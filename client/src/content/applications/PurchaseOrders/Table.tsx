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
  Zoom,
  Alert,
  Avatar,
  Stack,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import SentIcon from "@mui/icons-material/SendTwoTone";
import CancelIcon from "@mui/icons-material/CancelTwoTone";
import EmailIcon from "@mui/icons-material/Email";

import {
  customDateFormat,
  CustomPurchaseOrderModel,
  hasAdminAccess,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
  POrderLinesModel,
} from "src/models/mymodels";
import RightDrawer from "../../../Components/Shared/RightDrawerReceiving";
import BulkFilters, { Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import {
  addNewPO,
  deleteSinglePorder,
  sendOrderByEmail,
  updatePorderStatusAsCancelled,
  markOrderAsSent,
  updateSinglePorder,
} from "../../../services/user.service";
import { AxiosResponse } from "axios";

interface PordersTableProps {
  className?: string;
  pordersList: CustomPurchaseOrderModel[];
  updatePordersList: any;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 36,
      height: 36,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const applyFilterforForm = (
  categoriesList: CustomPurchaseOrderModel[],
  selectedids: number[],
): CustomPurchaseOrderModel[] => {
  return categoriesList.filter((x) => selectedids.includes(x.id));
};

const applyFilters = (
  pordersList: CustomPurchaseOrderModel[],
  filters: Filters,
): CustomPurchaseOrderModel[] => {
  return pordersList.filter((porder) => {
    let matches = true;

    if (
      filters.orderstatusid != null &&
      filters.orderstatusid !== 0 &&
      porder.statusid !== filters.orderstatusid
    ) {
      matches = false;
      return matches;
    }

    if (filters.itemtextgiven != undefined) {
      let aaa = filters?.itemtextgiven.toUpperCase() ?? "";

      if (
        aaa.length > 0 &&
        !porder.notes?.toUpperCase().includes(aaa.toUpperCase()) &&
        !porder.notes?.toUpperCase().includes(aaa.toUpperCase())
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
  catsList: CustomPurchaseOrderModel[],
  page: number,
  limit: number,
): CustomPurchaseOrderModel[] => {
  return catsList.slice(page * limit, page * limit + limit);
};



const PordersTable: FC<PordersTableProps> = ({
  pordersList,
  updatePordersList,
}) => {
  const userContext = useAuth();
  const [selectedPOrders, setSelectedCategories] = useState<number[]>([]);
  const selectedBulkActions = selectedPOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({ itemtextgiven: null });

  const [showINTREQDialog, setshowINTREQDialog] = useState<boolean>(false);

  const [selectedCategoryForEdit, setselectedCategoryForEdit] =
    useState<CustomPurchaseOrderModel>({
      id: 0,
      duedate: "",
      createdbyempid: 0,
      ordercreateddate: new Date(),
      podate: "",
      statusid: 0,
      supplierid: 0,
      notes: "",
      porderlines: [],
      sentbyempid: null,
      sentdate: null,
      tenderid: null,
    });
  //  const [apiResponse, setApiResponse] = useState<ApiResponse>({ statuscode: null, message: null  });
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();

  const refreshPORDERS = (prevcategories: CustomPurchaseOrderModel[]): void => {
    // console.log(prevFilters1);
    updatePordersList(prevcategories);
  };

  function refreshUpdatedRow(linetorefresh: CustomPurchaseOrderModel) {
    if (linetorefresh) {
      const newPList = pordersList.map((c) => {
        if (c.id === linetorefresh.id) {
          // Increment the clicked counter
          return linetorefresh;
        } else {
          // The rest haven't changed
          return c;
        }
      });
      updatePordersList(newPList);
    }
  }

  const setmyFilters2 = (prevFilters1: Filters): void => {

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

  const filteredCategories = applyFilters(pordersList, filters);
  const paginatedPorders = applyPagination(filteredCategories, page, limit);

  const theme = useTheme();



  const [
    selectedOrderIDForSendingByEmail,
    setselectedOrderIDForSendingByEmail,
  ] = React.useState(0);
  const [openSendOrderbyEmail, setopenSendOrderbyEmail] = React.useState(false);
  const handleCloseSendOrderbyEmail = () => {
    setopenSendOrderbyEmail(false);
    setselectedOrderIDForSendingByEmail(0);
    setMessageOfResponseOfEmailProcess("");
    //  setApiResponse(undefined);
  };
  const [sendingEmailProcessStatus, setSendingEmailProcessStatus] =
    useState(false);
  const [messageOfResponseOfEmailProcess, setMessageOfResponseOfEmailProcess] =
    useState("");

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setApiResponse(undefined);
  };

  //Add Purchase Order Dialog

  const [openAddCategDialog, setOpenAddCategDialog] = React.useState(false);


  const handleCloseAddCategDialog = () => {
    setOpenAddCategDialog(false);
    setApiResponse(undefined);
  };

  //Delete Category Dialog

  const [openDeleteCategDialog, setopenDeleteCategDialog] =
    React.useState(false);


  const handleCloseDeleteCategDialog = () => {
    setopenDeleteCategDialog(false);
    setApiResponse(undefined);
  };

  const handleChangeOfFieldCategoryName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedCategoryForEdit((filters: CustomPurchaseOrderModel) => ({
      ...filters,
      notes: e.target.value,
    }));
  };

  const handleChangeOfFieldCategoryDescr = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setselectedCategoryForEdit((filters: CustomPurchaseOrderModel) => ({
      ...filters,
      notes: e.target.value,
    }));
  };



  const handleSendByEmail = (porderid: number) => {
    setSendingEmailProcessStatus(true); // Set loading state to true before making the API call

    if (selectedOrderIDForSendingByEmail > 0) {
      sendOrderByEmail(porderid)
        .then((response) => {
          if (response) {
            if (response.status === 200) {
              const result = response.data ?? null;
              if (result.result === true) {
                setMessageOfResponseOfEmailProcess("Order sent successfully."); // Show success message
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

  const handleMarkAsSentBtn = (porderid: number) => {
    // event.preventDefault();
    markOrderAsSent(porderid).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          if (response.data) {
            const newList = pordersList.map((c) => {
              if (c.id === porderid) {
                return response.data;
              } else {
                return c;
              }
            });

            updatePordersList(newList);
          }
        } else {
          console.log(response.data, "Error updating pstatus as Sent!");
        }
      },
      (error) => {
        console.log(error, "Error updating pstatus as Sent!");
        // setApiResponse(error);
      },
    );
  };
  const handleMarkAsCancelledBtn = (porderid: number) => {
    // event.preventDefault();
    updatePorderStatusAsCancelled(porderid).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          if (response.data) {
            const newList = pordersList.map((c) => {
              if (c.id === porderid) {
                return response.data;
              } else {
                return c;
              }
            });

            updatePordersList(newList);
          }
        } else {
          console.log(response.data, "Error updating pstatus as Cancelled!");
        }
      },
      (error) => {
        console.log(error, "Error updating pstatus as Cancelled!");
        // setApiResponse(error);
      },
    );
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();



    updateSinglePorder(
      selectedCategoryForEdit.id,
      selectedCategoryForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {


          setApiResponse(undefined);
          handleClose();

          let newList = pordersList.filter(
            (data) => data.id != selectedCategoryForEdit.id,
          );
          newList.unshift(selectedCategoryForEdit);
          refreshPORDERS(newList);
          newList = [];

          setselectedCategoryForEdit({
            id: 0,
            duedate: "",
            createdbyempid: 0,
            ordercreateddate: new Date(),
            podate: "",
            statusid: 0,
            supplierid: 0,
            notes: "",
            porderlines: [],
            sentbyempid: null,
            sentdate: null,
            tenderid: null,
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

    deleteSinglePorder(
      selectedCategoryForEdit.id,
      selectedCategoryForEdit,
    ).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {
          setApiResponse(undefined);
          handleCloseDeleteCategDialog();

          let newList = pordersList.filter(
            (data) => data.id != selectedCategoryForEdit.id,
          );

          refreshPORDERS(newList);
          newList = [];
          setselectedCategoryForEdit({
            id: 0,
            duedate: "",
            createdbyempid: 0,
            ordercreateddate: new Date(),
            podate: "",
            statusid: 0,
            supplierid: 0,
            notes: "",
            porderlines: [],
            sentbyempid: null,
            sentdate: null,
            tenderid: null,
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

    addNewPO(selectedCategoryForEdit).then(
      (response) => {
        setApiResponse(response);
        if (response.status === 200) {

          setApiResponse(undefined);
          handleCloseAddCategDialog();

          let newList = pordersList;
          // newList.unshift(selectedCategoryForEdit);
          newList.unshift(response.data);
          refreshPORDERS(newList);
          newList = [];

          setselectedCategoryForEdit({
            id: 0,
            duedate: "",
            createdbyempid: 0,
            ordercreateddate: new Date(),
            podate: "",
            statusid: 0,
            supplierid: 0,
            notes: "",
            porderlines: [],
            sentbyempid: null,
            sentdate: null,
            tenderid: null,
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

                    </Box>
                  </Grid>
                </>
              )
            }
            title="Order List"
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
                {/*<TableCell padding="checkbox">*/}
                {/*    <Checkbox*/}
                {/*        color="primary"*/}
                {/*        checked={selectedAllCategories}*/}
                {/*        indeterminate={selectedSomeCategories}*/}
                {/*        onChange={handleSelectAllCategories}*/}
                {/*    />*/}
                {/*</TableCell>*/}

                <TableCell>Order ID</TableCell>
                <TableCell align="center">Date Created</TableCell>
                <TableCell align="left">Created By</TableCell>
                {/*  <TableCell align="center">Expected Delivery</TableCell>*/}
                <TableCell align="left">Supplier</TableCell>
                <TableCell align="center">Status</TableCell>

                <TableCell align="center">Details</TableCell>
                <TableCell align="left">Tender</TableCell>

                <TableCell align="center">Date Sent</TableCell>
                <TableCell align="left">Sent By</TableCell>
                {/*  <TableCell align="center">More Info</TableCell>*/}
                <TableCell align="right">More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPorders.map((porder) => {
                const isPOrderSelected = selectedPOrders.includes(porder.id);

                return (
                  <TableRow hover key={porder.id} selected={isPOrderSelected}>
                    {/*<TableCell padding="checkbox">*/}
                    {/*    <Checkbox*/}
                    {/*        color="primary"*/}
                    {/*        checked={isCategorySelected}*/}
                    {/*        onChange={(event: ChangeEvent<HTMLInputElement>) =>*/}
                    {/*            handleSelectOneCategory(event, porder.id)*/}
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
                        {porder.id}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text" noWrap>
                        {customDateFormat(porder.ordercreateddate, "DateOnly")}
                        {/*  {format(new Date(porder.ordercreateddate), "dd/MM/yyyy")}*/}
                        <Divider></Divider>
                        {customDateFormat(porder.ordercreateddate, "TimeOnly")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {porder.createdbyuserfullname != null && (
                        <Tooltip
                          arrow
                          TransitionComponent={Zoom}
                          title={<> {porder.createdbyuserfullname} </>}
                        >
                          <Avatar
                            {...stringAvatar(porder.createdbyuserfullname)}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                    {/*<TableCell align="center">*/}
                    {/*    <Typography variant="body2" color="text" noWrap>*/}

                    {/*        {format(new Date(porder.duedate), "dd/MM/yyyy")}*/}

                    {/*    </Typography>*/}
                    {/*</TableCell>*/}
                    <TableCell align="left">
                      <Typography variant="body2" color="text" noWrap>
                        {porder.supName ?? ""}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text" noWrap>
                        {porder.statusName ?? ""}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                      >
                        {/*                                            <RightDrawer key={porder.id} porderheader={porder} orderlinescount={porder.porderlinesCount ?? 0} refreshUpdatedRow={refreshUpdatedRow} porderline={null}  ></RightDrawer>*/}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="body2" color="text" noWrap>
                        {porder.tenderid ? porder.tendercode ?? "" : ""}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" color="text" noWrap>
                        {porder.sentdate ? (
                          <>
                            {customDateFormat(porder.sentdate, "DateOnly")}
                            <Divider></Divider>
                            {customDateFormat(porder.sentdate, "TimeOnly")}
                          </>
                        ) : (
                          ""
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      {porder.sentbyuserfullname != null && (
                        <Tooltip
                          arrow
                          TransitionComponent={Zoom}
                          title={<>{porder.sentbyuserfullname}</>}
                        >
                          <Avatar
                            {...stringAvatar(porder.sentbyuserfullname)}
                          />
                        </Tooltip>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {hasAdminAccess(userContext?.currentUser) && (
                        <>
                          {porder &&
                            !porder.sentdate &&
                            porder.statusName?.toLowerCase() == "new" && (
                              <Tooltip title="Mark As Sent" arrow>
                                <IconButton
                                  sx={{
                                    "&:hover": {
                                      background: theme.colors.primary.lighter,
                                    },
                                    color: theme.palette.primary.main,
                                  }}
                                  color="inherit"
                                  size="small"
                                  onClick={() => handleMarkAsSentBtn(porder.id)}
                                >
                                  <SentIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          {
                            <Tooltip title="Send Order by Email" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                                disabled={selectedOrderIDForSendingByEmail > 0}
                                onClick={() => {
                                  setselectedOrderIDForSendingByEmail(
                                    porder.id,
                                  );
                                  setopenSendOrderbyEmail(true);
                                }}
                              >
                                <EmailIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          }

                          {
                            // edit order btn
                            //<Tooltip title="Edit Order" arrow>
                            //    <IconButton
                            //        sx={{
                            //            '&:hover': {
                            //                background: theme.colors.primary.lighter
                            //            },
                            //            color: theme.palette.primary.main
                            //        }}
                            //        color="inherit"
                            //        size="small"
                            //        onClick={() => handleClickOpen(porder)}
                            //    >
                            //        <EditTwoToneIcon fontSize="small" />
                            //    </IconButton>
                            //</Tooltip>
                          }
                          {porder &&
                            (porder.statusName?.toLowerCase() == "new" ||
                              porder.statusName?.toLowerCase() == "sent") && (
                              <Tooltip title="Cancel Order" arrow>
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
                                    handleMarkAsCancelledBtn(porder.id)
                                  }
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                        </>
                        //<Button size="small" variant="outlined" onClick={() => handleClickOpen(category)}>
                        //    Edit Category
                        //</Button>
                      )}
                      <Stack direction="row" spacing={0}>
                        {porder.notes && porder.notes.length > 0 && (
                          <Tooltip
                            title={
                              <>
                                <b>Notes with Order</b>
                                <Divider></Divider>
                                {"" + porder.notes}
                              </>
                            }
                            arrow
                          >
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                              }}
                              color="inherit"
                              size="small"
                            >
                              <CommentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
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
              value={selectedCategoryForEdit?.notes?.toString() || ""}
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
              value={selectedCategoryForEdit?.notes?.toString() || ""}
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
          <DialogTitle>Add Purchase Order</DialogTitle>
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
              value={selectedCategoryForEdit?.notes?.toString() || ""}
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
              value={selectedCategoryForEdit?.notes?.toString() || ""}
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
              value={selectedCategoryForEdit?.notes?.toString() || ""}
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
              value={selectedCategoryForEdit?.notes?.toString() || ""}
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

      <Dialog open={openSendOrderbyEmail} onClose={handleCloseSendOrderbyEmail}>
        <DialogTitle>Send order by email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To send this order to supplier, please click Send.
          </DialogContentText>
          <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

          <div>
            {/* Render loading state or message */}
            {sendingEmailProcessStatus ? (
              <p>Sending...</p>
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
              handleSendByEmail(selectedOrderIDForSendingByEmail);
            }}
            disabled={
              selectedOrderIDForSendingByEmail <= 0 || sendingEmailProcessStatus
            }
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

PordersTable.propTypes = {
  pordersList: PropTypes.array.isRequired,
};

PordersTable.defaultProps = {
  pordersList: [],
};

export default PordersTable;
