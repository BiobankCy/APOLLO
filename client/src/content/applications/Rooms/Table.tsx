import React, { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";

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
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteIcon from "@mui/icons-material/DeleteTwoTone";

import {
  hasAdminAccess,
  LocBuildingModel,
  LocRoomModel,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
} from "src/models/mymodels";

import BulkFilters, { Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import {
  addNewRoom,
  deleteSingleRoom,
  updateSingleRoom,
} from "../../../services/user.service";
import { AxiosResponse } from "axios";
import { useAlert } from "src/contexts/AlertsContext";

interface RoomsTableProps {
  className?: string;
  roomsList: LocRoomModel[];
  buildingsList: LocBuildingModel[];
  updateRoomsList: any;
}



const applyFilters = (
  roomsList: LocRoomModel[],
  filters: Filters,
): LocRoomModel[] => {
  return roomsList.filter((room) => {
    let matches = true;

    if (filters.itemtextgiven != undefined) {

      let giventxt = filters?.itemtextgiven.toUpperCase() ?? "";


      if (
        giventxt.length > 0 &&
        !room.room.toUpperCase().includes(giventxt.toUpperCase()) &&
        !room.descr.toUpperCase().includes(giventxt.toUpperCase())
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
  buildingList: LocRoomModel[],
  page: number,
  limit: number,
): LocRoomModel[] => {
  return buildingList.slice(page * limit, page * limit + limit);
};



const RoomsTable: FC<RoomsTableProps> = ({
  roomsList,
  updateRoomsList,
  buildingsList,
}) => {
  const userContext = useAuth();
  const { showAlert } = useAlert();
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const selectedBulkActions = selectedRooms.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({
    itemtextgiven: null,
    itembuildingid: null,
    itemroomid: null,
  });

  const [selectedRoomForEdit, setselectedRoomForEdit] = useState<LocRoomModel>({
    id: 0,
    room: "",
    buildingid: 0,
    building: undefined,
    descr: "",
  });
  //  const [apiResponse, setApiResponse] = useState<ApiResponse>({ statuscode: null, message: null  });
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();

  const refreshRooms = (prevcategories: LocRoomModel[]): void => {

    updateRoomsList(prevcategories);
  };

  const setmyFilters2 = (prevFilters1: Filters): void => {

    setFilters(prevFilters1);
  };


  const handleSelectAllRooms = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedRooms(
      event.target.checked ? roomsList.map((room) => room.id) : [],
    );
  };

  const handleSelectOneRoom = (
    event: ChangeEvent<HTMLInputElement>,
    roomID: number,
  ): void => {
    if (!selectedRooms.includes(roomID)) {
      setSelectedRooms((prevSelected) => [...prevSelected, roomID]);
    } else {
      setSelectedRooms((prevSelected) =>
        prevSelected.filter((id) => id !== roomID),
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);
    if (filteredRooms.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredRooms.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredRooms.length / newlimitset) - 1);
      }
    }
  };

  const filteredRooms = applyFilters(roomsList, filters);
  const paginatedRooms = applyPagination(filteredRooms, page, limit);
  const selectedSomeRooms =
    selectedRooms.length > 0 && selectedRooms.length < roomsList.length;
  const selectedAllRooms = selectedRooms.length === roomsList.length;
  const theme = useTheme();

  //Edit Category Dialog

  const [openEditDialog, setOpen] = React.useState(false);
  const handleClickOpen = (room: LocRoomModel) => {
    setselectedRoomForEdit(room);
    setOpen(true);
  };

  const handleCloseEditDialog = () => {
    setOpen(false);
    setApiResponse(undefined);
  };

  //Add Category Dialog

  const [openAddRoomDialog, setOpenAddRoomDialog] = React.useState(false);
  const handleClickOpenAddRoomDialog = () => {
    setselectedRoomForEdit({
      id: 0,
      room: "",
      buildingid: 0,
      building: undefined,
      descr: "",
    });
    setOpenAddRoomDialog(true);
  };

  const handleCloseAddRoomDialog = () => {
    setOpenAddRoomDialog(false);
    setApiResponse(undefined);
  };

  //Delete Category Dialog

  const [openDeleteRoomDialog, setopenDeleteRoomDialog] = React.useState(false);
  const handleClickOpenDeleteRoomDialog = (room: LocRoomModel) => {
    setselectedRoomForEdit(room);
    setopenDeleteRoomDialog(true);
  };

  const handleCloseDeleteRoomDialog = () => {
    setopenDeleteRoomDialog(false);
    setApiResponse(undefined);
  };

  const handleChangeOfFieldRoomName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedRoomForEdit((filters: LocRoomModel) => ({
      ...filters,
      room: e.target.value,
    }));
  };

  const handleChangeOfFieldCategoryDescr = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedRoomForEdit((filters: LocRoomModel) => ({
      ...filters,
      descr: e.target.value,
    }));
  };

  const handleChangeBuilding = (event: SelectChangeEvent) => {
    setselectedRoomForEdit((filters: LocRoomModel) => ({
      ...filters,
      buildingid: Number(event.target.value),
    }));
  };

  const editedlocationbuildingidIsValid =
    selectedRoomForEdit.buildingid > 0
      ? selectedRoomForEdit.buildingid.toString()
      : "";


  const handleSubmitEditRoom = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();


    updateSingleRoom(Number(selectedRoomForEdit.id), selectedRoomForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Room Successfully Updated!", "success");
          setApiResponse(undefined);
          handleCloseEditDialog();

          let newList = roomsList.filter(
            (data) => data.id != selectedRoomForEdit.id,
          );
          newList.unshift(response.data);
          refreshRooms(newList);
          newList = [];

          setselectedRoomForEdit({
            id: 0,
            room: "",
            buildingid: 0,
            building: undefined,
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
  const handleSubmitDeleteRoom = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    deleteSingleRoom(Number(selectedRoomForEdit.id), selectedRoomForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Room Successfully Deleted!", "success");
          setApiResponse(undefined);
          handleCloseDeleteRoomDialog();

          let newList = roomsList.filter(
            (data) => data.id != selectedRoomForEdit.id,
          );

          refreshRooms(newList);
          newList = [];
          setselectedRoomForEdit({
            id: 0,
            room: "",
            buildingid: 0,
            building: undefined,
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

  const handleSubmitAddRoom = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    addNewRoom(selectedRoomForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Room Successfully Added!", "success");
          setApiResponse(undefined);
          handleCloseAddRoomDialog();

          let newList = roomsList;
          // newList.unshift(selectedCategoryForEdit);
          newList.unshift(response.data);
          refreshRooms(newList);
          newList = [];

          setselectedRoomForEdit({
            id: 0,
            room: "",
            buildingid: 0,
            building: undefined,
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
            {/*<BulkActions*/}

            {/*/>*/}
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
                        onClick={() => handleClickOpenAddRoomDialog()}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add room
                      </Button>
                    </Box>
                  </Grid>
                </>
              )
            }
            title="Room List"
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
                    checked={selectedAllRooms}
                    indeterminate={selectedSomeRooms}
                    onChange={handleSelectAllRooms}
                  />
                </TableCell>

                <TableCell>Room Name</TableCell>
                <TableCell>Building Name</TableCell>
                <TableCell>Room Description</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRooms.map((room) => {
                const isRoomSelected = selectedRooms.includes(room.id);

                return (
                  <TableRow hover key={room.id} selected={isRoomSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isRoomSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOneRoom(event, room.id)
                        }
                        value={isRoomSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                        noWrap
                      >
                        {room.room}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                        noWrap
                      >
                        {room.building?.building}
                      </Typography>
                    </TableCell>

                    <TableCell>{room.descr}</TableCell>

                    <TableCell align="right">
                      {hasAdminAccess(userContext?.currentUser) && (
                        <>
                          <Tooltip title="Edit Room" arrow>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleClickOpen(room)}
                            >
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Room" arrow>
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
                                handleClickOpenDeleteRoomDialog(room)
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
            count={filteredRooms.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={!filteredRooms.length || filteredRooms.length <= 0 ? 0 : page}
            rowsPerPage={limit}
            rowsPerPageOptions={Pagingdefaultoptions}
          />
        </Box>
      </Card>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <form onSubmit={handleSubmitEditRoom} autoComplete="off">
          <DialogTitle>Edit Room</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit this room, please click Save.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldRoomName}
              autoFocus
              // margin="dense"
              id="categoryname"
              label="Room Name"
              variant="outlined"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedRoomForEdit?.room.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryDescr}
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Room Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              variant="outlined"
              type="text"
              value={selectedRoomForEdit?.descr.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Building</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                onChange={handleChangeBuilding}
                defaultValue=""
                required
                value={editedlocationbuildingidIsValid}
                label="Room"
                fullWidth
              >
                {buildingsList?.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.building}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>
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

      <Dialog open={openAddRoomDialog} onClose={handleCloseAddRoomDialog}>
        <form onSubmit={handleSubmitAddRoom} autoComplete="off">
          <DialogTitle>Add Room</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add new room, please click Add.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldRoomName}
              autoFocus
              // margin="dense"
              id="buildingname"
              label="Room Name"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedRoomForEdit?.room.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldCategoryDescr}
              autoFocus
              //  margin="dense"
              id="locdescription"
              label="Room Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              //variant="standard"
              type="text"
              value={selectedRoomForEdit?.descr.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Building</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                onChange={handleChangeBuilding}
                defaultValue=""
                required
                value={editedlocationbuildingidIsValid}
                label="Room"
                fullWidth
              >
                {buildingsList?.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.building}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>

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
            <Button onClick={handleCloseAddRoomDialog}>Cancel</Button>

            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openDeleteRoomDialog} onClose={handleCloseDeleteRoomDialog}>
        <form onSubmit={handleSubmitDeleteRoom} autoComplete="off">
          <DialogTitle>Delete Room</DialogTitle>
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
              label="Room Name"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"

              type="text"
              value={selectedRoomForEdit?.room.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              disabled
              autoFocus
              //  margin="dense"
              id="categorydescr"
              label="Room Description"
              inputProps={{ minLength: 0, maxLength: 150 }}
              fullWidth
              multiline
              //variant="standard"
              type="text"
              value={selectedRoomForEdit?.descr.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

            <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
              <InputLabel>Building</InputLabel>
              <Select
                // error={isLocationIdValid(location.toString())}
                disabled
                onChange={handleChangeBuilding}
                defaultValue=""
                required
                value={editedlocationbuildingidIsValid}
                label="Room"
                fullWidth
              >
                {buildingsList?.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.building}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/*isLocationIdValid(location.toString()) ? "Please select" : ""*/}
              </FormHelperText>
            </FormControl>

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
            <Button onClick={handleCloseDeleteRoomDialog}>Cancel</Button>

            <Button type="submit">Delete</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

RoomsTable.propTypes = {
  roomsList: PropTypes.array.isRequired,
};

RoomsTable.defaultProps = {
  roomsList: [],
};

export default RoomsTable;
