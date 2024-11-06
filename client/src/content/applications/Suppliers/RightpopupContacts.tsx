import React, { useState, Fragment } from "react";
import {
  Typography,
  Button,
  IconButton,
  ListItemAvatar,
  Avatar,
  Tooltip,
  TextField,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
  Alert,
  Grid,

  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactIcon from "@mui/icons-material/ContactEmergencyTwoTone";
import EditIcon from "@mui/icons-material/Edit";

import ContactsIcon from "@mui/icons-material/Contacts"; // Import your desired icon

import {
  hasAdminAccess,
  SupplierContactsModel,
  SupplierModel,
} from "src/models/mymodels";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import {
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  Drawer,
  useTheme,
} from "@mui/material";

import { AxiosResponse } from "axios";
import {
  addNewContact,
  deleteSingleContact,
  updateSingleContact,
} from "../../../services/user.service";
import { useAuth } from "src/contexts/UserContext";


interface PostsProps {

  supplierList: SupplierModel[];
  selectedSupplier: SupplierModel;
  refreshSuppliers: any;
}



function RightpopupContacts(those: PostsProps) {
  // let anchor = "right";
  const userContext = useAuth();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  type Anchor = "top" | "left" | "bottom" | "right";
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  let anchora: Anchor = "right";
  const theme = useTheme();

  const [apiResponse, setApiResponse] = useState<AxiosResponse>();
  const [selectedContactForEdit, setselectedContactForEdit] =
    useState<SupplierContactsModel>({
      firstname: "",
      id: "0",
      lastname: "",
      supplierid: 0,
      email: "",
      address: "",
      city: "",
      country: "",
      workphone: "",
      zipcode: "",
      department: "",
      state: "",
      notes: "",
      role: "",
      cconpurchaseorder: false,
      activestatusflag: false,
    });

  //Edit Contact Dialog

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const handleClickOpenEditDialog = (subcategory: SupplierContactsModel) => {
    setselectedContactForEdit(subcategory);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setApiResponse(undefined);
  };

  //Add Contact Dialog

  const [openAddSubCategDialog, setOpenAddSubCategDialog] =
    React.useState(false);
  const handleClickOpenAddNewContactDialog = () => {
    setselectedContactForEdit({
      firstname: "",
      id: "0",
      lastname: "",
      supplierid: 0,
      email: "",
      address: "",
      city: "",
      country: "",
      workphone: "",
      zipcode: "",
      department: "",
      state: "",
      notes: "",
      role: "",
      cconpurchaseorder: false,
      activestatusflag: true,
    });
    setOpenAddSubCategDialog(true);
  };

  const handleCloseAddSubCategDialog = () => {
    setOpenAddSubCategDialog(false);
    setApiResponse(undefined);
  };

  //Delete Contact Dialog

  const [openDeleteSubCategDialog, setopenDeleteContactDialog] =
    React.useState(false);
  const handleClickOpenDeleteContactDialog = (
    supcontact: SupplierContactsModel,
  ) => {
    setselectedContactForEdit(supcontact);
    setopenDeleteContactDialog(true);
  };

  const handleCloseDeleteSubCategDialog = () => {
    setopenDeleteContactDialog(false);
    setApiResponse(undefined);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    updateSingleContact(
      Number(selectedContactForEdit.id),
      selectedContactForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          setApiResponse(undefined);
          handleCloseEditDialog();

          let editedsubcategsoriginal =
            those.selectedSupplier.contactsofsuppliers.filter(
              (data) => data.id !== selectedContactForEdit.id,
            );
          editedsubcategsoriginal.unshift(selectedContactForEdit);
          let originalcategory = those.selectedSupplier;
          originalcategory.contactsofsuppliers = editedsubcategsoriginal;

          let newList = those.supplierList.filter(
            (data) => data.id != selectedContactForEdit.supplierid,
          );
          newList.unshift(originalcategory);
          those.refreshSuppliers(newList);
          newList = [];
          editedsubcategsoriginal = [];

          setselectedContactForEdit({
            firstname: "",
            id: "0",
            lastname: "",
            supplierid: 0,
            email: "",
            address: "",
            city: "",
            country: "",
            workphone: "",
            zipcode: "",
            department: "",
            state: "",
            notes: "",
            role: "",
            cconpurchaseorder: false,
            activestatusflag: false,
          });


        } else {
          setApiResponse(response);
        }
      },
      (error) => {
        setApiResponse(error);
      },
    );
  };
  const handleSubmitDeleteSubCateg = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    setApiResponse(undefined);
    event.preventDefault();

    deleteSingleContact(
      Number(selectedContactForEdit.id),
      selectedContactForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          setApiResponse(undefined);
          handleCloseDeleteSubCategDialog();

          let editedContactsoriginal =
            those.selectedSupplier.contactsofsuppliers.filter(
              (data) => data.id != selectedContactForEdit.id,
            );

          let originalSupplier = those.selectedSupplier;
          originalSupplier.contactsofsuppliers = editedContactsoriginal;

          let newList = those.supplierList.filter(
            (data) => data.id != selectedContactForEdit.supplierid,
          );
          newList.unshift(originalSupplier);
          those.refreshSuppliers(newList);
          newList = [];
          editedContactsoriginal = [];

          setselectedContactForEdit({
            firstname: "",
            id: "0",
            lastname: "",
            supplierid: 0,
            email: "",
            address: "",
            city: "",
            country: "",
            workphone: "",
            zipcode: "",
            department: "",
            state: "",
            notes: "",
            role: "",
            cconpurchaseorder: false,
            activestatusflag: false,
          });
        } else {
          setApiResponse(response);
        }
      },
      (error) => {
        setApiResponse(error);
      },
    );
  };

  const handleSubmitAddContact = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    selectedContactForEdit.supplierid = Number(those.selectedSupplier.id);

    addNewContact(selectedContactForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          setApiResponse(undefined);
          handleCloseAddSubCategDialog();

          let editedsubcategsoriginal =
            those.selectedSupplier.contactsofsuppliers;
          editedsubcategsoriginal.unshift(response.data);
          let originalsupplier = those.selectedSupplier;
          originalsupplier.contactsofsuppliers = editedsubcategsoriginal;

          let newList = those.supplierList.filter(
            (data) => data.id != selectedContactForEdit.supplierid,
          );
          newList.unshift(originalsupplier);
          those.refreshSuppliers(newList);
          newList = [];
          editedsubcategsoriginal = [];

          setselectedContactForEdit({
            firstname: "",
            id: "0",
            lastname: "",
            supplierid: 0,
            email: "",
            address: "",
            city: "",
            country: "",
            workphone: "",
            zipcode: "",
            department: "",
            state: "",
            notes: "",
            role: "",
            cconpurchaseorder: false,
            activestatusflag: false,
          });


        } else {
          setApiResponse(response);
        }
      },
      (error) => {
        setApiResponse(error);
      },
    );
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (e.target.type === "checkbox") {
      // Ensure e.target is of type HTMLInputElement before accessing the checked property
      if (e.target instanceof HTMLInputElement) {
        setselectedContactForEdit({
          ...selectedContactForEdit,
          [name]: e.target.checked, // Use e.target.checked for checkbox input
        });
      }
    } else {
      setselectedContactForEdit({
        ...selectedContactForEdit,
        [name]: value,
      });
    }
  };


  return (
    <div>
      <Fragment key={those.selectedSupplier.id}>
        {/*    <Button onClick={toggleDrawer(anchora, true)}>Contacts ({those.selectedSupplier.contactsofsuppliers.length ?? 0})</Button>*/}
        <Button
          onClick={toggleDrawer(anchora, true)}
          startIcon={<ContactsIcon />} // Add the icon to the left
        >
          Contacts ({those.selectedSupplier.contactsofsuppliers.length ?? 0})
        </Button>

        <Drawer
          anchor={anchora}
          open={state[anchora]}
          onClose={toggleDrawer(anchora, false)}
        >
          <Box
            sx={{ width: anchora === "right" ? 500 : "auto" }}
            p={1}
            mt={2}
            role="presentation"
            onClick={toggleDrawer(anchora, true)}
            onKeyDown={toggleDrawer(anchora, false)}
          >
            {hasAdminAccess(userContext?.currentUser) && (
              <>
                <Stack direction="row" justifyContent="end">
                  <Button
                    sx={{ ml: 1 }}
                    variant="contained"
                    onClick={() => handleClickOpenAddNewContactDialog()}
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                  >
                    Add Contact
                  </Button>
                </Stack>
              </>
            )}
            <Stack direction="row" justifyContent="end">
              <Box sx={{ mx: "auto", textAlign: "center" }}>
                Supplier Contacts
                <Typography variant="h5">
                  {those.selectedSupplier.name}{" "}
                </Typography>

                {those.selectedSupplier.contactsofsuppliers.length <= 0 && (
                  <Typography variant="subtitle2">
                    {" "}
                    No contacts found!{" "}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider />
            {/*<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">*/}
            {/*    {those.category.name}*/}
            {/*</Typography>*/}

            <List key={those.selectedSupplier.id} dense={true}>
              {those.selectedSupplier.contactsofsuppliers.map((contact) => (
                <Fragment key={contact.id}>
                  <ListItem
                    key={contact.id}
                    secondaryAction={
                      <>
                        {/*<IconButton edge="start" aria-label="edit">*/}
                        {/*    <EditIcon />*/}
                        {/*</IconButton>*/}
                        {/*<IconButton edge="end" aria-label="delete">*/}
                        {/*    <DeleteIcon />*/}
                        {/*</IconButton>*/}

                        <Tooltip title="Edit Contact" arrow>
                          <IconButton
                            sx={{
                              "&:hover": {
                                background: theme.colors.primary.lighter,
                              },
                              color: theme.palette.primary.main,
                            }}
                            color="inherit"
                            size="small"
                            //  onClick={() => handleClickOpenEditDialog(subcategory)}
                            onClick={() => {
                              if (hasAdminAccess(userContext?.currentUser)) {
                                handleClickOpenEditDialog(contact);
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Contact" arrow>
                          <IconButton
                            sx={{
                              "&:hover": {
                                background: theme.colors.error.lighter,
                              },
                              color: theme.palette.error.main,
                            }}
                            color="inherit"
                            size="small"
                            //   onClick={() => handleClickOpenDeleteCategDialog(subcategory)}
                            onClick={() => {
                              if (hasAdminAccess(userContext?.currentUser)) {
                                handleClickOpenDeleteContactDialog(contact);
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <ContactIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Full Name: ${contact.firstname} ${contact.lastname}`}
                      secondary={
                        <div>
                          <Typography variant="body2" color="textSecondary">
                            Email: {contact.email}
                          </Typography>

                          <Typography variant="body2" color="textSecondary">
                            CC on Email Order?:{" "}
                            {contact.cconpurchaseorder ? "Yes" : "No"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Active?: {contact.activestatusflag ? "Yes" : "No"}
                          </Typography>

                          <Typography variant="body2" color="textSecondary">
                            Phone: {contact.workphone}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Department: {contact.department}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Role/Position: {contact.role}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Address: {contact.address}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ZipCode: {contact.zipcode}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            City: {contact.city}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Country: {contact.country}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Notes: {contact.notes}
                          </Typography>
                        </div>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>
              ))}
            </List>
          </Box>
        </Drawer>

        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="xs"
        >
          <form onSubmit={handleEditSubmit} autoComplete="off">
            <DialogTitle>Edit Contact</DialogTitle>

            <DialogContent>
              <DialogContentText>
                To edit this Contact, please click Save.
              </DialogContentText>
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="firstname"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.firstname.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="lastname"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.lastname.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="department"
                    label="Department"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.department.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="role"
                    label="Role"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.role.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.email.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          selectedContactForEdit?.cconpurchaseorder || false
                        }
                        onChange={handleChange}
                        name="cconpurchaseorder"
                        color="primary"
                      />
                    }
                    label="Cc On Email Purchase Order"
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          selectedContactForEdit?.activestatusflag || false
                        }
                        onChange={handleChange}
                        name="activestatusflag"
                        color="primary"
                      />
                    }
                    label="Active?"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    name="workphone"
                    label="Work Phone"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.workphone.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.address.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="city"
                    label="City"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.city.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="zipcode"
                    label="Zip Code"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.zipcode.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="state"
                    label="State"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.state.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.country.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="notes"
                    label="Notes"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={selectedContactForEdit?.notes.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              {apiResponse &&
                typeof apiResponse !== "undefined" &&
                !(apiResponse.status === 200) && (
                  <Alert severity="error">
                    Error! {apiResponse?.toString()}
                  </Alert>
                )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>



        <Dialog
          open={openAddSubCategDialog}
          onClose={handleCloseAddSubCategDialog}
        >
          <form onSubmit={handleSubmitAddContact} autoComplete="off">
            <DialogTitle>Add Contact</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add new contact, please click Add.
              </DialogContentText>
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="firstname"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.firstname.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="lastname"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.lastname.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="department"
                    label="Department"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.department.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="role"
                    label="Role"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.role.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.email.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          selectedContactForEdit?.cconpurchaseorder || false
                        }
                        onChange={handleChange}
                        name="cconpurchaseorder"
                        color="primary"
                      />
                    }
                    label="Cc On Email Purchase Order"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          selectedContactForEdit?.activestatusflag || false
                        }
                        onChange={handleChange}
                        name="activestatusflag"
                        color="primary"
                      />
                    }
                    label="Active?"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="workphone"
                    label="Work Phone"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.workphone.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.address.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="city"
                    label="City"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.city.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="zipcode"
                    label="Zip Code"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.zipcode.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="state"
                    label="State"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.state.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={selectedContactForEdit?.country.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="notes"
                    label="Notes"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={selectedContactForEdit?.notes.toString() || ""}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {apiResponse &&
                typeof apiResponse !== "undefined" &&
                !(apiResponse.status === 200) && (
                  <Alert severity="error">
                    {" "}
                    Error! {apiResponse?.toString()}
                  </Alert>
                )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddSubCategDialog}>Cancel</Button>
              {/*<Button onClick={handleClose}>Save</Button>*/}
              <Button type="submit">Add</Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={openDeleteSubCategDialog}
          onClose={handleCloseDeleteSubCategDialog}
        >
          <form onSubmit={handleSubmitDeleteSubCateg} autoComplete="off">
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure? If yes, please click Delete.
              </DialogContentText>
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                disabled
                autoFocus
                // margin="dense"
                id="firstname"
                label="Firstname"
                inputProps={{ minLength: 1, maxLength: 50 }}
                fullWidth
                //variant="standard"

                type="text"
                value={selectedContactForEdit?.firstname.toString() || ""}
              />
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                disabled
                autoFocus
                // margin="dense"
                id="lastname"
                label="Lastname"
                inputProps={{ minLength: 1, maxLength: 50 }}
                fullWidth
                //variant="standard"

                type="text"
                value={selectedContactForEdit?.lastname.toString() || ""}
              />
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                disabled
                autoFocus
                // margin="dense"
                id="email"
                label="Email"
                inputProps={{ minLength: 0, maxLength: 100 }}
                fullWidth
                //variant="standard"

                type="text"
                value={selectedContactForEdit?.email.toString() || ""}
              />

              {apiResponse &&
                typeof apiResponse !== "undefined" &&
                !(apiResponse.status === 200) && (
                  <Alert severity="error">
                    {" "}
                    Error! {apiResponse?.toString()}
                  </Alert>
                )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteSubCategDialog}>Cancel</Button>

              <Button type="submit">Delete</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Fragment>
    </div>
  );
}

export default RightpopupContacts;

