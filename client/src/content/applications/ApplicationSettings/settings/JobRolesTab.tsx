import { useState, useEffect, ChangeEvent, Fragment } from "react";
import React from "react";
import {
  Box,
  Card,
  Grid,
  Divider,
  Button,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  useTheme,
  SelectChangeEvent,
  TextField,
  CardContent,
  Stack,
  Alert,
} from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

import {
  IUser,
  jobRole,
} from "../../../../models/mymodels";
import {
  getAllJobRoles,
  addNewJobRole,
  updateJobRole,
} from "../../../../services/user.service";

import { useAuth } from "src/contexts/UserContext";

function JobRolesTab() {
  const theme = useTheme();
  const userContext = useAuth();
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<jobRole[]>([]);

  const [showAddJobRoleForm, setshowAddJobRoleForm] = useState(false);
  //const [messageOfResponseOfAddnewUserProccess, setMessageOfResponseOfAddnewUserProccess] = useState('');
  const [myFormErrors, setmyFormErrors] = useState<string[]>([]);

  let emptyJobRole: jobRole = {
    id: 0,
    roleName: "",
  };

  const [newUser, setNewUser] = useState<jobRole>(emptyJobRole);

  const [openResetPasswordDialogue, setOpenResetPasswordDialogue] =
    useState(false);
  const [sendingEmailProcessStatus, setSendingEmailProcessStatus] =
    useState(false);
  const [messageOfResponseOfEmailProcess, setMessageOfResponseOfEmailProcess] =
    useState("");
  const [
    selectedOrderIDForSendingByEmail,
    setselectedOrderIDForSendingByEmail,
  ] = useState(0);

  const handleCloseSendOrderbyEmail = () => {
    setOpenResetPasswordDialogue(false);
    setselectedOrderIDForSendingByEmail(0);
    setMessageOfResponseOfEmailProcess("");
    //  setApiResponse(undefined);
  };

  const handleChangeNewJobRole = (
    event: ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>,
    element: string,
  ): void => {
    let value: string | boolean | number = "";

    if ((event.target as HTMLInputElement).type === "checkbox") {
      value = (event.target as HTMLInputElement).checked;
    } else {
      value = event.target.value ?? "";
    }

    if (typeof value === "string" && value.toLowerCase() === "true") {
      value = true;
    } else if (typeof value === "string" && value.toLowerCase() === "false") {
      value = false;
    }

    setNewUser((prevUser) => ({ ...prevUser, [element]: value }));
  };

  useEffect(() => {
    Promise.all([getAllJobRoles()]).then(
      ([jobrolesResponse]) => {
        setData(jobrolesResponse.data);
      },
      (error) => {
        setData([]);
      },
    );
  }, []);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const handleEditClick = (userID: number) => {
    if (expandedRows.includes(userID)) {
      setExpandedRows(expandedRows.filter((id) => id !== userID));
    } else {
      setExpandedRows([...expandedRows, userID]);
    }
  };

  const handleResetPasswordClick = (user: IUser) => {
    console.log("reset clicked", Number(user.id));
    setselectedOrderIDForSendingByEmail(Number(user.id));
    setOpenResetPasswordDialogue(true);

  };



  const addNewJobRoleViaAPI = (newJobRole: jobRole): void => {
    setmyFormErrors([]);

    newJobRole.id = 0;

    if (newJobRole.roleName.length <= 0) {
      setmyFormErrors((errors) => [
        ...errors,
        "Error: Job Role Name is empty!",
      ]);
      return;
    }

    addNewJobRole(newJobRole)
      .then((response) => {
        if (response.status === 200) {
          const newUserResponse = response.data;
          setData((prevData) => [...prevData, newUserResponse]);
          setshowAddJobRoleForm(false);
          setNewUser(emptyJobRole);
        } else {
          // console.log(response.data, 'Error adding new user!');
          setmyFormErrors((errors) => [
            ...errors,
            "Error: " + (response.data ?? "Unknown"),
          ]);
        }
      })
      .catch((error) => {
        //  console.log(error, 'Error adding new user!');
        setmyFormErrors((errors) => [
          ...errors,
          "Error: " + (error ?? "Unknown"),
        ]);
      })
      .finally(() => {
        // Perform cleanup or additional actions here
      });
  };

  const updateJobRoleNow = (updatedJobRole: jobRole): void => {
    updateJobRole(updatedJobRole)
      .then((response) => {
        if (response.status === 200) {
          //    const updatedUser1 = { ...user, jobRoleId: updatedUser.jobRoleId } as IUser;
          const updatedData = data.map((item) =>
            item.id === updatedJobRole.id ? response.data : item,
          );
          setData(updatedData);
          if (
            updatedJobRole &&
            updatedJobRole.id == userContext?.currentUser?.id
          ) {
            //if (userContext?.refreshSession) { userContext?.refreshSession(); }
          }
        } else {
          console.log(response.data, "Error updating jobrole!");
        }
      })
      .catch((error) => {
        console.log(error, "Error updating jobrole!");
      });
  };



  const handleChangeFirstName = (
    event: ChangeEvent<HTMLInputElement>,
    user: jobRole,
  ): void => {
    const updatedUser: jobRole = {
      ...user,
      roleName: event.target.value ?? "",
    };
    updateJobRoleNow(updatedUser);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              subheaderTypographyProps={{}}
              titleTypographyProps={{}}
              title="Job Roles"
              subheader="Change Job Roles here"
              action={
                !showAddJobRoleForm ? (
                  <Grid item>
                    <Box component="span">
                      <Button
                        onClick={() => {
                          setNewUser(emptyJobRole);
                          setshowAddJobRoleForm(!showAddJobRoleForm);
                        }}
                        sx={{ ml: 1 }}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add Job Role
                      </Button>
                    </Box>
                  </Grid>
                ) : (
                  <Box component="span">
                    <Button
                      onClick={() => {
                        setNewUser(emptyJobRole);
                        setshowAddJobRoleForm(false);
                        setmyFormErrors([]);
                      }}
                      sx={{
                        ml: 1,
                        variant: "contained",
                        color: "white",
                        backgroundColor: "error.main",
                        "&:hover": {
                          backgroundColor: "error.dark",
                          color: "white",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )
              }
            />
            <CardContent>
              {showAddJobRoleForm ? (
                //add user form
                <>
                  <Divider />
                  {/* Add user form */}
                  {/* Include input fields and a save button */}
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="text"
                          value={newUser.roleName}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleChangeNewJobRole(event, "roleName")
                          }
                          variant="standard"
                          label="Job Role Name"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          id="addnowbtn"
                          onClick={() => addNewJobRoleViaAPI(newUser)}
                          variant="contained"
                        >
                          Save user
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
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Job Role</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((user) => (
                          <Fragment key={user.id}>
                            <TableRow key={user.id} hover>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>
                                <TextField
                                  type="text"
                                  value={user.roleName}
                                  onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                  ) => handleChangeFirstName(event, user)}
                                  fullWidth
                                  variant="standard"
                                />
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default JobRolesTab;
