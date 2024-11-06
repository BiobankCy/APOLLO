import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  TextField,
  InputLabel,
  Typography,
  Box,
  Input,
  TableContainer,
  Paper,
  Stack,
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
  IconButton,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import AddTwoToneIcon from "@mui/icons-material/Send";
import TenderComboWithSearchAndAddNewDialog from "./TenderCombo";
import {
  ccyFormat,
  customDateFormat,
  POrderFormLine,
  PorderHeaderModel,
  POrderLinesModel,
  TenderModel,
} from "../../models/mymodels";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import {
  addNewPO,
  sendOrderByEmail,
  markOrderAsSent,
} from "../../services/user.service";
import HelpTooltipButton from "./HelpTooltipButton";
import TooltipIconButton from "./TooltipIconButton";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";

interface PurchaseOrderDialogProps {
  orderLines: POrderFormLine[];
  onClose: () => void;
  onOrderSent: (reqids?: number[]) => void;
}

function addDays(
  numOfDays: number,
  date: Date,
): Date | (() => Date | null) | null {
  date.setDate(date.getDate() + numOfDays);

  return date;
}

const PurchaseOrderDialog: React.FC<PurchaseOrderDialogProps> = ({
  orderLines,
  onClose,
  onOrderSent,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [orderSavedInDB, setOrderSavedInDB] = useState(false);
  const [newOrderSavedResponseData, setNewOrderSavedResponseData] =
    useState<PorderHeaderModel>();
  const [myOrderToSend, setMyOrderToSend] =
    useState<POrderFormLine[]>(orderLines);
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  const [sendingEmailProcessStatus, setSendingEmailProcessStatus] =
    useState(false);
  const [messageOfResponseOfEmailProcess, setMessageOfResponseOfEmailProcess] =
    useState("");

  const [myNotes, setmyNotes] = React.useState("");
  const [myDueDate, setmyDueDate] = React.useState<Date | null>(
    addDays(15, new Date()),
  );
  const [myPODate, setmyPODate] = React.useState<Date | null>(new Date());
  const [myTender, setmyTender] = React.useState<TenderModel | null>(null);
  const [myFormErrors, setmyFormErrors] = useState<string[]>([]);
  // Calculate subtotal and total amounts
  const subtotal = myOrderToSend.reduce((total, product) => {
    return total + product.orderQuantity * product.costprice;
  }, 0);

  const vatAmount = myOrderToSend.reduce((total, product) => {
    return (
      total +
      (product.orderQuantity * product.costprice * product.vatRate) / 100
    );
  }, 0);

  const totalAmount = subtotal + vatAmount;

  // Check if all products have the same supplierId
  const supplierId = myOrderToSend[0]?.defaultSupplierId;
  const sameSupplier = myOrderToSend.every(
    (product) => product.defaultSupplierId === supplierId,
  );
  const invalidDatesCheck = !myDueDate || !myPODate || myPODate > myDueDate;
  const handleChangeOfDuedate = (newValue: Date | null) => {
    setmyDueDate(newValue);
  };
  const handleChangeOfPOdate = (newValue: Date | null) => {
    setmyPODate(newValue);
  };
  // Handle order quantity change
  const handleOrderQuantityChange = (
    productId: string,
    requestId: number,
    value: string,
  ) => {
    const updatedProducts = myOrderToSend.map((product) => {
      if (product.id === productId && product.requestlineid === requestId) {
        const orderQuantity = parseFloat(value);
        return {
          ...product,
          orderQuantity:
            isNaN(orderQuantity) || orderQuantity < 0 ? 0 : orderQuantity,
        };
      }
      return product;
    });
    setMyOrderToSend(updatedProducts);
  };
  // Handle costprice change
  const handleUnitCostpriceChange = (
    productId: string,
    requestId: number,
    value: string,
  ) => {
    const updatedProducts = myOrderToSend.map((product) => {
      if (product.id === productId && product.requestlineid === requestId) {
        const unitCostprice = parseFloat(value);
        return {
          ...product,
          costprice:
            isNaN(unitCostprice) || unitCostprice < 0 ? 0 : unitCostprice,
        };
      }
      return product;
    });
    setMyOrderToSend(updatedProducts);
  };

  const handleSendByEmail = () => {
    setSendingEmailProcessStatus(true); // Set loading state to true before making the API call

    if (orderSavedInDB) {
      sendOrderByEmail(newOrderSavedResponseData?.id ?? 0)
        .then((response) => {
          if (response) {
            if (response.status === 200) {
              const result = response.data ?? null;
              if (result.result === true) {
                setMessageOfResponseOfEmailProcess("Order sent successfully."); // Show success message
                handleClose();
              } else {
                setMessageOfResponseOfEmailProcess(
                  "Failed to send order via email." + result.message,
                ); // Show error message when result.result is false
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

  const handleMarkAsSent = () => {
    // Handle the action when the "Mark as Sent" button is clicked
    if (orderSavedInDB) {
      markOrderAsSent(newOrderSavedResponseData?.id ?? 0).then(
        (response) => {
          if (response.status === 200) {
            handleClose();
          } else {
            console.log(response.data, "Error updating pstatus as Sent!");
          }
        },
        (error) => {
          console.log(error, "Error updating pstatus as Sent!");
          // setApiResponse(error);
        },
      );
    }
  };
  function calculateAmountWithTax(porderlines?: POrderLinesModel[]): number {
    if (!porderlines) {
      return 0;
    }
    const subtotal = porderlines.reduce((total, product) => {
      return total + product.qty * product.unitpurcostprice;
    }, 0);

    const vatAmount = porderlines.reduce((total, product) => {
      return (
        total +
        (product.qty *
          product.unitpurcostprice *
          (product.vatindexNavigation?.rate ?? 0)) /
        100
      );
    }, 0);

    const totalAmount = subtotal + vatAmount;

    return roundToTwoDecimalPlaces(totalAmount);
  }

  function roundToTwoDecimalPlaces(value: number): number {
    return Math.round(value * 100) / 100;
  }
  // Send order to API
  const sendOrder = () => {
    //   setmyFormErrors(errors => [...errors, "Custom Error!"]);
    // Validate order quantity
    const invalidOrderLength = myOrderToSend.length;
    if (invalidOrderLength <= 0) {
      setmyFormErrors((errors) => [...errors, "Error: Empty Order"]);
      return;
    }

    const invalidOrderLineQty = myOrderToSend.some(
      (product) => product.orderQuantity <= 0,
    );

    if (invalidOrderLineQty) {
      setmyFormErrors((errors) => [...errors, "Error: Items with 0 quantity"]);
      return;
    }

    if (invalidDatesCheck) {
      setmyFormErrors((errors) => [
        ...errors,
        "Error: Check Order Date Or Due Date Or Both. ",
      ]);
      return;
    }

    let lines = [] as POrderLinesModel[];
    let newline = {} as POrderLinesModel;

    myOrderToSend.forEach((p) => {
      newline = {
        id: 0,
        pordid: 0,
        productid: Number(p.id),
        qty: p?.orderQuantity ?? 0,
        unitpurcostprice: p.costprice,
        vatindex: p.vatId,
        requestlineid: p.requestlineid <= 0 ? null : p.requestlineid,
        /*urgentFlag: p.urgent || false,*/
      };

      lines.push(newline);
    });

    let myNewPOObj: PorderHeaderModel = {
      id: 0,
      ordercreateddate: new Date(), //filled by API Logic
      //  podate: '2018-12-25' , // date input
      //  duedate: '2018-12-25', // date input
      podate: format(myPODate, "yyyy-MM-dd"),
      duedate: format(myDueDate, "yyyy-MM-dd"),
      supplierid: myOrderToSend[0].defaultSupplierId | 0,
      createdbyempid: 0, //filled by API Logic
      sentbyempid: null,
      sentdate: null,
      statusid: 0, //filled by API Logic
      notes: myNotes,
      tenderid: myTender?.id ?? null,
      porderlines: lines,
    };

    addNewPO(myNewPOObj).then(
      (response) => {
        if (response.status === 200) {
          //  setOrderSentSuccessfully(response.data);
          //   setorderSentFlag(true);
          setOrderSavedInDB(true);
          const getNewOrder: PorderHeaderModel = response.data;
          setNewOrderSavedResponseData(getNewOrder);

          //check if order lines are having reqids inside
          if (
            getNewOrder.porderlines &&
            getNewOrder.porderlines.some(
              (product) => product.requestlineid ?? 0 > 0,
            )
          ) {
            // let uniqueProductIds = [...new Set(myreqLinesList.map((item) => item.linepid))];

            let reqlinesIDs1: number[] = [];
            //    myNewPOObj.porderlines.forEach(p => reqlinesIDs.push(p.requestlineid || 0));
            reqlinesIDs1 = [
              ...new Set(
                getNewOrder.porderlines.map((item) => item.requestlineid || 0),
              ),
            ];
            // setupdatedIds(reqlinesIDs1);
            onOrderSent(reqlinesIDs1);
            //  console.log(reqlinesIDs1, 'ids');
          } else {
            //order without reqids inside
            onOrderSent();
          }

          //    setsendResult(reqresult);

          //setTimeout(function () {
          //    // navigate("/management/products/", { replace: true });
          //}, 2000);
        } else {
          //response not 200

          // setmyFormErrors(errors => [...errors, "Error: " + response.data ?? "Unknown"] );
          setmyFormErrors((errors) => [
            ...errors,
            `Error: Status ${response.status} - ${response.data ?? "Unknown"}`,
          ]);
          return;
        }
        // setbtnSumbitDisabled(false);
        //   setsendResultResponse({ status: response.status, data: response.data, message: response.data.message });
      },
      (error) => {
        //setbtnSumbitDisabled(false);
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error);

        //  setmyFormErrors(errors => [...errors, "Error: Status: " + error.response.status ?? "Unknown" + " : " + error.response.data ?? '' + " : " + error.response.data ?? '' + ' Message:' + error.response.data ?? error.response.data?.message ?? error.message ?? error?.toString()]);
        setmyFormErrors((errors) => [
          ...errors,
          `Error: Status ${error.response?.status ?? "Unknown"} - ${error.response?.data ?? error.message ?? "Unknown"}`,
        ]);
        return;
      },
    );

  };

  // Reset order data when closing the dialog
  useEffect(() => {
    if (!orderSavedInDB) {
      setMyOrderToSend(orderLines);
      setNewOrderSavedResponseData(undefined);
      setmyFormErrors([]);
      setmyNotes("");
      setmyPODate(new Date());
      setmyDueDate(addDays(15, new Date()));
      setmyTender(null);
    }
  }, [orderSavedInDB, orderLines]);

  const isQtyValid = (value: number): boolean | undefined =>
    value < 1 || value > 1000000;
  const isUnitCostpriceValid = (value: number): boolean | undefined =>
    value < 0;

  const handleChangeOfFieldName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setmyNotes(event.target.value);
  };
  // Calculate the sum of row.id values
  const sumReqQTY = myOrderToSend.reduce((total, row) => {
    return total + row.originalreqlineqty;
  }, 0);


  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      fullScreen={fullScreen}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <IconButton color="primary" aria-label="add" sx={{ marginRight: 1 }}>
          <PostAddOutlinedIcon />
        </IconButton>
        <Typography variant="h6" component="div">
          IMS - Order - {myOrderToSend && myOrderToSend.length > 0 && myOrderToSend[0].defaultSupplierName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <div>
          {/* Purchase Order dialog content */}
          {!orderSavedInDB ? (
            <div>
              {/* Display message if products have different supplierId */}
              {/* {!sameSupplier && <div>Products must have the same supplierId.</div>} */}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <DesktopDatePicker
                  label="Date"
                  inputFormat="dd/MM/yyyy"
                  value={myPODate}
                  maxDate={myDueDate ?? undefined}
                  onChange={handleChangeOfPOdate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={invalidDatesCheck}
                      helperText={
                        invalidDatesCheck
                          ? "PO Date can't be after Due Date"
                          : ""
                      }
                    />
                  )}
                />

                <DesktopDatePicker
                  label="Due Date"
                  inputFormat="dd/MM/yyyy"
                  minDate={myPODate ?? undefined}
                  value={myDueDate}
                  onChange={handleChangeOfDuedate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={invalidDatesCheck}
                      helperText={
                        invalidDatesCheck
                          ? "PO Date can't be after Due Date"
                          : ""
                      }
                    />
                  )}
                />

                <TenderComboWithSearchAndAddNewDialog
                  givenPOsupplierid={
                    myOrderToSend && myOrderToSend.length > 0
                      ? myOrderToSend[0].defaultSupplierId
                      : 0
                  }
                  onTenderIDchange={setmyTender}
                />
              </Stack>

              {/* Display the list of products */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Code</TableCell>
                      <TableCell>Description</TableCell>

                      {sumReqQTY > 0 && (
                        <TableCell align="center">Requested Quantity</TableCell>
                      )}
                      <TableCell align="center">Ordered Quantity</TableCell>
                      <TableCell align="center">Available Quantity</TableCell>
                      <TableCell align="center">Product Units</TableCell>
                      <TableCell align="center">Vat (%)</TableCell>
                      <TableCell align="right">Unit</TableCell>
                      <TableCell align="right">Sum</TableCell>
                      <TableCell align="center">More</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myOrderToSend.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>

                        {sumReqQTY > 0 && (
                          <TableCell align="center">
                            {row.originalreqlineqty}{" "}
                          </TableCell>
                        )}
                        <TableCell align="center">
                          <div>
                            <FormControl fullWidth focused>
                              <TextField
                                sx={{ m: 0, minWidth: "5ch", maxWidth: "6ch" }}
                                type="number"
                                id="my-input"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                variant="standard"
                                required
                                error={isQtyValid(row.orderQuantity ?? 0)}
                                helperText={
                                  isQtyValid(row.orderQuantity ?? 0)
                                    ? "Min 1"
                                    : ""
                                }
                                aria-describedby="my-helper-text"
                                //defaultValue={row.orderQuantity}
                                value={row.orderQuantity.toString()}
                                inputProps={{
                                  minLength: 1,
                                  maxLength: 7,
                                  min: "1",
                                  max: "1000000",
                                }}
                                disabled={
                                  row.linePrimers && row.linePrimers.length > 0
                                }
                                onChange={(e) =>
                                  handleOrderQuantityChange(
                                    row.id,
                                    row.requestlineid,
                                    e.target.value,
                                  )
                                }
                              />
                              {/*<InputLabel htmlFor="my-input">Quantity</InputLabel>*/}
                              {/*<Input*/}
                              {/*    type="number" id="my-input"*/}
                              {/*    required*/}
                              {/*    error={ispunitsqtyValid(row.orderqty ?? 0)}*/}
                              {/*    helperText={ispunitsqtyValid(row.orderqty ?? 0) ? "Minimum 1 And Max 1000" : ""}*/}
                              {/*    aria-describedby="my-helper-text"*/}
                              {/*    defaultValue={row.orderqty}*/}
                              {/*    inputProps={{*/}
                              {/*        "aria-valuemin": 1, minLength: 1, maxLength: 4,   min: '1',*/}
                              {/*        max: '1000', }}*/}
                              {/*    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleQtyChange(event, row.id)}*/}

                              {/*/>*/}
                            </FormControl>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          {" "}
                          {row.availabletotalstockqty}{" "}
                        </TableCell>

                        <TableCell align="center"> {row.punits} </TableCell>
                        <TableCell align="center"> {row.vatRate} </TableCell>

                        <TableCell align="right">
                          {row.editableCostpriceFlag ? (
                            <TextField
                              sx={{ m: 1, minWidth: "10ch", maxWidth: "15ch" }}
                              id="standard-number22"
                              label="Price"
                              type="number"
                              error={isUnitCostpriceValid(row.costprice)}
                              helperText={
                                isUnitCostpriceValid(row.costprice)
                                  ? "Minimum 0"
                                  : ""
                              }
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                              inputProps={{
                                min: "0",
                                /*max: '100000',*/
                              }}
                              onChange={(e) =>
                                handleUnitCostpriceChange(
                                  row.id,
                                  row.requestlineid,
                                  e.target.value,
                                )
                              }
                              value={row.costprice}
                              required
                            />
                          ) : (
                            ccyFormat(row.costprice)
                          )}
                        </TableCell>

                        <TableCell align="right">
                          {ccyFormat(row.costprice * (row?.orderQuantity ?? 0))}
                        </TableCell>
                        {/* more column*/}
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                          >
                            <HelpTooltipButton
                              title={
                                "Minimum Stock Quantity: " +
                                row.minstockqty.toString()
                              }
                              size="small"
                              icon={<HelpIcon fontSize="small" />}
                            />



                            {row.linePrimers && row.linePrimers.length > 0 && (
                              <TooltipIconButton
                                title="Primers:"
                                primers={row.linePrimers}
                              />

                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell align="right" colSpan={sumReqQTY > 0 ? 7 : 6}>
                        Subtotal
                      </TableCell>
                      <TableCell defaultValue="" align="right" colSpan={2}>
                        <Typography> {ccyFormat(subtotal ?? 0)}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="right" colSpan={sumReqQTY > 0 ? 7 : 6}>
                        Vat
                      </TableCell>
                      {/*<TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>*/}
                      <TableCell defaultValue="" align="right" colSpan={2}>
                        <Typography> {ccyFormat(vatAmount ?? 0)}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right" colSpan={sumReqQTY > 0 ? 7 : 6}>
                        Total
                      </TableCell>
                      <TableCell defaultValue="" align="right" colSpan={2}>
                        <Typography> {ccyFormat(totalAmount ?? 0)}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="center" colSpan={sumReqQTY > 0 ? 7 : 6}>
                        <FormControl fullWidth focused>
                          <InputLabel htmlFor="mynoteshere">Notes</InputLabel>
                          <Input
                            placeholder="Write your notes here.."
                            aria-describedby="my-helper-text"
                            onChange={handleChangeOfFieldName}
                            value={myNotes}
                            multiline
                            id="mynoteshere"
                            inputProps={{ minLength: 0, maxLength: 500 }}
                          />
                          {/* <FormHelperText id="my-helper-text">Enter your notes here.</FormHelperText>*/}
                        </FormControl>
                      </TableCell>
                      <TableCell defaultValue="" align="right" colSpan={2}>
                        <Button
                          fullWidth
                          onClick={sendOrder}
                          variant="contained"
                          disabled={
                            (myOrderToSend.find(
                              (o) => (o.orderQuantity ?? 1) <= 0,
                            )
                              ? true
                              : false) ||
                            !myOrderToSend ||
                            !(myOrderToSend.length > 0)
                          }
                          startIcon={<AddTwoToneIcon fontSize="small" />}
                        >
                          <Typography variant="h4">
                            <Box sx={{ pb: 0 }}>
                              <b>Save</b>
                            </Box>
                          </Typography>
                        </Button>
                      </TableCell>
                    </TableRow>

                    {myFormErrors && myFormErrors.length > 0 && (
                      <TableRow
                        sx={
                          {
                            /*backgroundColor: "darkred"*/
                          }
                        }
                      >
                        <TableCell
                          defaultValue=""
                          align="right"
                          colSpan={sumReqQTY > 0 ? 9 : 8}
                        >
                          <Stack sx={{ width: "100%" }} spacing={0.5}>
                            {myFormErrors.map((error, index) => (
                              <Alert key={index} severity="error">
                                {error}
                              </Alert>
                            ))}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            newOrderSavedResponseData && (
              <div>
                <Box
                  sx={{
                    width: "100%",
                    minWidth: 250,
                    bgcolor: "background.paper",
                  }}
                >
                  <Box sx={{ my: 3, mx: 2 }}>
                    <Grid container alignItems="flex-start" spacing={4}>
                      <Grid item xs>
                        <Typography gutterBottom variant="h4" component="div">
                          Order saved successfully!
                        </Typography>
                        <Box sx={{ m: 2 }}>
                          <Typography gutterBottom variant="body1">
                            Select action or click close.
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
                              {/* <Button onClick={handleMarkAsSent}>Mark as Sent</Button>*/}

                              <div>
                                {/* Render loading state or message */}
                                {sendingEmailProcessStatus ? (
                                  <p>Sending...</p>
                                ) : (
                                  messageOfResponseOfEmailProcess && (
                                    <p>{messageOfResponseOfEmailProcess}</p>
                                  )
                                )}

                                {/* Render the button */}
                                <Button
                                  onClick={handleSendByEmail}
                                  disabled={sendingEmailProcessStatus}
                                >
                                  Send Order by Email
                                </Button>
                              </div>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="h4" component="div">
                          Order Details:
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          Number: {newOrderSavedResponseData.id}
                          <br />
                          Created:{" "}
                          {customDateFormat(
                            newOrderSavedResponseData.ordercreateddate,
                            "Datetime",
                          )}{" "}
                          <br />
                          Expected Delivery:{" "}
                          {customDateFormat(
                            newOrderSavedResponseData.duedate,
                            "DateOnly",
                          )}{" "}
                          <br />
                          Status: {newOrderSavedResponseData.status?.name}{" "}
                          <br />
                          Items:{" "}
                          {newOrderSavedResponseData.porderlines?.length.toString() ??
                            ""}{" "}
                          <br />
                          TotalAmount:{" "}
                          {calculateAmountWithTax(
                            newOrderSavedResponseData.porderlines,
                          ) ?? "error"}{" "}
                          Vat incl. <br />
                          Notes: {newOrderSavedResponseData.notes} <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="h4" component="div">
                          Supplier Details:
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          Name: {newOrderSavedResponseData.supplier?.name}{" "}
                          <br />
                          Email: {
                            newOrderSavedResponseData.supplier?.email
                          }{" "}
                          <br />
                          Phone:{" "}
                          {newOrderSavedResponseData.supplier?.worknumber}{" "}
                          <br />
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    ></Typography>
                  </Box>
                </Box>
              </div>
            )
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {/* Add other action buttons here */}
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDialog;
