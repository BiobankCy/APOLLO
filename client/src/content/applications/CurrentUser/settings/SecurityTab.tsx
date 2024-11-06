import { useState, ChangeEvent } from "react";
import React from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  CardContent,
  Stack,
  Alert,
  TextField,
} from "@mui/material";
import { useAuth } from "src/contexts/UserContext";





function SecurityTab() {
  const userContext = useAuth();
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [myFormErrors, setmyFormErrors] = useState<string[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCurrentPasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setmyFormErrors(["New password and confirm password do not match."]);
      return;
    }

    if (newPassword == currentPassword) {
      setmyFormErrors([
        "New password and current password match. Please try again.",
      ]);
      return;
    }


    if (
      userContext?.currentUser &&
      Number(userContext.currentUser.id) > 0 &&
      userContext?.changePassword
    ) {
      userContext
        ?.changePassword(currentPassword, newPassword)
        .then((result: { success: boolean; message: string } | {}) => {
          let result1: { success: boolean; message: string } = {
            success: false,
            message: "",
          };
          result1 = result as { success: boolean; message: string };

          if (result1.success) {
            // Password change successful
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setmyFormErrors([]);
            setShowAddUserForm(false);
          } else {
            // Password change failed
            setmyFormErrors([result1.message]);
          }
        })
        .catch((error) => {
          
          //   console.log(error);
          setmyFormErrors([error.toString()]);
        });
    }


  };




  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">Security</Typography>
          <Typography variant="subtitle2">
            Change your security preferences below
          </Typography>
        </Box>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: "h5", gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  lineHeight: 1,
                }}
                primary="Change Password"
                secondary="You can change your password here"
              />
              <Button
                onClick={() => {
                  setShowAddUserForm(true);
                  setmyFormErrors([]);
                }}
                size="large"
                variant="outlined"
              >
                Change password
              </Button>
            </ListItem>
          </List>
          <CardContent>
            {showAddUserForm && (
              <>
                <Divider />
                {/* Add user form */}
             
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="password"
                        value={currentPassword}
                        onChange={handleCurrentPasswordChange}
                        variant="standard"
                        label="Current Password"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        variant="standard"
                        label="New Password"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        variant="standard"
                        label="New Password Again"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        id="changenowbtn"
                        onClick={handleChangePassword}
                        variant="contained"
                      >
                        Change Now
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      {myFormErrors && myFormErrors.length > 0 && (
                        <Stack sx={{ width: "100%" }} spacing={0.5}>
                          {myFormErrors.map((error, index) => (
                            <Alert key={index} severity="error">
                              {error}!
                            </Alert>
                          ))}
                        </Stack>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}

export default SecurityTab;
