import React, { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import {
  Tooltip,
  Divider,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  CardHeader,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteIcon from "@mui/icons-material/DeleteTwoTone";

import {
  CategoryModel,
  hasAdminAccess,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
} from "src/models/mymodels";
//import BulkActions from './BulkActions';
import RightDrawer from "./Rightpopup";
import BulkFilters, { Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import {
  addNewCategory,
  deleteSingleCategory,
  updateSingleCategory,
} from "../../../services/user.service";
import { AxiosResponse } from "axios";
import { useAlert } from "src/contexts/AlertsContext";

interface CategoriesTableProps {
  className?: string;
  catsList: CategoryModel[];
  updateCategoriesList: any;
}

const applyFilterforForm = (
  categoriesList: CategoryModel[],
  selectedids: string[],
): CategoryModel[] => {
  return categoriesList.filter((x) => selectedids.includes(x.id));
};

const applyFilters = (
  categoriesList: CategoryModel[],
  filters: Filters,
): CategoryModel[] => {
  return categoriesList.filter((category) => {
    let matches = true;

    if (filters.itemtextgiven != undefined) {
      let aaa = filters?.itemtextgiven.toUpperCase() ?? "";

      if (
        aaa.length > 0 &&
        !category.name.toUpperCase().includes(aaa.toUpperCase()) &&
        !category.descr.toUpperCase().includes(aaa.toUpperCase())
      ) {
        matches = false;
        return matches;
      } else {
      }
    }

    return matches;
  });
};

const applyPagination = (
  catsList: CategoryModel[],
  page: number,
  limit: number,
): CategoryModel[] => {
  return catsList.slice(page * limit, page * limit + limit);
};



const CategoriesTable: FC<CategoriesTableProps> = ({
  catsList,
  updateCategoriesList,
}) => {
  const userContext = useAuth();
  const { showAlert } = useAlert();
  const [selectedCatetegories, setSelectedCategories] = useState<string[]>([]);
  const selectedBulkActions = selectedCatetegories.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({ itemtextgiven: null });
  const [showINTREQDialog, setshowINTREQDialog] = useState<boolean>(false);
  const [showPODialog, setshowPODialog] = useState<boolean>(false);
  const [selectedCategoryForEdit, setselectedCategoryForEdit] =
    useState<CategoryModel>({
      name: "",
      id: "",
      descr: "",
      productsubcategories: [],
    });
  //  const [apiResponse, setApiResponse] = useState<ApiResponse>({ statuscode: null, message: null  });
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();

  const refreshCategories = (prevcategories: CategoryModel[]): void => {
    // console.log(prevFilters1);
    updateCategoriesList(prevcategories);
  };

  const setmyFilters2 = (prevFilters1: Filters): void => {
    // console.log(prevFilters1);
    setFilters(prevFilters1);
  };


  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);
    if (filteredCategories.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredCategories.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredCategories.length / newlimitset) - 1);
      }
    }
  };

  const filteredCategories = applyFilters(catsList, filters);
  const paginatedSuppliers = applyPagination(filteredCategories, page, limit);
  const theme = useTheme();

  //handler

  //Edit Category Dialog

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (category: CategoryModel) => {
    setselectedCategoryForEdit(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setApiResponse(undefined);
  };

  //Add Category Dialog

  const [openAddCategDialog, setOpenAddCategDialog] = React.useState(false);
  const handleClickOpenAddCategDialog = () => {
    setselectedCategoryForEdit({
      name: "",
      descr: "",
      id: "0",
      productsubcategories: [],
    });
    setOpenAddCategDialog(true);
  };

  const handleCloseAddCategDialog = () => {
    setOpenAddCategDialog(false);
    setApiResponse(undefined);
  };

  //Delete Category Dialog

  const [openDeleteCategDialog, setopenDeleteCategDialog] =
    React.useState(false);
  const handleClickOpenDeleteCategDialog = (category: CategoryModel) => {
    setselectedCategoryForEdit(category);
    setopenDeleteCategDialog(true);
  };

  const handleCloseDeleteCategDialog = () => {
    setopenDeleteCategDialog(false);
    setApiResponse(undefined);
  };

  const handleChangeOfFieldCategoryName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedCategoryForEdit((filters: CategoryModel) => ({
      ...filters,
      name: e.target.value,
    }));
  };

  const handleChangeOfFieldCategoryDescr = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedCategoryForEdit((filters: CategoryModel) => ({
      ...filters,
      descr: e.target.value,
    }));
  };

  //const sendSingleProductRequest = (pr: MyProps): JSX.Element => {
  //    //console.log(pr);
  //  return ResponsiveFormDialog(pr) ;

  //};

  //const list = (anchor: Anchor, stocklist: availableStockAnalysisModel[]) => (

  //);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();



    updateSingleCategory(
      Number(selectedCategoryForEdit.id),
      selectedCategoryForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Category Successfully Updated!", "success");


          setApiResponse(undefined);
          handleClose();

          let newList = catsList.filter(
            (data) => data.id != selectedCategoryForEdit.id,
          );
          newList.unshift(selectedCategoryForEdit);
          refreshCategories(newList);
          newList = [];

          setselectedCategoryForEdit({
            name: "",
            id: "",
            descr: "",
            productsubcategories: [],
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
  const handleSubmitDeleteCateg = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    deleteSingleCategory(
      Number(selectedCategoryForEdit.id),
      selectedCategoryForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          setApiResponse(undefined);
          handleCloseDeleteCategDialog();

          let newList = catsList.filter(
            (data) => data.id != selectedCategoryForEdit.id,
          );

          refreshCategories(newList);
          newList = [];
          setselectedCategoryForEdit({
            name: "",
            id: "",
            descr: "",
            productsubcategories: [],
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

  const handleSubmitAddCateg = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    addNewCategory(selectedCategoryForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {

          showAlert("Category Successfully Added!", "success");
          setApiResponse(undefined);
          handleCloseAddCategDialog();


          let newList = catsList;
          // newList.unshift(selectedCategoryForEdit);
          newList.unshift(response.data);
          refreshCategories(newList);
          newList = [];

          setselectedCategoryForEdit({
            name: "",
            id: "",
            descr: "",
            productsubcategories: [],
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

  return (
    <React.Fragment>
      <Card>


        {selectedBulkActions && (
          <Box flex={1} p={2}>

          </Box>
        )}

        {!selectedBulkActions && (
          <CardHeader
            sx={{ pr: 2.6 }}
            action={
              hasAdminAccess(userContext?.currentUser) && (
                <>
                  <Grid item>
                    <Box component="span">
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        onClick={() => handleClickOpenAddCategDialog()}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add category
                      </Button>
                    </Box>
                  </Grid>
                </>
              )
            }
            title="Category List"
          />
        )}
        <Box flex={1} p={2}>
          <BulkFilters setmyFilters={setmyFilters2} filters={filters} />
        </Box>
        <Divider />
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow sx={{ verticalAlign: "top" }}>
                {/*<TableCell padding="checkbox">*/}
                {/*    <Checkbox*/}
                {/*        color="primary"*/}
                {/*        checked={selectedAllCategories}*/}
                {/*        indeterminate={selectedSomeCategories}*/}
                {/*        onChange={handleSelectAllCategories}*/}
                {/*    />*/}
                {/*</TableCell>*/}

                <TableCell>Category Name</TableCell>
                <TableCell>Category Description</TableCell>
                <TableCell></TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSuppliers.map((category) => {
                const isCategorySelected = selectedCatetegories.includes(
                  category.id,
                );

                return (
                  <TableRow
                    hover
                    key={category.id}
                    selected={isCategorySelected}
                  >
                    {/*<TableCell padding="checkbox">*/}
                    {/*    <Checkbox*/}
                    {/*        color="primary"*/}
                    {/*        checked={isCategorySelected}*/}
                    {/*        onChange={(event: ChangeEvent<HTMLInputElement>) =>*/}
                    {/*            handleSelectOneCategory(event, category.id)*/}
                    {/*        }*/}
                    {/*        value={isCategorySelected}*/}
                    {/*    />*/}
                    {/*</TableCell>*/}
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                        noWrap
                      >
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                      >
                        {category.descr}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                      >
                        <RightDrawer
                          key={category.id}
                          refreshCategories={refreshCategories}
                          catsList={catsList}
                          category={category}
                        />
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      {hasAdminAccess(userContext?.currentUser) && (
                        <>
                          <Tooltip title="Edit Category" arrow>
                            <IconButton
                              key={`editButton-${category.id}`}
                              sx={{
                                "&:hover": {
                                  background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleClickOpen(category)}
                            >
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Category" arrow>
                            <IconButton
                              key={`deleteButton-${category.id}`}
                              sx={{
                                "&:hover": {
                                  background: theme.colors.error.lighter,
                                },
                                color: theme.palette.error.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() =>
                                handleClickOpenDeleteCategDialog(category)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredCategories.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={
              !filteredCategories.length || filteredCategories.length <= 0
                ? 0
                : page
            }
            rowsPerPage={limit}
            rowsPerPageOptions={Pagingdefaultoptions}
          />
        </Box>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit this category, please click Save.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryName}
              autoFocus
              // margin="dense"
              id="categoryname"
              label="Category Name"
              variant="outlined"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedCategoryForEdit?.name.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryDescr}
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Category Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              variant="outlined"
              type="text"
              value={selectedCategoryForEdit?.descr.toString() || ""}
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
            <Button onClick={handleClose}>Cancel</Button>
            {/*<Button onClick={handleClose}>Save</Button>*/}
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openAddCategDialog} onClose={handleCloseAddCategDialog}>
        <form onSubmit={handleSubmitAddCateg} autoComplete="off">
          <DialogTitle>Add Category</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add new category, please click Add.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryName}
              autoFocus
              // margin="dense"
              id="categoryname"
              label="Category Name"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedCategoryForEdit?.name.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryDescr}
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Category Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              //variant="standard"
              type="text"
              value={selectedCategoryForEdit?.descr.toString() || ""}
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
            <Button onClick={handleCloseAddCategDialog}>Cancel</Button>
            {/*<Button onClick={handleClose}>Save</Button>*/}
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDeleteCategDialog}
        onClose={handleCloseDeleteCategDialog}
      >
        <form onSubmit={handleSubmitDeleteCateg} autoComplete="off">
          <DialogTitle>Delete Category</DialogTitle>
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
              label="Category Name"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"

              type="text"
              value={selectedCategoryForEdit?.name.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              disabled
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Category Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              //variant="standard"
              type="text"
              value={selectedCategoryForEdit?.descr.toString() || ""}
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
            <Button onClick={handleCloseDeleteCategDialog}>Cancel</Button>

            <Button type="submit">Delete</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

CategoriesTable.propTypes = {
  catsList: PropTypes.array.isRequired,
};

CategoriesTable.defaultProps = {
  catsList: [],
};

export default CategoriesTable;
