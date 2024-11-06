import { useState, useEffect, ChangeEvent, Fragment } from "react";
import React from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  Button,
  CardHeader,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
  TextField,
  Collapse,
  FormControlLabel,
  FormControl,
  InputLabel,
  CardContent,
  Stack,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import ResetPassIcon from "@mui/icons-material/LockResetTwoTone";
import ResetApproverIcon from "@mui/icons-material/Approval";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

import {
  customDateFormat,
  hasAdminAccess,
  IUser,
  jobRole,
  systemRole,
  validateEmail,
} from "../../../../models/mymodels";
import {
  getAllUsers,
  getAllSystemRoles,
  updateSingleUser,
  getAllJobRoles,
  addNewUser,
  sendOrderByEmail,
  resetUserPassword,
} from "../../../../services/user.service";

import { useAuth } from "src/contexts/UserContext";

function UsersTab() {
  const theme = useTheme();
  const userContext = useAuth();
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<systemRole[]>([]);
  const [jobroles, setJobRoles] = useState<jobRole[]>([]);

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  //const [messageOfResponseOfAddnewUserProccess, setMessageOfResponseOfAddnewUserProccess] = useState('');
  const [myFormErrors, setmyFormErrors] = useState<string[]>([]);

  let emptyUser: IUser = {
    id: null,
    roleId: 0,
    jobRoleId: 0,
    jobRole: { id: 0, roleName: "" },
    role: { id: 0, roleName: "" },
    username: "",
    fullname: "",
    firstName: "",
    lastName: "",
    email: "",
    lockoutFlag: false,
    claimCanApproveRequest: false,
    claimCanMakeInventoryAdjustment: false,
    claimCanViewReports: false,
    claimCanMakePo: false,
    claimCanMakeRequest: false,
    claimCanReceiveItems: false,
    claimCanTransferStock: false,
    cconpurchaseOrder: false,
    approverUid: undefined,
  };

  const [newUser, setNewUser] = useState<IUser>(emptyUser);

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

  const handleChangeNewUser = (
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
    Promise.all([getAllUsers(), getAllSystemRoles(), getAllJobRoles()]).then(
      ([usersResponse, rolesResponse, jobrolesResponse]) => {
        setData(usersResponse.data);
        setRoles(rolesResponse.data);
        setJobRoles(jobrolesResponse.data);
      },
      (error) => {
        setData([]);
        setRoles([]);
        setJobRoles([]);
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

    //if (expandedRows.includes(userID)) {
    //    setExpandedRows(expandedRows.filter((id) => id !== userID));
    //} else {
    //    setExpandedRows([...expandedRows, userID]);
    //}
  };

  const handleResetApproverClick = (user: IUser) => {
    const updatedUser: IUser = { ...user, approverUid: undefined };
    updateUserNow(updatedUser);
  };

  const isRowExpanded = (userID: number) => expandedRows.includes(userID);
  //const changeLockOutFlag = (event: ChangeEvent<HTMLInputElement>, user: IUser): void => {
  //    switchUserStatus(user)
  //        .then((response) => {
  //            if (response.status === 200) {
  //                if (response.data) {
  //                    const updatedRows = response.data;
  //                    const updatedList = data.map((c) => {
  //                        const matchingRow = updatedRows.find((row: IUser) => row.id === c.id) as IUser;
  //                        if (matchingRow) {
  //                            return matchingRow;
  //                        } else {
  //                            return c;
  //                        }
  //                    });
  //                    setData(updatedList);
  //                }
  //            } else {
  //                console.log(response.data, 'Error updating user status!');
  //            }
  //        })
  //        .catch((error) => {
  //            console.log(error, 'Error updating user status!');
  //        });
  //};

  const addNewUserViaAPI = (newUser: IUser): void => {
    setmyFormErrors([]);

    newUser.id = 0;

    if (newUser.firstName.length <= 0) {
      setmyFormErrors((errors) => [...errors, "Error: Firstname is empty!"]);
      return;
    }
    if (newUser.lastName.length <= 0) {
      setmyFormErrors((errors) => [...errors, "Error: LastName is empty!"]);
      return;
    }

    if (!validateEmail(newUser.email)) {
      setmyFormErrors((errors) => [
        ...errors,
        "Error: Email is empty or incorrect!",
      ]);
      return;
    }
    if (newUser.roleId <= 0) {
      setmyFormErrors((errors) => [...errors, "Error: System Role is empty!"]);
      return;
    }
    if (newUser.jobRoleId <= 0) {
      setmyFormErrors((errors) => [...errors, "Error: Job Role is empty!"]);
      return;
    }

    addNewUser(newUser)
      .then((response) => {
        if (response.status === 200) {
          const newUserResponse = response.data;
          setData((prevData) => [...prevData, newUserResponse]);
          setShowAddUserForm(false);
          setNewUser(emptyUser);
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

  const updateUserNow = (updatedUser: IUser): void => {
    updateSingleUser(updatedUser)
      .then((response) => {
        if (response.status === 200) {
          //    const updatedUser1 = { ...user, jobRoleId: updatedUser.jobRoleId } as IUser;
          const updatedData = data.map((item) =>
            item.id === updatedUser.id ? response.data : item,
          );
          setData(updatedData);
          if (updatedUser && updatedUser.id == userContext?.currentUser?.id) {
            if (userContext?.refreshSession) {
              userContext?.refreshSession();
            }
          }
        } else {
          console.log(response.data, "Error updating user lastname!");
        }
      })
      .catch((error) => {
        console.log(error, "Error updating user lastname!");
      });
  };

  const changeLockOutFlag = (
    event: ChangeEvent<HTMLInputElement>,
    user: IUser,
  ): void => {
    const updatedUser: IUser = { ...user, lockoutFlag: event.target.checked };
    updateUserNow(updatedUser);
  };

  const handleChangeFirstName = (
    event: ChangeEvent<HTMLInputElement>,
    user: IUser,
  ): void => {
    const updatedUser: IUser = { ...user, firstName: event.target.value ?? "" };
    updateUserNow(updatedUser);
  };

  const handleChangeEmail = (
    event: ChangeEvent<HTMLInputElement>,
    user: IUser,
  ): void => {
    const newEmail = event.target.value;

    // Perform email validation
    //   if (!validateEmail(newEmail)) {
    // Display error or handle invalid email format
    //    return;
    //   }

    const updatedUser: IUser = { ...user, email: newEmail };
    updateUserNow(updatedUser);
  };
  const handleChangeLastName = (
    event: ChangeEvent<HTMLInputElement>,
    user: IUser,
  ): void => {
    const updatedUser: IUser = { ...user, lastName: event.target.value ?? "" };
    updateUserNow(updatedUser);
  };

  const handleChangeUserRole = (
    event: SelectChangeEvent<number>,
    user: IUser,
  ): void => {
    const updatedUser: IUser = {
      ...user,
      roleId: Number(event.target.value) ?? 0,
    };
    updateUserNow(updatedUser);
  };

  const handleChangeUserJobRole = (
    event: SelectChangeEvent<number>,
    user: IUser,
  ): void => {
    const updatedUser: IUser = {
      ...user,
      jobRoleId: Number(event.target.value) ?? 0,
    };
    updateUserNow(updatedUser);
  };

  const handleChangeUserApprover = (
    event: SelectChangeEvent<number>,
    user: IUser,
  ): void => {
    const updatedUser: IUser = {
      ...user,
      approverUid: Number(event.target.value) ?? 0,
    };
    updateUserNow(updatedUser);
  };

  function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>,
    propertyName: string,
    user: IUser,
  ): void {
    const updatedUser: IUser = {
      ...user,
      [propertyName]: event.target.checked,
    };
    updateUserNow(updatedUser);
  }

  const handleResetPasswordViaAPI = (userid: number) => {
    setSendingEmailProcessStatus(true); // Set loading state to true before making the API call

    if (selectedOrderIDForSendingByEmail > 0) {
      resetUserPassword(userid)
        .then((response) => {
          if (response) {
            if (response.status === 200) {
              const result = response.data ?? null;
              if (result.result === true) {
                setMessageOfResponseOfEmailProcess(result.message); // Show success message
                // updatePlinesfromResponse(userid);
                handleCloseSendOrderbyEmail();
              } else {
                setMessageOfResponseOfEmailProcess("Error: " + result.message); // Show error message when result.result is false
              }
            } else {
              setMessageOfResponseOfEmailProcess(
                "Error: Unexpected response status.",
              ); // Show error message when response status is not 200
            }
          } else {
            setMessageOfResponseOfEmailProcess("Error: No response received."); // Show error message when no response is received
          }
        })
        .catch((error) => {
          setMessageOfResponseOfEmailProcess("Error: " + error.message); // Show error message when an error occurs
        })
        .finally(() => {
          setSendingEmailProcessStatus(false); // Set loading state to false after API call is completed
        });
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              subheaderTypographyProps={{}}
              titleTypographyProps={{}}
              title="Users"
              subheader="Change application users here"
              action={
                !showAddUserForm ? (
                  <Grid item>
                    <Box component="span">
                      <Button
                        onClick={() => {
                          setNewUser(emptyUser);
                          setShowAddUserForm(!showAddUserForm);
                        }}
                        sx={{ ml: 1 }}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add user
                      </Button>
                    </Box>
                  </Grid>
                ) : (
                  <Box component="span">
                    <Button
                      onClick={() => {
                        setNewUser(emptyUser);
                        setShowAddUserForm(false);
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
              {showAddUserForm ? (
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
                          value={newUser.firstName}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleChangeNewUser(event, "firstName")
                          }
                          variant="standard"
                          label="First Name"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="text"
                          value={newUser.lastName}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleChangeNewUser(event, "lastName")
                          }
                          variant="standard"
                          label="Last Name"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="text"
                          value={newUser.email}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleChangeNewUser(event, "email")
                          }
                          variant="standard"
                          label="Email"
                          error={!validateEmail(newUser.email)}
                          helperText={
                            !validateEmail(newUser.email)
                              ? "Invalid email format"
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel id={`role-select-label-${newUser.id}`}>
                            System Role
                          </InputLabel>
                          <Select
                            labelId={`role-select-label-${newUser.id}`}
                            value={newUser.roleId <= 0 ? "" : newUser.roleId}
                            onChange={(event: SelectChangeEvent<number>) =>
                              handleChangeNewUser(event, "roleId")
                            }
                          >
                            {roles.map((role) => (
                              <MenuItem key={role.id} value={role.id}>
                                {role.roleName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel
                            id={`job-role-select-label-${newUser.id}`}
                          >
                            Job Role
                          </InputLabel>
                          <Select
                            labelId={`job-role-select-label-${newUser.id}`}
                            value={
                              newUser.jobRoleId <= 0 ? "" : newUser.jobRoleId
                            }
                            onChange={(event: SelectChangeEvent<number>) =>
                              handleChangeNewUser(event, "jobRoleId")
                            }
                          >
                            {jobroles.map((role) => (
                              <MenuItem key={role.id} value={role.id}>
                                {role.roleName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel
                            id={`approver-select-label-${newUser.approverUid ?? 0}`}
                          >
                            Approver
                          </InputLabel>
                          <Select
                            labelId={`approver-select-label-${newUser.approverUid ?? 0}`}
                            value={newUser.approverUid ?? ""}
                            // value={newUser.approverUid <= 0 ? "" : newUser.approverUid}
                            onChange={(event: SelectChangeEvent<number>) =>
                              handleChangeNewUser(event, "approverUid")
                            }
                          >
                            {data.map((user) => (
                              <MenuItem key={user.id} value={user.id}>
                                {user.firstName + " " + user.lastName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        {/* Additional checkboxes for user permissions */}
                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  newUser.claimCanApproveRequest || false
                                }
                                onChange={(event) =>
                                  handleChangeNewUser(
                                    event,
                                    "claimCanApproveRequest",
                                  )
                                }
                              />
                            }
                            name="claimCanApproveRequest"
                            label="Request Approval"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                name="claimCanMakePo"
                                checked={newUser.claimCanMakePo || false}
                                onChange={(event) =>
                                  handleChangeNewUser(event, "claimCanMakePo")
                                }
                              />
                            }
                            label="Add Purchase Order"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="claimCanMakeRequest"
                                checked={newUser.claimCanMakeRequest || false}
                                onChange={(event) =>
                                  handleChangeNewUser(
                                    event,
                                    "claimCanMakeRequest",
                                  )
                                }
                              />
                            }
                            label="Add Request"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                name="claimCanReceiveItems"
                                checked={newUser.claimCanReceiveItems || false}
                                onChange={(event) =>
                                  handleChangeNewUser(
                                    event,
                                    "claimCanReceiveItems",
                                  )
                                }
                              />
                            }
                            label="Receive Items"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                name="claimCanTransferStock"
                                checked={newUser.claimCanTransferStock || false}
                                onChange={(event) =>
                                  handleChangeNewUser(
                                    event,
                                    "claimCanTransferStock",
                                  )
                                }
                              />
                            }
                            label="Transfer Inventory"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="claimCanMakeInventoryAdjustment"
                                checked={
                                  newUser.claimCanMakeInventoryAdjustment ||
                                  false
                                }
                                onChange={(event) =>
                                  handleChangeNewUser(
                                    event,
                                    "claimCanMakeInventoryAdjustment",
                                  )
                                }
                              />
                            }
                            label="Inventory Adjustment"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                name="claimCanMakeViewReports"
                                checked={newUser.claimCanViewReports || false}
                                onChange={(event) =>
                                  handleChangeNewUser(
                                    event,
                                    "claimCanMakeViewReports",
                                  )
                                }
                              />
                            }
                            label="Reports"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                name="cconpurchaseOrder"
                                checked={newUser.cconpurchaseOrder}
                                onChange={(event) =>
                                  handleChangeNewUser(
                                    event,
                                    "cconpurchaseOrder",
                                  )
                                }
                              />
                            }
                            label="(CC) recipient to every purchase order email"
                          />
                        </div>
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          id="addnowbtn"
                          onClick={() => addNewUserViaAPI(newUser)}
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
                          <TableCell>User ID</TableCell>
                          <TableCell>First Name</TableCell>
                          <TableCell>Last Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell align="center">Locked Out</TableCell>
                          <TableCell>System Role</TableCell>
                          <TableCell>Job Role</TableCell>
                          <TableCell>Approver</TableCell>
                          <TableCell>Last Update Date</TableCell>
                          <TableCell>Created Date</TableCell>
                          <TableCell align="right">Actions</TableCell>
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
                                  value={user.firstName}
                                  onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                  ) => handleChangeFirstName(event, user)}
                                  fullWidth
                                  variant="standard"
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="text"
                                  value={user.lastName}
                                  onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                  ) => handleChangeLastName(event, user)}
                                  fullWidth
                                  variant="standard"
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="text"
                                  value={user.email}
                                  onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                  ) => handleChangeEmail(event, user)}
                                  fullWidth
                                  variant="standard"
                                  error={!validateEmail(user.email)} // Apply error styling based on email validation
                                  helperText={
                                    !validateEmail(user.email)
                                      ? "Invalid email format"
                                      : ""
                                  }
                                />
                              </TableCell>

                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={user.lockoutFlag}
                                  onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                  ) => changeLockOutFlag(event, user)}
                                />
                              </TableCell>

                              <TableCell>
                                <FormControl variant="standard" fullWidth>
                                  <InputLabel
                                    id={`role-select-label-${user.id}`}
                                  >
                                    System Role
                                  </InputLabel>
                                  <Select
                                    labelId={`role-select-label-${user.id}`}
                                    value={user.roleId ?? ""}
                                    onChange={(
                                      event: SelectChangeEvent<number>,
                                    ) => handleChangeUserRole(event, user)}
                                  >
                                    {roles.map((role) => (
                                      <MenuItem key={role.id} value={role.id}>
                                        {role.roleName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl variant="standard" fullWidth>
                                  <InputLabel
                                    id={`job-role-select-label-${user.id}`}
                                  >
                                    Job Role
                                  </InputLabel>
                                  <Select
                                    labelId={`job-role-select-label-${user.id}`}
                                    value={user.jobRoleId ?? ""}
                                    onChange={(
                                      event: SelectChangeEvent<number>,
                                    ) => handleChangeUserJobRole(event, user)}
                                  >
                                    {jobroles.map((role) => (
                                      <MenuItem key={role.id} value={role.id}>
                                        {role.roleName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                <FormControl variant="standard" fullWidth>
                                  <InputLabel
                                    id={`approver-role-select-label-${user.id}`}
                                  >
                                    Approver
                                  </InputLabel>
                                  <Select
                                    labelId={`approver-role-select-label-${user.id}`}
                                    value={user.approverUid ?? ""}
                                    onChange={(
                                      event: SelectChangeEvent<number>,
                                    ) => handleChangeUserApprover(event, user)}
                                  >
                                    {data.map((user) => (
                                      <MenuItem key={user.id} value={user.id}>
                                        {user.firstName + " " + user.lastName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                {customDateFormat(
                                  user.lastUpdatedDate,
                                  "Datetime",
                                )}
                              </TableCell>
                              <TableCell>
                                {customDateFormat(user.createdDate, "Datetime")}
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip
                                  placement="top"
                                  title="Reset Password"
                                  arrow
                                >
                                  <IconButton
                                    sx={{
                                      "&:hover": {
                                        background: theme.colors.info.lighter,
                                      },
                                      color: theme.palette.info.main,
                                    }}
                                    color="inherit"
                                    size="small"
                                    onClick={() =>
                                      handleResetPasswordClick(user)
                                    }
                                  >
                                    <ResetPassIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  placement="top"
                                  title="Reset Approver"
                                  arrow
                                >
                                  <IconButton
                                    sx={{
                                      "&:hover": {
                                        background: theme.colors.info.lighter,
                                      },
                                      color: theme.palette.info.main,
                                    }}
                                    color="inherit"
                                    size="small"
                                    onClick={() =>
                                      handleResetApproverClick(user)
                                    }
                                  >
                                    <ResetApproverIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  placement="top"
                                  title="Edit Permissions"
                                  arrow
                                >
                                  <IconButton
                                    sx={{
                                      "&:hover": {
                                        background: theme.colors.info.lighter,
                                      },
                                      color: theme.palette.info.main,
                                    }}
                                    color="inherit"
                                    size="small"
                                    onClick={() => handleEditClick(user.id)}
                                  >
                                    <EditTwoToneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>

                            {isRowExpanded(user.id) && (
                              <TableRow>
                                <TableCell colSpan={10}>
                                  <Collapse
                                    in={true}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    {/* Additional checkboxes for user permissions */}
                                    <div>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              user.claimCanApproveRequest ||
                                              false
                                            }
                                            onChange={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                "claimCanApproveRequest",
                                                user,
                                              )
                                            }
                                          />
                                        }
                                        label="Request Approval"
                                      />

                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              user.claimCanMakePo || false
                                            }
                                            onChange={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                "claimCanMakePo",
                                                user,
                                              )
                                            }
                                          />
                                        }
                                        label="Add Purchase Order"
                                      />
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              user.claimCanMakeRequest || false
                                            }
                                            onChange={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                "claimCanMakeRequest",
                                                user,
                                              )
                                            }
                                          />
                                        }
                                        label="Add Request"
                                      />

                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              user.claimCanReceiveItems || false
                                            }
                                            onChange={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                "claimCanReceiveItems",
                                                user,
                                              )
                                            }
                                          />
                                        }
                                        label="Receive Items"
                                      />

                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              user.claimCanTransferStock ||
                                              false
                                            }
                                            onChange={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                "claimCanTransferStock",
                                                user,
                                              )
                                            }
                                          />
                                        }
                                        label="Transfer Inventory"
                                      />
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              user.claimCanMakeInventoryAdjustment ||
                                              false
                                            }
                                            onChange={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                "claimCanMakeInventoryAdjustment",
                                                user,
                                              )
                                            }
                                          />
                                        }
                                        label="Inventory Adjustment"
                                      />

                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              user.claimCanViewReports || false
                                            }
                                            onChange={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                "claimCanViewReports",
                                                user,
                                              )
                                            }
                                          />
                                        }
                                        label="Reports"
                                      />

                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={user.cconpurchaseOrder}
                                            onChange={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                "cconpurchaseOrder",
                                                user,
                                              )
                                            }
                                          />
                                        }
                                        label="(CC) recipient to every purchase order email"
                                      />
                                    </div>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            )}
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
      <Dialog
        open={openResetPasswordDialogue}
        onClose={handleCloseSendOrderbyEmail}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="primary" aria-label="add" sx={{ marginRight: 1 }}>
            <ResetPassIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            IMS - Reset User Password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset password of the user please click Reset Password.
          </DialogContentText>
          <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

          <div>
            {/* Render loading state or message */}
            {sendingEmailProcessStatus ? (
              <p>Reseting Password...Please wait...</p>
            ) : (
              messageOfResponseOfEmailProcess && (
                <Alert severity="error">
                  {" "}
                  {messageOfResponseOfEmailProcess}
                </Alert>
              )
            )}
          </div>
          {/*{apiResponse && typeof apiResponse !== 'undefined' && !(apiResponse.status === 200) && (<Alert severity="error"> Error! {apiResponse?.toString()}</Alert>)}*/}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSendOrderbyEmail}>Cancel</Button>
          <Button
            onClick={() => {
              handleResetPasswordViaAPI(selectedOrderIDForSendingByEmail);
            }}
            disabled={
              selectedOrderIDForSendingByEmail <= 0 || sendingEmailProcessStatus
            }
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UsersTab;
