import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  TextField,
  CardActions,
  useTheme,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Snackbar from "@mui/material/Snackbar";
//import MuiAlert, { AlertProps } from '@mui/material/Alert';
//import { useTheme } from '@mui/material/styles';
import Slide, { SlideProps } from "@mui/material/Slide";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useAuth } from "src/contexts/UserContext";
import {
  changeSMTPpassword,
  getSMTPSettings,
  saveSMTPsettings,
  sendTestEmail,
} from "../../../../services/user.service";
import { SecureSocketOption } from "../../../../models/mymodels";

function ViewSettingsTab() {
  const userContext = useAuth();

  const [snackbarContent, setSnackbarContent] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  type TransitionProps = Omit<SlideProps, "direction">;

  function TransitionRight(props: TransitionProps) {
    return <Slide {...props} direction="down" />;
  }
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    },
  );

  const [smtpSettings, setSmtpSettings] = useState({
    smtpServer: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpFromAddress: "",
    smtpTimeoutMs: 15000,
    smtpSecureSocketOption: SecureSocketOption.None,
    sendEmailByApp: false,
  });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Load current SMTP settings from the API
    getSMTPSettings()
      .then((response) => {
        // Handle success
        if (response.status == 200) {
          setSmtpSettings(response.data);
        } else {
          setSnackbarContent({
            severity: "error",
            message: "Error loading SMTP settings. Status: " + response.status,
          });
          console.error(
            "Error loading SMTP settings:",
            "Status:" + response.status,
          );
        }
      })
      .catch((error) => {
        // Handle error
        setSnackbarContent({
          severity: "error",
          message: "Error loading SMTP settings. Status: " + error.status,
        });
        console.error("Error loading SMTP settings:", error);
      });
  }, []);

  //const handleChange = (field: string, value: string | number) => {
  //    setSmtpSettings((prevSettings) => ({
  //        ...prevSettings,
  //        [field]: value
  //    }));
  //};
  const handleChange = (field: string, value: string | number | boolean) => {
    setSmtpSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Make API call to save SMTP settings to the database
    saveSMTPsettings(smtpSettings)
      .then((response) => {
        // Handle success
        if (response.status === 200) {
          setSnackbarContent({
            severity: "success",
            message: "SMTP settings saved successfully!",
          });
        } else {
          setSnackbarContent({
            severity: "error",
            message: "Error saving SMTP settings. Status: " + response.status,
          });
        }
      })
      .catch((error) => {
        // Handle error
        setSnackbarContent({
          severity: "error",
          message: "Error saving SMTP settings: " + error.message,
        });
      });
  };

  const handleSendTestEmail = () => {
    sendTestEmail()
      .then((response) => {
        // Handle success
        if (response.status === 200) {
          setSnackbarContent({
            severity: "success",
            message: "Email Sent successfully!",
          });
        } else {
          setSnackbarContent({
            severity: "error",
            message: "Error sending test email. Status: " + response.status,
          });
        }
      })
      .catch((error) => {
        // Handle error
        setSnackbarContent({
          severity: "error",
          message: "Error sending test email. Status: " + error.status,
        });
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarContent(null);
  };

  const theme = useTheme();

  const handlePasswordChange = () => {
    // Make API call to change the SMTP password
    changeSMTPpassword(newPassword)
      .then((success) => {
        if (success) {
          setSnackbarContent({
            severity: "success",
            message: "Password changed successfully!",
          });
        } else {
          setSnackbarContent({
            severity: "error",
            message: "Error changing password.",
          });
        }
      })
      .catch((error) => {
        setSnackbarContent({
          severity: "error",
          message: "Error changing password. Status: " + error.status,
        });
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Global Settings
              </Typography>
              <Typography variant="subtitle2">
                View application global settings.
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2"></Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                SMTP Settings
              </Typography>
              <Typography variant="subtitle2">
                Settings related to web app email server.
              </Typography>
            </Box>
          </Box>
          <Divider />

          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={smtpSettings.sendEmailByApp}
                            onChange={(e) =>
                              handleChange("sendEmailByApp", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={
                          <span>
                            Enable Email Notifications
                            <Tooltip title="Enable this option to allow the application to send email notifications">
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                component="span"
                              >
                                <HelpOutlineIcon fontSize="small" />
                              </Typography>
                            </Tooltip>
                          </span>
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="SMTP Server"
                    value={smtpSettings.smtpServer}
                    onChange={(e) => handleChange("smtpServer", e.target.value)}
                    autoComplete="off"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="SMTP Port"
                    value={smtpSettings.smtpPort}
                    onChange={(e) =>
                      handleChange("smtpPort", Number(e.target.value))
                    }
                    autoComplete="off"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>SMTP Secure Socket Option</InputLabel>
                    <Select
                      value={smtpSettings.smtpSecureSocketOption}
                      onChange={(e) =>
                        handleChange("smtpSecureSocketOption", e.target.value)
                      }
                    >
                      <MenuItem value={SecureSocketOption.None}>None</MenuItem>
                      <MenuItem value={SecureSocketOption.SslOnConnect}>
                        SSL on Connect
                      </MenuItem>
                      <MenuItem value={SecureSocketOption.StartTls}>
                        STARTTLS
                      </MenuItem>
                      <MenuItem value={SecureSocketOption.Auto}>Auto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="SMTP Timeout (ms)"
                    value={smtpSettings.smtpTimeoutMs}
                    onChange={(e) =>
                      handleChange("smtpTimeoutMs", Number(e.target.value))
                    }
                    autoComplete="off"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="SMTP Username"
                    value={smtpSettings.smtpUsername}
                    onChange={(e) =>
                      handleChange("smtpUsername", e.target.value)
                    }
                    autoComplete="off"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="SMTP From Address"
                    value={smtpSettings.smtpFromAddress}
                    onChange={(e) =>
                      handleChange("smtpFromAddress", e.target.value)
                    }
                    autoComplete="off"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "right", marginTop: 2 }}>
                  <Snackbar
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    open={snackbarContent !== null}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                  >
                    <Alert
                      onClose={handleSnackbarClose}
                      severity={
                        snackbarContent?.severity === "success"
                          ? "success"
                          : "error"
                      }
                      sx={{ width: "100%" }}
                    >
                      {snackbarContent?.message}
                    </Alert>
                  </Snackbar>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveSettings}
                  >
                    Save Changes
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                  >
                    <TextField
                      label="New Password"
                      variant="outlined"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      type="password"
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handlePasswordChange}
                    >
                      Change Password
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSendTestEmail}
            >
              Send Test Email Notification
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ViewSettingsTab;
