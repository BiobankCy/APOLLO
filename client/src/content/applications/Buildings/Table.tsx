import React, { FC, ChangeEvent, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";

import {
  Tooltip,
  Divider,
  Box,
  Card,
  Checkbox,
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
  hasAdminAccess,
  LocBuildingModel,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
} from "src/models/mymodels";
import BulkActions from "./BulkActions";

import BulkFilters, { ComboOptions, Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import {
  addNewBuilding,
  deleteSingleBuilding,
  getAllLocTypes,
  updateSingleBuilding,
} from "../../../services/user.service";
import { AxiosResponse } from "axios";
import { useAlert } from "src/contexts/AlertsContext";

interface CategoriesTableProps {
  className?: string;
  buildingsList: LocBuildingModel[];
  updateBuildingsList: any;
}



const applyFilters = (
  buildingsList: LocBuildingModel[],
  filters: Filters,
): LocBuildingModel[] => {
  return buildingsList.filter((building) => {
    let matches = true;

    if (filters.itemtextgiven != undefined) {
      let giventxt = filters?.itemtextgiven.toUpperCase() ?? "";

      if (
        giventxt.length > 0 &&
        !building.building.toUpperCase().includes(giventxt.toUpperCase()) &&
        !building.descr.toUpperCase().includes(giventxt.toUpperCase())
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
  buildingList: LocBuildingModel[],
  page: number,
  limit: number,
): LocBuildingModel[] => {
  return buildingList.slice(page * limit, page * limit + limit);
};



const BuildingsTable: FC<CategoriesTableProps> = ({
  buildingsList,
  updateBuildingsList,
}) => {
  const userContext = useAuth();
  const [selectedBuildings, setSelectedBuildings] = useState<number[]>([]);
  const selectedBulkActions = selectedBuildings.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({
    itemtextgiven: null,
    itembuildingid: null,
    itemroomid: null,
  });
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [selectedBuildingForEdit, setselectedBuildingForEdit] =
    useState<LocBuildingModel>({ id: 0, building: "", descr: "" });
  //  const [apiResponse, setApiResponse] = useState<ApiResponse>({ statuscode: null, message: null  });
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();

  const refreshBuildings = (prevcategories: LocBuildingModel[]): void => {
    // console.log(prevFilters1);
    updateBuildingsList(prevcategories);
  };

  const setmyFilters2 = (prevFilters1: Filters): void => {
    // console.log(prevFilters1);
    setFilters(prevFilters1);
  };


  const handleSelectAllBuildings = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedBuildings(
      event.target.checked ? buildingsList.map((category) => category.id) : [],
    );
  };

  const handleSelectOneBuilding = (
    event: ChangeEvent<HTMLInputElement>,
    locID: number,
  ): void => {
    if (!selectedBuildings.includes(locID)) {
      setSelectedBuildings((prevSelected) => [...prevSelected, locID]);
    } else {
      setSelectedBuildings((prevSelected) =>
        prevSelected.filter((id) => id !== locID),
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);
    if (filteredBuildings.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredBuildings.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredBuildings.length / newlimitset) - 1);
      }
    }
  };

  const filteredBuildings = applyFilters(buildingsList, filters);
  const paginatedSuppliers = applyPagination(filteredBuildings, page, limit);
  const selectedSomeBuildings =
    selectedBuildings.length > 0 &&
    selectedBuildings.length < buildingsList.length;
  const selectedAllBuildings =
    selectedBuildings.length === buildingsList.length;
  const theme = useTheme();



  const [openEditDialog, setOpen] = React.useState(false);
  const handleClickOpen = (building: LocBuildingModel) => {
    setselectedBuildingForEdit(building);
    setOpen(true);
  };

  const handleCloseEditDialog = () => {
    setOpen(false);
    setApiResponse(undefined);
  };



  const [openAddBuildingDialog, setOpenAddBuildingDialog] =
    React.useState(false);
  const handleClickOpenAddBuildingDialog = () => {
    setselectedBuildingForEdit({ id: 0, building: "", descr: "" });
    setOpenAddBuildingDialog(true);
  };

  const handleCloseAddBuildingDialog = () => {
    setOpenAddBuildingDialog(false);
    setApiResponse(undefined);
  };



  const [openDeleteBuildingDialog, setopenDeleteBuildingDialog] =
    React.useState(false);
  const handleClickOpenDeleteBuildingDialog = (building: LocBuildingModel) => {
    setselectedBuildingForEdit(building);
    setopenDeleteBuildingDialog(true);
  };

  const handleCloseDeleteBuildingDialog = () => {
    setopenDeleteBuildingDialog(false);
    setApiResponse(undefined);
  };

  const handleChangeOfFieldBuildingName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedBuildingForEdit((filters: LocBuildingModel) => ({
      ...filters,
      building: e.target.value,
    }));
  };

  const handleChangeOfFieldCategoryDescr = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedBuildingForEdit((filters: LocBuildingModel) => ({
      ...filters,
      descr: e.target.value,
    }));
  };


  const handleSubmitEditBuilding = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    setApiResponse(undefined);
    event.preventDefault();



    updateSingleBuilding(
      Number(selectedBuildingForEdit.id),
      selectedBuildingForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Building Successfully Updated!", "success");
          setApiResponse(undefined);
          handleCloseEditDialog();

          let newList = buildingsList.filter(
            (data) => data.id != selectedBuildingForEdit.id,
          );
          newList.unshift(response.data);
          refreshBuildings(newList);
          newList = [];

          setselectedBuildingForEdit({ id: 0, building: "", descr: "" });
        } else {
          setApiResponse(response);
        }
      },
      (error) => {
        setApiResponse(error);
      },
    );


  };
  const handleSubmitDeleteBuilding = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    setApiResponse(undefined);
    event.preventDefault();

    deleteSingleBuilding(
      Number(selectedBuildingForEdit.id),
      selectedBuildingForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Building Successfully Deleted!", "success");
          setApiResponse(undefined);
          handleCloseDeleteBuildingDialog();

          let newList = buildingsList.filter(
            (data) => data.id != selectedBuildingForEdit.id,
          );

          refreshBuildings(newList);
          newList = [];
          setselectedBuildingForEdit({ id: 0, building: "", descr: "" });
        } else {
          setApiResponse(response);
        }
      },
      (error) => {
        setApiResponse(error);
      },
    );
  };

  const handleSubmitAddBuilding = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    addNewBuilding(selectedBuildingForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Building Successfully Added!", "success");
          setApiResponse(undefined);
          handleCloseAddBuildingDialog();

          let newList = buildingsList;
          // newList.unshift(selectedCategoryForEdit);
          newList.unshift(response.data);
          refreshBuildings(newList);
          newList = [];

          setselectedBuildingForEdit({ id: 0, building: "", descr: "" });
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
            {/*<BulkActions*/}
            {/*    openInternalReqFormFunc={setshowINTREQDialog} */}
            {/*    openCreatePOFormFunc={setshowPODialog}*/}
            {/*/>*/}
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
                        onClick={() => handleClickOpenAddBuildingDialog()}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add building
                      </Button>
                    </Box>
                  </Grid>
                </>
              )
            }
            title="Building List"
          />
        )}
        <Box flex={1} p={2}>
          <BulkFilters setmyFilters={setmyFilters2} filters={filters} />
        </Box>
        <Divider />
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedAllBuildings}
                    indeterminate={selectedSomeBuildings}
                    onChange={handleSelectAllBuildings}
                  />
                </TableCell>

                <TableCell>Building Name</TableCell>
                <TableCell>Building Description</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSuppliers.map((building) => {
                const isBuildingSelected = selectedBuildings.includes(
                  building.id,
                );

                return (
                  <TableRow
                    hover
                    key={building.id}
                    selected={isBuildingSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isBuildingSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOneBuilding(event, building.id)
                        }
                        value={isBuildingSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                        noWrap
                      >
                        {building.building}
                      </Typography>
                    </TableCell>

                    <TableCell>{building.descr}</TableCell>

                    <TableCell align="right">
                      {hasAdminAccess(userContext?.currentUser) && (
                        <>
                          <Tooltip title="Edit Building" arrow>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleClickOpen(building)}
                            >
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Building" arrow>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.error.lighter,
                                },
                                color: theme.palette.error.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() =>
                                handleClickOpenDeleteBuildingDialog(building)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                        //<Button size="small" variant="outlined" onClick={() => handleClickOpen(category)}>
                        //    Edit Category
                        //</Button>
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
            count={filteredBuildings.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={
              !filteredBuildings.length || filteredBuildings.length <= 0
                ? 0
                : page
            }
            rowsPerPage={limit}
            rowsPerPageOptions={Pagingdefaultoptions}
          />
        </Box>
      </Card>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <form onSubmit={handleSubmitEditBuilding} autoComplete="off">
          <DialogTitle>Edit Building</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit this building, please click Save.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldBuildingName}
              autoFocus
              // margin="dense"
              id="categoryname"
              label="Building Name"
              variant="outlined"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedBuildingForEdit?.building.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryDescr}
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Building Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              variant="outlined"
              type="text"
              value={selectedBuildingForEdit?.descr.toString() || ""}
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
        open={openAddBuildingDialog}
        onClose={handleCloseAddBuildingDialog}
      >
        <form onSubmit={handleSubmitAddBuilding} autoComplete="off">
          <DialogTitle>Add Building</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add new building, please click Add.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldBuildingName}
              autoFocus
              // margin="dense"
              id="buildingname"
              label="Building Name"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedBuildingForEdit?.building.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryDescr}
              autoFocus
              //  margin="dense"
              id="locdescription"
              label="Building Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              //variant="standard"
              type="text"
              value={selectedBuildingForEdit?.descr.toString() || ""}
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
            <Button onClick={handleCloseAddBuildingDialog}>Cancel</Button>

            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDeleteBuildingDialog}
        onClose={handleCloseDeleteBuildingDialog}
      >
        <form onSubmit={handleSubmitDeleteBuilding} autoComplete="off">
          <DialogTitle>Delete Building</DialogTitle>
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
              label="Building Name"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"

              type="text"
              value={selectedBuildingForEdit?.building.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              disabled
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Building Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              //variant="standard"
              type="text"
              value={selectedBuildingForEdit?.descr.toString() || ""}
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
            <Button onClick={handleCloseDeleteBuildingDialog}>Cancel</Button>

            <Button type="submit">Delete</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

BuildingsTable.propTypes = {
  buildingsList: PropTypes.array.isRequired,
};

BuildingsTable.defaultProps = {
  buildingsList: [],
};

export default BuildingsTable;
