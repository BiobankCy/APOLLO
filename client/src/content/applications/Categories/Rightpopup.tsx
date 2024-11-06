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
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from "@mui/icons-material/Edit";
import {
  CategoryModel,
  hasAdminAccess,
  SubCategoryModel,
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
  addNewSubCategory,
  deleteSingleSubCategory,
  updateSingleSubCategory,
} from "../../../services/user.service";
import { useAuth } from "src/contexts/UserContext";
// create a new interface for prop types

interface PostsProps {

  catsList: CategoryModel[];
  category: CategoryModel;
  refreshCategories: any;
}



function Rightpopup(those: PostsProps) {
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
  const [selectedSubCategoryForEdit, setselectedSubCategoryForEdit] =
    useState<SubCategoryModel>({ name: "", id: "0", descr: "", catid: 0 });

  //Edit Sub Category Dialog

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const handleClickOpenEditDialog = (subcategory: SubCategoryModel) => {
    setselectedSubCategoryForEdit(subcategory);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setApiResponse(undefined);
  };

  //Add Sub Category Dialog

  const [openAddSubCategDialog, setOpenAddSubCategDialog] =
    React.useState(false);
  const handleClickOpenAddCategDialog = () => {
    setselectedSubCategoryForEdit({ name: "", id: "0", descr: "", catid: 0 });
    setOpenAddSubCategDialog(true);
  };

  const handleCloseAddSubCategDialog = () => {
    setOpenAddSubCategDialog(false);
    setApiResponse(undefined);
  };

  //Delete Sub Category Dialog

  const [openDeleteSubCategDialog, setopenDeleteSubCategDialog] =
    React.useState(false);
  const handleClickOpenDeleteCategDialog = (category: SubCategoryModel) => {
    setselectedSubCategoryForEdit(category);
    setopenDeleteSubCategDialog(true);
  };

  const handleCloseDeleteSubCategDialog = () => {
    setopenDeleteSubCategDialog(false);
    setApiResponse(undefined);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    updateSingleSubCategory(
      Number(selectedSubCategoryForEdit.id),
      selectedSubCategoryForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          setApiResponse(undefined);
          handleCloseEditDialog();

          let editedsubcategsoriginal =
            those.category.productsubcategories.filter(
              (data) => data.id != selectedSubCategoryForEdit.id,
            );
          editedsubcategsoriginal.unshift(selectedSubCategoryForEdit);
          let originalcategory = those.category;
          originalcategory.productsubcategories = editedsubcategsoriginal;

          let newList = those.catsList.filter(
            (data) => data.id != selectedSubCategoryForEdit.catid.toString(),
          );
          newList.unshift(originalcategory);
          those.refreshCategories(newList);
          newList = [];
          editedsubcategsoriginal = [];

          setselectedSubCategoryForEdit({
            name: "",
            id: "0",
            descr: "",
            catid: 0,
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

    deleteSingleSubCategory(
      Number(selectedSubCategoryForEdit.id),
      selectedSubCategoryForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          setApiResponse(undefined);
          handleCloseDeleteSubCategDialog();

          let editedsubcategsoriginal =
            those.category.productsubcategories.filter(
              (data) => data.id != selectedSubCategoryForEdit.id,
            );

          let originalcategory = those.category;
          originalcategory.productsubcategories = editedsubcategsoriginal;

          let newList = those.catsList.filter(
            (data) => data.id != selectedSubCategoryForEdit.catid.toString(),
          );
          newList.unshift(originalcategory);
          those.refreshCategories(newList);
          newList = [];
          editedsubcategsoriginal = [];

          setselectedSubCategoryForEdit({
            name: "",
            id: "0",
            descr: "",
            catid: 0,
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

  const handleSubmitAddSubCateg = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    selectedSubCategoryForEdit.catid = Number(those.category.id);

    addNewSubCategory(selectedSubCategoryForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          setApiResponse(undefined);
          handleCloseAddSubCategDialog();

          let editedsubcategsoriginal = those.category.productsubcategories;
          editedsubcategsoriginal.unshift(response.data);
          let originalcategory = those.category;
          originalcategory.productsubcategories = editedsubcategsoriginal;

          let newList = those.catsList.filter(
            (data) => data.id != selectedSubCategoryForEdit.catid.toString(),
          );
          newList.unshift(originalcategory);
          those.refreshCategories(newList);
          newList = [];
          editedsubcategsoriginal = [];

          setselectedSubCategoryForEdit({
            name: "",
            id: "0",
            descr: "",
            catid: 0,
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

  const handleChangeOfFieldCategoryName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedSubCategoryForEdit((filters: SubCategoryModel) => ({
      ...filters,
      name: e.target.value,
    }));
  };

  const handleChangeOfFieldCategoryDescr = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedSubCategoryForEdit((filters: SubCategoryModel) => ({
      ...filters,
      descr: e.target.value,
    }));
  };

  return (
    <div>
      <Fragment key={those.category.id}>
        <Button onClick={toggleDrawer(anchora, true)}>
          Show Subcategories ({those.category.productsubcategories.length ?? 0})
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
                    onClick={() => handleClickOpenAddCategDialog()}
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                  >
                    Add Sub Category
                  </Button>
                </Stack>
              </>
            )}
            <Stack direction="row" justifyContent="end">
              <Box sx={{ mx: "auto", textAlign: "center" }}>
                Category
                <Typography variant="h5">{those.category.name} </Typography>
                {those.category.descr.length > 0 && (
                  <Typography variant="subtitle2">
                    {" "}
                    Description: {those.category.descr}{" "}
                  </Typography>
                )}
                {those.category.productsubcategories.length <= 0 && (
                  <Typography variant="subtitle2">
                    {" "}
                    No subcategories found!{" "}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider />
            {/*<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">*/}
            {/*    {those.category.name}*/}
            {/*</Typography>*/}

            <List key={those.category.id} dense={true}>
              {those.category.productsubcategories.map((subcategory) => (
                <Fragment key={subcategory.id}>
                  <ListItem
                    key={subcategory.id}
                    secondaryAction={
                      <>
                        {/*<IconButton edge="start" aria-label="edit">*/}
                        {/*    <EditIcon />*/}
                        {/*</IconButton>*/}
                        {/*<IconButton edge="end" aria-label="delete">*/}
                        {/*    <DeleteIcon />*/}
                        {/*</IconButton>*/}

                        <Tooltip title="Edit Sub Category" arrow>
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
                                handleClickOpenEditDialog(subcategory);
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Sub Category" arrow>
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
                                handleClickOpenDeleteCategDialog(subcategory);
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
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={subcategory.name}
                      secondary={subcategory.descr}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>
              ))}
            </List>
          </Box>
        </Drawer>

        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <form onSubmit={handleEditSubmit} autoComplete="off">
            <DialogTitle>Edit Sub Category</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To edit this sub category, please click Save.
              </DialogContentText>
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                onChange={handleChangeOfFieldCategoryName}
                autoFocus
                // margin="dense"
                id="categoryname"
                label="Sub Category Name"
                variant="outlined"
                inputProps={{ minLength: 1, maxLength: 100 }}
                fullWidth
                //variant="standard"
                required
                type="text"
                value={selectedSubCategoryForEdit?.name.toString() || ""}
              />
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                onChange={handleChangeOfFieldCategoryDescr}
                autoFocus
                //  margin="dense"
                id="categorydescr"
                label="Sub Category Description"
                inputProps={{ minLength: 0, maxLength: 150 }}
                fullWidth
                multiline
                variant="outlined"
                type="text"
                value={selectedSubCategoryForEdit?.descr.toString() || ""}
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
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              {/*<Button onClick={handleClose}>Save</Button>*/}
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={openAddSubCategDialog}
          onClose={handleCloseAddSubCategDialog}
        >
          <form onSubmit={handleSubmitAddSubCateg} autoComplete="off">
            <DialogTitle>Add Sub Category</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add new sub category, please click Add.
              </DialogContentText>
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                onChange={handleChangeOfFieldCategoryName}
                autoFocus
                // margin="dense"
                id="categoryname"
                label="Sub Category Name"
                inputProps={{ minLength: 1, maxLength: 100 }}
                fullWidth
                //variant="standard"
                required
                type="text"
                value={selectedSubCategoryForEdit?.name.toString() || ""}
              />
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                onChange={handleChangeOfFieldCategoryDescr}
                autoFocus
                //  margin="dense"
                id="categorydescr"
                label="Sub Category Description"
                inputProps={{ minLength: 0, maxLength: 150 }}
                fullWidth
                multiline
                //variant="standard"
                type="text"
                value={selectedSubCategoryForEdit?.descr.toString() || ""}
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
            <DialogTitle>Delete Sub Category</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure? If yes, please click Delete.
              </DialogContentText>
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                disabled
                autoFocus
                // margin="dense"
                id="categoryname"
                label="Sub Category Name"
                inputProps={{ minLength: 1, maxLength: 100 }}
                fullWidth
                //variant="standard"

                type="text"
                value={selectedSubCategoryForEdit?.name.toString() || ""}
              />
              <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
              <TextField
                disabled
                autoFocus
                //  margin="dense"
                id="categorydescr"
                label="Sub Category Description"
                inputProps={{ minLength: 0, maxLength: 150 }}
                fullWidth
                multiline
                //variant="standard"
                type="text"
                value={selectedSubCategoryForEdit?.descr.toString() || ""}
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

export default Rightpopup;