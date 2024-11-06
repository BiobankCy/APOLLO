import React, { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { format, parseISO } from "date-fns";
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
  LotModel,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
} from "src/models/mymodels";
import BulkFilters, { Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import {
  addNewLot,
  deleteSingleLot,
  updateSingleLot,
} from "../../../services/user.service";
import { AxiosResponse } from "axios";
import { useAlert } from "src/contexts/AlertsContext";

interface CategoriesTableProps {
  className?: string;
  lotsList: LotModel[];
  updateLotListFn: any;
}

const applyFilterforForm = (
  lotsList: LotModel[],
  selectedids: string[],
): LotModel[] => {
  return lotsList.filter((x) => selectedids.includes(x.id.toString()));
};

const applyFilters = (lotsList: LotModel[], filters: Filters): LotModel[] => {
  return lotsList.filter((lot) => {
    let matches = true;

    if (filters.itemtextgiven != undefined) {
      let aaa = filters?.itemtextgiven.toUpperCase() ?? "";

      if (
        aaa.length > 0 &&
        !lot.lotnumber.toUpperCase().includes(aaa.toUpperCase()) &&
        !format(new Date(lot.expdate ?? 0), "dd/MM/yyyy")
          .toUpperCase()
          .includes(aaa.toUpperCase())
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
  lotsList: LotModel[],
  page: number,
  limit: number,
): LotModel[] => {
  return lotsList.slice(page * limit, page * limit + limit);
};

const LotsTable: FC<CategoriesTableProps> = ({
  lotsList,
  updateLotListFn,
}) => {
  const userContext = useAuth();
  const { showAlert } = useAlert();
  const [selectedLots, setSelectedLots] = useState<number[]>([]);
  const selectedBulkActions = selectedLots.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({ itemtextgiven: null });
  const navigate = useNavigate();

  const [selectedLotForEdit, setselectedLotForEdit] = useState<LotModel>({
    lotnumber: "",
    id: 0,
    expdate: null,
  });
  //  const [apiResponse, setApiResponse] = useState<ApiResponse>({ statuscode: null, message: null  });
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();

  const refreshLots = (prevlots: LotModel[]): void => {
    // console.log(prevFilters1);
    updateLotListFn(prevlots);
  };

  const setmyFilters2 = (prevFilters1: Filters): void => {
    // console.log(prevFilters1);
    setFilters(prevFilters1);
  };
  const handleSelectAllLots = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedLots(event.target.checked ? lotsList.map((lot) => lot.id) : []);
  };

  const handleSelectOneLot = (
    event: ChangeEvent<HTMLInputElement>,
    lotId: number,
  ): void => {
    if (!selectedLots.includes(lotId)) {
      setSelectedLots((prevSelected) => [...prevSelected, lotId]);
    } else {
      setSelectedLots((prevSelected) =>
        prevSelected.filter((id) => id !== lotId),
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);
    if (filteredLots.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredLots.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredLots.length / newlimitset) - 1);
      }
    }
  };

  const filteredLots = applyFilters(lotsList, filters);
  const paginatedLots = applyPagination(filteredLots, page, limit);
  const selectedSomeLots =
    selectedLots.length > 0 && selectedLots.length < lotsList.length;
  const selectedAllLots = selectedLots.length === lotsList.length;
  const theme = useTheme();

  //Edit Lot Dialog

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (lot: LotModel) => {
    setselectedLotForEdit(lot);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setApiResponse(undefined);
  };

  //Add Lot Dialog

  const [openAddLotDialog, setOpenAddCategDialog] = React.useState(false);
  const handleClickOpenAddCategDialog = () => {
    setselectedLotForEdit({ lotnumber: "", id: 0, expdate: null });
    setOpenAddCategDialog(true);
  };

  const handleCloseAddLotDialog = () => {
    setOpenAddCategDialog(false);
    setApiResponse(undefined);
  };

  //Delete Lot Dialog

  const [openDeleteCategDialog, setopenDeleteCategDialog] =
    React.useState(false);
  const handleClickOpenDeleteCategDialog = (lot: LotModel) => {
    setselectedLotForEdit(lot);
    setopenDeleteCategDialog(true);
  };

  const handleCloseDeleteCategDialog = () => {
    setopenDeleteCategDialog(false);
    setApiResponse(undefined);
  };

  const handleChangeOfFieldLotNumber = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedLotForEdit((filters: LotModel) => ({
      ...filters,
      lotnumber: e.target.value,
    }));
  };

  const handleChangeOfFieldLotExpDate = (newValue: Date | null) => {
    // setmyPODate(newValue);
    setselectedLotForEdit((filters: LotModel) => ({
      ...filters,
      expdate: newValue,
    }));
  };

  const handleSubmitEditLot = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();


    let newlot = selectedLotForEdit;
    if (selectedLotForEdit.expdate instanceof Date && !isNaN(selectedLotForEdit.expdate.getTime())) {
      const dt: any = format(
        selectedLotForEdit.expdate,
        "yyyy-MM-dd",
      );
      newlot.expdate = dt;
    }

    updateSingleLot(Number(newlot.id), newlot).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Lot Successfully Updated!", "success");
          setApiResponse(undefined);
          handleClose();

          let newList = lotsList.filter(
            (data) => data.id != selectedLotForEdit.id,
          );
          newList.unshift(selectedLotForEdit);
          refreshLots(newList);
          newList = [];

          setselectedLotForEdit({ lotnumber: "", id: 0, expdate: null });


        } else {
          setApiResponse(response);
        }
      },
      (error) => {
        setApiResponse(error);
      },
    );

  };
  const handleSubmitDeleteLot = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    deleteSingleLot(Number(selectedLotForEdit.id), selectedLotForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Lot Successfully Deleted!", "success");
          setApiResponse(undefined);
          handleCloseDeleteCategDialog();

          let newList = lotsList.filter(
            (data) => data.id != selectedLotForEdit.id,
          );

          refreshLots(newList);
          newList = [];
          setselectedLotForEdit({ lotnumber: "", id: 0, expdate: null });
        } else {
          setApiResponse(response);
        }
      },
      (error) => {
        setApiResponse(error);
      },
    );
  };

  const handleSubmitAddLot = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    let newlot = selectedLotForEdit;
    if (selectedLotForEdit.expdate) {
      const dt: any = format(
        parseISO(selectedLotForEdit.expdate.toISOString()),
        "yyyy-MM-dd",
      );
      newlot.expdate = dt;
    }

    addNewLot(newlot).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          showAlert("Lot Successfully Added!", "success");
          setApiResponse(undefined);
          handleCloseAddLotDialog();

          let newList = lotsList;

          newList.unshift(response.data);
          refreshLots(newList);
          newList = [];

          setselectedLotForEdit({ lotnumber: "", id: 0, expdate: null });


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
                        Add Lot
                      </Button>
                    </Box>
                  </Grid>
                </>
              )
            }
            title="Lot List"
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
                    checked={selectedAllLots}
                    indeterminate={selectedSomeLots}
                    onChange={handleSelectAllLots}
                  />
                </TableCell>

                <TableCell>Lot Number</TableCell>
                <TableCell>Expiry Date</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLots.map((lot) => {
                const isLotSelected = selectedLots.includes(lot.id);

                return (
                  <TableRow hover key={lot.id} selected={isLotSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isLotSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOneLot(event, lot.id)
                        }
                        value={isLotSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                        noWrap
                      >
                        {lot.lotnumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                      >
                        {lot.expdate &&
                          format(new Date(lot.expdate), "dd/MM/yyyy")}
                      </Typography>
                    </TableCell>
                    {/*<TableCell align="right">*/}
                    {/*    <Typography*/}
                    {/*        variant="body1"*/}
                    {/*        fontWeight="bold"*/}
                    {/*        color="text.primary"*/}
                    {/*        gutterBottom*/}

                    {/*    >*/}
                    {/*        <RightDrawer refreshCategories={refreshLots} catsList={lotsList} category={category}></RightDrawer>*/}
                    {/*    </Typography>*/}
                    {/*</TableCell>*/}

                    <TableCell align="right">
                      {hasAdminAccess(userContext?.currentUser) && (
                        <>
                          <Tooltip title="Edit Lot" arrow>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleClickOpen(lot)}
                            >
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Lot" arrow>
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
                                handleClickOpenDeleteCategDialog(lot)
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
            count={filteredLots.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={!filteredLots.length || filteredLots.length <= 0 ? 0 : page}
            rowsPerPage={limit}
            rowsPerPageOptions={Pagingdefaultoptions}
          />
        </Box>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmitEditLot} autoComplete="off">
          <DialogTitle>Edit Lot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit this lot, please click Save.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldLotNumber}
              autoFocus
              // margin="dense"
              id="lotnumber"
              label="Lot Number"
              variant="outlined"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedLotForEdit?.lotnumber.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />


            <DesktopDatePicker
              label="Lot Expdate"
              inputFormat="dd/MM/yyyy"
              value={selectedLotForEdit?.expdate}
              maxDate={undefined}
              //onChange={handleChangeOfPOdate}
              onChange={handleChangeOfFieldLotExpDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                //error={validateDates}
                // helperText={validateDates ? "PO Date can't be after Due Date" : ""}
                />
              )}
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

      <Dialog open={openAddLotDialog} onClose={handleCloseAddLotDialog}>
        <form onSubmit={handleSubmitAddLot} autoComplete="off">
          <DialogTitle>Add Lot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add new lot, please click Add.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              onChange={handleChangeOfFieldLotNumber}
              autoFocus
              // margin="dense"
              id="lotnumber"
              label="Lot Number"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"
              required
              type="text"
              value={selectedLotForEdit?.lotnumber || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

            <DesktopDatePicker
              label="Lot Expdate"
              inputFormat="dd/MM/yyyy"
              value={selectedLotForEdit?.expdate}
              maxDate={undefined}
              //onChange={handleChangeOfPOdate}
              onChange={handleChangeOfFieldLotExpDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                //error={validateDates}
                // helperText={validateDates ? "PO Date can't be after Due Date" : ""}
                />
              )}
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
            <Button onClick={handleCloseAddLotDialog}>Cancel</Button>
            {/*<Button onClick={handleClose}>Save</Button>*/}
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDeleteCategDialog}
        onClose={handleCloseDeleteCategDialog}
      >
        <form onSubmit={handleSubmitDeleteLot} autoComplete="off">
          <DialogTitle>Delete Lot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure? If yes, please click Delete.
            </DialogContentText>
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />
            <TextField
              disabled
              autoFocus
              // margin="dense"
              id="lotnumber"
              label="Lot Number"
              inputProps={{ minLength: 1, maxLength: 100 }}
              fullWidth
              //variant="standard"

              type="text"
              value={selectedLotForEdit?.lotnumber.toString() || ""}
            />
            <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

            <DesktopDatePicker
              label="Lot Expdate"
              inputFormat="dd/MM/yyyy"
              value={selectedLotForEdit?.expdate}
              maxDate={undefined}
              //onChange={handleChangeOfPOdate}
              onChange={handleChangeOfFieldLotExpDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                //error={validateDates}
                // helperText={validateDates ? "PO Date can't be after Due Date" : ""}
                />
              )}
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

LotsTable.propTypes = {
  lotsList: PropTypes.array.isRequired,
};

LotsTable.defaultProps = {
  lotsList: [],
};

export default LotsTable;
