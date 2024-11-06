import React, { FC, ChangeEvent, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  SelectChangeEvent,
  Stack,
  Switch,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteIcon from "@mui/icons-material/DeleteTwoTone";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  hasAdminAccess,
  LocationModel,
  LocRoomModel,
  LocTypeModel,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
} from "src/models/mymodels";

import BulkFilters, { ComboOptions, Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import {
  addNewLocation,
  deleteSingleLocation,
  getAllLocTypes,
  getAllRooms,
  updateSingleLocation,
} from "../../../services/user.service";
import { AxiosResponse } from "axios";
import { useAlert } from "src/contexts/AlertsContext";

interface CategoriesTableProps {
  className?: string;
  locsList: LocationModel[];
  updateLocationsList: any;
}

const getRoomsOptions = (locsList: LocationModel[]): ComboOptions[] => {
  let listItems: ComboOptions[] = [];
  listItems.push({ name: "All", id: 0 });
  locsList.forEach(function (location) {
    listItems.push({ name: location.room?.room ?? "", id: location.roomid });
  });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};

const getBuildingsOptions = (locsList: LocationModel[]): ComboOptions[] => {
  let listItems: ComboOptions[] = [];
  listItems.push({ name: "All", id: 0 });
  locsList.forEach(function (location) {
    listItems.push({
      name: location.room?.building?.building ?? "",
      id: location.room?.buildingid ?? 0,
    });
  });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};

const applyFilterforForm = (
  categoriesList: LocationModel[],
  selectedids: number[],
): LocationModel[] => {
  return categoriesList.filter((x) => selectedids.includes(x.id));
};

const applyFilters = (
  locationsList: LocationModel[],
  filters: Filters,
): LocationModel[] => {
  return locationsList.filter((location) => {
    let matches = true;

    if (
      filters.itembuildingid != null &&
      filters.itembuildingid !== 0 &&
      location.room?.buildingid !== filters.itembuildingid
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.itemroomid != null &&
      filters.itemroomid !== 0 &&
      location.roomid !== filters.itemroomid
    ) {
      matches = false;
      return matches;
    }

    if (filters.itemtextgiven != undefined) {
      let giventxt = filters?.itemtextgiven.toUpperCase() ?? "";

      if (
        giventxt.length > 0 &&
        !location.locname.toUpperCase().includes(giventxt.toUpperCase()) &&
        !location.descr.toUpperCase().includes(giventxt.toUpperCase()) &&
        !location.room?.building?.building
          .toUpperCase()
          .includes(giventxt.toUpperCase()) &&
        !location.room?.room.toUpperCase().includes(giventxt.toUpperCase())
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
  catsList: LocationModel[],
  page: number,
  limit: number,
): LocationModel[] => {
  return catsList.slice(page * limit, page * limit + limit);
};


const CategoriesTable: FC<CategoriesTableProps> = ({
  locsList,
  updateLocationsList,
}) => {
  const userContext = useAuth();
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const selectedBulkActions = selectedLocations.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({
    itemtextgiven: null,
    itembuildingid: null,
    itemroomid: null,
  });
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [selectedLocationForEdit, setselectedLocationForEdit] =
    useState<LocationModel>({
      id: 0,
      locname: "",
      loctypeid: 0,
      roomid: 0,
      activestatusFlag: false,
      descr: "",
    });
  //  const [apiResponse, setApiResponse] = useState<ApiResponse>({ statuscode: null, message: null  });
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();

  const refreshLocations = (prevcategories: LocationModel[]): void => {
    // console.log(prevFilters1);
    updateLocationsList(prevcategories);
  };

  const setmyFilters2 = (prevFilters1: Filters): void => {
    // console.log(prevFilters1);
    setFilters(prevFilters1);
  };

  const [availableLocRooms, setavailableLocRooms] = React.useState<
    LocRoomModel[]
  >([]);
  useEffect(() => {
    if (availableLocRooms && availableLocRooms.length > 0) {
    } else {
      getAllRooms().then(
        (response) => {
          if (response.status === 200) {
            setavailableLocRooms(response.data);
          } else {
            setavailableLocRooms([]);
          }
        },
        (error) => {
          setavailableLocRooms([]);
        },
      );
    }
  }, [availableLocRooms]);

  const [locTypes, setlocTypes] = React.useState<LocTypeModel[]>([]);
  useEffect(() => {
    if (locTypes && locTypes.length > 0) {
    } else {
      getAllLocTypes().then(
        (response) => {
          if (response.status === 200) {
            setlocTypes(response.data);
          } else {
            setlocTypes([]);
          }
        },
        (error) => {
          setlocTypes([]);
        },
      );
    }
  }, [locTypes]);

  const handleSelectAllLocations = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedLocations(
      event.target.checked ? locsList.map((category) => category.id) : [],
    );
  };

  const handleSelectOneLocation = (
    event: ChangeEvent<HTMLInputElement>,
    locID: number,
  ): void => {
    if (!selectedLocations.includes(locID)) {
      setSelectedLocations((prevSelected) => [...prevSelected, locID]);
    } else {
      setSelectedLocations((prevSelected) =>
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
    if (filteredLocations.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredLocations.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredLocations.length / newlimitset) - 1);
      }
    }
  };

  const filteredLocations = applyFilters(locsList, filters);
  const paginatedSuppliers = applyPagination(filteredLocations, page, limit);
  const selectedSomeLocations =
    selectedLocations.length > 0 && selectedLocations.length < locsList.length;
  const selectedAllLocations = selectedLocations.length === locsList.length;
  const theme = useTheme();

  //Edit Location Dialog

  const [openEditDialog, setOpen] = React.useState(false);
  const handleClickOpen = (category: LocationModel) => {
    setselectedLocationForEdit(category);
    setOpen(true);
  };

  const handleCloseEditDialog = () => {
    setOpen(false);
    setApiResponse(undefined);
  };

  //Add Location Dialog

  const [openAddLocationDialog, setOpenAddLocationDialog] =
    React.useState(false);
  const handleClickOpenAddCategDialog = () => {
    setselectedLocationForEdit({
      id: 0,
      locname: "",
      loctypeid: 0,
      roomid: 0,
      activestatusFlag: true,
      descr: "",
    });
    setOpenAddLocationDialog(true);
  };

  const handleCloseAddLocationDialog = () => {
    setOpenAddLocationDialog(false);
    setApiResponse(undefined);
  };

  //Delete Location Dialog

  const [openDeleteLocationDialog, setopenDeleteCategDialog] =
    React.useState(false);
  const handleClickOpenDeleteCategDialog = (category: LocationModel) => {
    setselectedLocationForEdit(category);
    setopenDeleteCategDialog(true);
  };

  const handleCloseDeleteLocationDialog = () => {
    setopenDeleteCategDialog(false);
    setApiResponse(undefined);
  };

  const handleChangeOfFieldLocationName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedLocationForEdit((filters: LocationModel) => ({
      ...filters,
      locname: e.target.value,
    }));
  };

  const handleChangeOfFieldCategoryDescr = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedLocationForEdit((filters: LocationModel) => ({
      ...filters,
      descr: e.target.value,
    }));
  };

  const handleChangeLOCroom = (event: SelectChangeEvent) => {
    setselectedLocationForEdit((filters: LocationModel) => ({
      ...filters,
      roomid: Number(event.target.value),
    }));
  };

  const handleChangeLOCtype = (event: SelectChangeEvent) => {
    setselectedLocationForEdit((filters: LocationModel) => ({
      ...filters,
      loctypeid: Number(event.target.value),
    }));
  };

  const handleChangeActiveStatusFlag = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setselectedLocationForEdit((filters: LocationModel) => ({
      ...filters,
      activestatusFlag: event.target.checked,
    }));
  };


  const handleSubmitEditLoc = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();


    updateSingleLocation(
      Number(selectedLocationForEdit.id),
      selectedLocationForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Location Successfully Updated!", "success");
          setApiResponse(undefined);
          handleCloseEditDialog();

          let newList = locsList.filter(
            (data) => data.id != selectedLocationForEdit.id,
          );
          newList.unshift(response.data);
          refreshLocations(newList);
          newList = [];

          setselectedLocationForEdit({
            id: 0,
            locname: "",
            loctypeid: 0,
            roomid: 0,
            activestatusFlag: false,
            descr: "",
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

    deleteSingleLocation(
      Number(selectedLocationForEdit.id),
      selectedLocationForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Location Successfully Deleted!", "success");
          setApiResponse(undefined);
          handleCloseDeleteLocationDialog();

          let newList = locsList.filter(
            (data) => data.id != selectedLocationForEdit.id,
          );

          refreshLocations(newList);
          newList = [];
          setselectedLocationForEdit({
            id: 0,
            locname: "",
            loctypeid: 0,
            roomid: 0,
            activestatusFlag: false,
            descr: "",
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
  const editedlocationroomidIsValid =
    selectedLocationForEdit.roomid > 0
      ? selectedLocationForEdit.roomid.toString()
      : "";
  const editedlocationtypeidIsValid =
    selectedLocationForEdit.loctypeid > 0
      ? selectedLocationForEdit.loctypeid.toString()
      : "";
  const handleSubmitAddLocation = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    addNewLocation(selectedLocationForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Location Successfully Added!", "success");
          setApiResponse(undefined);
          handleCloseAddLocationDialog();

          let newList = locsList;
          // newList.unshift(selectedCategoryForEdit);
          newList.unshift(response.data);
          refreshLocations(newList);
          newList = [];

          setselectedLocationForEdit({
            id: 0,
            locname: "",
            loctypeid: 0,
            roomid: 0,
            activestatusFlag: false,
            descr: "",
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
                        Add location
                      </Button>
                    </Box>
                  </Grid>
                </>
              )
            }
            title="Location List"
          />
        )}
        <Box flex={1} p={2}>
          <BulkFilters
            setmyFilters={setmyFilters2}
            filters={filters}
            buildingsArray={getBuildingsOptions(locsList)}
            roomsArray={getRoomsOptions(locsList)}
          />
        </Box>
        <Divider />
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedAllLocations}
                    indeterminate={selectedSomeLocations}
                    onChange={handleSelectAllLocations}
                  />
                </TableCell>

                <TableCell>Location Name</TableCell>

                <TableCell>Building</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="center">Status</TableCell>

                <TableCell>Location Description</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSuppliers.map((location) => {
                const isLocationSelected = selectedLocations.includes(
                  location.id,
                );

                return (
                  <TableRow
                    hover
                    key={location.id}
                    selected={isLocationSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isLocationSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOneLocation(event, location.id)
                        }
                        value={isLocationSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                        noWrap
                      >
                        {location.locname}
                      </Typography>
                    </TableCell>

                    <TableCell>{location.room?.building?.building}</TableCell>
                    <TableCell>{location.room?.room}</TableCell>
                    <TableCell>{location.loctype?.loctype}</TableCell>
                    <TableCell align="center">
                      {location.activestatusFlag === true ? (
                        <ToggleOnIcon color="success" fontSize="small" />
                      ) : (
                        <ToggleOffIcon color="error" fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell>{location.descr}</TableCell>

                    <TableCell align="right">
                      {hasAdminAccess(userContext?.currentUser) && (
                        <>
                          <Tooltip title="Edit Location" arrow>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleClickOpen(location)}
                            >
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Location" arrow>
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
                                handleClickOpenDeleteCategDialog(location)
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
            count={filteredLocations.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={
              !filteredLocations.length || filteredLocations.length <= 0
                ? 0
                : page
            }
            rowsPerPage={limit}
            rowsPerPageOptions={Pagingdefaultoptions}
          />
        </Box>
      </Card>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <form onSubmit={handleSubmitEditLoc} autoComplete="off">
          <DialogTitle>Edit Location</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit this location, please click Save.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldLocationName}
              autoFocus
              // margin="dense"
              id="categoryname"
              label="Location Name"
              variant="outlined"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedLocationForEdit?.locname.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryDescr}
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Location Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              variant="outlined"
              type="text"
              value={selectedLocationForEdit?.descr.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Room</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                onChange={handleChangeLOCroom}
                defaultValue=""
                required
                value={editedlocationroomidIsValid}
                label="Room"
                fullWidth
              >
                {availableLocRooms?.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    [{room.building?.building}] {room.room}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Type</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                onChange={handleChangeLOCtype}
                defaultValue=""
                required
                value={editedlocationtypeidIsValid}
                label="Type"
                fullWidth
              >
                {locTypes?.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.loctype}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <Stack
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ m: 1, p: 0, flexWrap: "wrap" }}
              spacing={1}
              justifyContent="space-evenly"
              alignItems="left"
              direction={{ xs: "column", sm: "column", md: "column" }}
            >
              <Typography>Status</Typography>
              <Switch
                color="success"
                checked={selectedLocationForEdit.activestatusFlag}
                onChange={handleChangeActiveStatusFlag}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Stack>
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
        open={openAddLocationDialog}
        onClose={handleCloseAddLocationDialog}
      >
        <form onSubmit={handleSubmitAddLocation} autoComplete="off">
          <DialogTitle>Add Location</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add new location, please click Add.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldLocationName}
              autoFocus
              // margin="dense"
              id="locationname"
              label="Location Name"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedLocationForEdit?.locname.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryDescr}
              autoFocus
              //  margin="dense"
              id="locdescription"
              label="Location Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              //variant="standard"
              type="text"
              value={selectedLocationForEdit?.descr.toString() || ""}
            />

            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Room</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                onChange={handleChangeLOCroom}
                defaultValue=""
                required
                value={editedlocationroomidIsValid}
                label="Room"
                fullWidth
              >
                {availableLocRooms?.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    [{room.building?.building}] {room.room}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Type</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                onChange={handleChangeLOCtype}
                defaultValue=""
                required
                value={editedlocationtypeidIsValid}
                label="Type"
                fullWidth
              >
                {locTypes?.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.loctype}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>

            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <Stack
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ m: 1, p: 0, flexWrap: "wrap" }}
              spacing={1}
              justifyContent="space-evenly"
              alignItems="left"
              direction={{ xs: "column", sm: "column", md: "column" }}
            >
              <Typography>Status</Typography>
              <Switch
                color="success"
                checked={selectedLocationForEdit.activestatusFlag}
                onChange={handleChangeActiveStatusFlag}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Stack>
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
            <Button onClick={handleCloseAddLocationDialog}>Cancel</Button>
            {/*<Button onClick={handleClose}>Save</Button>*/}
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDeleteLocationDialog}
        onClose={handleCloseDeleteLocationDialog}
      >
        <form onSubmit={handleSubmitDeleteCateg} autoComplete="off">
          <DialogTitle>Delete Location</DialogTitle>
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
              label="Location Name"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"

              type="text"
              value={selectedLocationForEdit?.locname.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              disabled
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Location Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              //variant="standard"
              type="text"
              value={selectedLocationForEdit?.descr.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Room</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                onChange={handleChangeLOCroom}
                defaultValue=""
                required
                value={editedlocationroomidIsValid}
                label="Room"
                fullWidth
              >
                {availableLocRooms?.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    [{room.building?.building}] {room.room}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Type</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                onChange={handleChangeLOCtype}
                defaultValue=""
                required
                value={editedlocationtypeidIsValid}
                label="Type"
                fullWidth
              >
                {locTypes?.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.loctype}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <Stack
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ m: 1, p: 0, flexWrap: "wrap" }}
              spacing={1}
              justifyContent="space-evenly"
              alignItems="left"
              direction={{ xs: "column", sm: "column", md: "column" }}
            >
              <Typography>Status</Typography>
              <Switch
                color="success"
                checked={selectedLocationForEdit.activestatusFlag}
                onChange={handleChangeActiveStatusFlag}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Stack>
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
            <Button onClick={handleCloseDeleteLocationDialog}>Cancel</Button>

            <Button type="submit">Delete</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

CategoriesTable.propTypes = {
  locsList: PropTypes.array.isRequired,
};

CategoriesTable.defaultProps = {
  locsList: [],
};

export default CategoriesTable;
