import React, { useEffect, useState } from "react";
import {
  ProductModel,
  POrderLinesModel,
  CustomRequestLinesModel,
  ReceivingHeaderModel,
  ReceivingLinesModel,
  VatRateModel,
  ItemConditionStatusModel,
  LotOptionType,
  CustomPurchaseOrderModel,
  LocationModel,
  ccyFormat,
  SupplierInvoiceModel,
} from "src/models/mymodels";
import {
  addNewReceiving,
  getSomeProductsByIds,
} from "src/services/user.service";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  useTheme,
  Button,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Dialog,
  DialogContent,
  Card,
  CardHeader,
  Avatar,
  InputBase,
  CardContent,
} from "@mui/material";

import {
  ContentCopy as CopyrequestIcon,
  Delete as DeleteIcon,
  RemoveFromQueue as RequestIcon,
  ErrorOutlineTwoTone,
  Edit as EditIcon,
  Add as AddIcon,
  QrCodeScanner,
} from "@mui/icons-material";

import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";

import { useAuth } from "src/contexts/UserContext";
import { format, parseISO } from "date-fns";
import ChooseInvoice from "../PurchaseOrdersByLine/ExtraForms/ChooseInvoice";
import LocsComboWithSearchAndAddNewDialog from "../../../Components/Shared/LocsCombo";
import LotsComboWithSearchAndAddNewDialog from "../../../Components/Shared/LotsCombo";

const steps = [
  {
    label: "Receiving created",
    description: ``,
  },
  {
    label: "Saved",
    description: "",
  },
  {
    label: " You are finished.\n Now, please choose any available action:",
    description: ``,
  },
];


const groupBy = (data: POrderLinesModel[], keys: string[]) => {
  return Object.values(
    data.reduce((acc: { [key: string]: any }, val) => {
      const requestlineid = val.requestlineid ?? undefined; // Treat null as undefined
      const groupKey = keys
        .reduce((finalName, key) => finalName + (val as any)[key] + "/", "")
        .slice(0, -1);
      if (acc[groupKey]) {
        acc[groupKey].values.push(val.qty);
        acc[groupKey].qtysum += val.qty;
        acc[groupKey].alreadyreceivesum += val.alreadyreceivedqty;
        acc[groupKey].purcostpricesum += val.unitpurcostprice * val.qty;
        acc[groupKey].vatindex = val.vatindex;
        acc[groupKey].requestlineid = requestlineid;
        acc[groupKey].id = val.id;
        acc[groupKey].pid = val.productid;
      } else {
        acc[groupKey] = {
          pid: val.productid, // Keep the original pid value
          groupKey: groupKey, // Assign the concatenated value to a new field
          qtysum: val.qty,
          alreadyreceivesum: val.alreadyreceivedqty,
          purcostpricesum: val.unitpurcostprice * val.qty,
          vatindex: val.vatindex,
          values: [val.qty],
          requestlineid: requestlineid,
          id: val.id,
        };
      }
      console.log(acc, "acc");
      return acc;
    }, {}),
  );
};

function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(2);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 4 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button variant="contained" sx={{ mt: 1, mr: 1 }}>
                    Email Order
                    {/*index === steps.length - 1 ? 'Finish' : 'Continue'*/}
                  </Button>

                  <Button variant="contained" sx={{ mt: 1, mr: 1 }}>
                    Mark as Sent
                    {/*index === steps.length - 1 ? 'Finish' : 'Continue'*/}
                  </Button>
                  <Button variant="contained" sx={{ mt: 1, mr: 1 }}>
                    No further action
                    {/*index === steps.length - 1 ? 'Finish' : 'Continue'*/}
                  </Button>
                  {/*comment buttons on same line*/}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

function fillIReceivingLinesArray(
  orderLines: POrderLinesModel[],
  liveProducts: ProductModel[],
): ReceivingLinesModel[] {
  let finalreceivingdocument = [] as ReceivingLinesModel[];

  //console.log(JSON.stringify(groupBy(poOrderLines, ['productid']), null, 2));
  const groupedPOLinesArray = groupBy(orderLines, [
    "requestlineid",
    "productid",
  ]);
  let newReceivingline: ReceivingLinesModel = {} as ReceivingLinesModel;
  let templineid = 1;

  interface ABC {
    pid: number;
    qtysum: number;
    alreadyreceivesum: number;
    purcostpricesum: number;
    vatindex: number;
    id: number;
    requestlineid?: number;
  }

  for (let p of groupedPOLinesArray as ABC[]) {
    //  console.log(p, 'p');
    newReceivingline.productid = p.pid;
    newReceivingline.qtyOrdered = p.qtysum;
    newReceivingline.qtyRemainingToReceive = p.qtysum - p.alreadyreceivesum;
    //  newReceivingline.qty = p.qtysum;
    newReceivingline.qty = p.qtysum - p.alreadyreceivesum;
    newReceivingline.unitpurcostprice = p.purcostpricesum;
    newReceivingline.originalPOUnitCostprice = p.purcostpricesum;
    newReceivingline.linediscountPerc = 0;
    newReceivingline.vatindex = p.vatindex;
    newReceivingline.id = templineid;
    newReceivingline.receivingId = 0;
    newReceivingline.lotid = 0;
    newReceivingline.polineId = p.id;
    newReceivingline.requestlineid = p.requestlineid;
    // newReceivingline.re = p.id;
    newReceivingline.unitpurcostprice =
      Number(newReceivingline.unitpurcostprice) / newReceivingline.qtyOrdered;
    newReceivingline.conditionstatus = 1;

    let item = liveProducts?.find(
      (item) =>
        item.id.toString().toLowerCase() ===
        newReceivingline.productid.toString().toLowerCase(),
    );

    //newReceivingline.product = p.product ;
    newReceivingline.product = item;
    newReceivingline.receivinglocId = item?.defaultLocId ?? 0;

    let vatr: VatRateModel = {
      id: newReceivingline.vatindex.toString(),
      rate: item?.vatRate ?? 0, //thats not correct - we want from po line and not from product live table
    };

    newReceivingline.vatindexNavigation = vatr;
    newReceivingline.pooriginalvatindexNavigation = vatr;

    finalreceivingdocument.push(newReceivingline);
    newReceivingline = {} as ReceivingLinesModel;
    templineid++;
  }

  //  finalinternalorder.forEach(p => { p.orderqty = 1; /*p.urgent = false;*/ });
  return finalreceivingdocument;
}

function subtotal(items: ReceivingLinesModel[]) {
  return items
    .map(({ unitpurcostprice, qty }) => unitpurcostprice * (qty ?? 0))
    .reduce((sum, i) => sum + i, 0);
}

function calculateTotalDiscount(items: ReceivingLinesModel[]): number {
  return items
    .map(({ unitpurcostprice, qty, linediscountPerc }) => {
      const discount =
        unitpurcostprice * (qty ?? 0) * ((linediscountPerc ?? 0) / 100);
      return isNaN(discount) ? 0 : discount;
    })
    .reduce((sum, i) => sum + i, 0);
}

function totalamountAfterVat(items: ReceivingLinesModel[]) {
  return items
    .map(
      ({
        unitpurcostprice,
        qty,
        linediscountPerc,
        vatindexNavigation: { id, rate },
      }) => {
        // Calculate the total cost after applying the discount
        const totalAfterDiscount =
          unitpurcostprice * (qty ?? 0) * (1 - (linediscountPerc ?? 0) / 100);
        // Calculate the VAT on the total after discount
        const totalWithVAT = totalAfterDiscount * (1 + rate / 100);
        return isNaN(totalWithVAT) ? 0 : totalWithVAT;
      },
    )
    .reduce((sum, i) => sum + i, 0);
}
function totalVatAmount(items: ReceivingLinesModel[]) {
  return items
    .map(
      ({
        unitpurcostprice,
        qty,
        linediscountPerc,
        vatindexNavigation: { id, rate },
      }) => {
        // Calculate the cost after discount
        const totalAfterDiscount =
          unitpurcostprice * (qty ?? 0) * (1 - (linediscountPerc ?? 0) / 100);
        // Calculate the VAT amount for this item
        const vatAmount = totalAfterDiscount * (rate / 100);
        return isNaN(vatAmount) ? 0 : vatAmount;
      },
    )
    .reduce((sum, i) => sum + i, 0);
}

const countSuppliers = (prodList: CustomRequestLinesModel[]): number => {
  // console.log(prodList);
  return [...new Set(prodList.map((item) => item.linedefsupplierid))].length;
};

interface MyTotals {
  initialsubtotalamount: number;
  totaldiscountamount: number;
  subtotalamountAfterDiscount: number;
  totalamountAfterVat: number;
  totalVATamount: number;
}

interface ApiResponse {
  status: number;
  data?: any;
  message: string | string[];
}

export default function RecMainFormWithLines(
  myPOLinesToReceiveArray: POrderLinesModel[],
  myPOHeader: CustomPurchaseOrderModel,
  setupdatedIds: Function,
  availableVatRates: VatRateModel[],
  availableItemConditionStatuses: ItemConditionStatusModel[],
  availableLots: LotOptionType[],
  setavailableLots: any,
  availableLocs: LocationModel[],
  successReceivingFN: Function,
) {
  const userContext = useAuth();
  const theme = useTheme();

  //  const [productsLiveData, setproductsLiveData] = useState<ProductModel[]>();
  const [myOrder, setmyOrder] = useState<ReceivingLinesModel[]>();
  const [myOrdertotals, setmyOrdertotals] = useState<MyTotals>();
  const [myNotes, setmyNotes] = React.useState("");
  // const [invoiceNumber, setinvoiceNumber] = React.useState("");
  // const [invoiceDate, setInvoiceDate] = React.useState<Date | null>(new Date(),);
  const [selectedInvoice, setselectedInvoice] =
    React.useState<SupplierInvoiceModel>();

  const [myScanInput, setmyScanInput] = React.useState("");

  //const [myDueDate, setmyDueDate] = React.useState<Date | null>(addDays(15, new Date()));
  const [myPODate, setmyPODate] = React.useState<Date | null>(new Date());
  //  const [myTender, setmyTender] = React.useState<TenderOptionType | null>(null);
  const [btnSumbitDisabled, setbtnSumbitDisabled] =
    React.useState<boolean>(false);
  const [sendResultResponse, setsendResultResponse] =
    React.useState<ApiResponse | null>(null);
  //const countedSupNum: number = countSuppliers(myreqLinesList);
  const [orderSentFlag, setorderSentFlag] = React.useState<boolean>(false);
  const [dataDownloadedFlag, setdataDownloadedFlag] =
    React.useState<boolean>(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleCloseDialog = () => {
    setSelectedRowId(null);
    setOpenDialog(false);
  };



  function refreshTotals(newTotals: MyTotals) {
    setmyOrdertotals(newTotals);
  }



  const updateOrderLine = (linetoedit: ReceivingLinesModel) => {
    if (myOrder && linetoedit) {
      const newState = myOrder.map((obj) => {
        if (obj.id === linetoedit.id) {
          //      console.log(obj, 'found to edit');
          //    console.log(linetoedit, 'linetoedit replaced');
          return linetoedit;
        }

        // otherwise return the object as is
        //   console.log(obj, 'as is');
        return obj;
      });

      setmyOrder(newState);
    }
  };

  const isQtyValid = (value: number) => value < 1 || value > 1000000;



  const handleChangeOfScanhereField = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    let scaninput: string = e.target.value ?? "";
    setmyScanInput(scaninput);
  };

  async function onSubmitReceivingAPI(
    recLines: ReceivingLinesModel[],
    notes: string,
    podate: Date | null,
  ): Promise<boolean> {
    let reqresult = false;


    let newReceivingHead: ReceivingHeaderModel = {
      id: 0,
      receivedatetime: new Date(), //filled by API Logic
      porderID: myPOHeader.id,
      byuserID: 0, //filled by API Logic
      invoiceId: selectedInvoice?.id,
      notes: notes,
      receivinglines: recLines,
    };

    addNewReceiving(newReceivingHead).then(
      (response) => {
        if (response.status === 200) {
          setdataDownloadedFlag(false);
          setorderSentFlag(true);
          setbtnSumbitDisabled(false);
          //  setinvoiceNumber("");
          // setInvoiceDate(null);
          setselectedInvoice(undefined);

          reqresult = true;



          successReceivingFN(myPOHeader.id);
          return true;
        } else {
          console.log(response.data);
        }
        setbtnSumbitDisabled(false);
        setsendResultResponse({
          status: response.status,
          data: response.data,
          message: response.data.response.data,
        });
      },
      (error) => {
        setbtnSumbitDisabled(false);
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error);



        setsendResultResponse({
          status: error.response.status || 0,
          data: error.response.data || "",
          message:
            error.response.data ||
            error.response.data?.message ||
            error.message ||
            error?.toString(),
        });

      },
    );

    return reqresult;
  }

  const validateDates = false; // !myDueDate || !myPODate || myPODate > myDueDate;

  const sendNowF = async () => {
    if (myOrder) {
      if (myOrder.length > 0) {
        if (!validateDates) {
          let reqsumqty = 0;

          myOrder.forEach((obj) => {
            reqsumqty += obj.qty ?? 0;
          });

          const noLocsGivenCheck = myOrder.find(
            (o) => (o.receivinglocId ?? 1) <= 0,
          );
          const noLotsGivenCheck = myOrder.find((o) => (o.lotid ?? 1) <= 0);
          const isQtygivenWrongCheck = myOrder.find((o) => (o.qty ?? 1) <= 0);
          const linesExist = myOrder.length > 0 ? true : false;
          const isInvoiceGivenCheck = selectedInvoice ? true : false;
          // const isInvoiceDateGivenCheck = !!invoiceDate;

          if (
            !isQtygivenWrongCheck &&
            linesExist &&
            !noLocsGivenCheck &&
            !noLotsGivenCheck &&
            isInvoiceGivenCheck
          ) {
            // As find return object else undefined
            setbtnSumbitDisabled(true);
            let saveNow: boolean = await onSubmitReceivingAPI(
              myOrder,
              myNotes.trim(),
              myPODate,
            );
          } else {
            let errorsArray: string[] = [];
            // if (!isInvoiceDateGivenCheck) { errorsArray.push("Invoice date have not been specified."); }
            if (noLocsGivenCheck) {
              errorsArray.push("Location(s) have not been specified.");
            }
            if (noLotsGivenCheck) {
              errorsArray.push("Lot number(s) have not been specified.");
            }
            if (isQtygivenWrongCheck) {
              errorsArray.push("Quantity <= 0 Found.");
            }
            if (!linesExist) {
              errorsArray.push("Lines Not Found.");
            }
            if (!isInvoiceGivenCheck) {
              errorsArray.push("Invoice have not been specified.");
            }
            console.log(errorsArray.join("\n"), "Errors Found");

            setsendResultResponse({
              status: 404,
              data: "",
              message: errorsArray,
            });
          }
        } else {
          //wrong dates
        }
      }
    }
  };

  useEffect(() => {
    if (!myPOLinesToReceiveArray || myPOLinesToReceiveArray.length <= 0) {
      //  setproductsLiveData(undefined);
      setorderSentFlag(false);
      setdataDownloadedFlag(false);
      //  refreshTotals({ subtotalamount: subtotal(myOrder), totalamount: vattotal(myOrder), totalVATamount: vattotal(myOrder) - subtotal(myOrder) });
    } else if (!orderSentFlag) {
      if (myPOLinesToReceiveArray.length > 0 && !dataDownloadedFlag) {
        let uniqueProductIds = [
          ...new Set(myPOLinesToReceiveArray.map((item) => item.productid)),
        ];

        getSomeProductsByIds(uniqueProductIds).then(
          (response) => {
            if (response.status === 200) {
              //  setproductsLiveData(response.data);
              setmyOrder(
                fillIReceivingLinesArray(
                  myPOLinesToReceiveArray,
                  response.data ?? [],
                ),
              );
              setsendResultResponse(null);
              setmyNotes("");
              //  setinvoiceNumber("");
              // setInvoiceDate(null);
              setselectedInvoice(undefined);
              setmyScanInput("");
              setmyPODate(new Date());
              // setmyDueDate(addDays(15, new Date()));
              // setmyTender(null);
              setbtnSumbitDisabled(false);
              setdataDownloadedFlag(true);
            } else {
              // setproductsLiveData(undefined);
              setmyOrder([]);
            }
          },
          (error) => {
            //  setproductsLiveData(undefined);
            setmyOrder([]);
          },
        );
      }
    }
  }, [myPOLinesToReceiveArray]);

  useEffect(() => {
    if (myOrder && myOrder.length > 0) {
      refreshTotals({
        initialsubtotalamount: subtotal(myOrder),
        totaldiscountamount: calculateTotalDiscount(myOrder),
        subtotalamountAfterDiscount:
          subtotal(myOrder) - calculateTotalDiscount(myOrder),
        totalamountAfterVat: totalamountAfterVat(myOrder),
        totalVATamount: totalVatAmount(myOrder),
      });
    } else {
      refreshTotals({
        initialsubtotalamount: 0,
        totaldiscountamount: 0,
        subtotalamountAfterDiscount: 0,
        totalamountAfterVat: 0,
        totalVATamount: 0,
      });
    }
  }, [myOrder]);


  const handleChangeOfFieldName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setmyNotes(event.target.value);
  };

  const scaninfogiven =
    (info: string) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Enter"
        // ||     (event as React.KeyboardEvent).key === 'Shift'
      ) {
        event.preventDefault();
        alert(myScanInput);
        //return;
      }
      return;
      //     setmScanInput("");
      //  if (open) { setloadLinesFromAPI(true); } else { setloadLinesFromAPI(false); setpOrderLines(undefined); setReceiveMode(false); }

      //setState({ ...state, [anchor]: open });
    };
  const handleConditionStatusChange = (
    e: SelectChangeEvent,
    lineid: number,
  ): void => {
    let value: any = null;
    if (e.target.value !== "") {
      value = e.target.value;
    }

    if (myOrder) {
      setmyOrder(
        myOrder.map((line) => {
          if (line.id === lineid) {
            return { ...line, conditionstatus: Number(value) | 0 };
          } else {
            // No changes
            return line;
          }
        }),
      );
    }
  };

  const handleVatRateChange = (e: SelectChangeEvent, lineid: number): void => {
    const selectedValue = e.target.value;
    const selectedVatRate = availableVatRates.find(
      (vatRate) => vatRate.id === selectedValue,
    );

    if (!selectedVatRate) {
      // Handle the case when the selected VAT rate is not found
      return;
    }

    setmyOrder((prevOrder) =>
      (prevOrder ?? []).map((line) =>
        line.id === lineid
          ? {
            ...line,
            vatindex: Number(selectedValue) || 0,
            vatindexNavigation: {
              id: selectedValue, // Convert to string
              rate: selectedVatRate.rate,
            },
          }
          : line,
      ),
    );
  };

  const handleQtyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    lineid: number,
  ): void => {
    let value: any = null;
    if (e.target.value !== "") {
      value = e.target.value;
    }

    if (myOrder) {
      setmyOrder(
        myOrder.map((line) => {
          if (line.id === lineid) {
            return { ...line, qty: Number(value) | 0 };
          } else {
            // No changes
            return line;
          }
        }),
      );
    }
  };
  const handleDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    lineid: number,
  ): void => {
    let value: any = null;
    if (e.target.value !== "") {
      value = e.target.value;
    }

    if (myOrder) {
      setmyOrder(
        myOrder.map((line) => {
          if (line.id === lineid) {
            /*       return { ...line, linediscountPerc: Number(value) | 0 };*/
            return { ...line, linediscountPerc: parseFloat(value) || 0 };
          } else {
            // No changes
            return line;
          }
        }),
      );
    }
  };
  const handleInvoiceUnitCostChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    lineid: number,
  ): void => {
    let value: any = null;
    if (e.target.value !== "") {
      value = e.target.value;
    }

    if (myOrder) {
      setmyOrder(
        myOrder.map((line) => {
          if (line.id === lineid) {
            /*       return { ...line, linediscountPerc: Number(value) | 0 };*/
            return { ...line, unitpurcostprice: Number(value) || 0 };
          } else {
            // No changes
            return line;
          }
        }),
      );
    }
  };

  return (
    <>
      {
        //<div>Loaded receiving lines {myOrder?.length ?? 0}  </div>
        // <div>Loaded po lines {myPOLinesToReceiveArray?.length ?? 0}  </div>
      }
      {myOrder &&
        (!sendResultResponse ||
          !sendResultResponse.status ||
          sendResultResponse.status !== 200) && (
          <>
            <Stack
              direction="row"
              alignItems="flex-start"
              spacing={1}
              sx={{ marginLeft: 2 }}
            >
              <div>
                <ChooseInvoice
                  suppliername={myPOHeader.supName ?? ""}
                  supplierID={myPOHeader.supplierid}
                  selectedInvoice={selectedInvoice}
                  setSelectedInvoice={setselectedInvoice}
                />
              </div>
              {/* Scanner  */}
              {
                //  <div>
                //               <Card sx={{ width: "100%", bgcolor: "#2196F3" }}>
                //                 <CardHeader
                //                   avatar={
                //                     <Avatar
                //                       style={{ color: "#2196F3", backgroundColor: "white" }}
                //                       aria-label="selectinvoice"
                //                     >
                //                       <QrCodeScanner></QrCodeScanner>
                //                     </Avatar>
                //                   }
                //                   subheader={
                //                     <>
                //                       <InputBase
                //                         sx={{ ml: 1, flex: 1, color: "white" }}
                //                         placeholder="Scan QR/1D/2D Barcode"
                //                         inputProps={{
                //                           "aria-label": "Scan QR/1D/2D Barcode",
                //                           minLength: 0,
                //                           maxLength: 150,
                //                         }}
                //                         onKeyDown={scaninfogiven("")}
                //                         onChange={(
                //                           event: React.ChangeEvent<HTMLInputElement>,
                //                         ) => handleChangeOfScanhereField(event)}
                //                         id="scanhere"
                //                         type="text"
                //                         size="small"
                //                         autoComplete="off"
                //                         value={myScanInput || ""}
                //                       />

                //                       {/*<TextField*/}
                //                       {/*    onKeyDown={scaninfogiven("")}*/}
                //                       {/*    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeOfScanhereField(event)}*/}
                //                       {/*    autoFocus*/}
                //                       {/*    id="scanhere"*/}
                //                       {/*    label="Scan here"*/}
                //                       {/*    inputProps={{ minLength: 0, maxLength: 150 }}*/}

                //                       {/*    focused*/}
                //                       {/*    multiline*/}
                //                       {/*    variant="outlined"*/}
                //                       {/*    type="text"*/}
                //                       {/*    size="small"*/}
                //                       {/*    autoComplete="off"*/}
                //                       {/*    value={myScanInput || ""}*/}
                //                       {/*    InputLabelProps={{*/}
                //                       {/*        shrink: true,*/}
                //                       {/*    }}*/}
                //                       {/*    sx={{ marginBottom: 0, color:'white' }}*/}
                //                       {/*/>*/}
                //                     </>
                //                   }
                //                 />
                //               </Card>
                //             </div>

              }


            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              {/*<DesktopDatePicker*/}
              {/*    label="Date"*/}
              {/*    inputFormat="dd/MM/yyyy"*/}
              {/*    value={myPODate}*/}
              {/*    maxDate={myPODate ?? undefined}*/}
              {/*    onChange={handleChangeOfPOdate}*/}
              {/*    renderInput={(params) => <TextField {...params} error={validateDates}*/}
              {/*        helperText={validateDates ? "PO Date can't be after Due Date" : ""} />} />*/}
            </Stack>

            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 300, width: "100%" }}
                aria-label="spanning table"
                size={"small"}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Actions</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Desc</TableCell>

                    <TableCell align="center">Ordered Quantity</TableCell>
                    <TableCell align="center">
                      Invoice Qty (Remaining)
                    </TableCell>

                    <TableCell align="center">Lot</TableCell>
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Condition</TableCell>
                    <TableCell align="center">PO Vat(%)</TableCell>
                    <TableCell align="center">Invoice Vat (%)</TableCell>

                    <TableCell align="right">PO Unit Value</TableCell>
                    <TableCell align="right">
                      Invoice Unit Value (before discount)
                    </TableCell>
                    <TableCell align="center">Discount (%)</TableCell>

                    <TableCell align="right">Total Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myOrder
                    .sort((a, b) => {
                      const nameA = a.product?.name || "";
                      const nameB = b.product?.name || "";
                      const productIdA = a.productid;
                      const productIdB = b.productid;
                      const requestlineidA = a.requestlineid || 0;
                      const requestlineidB = b.requestlineid || 0;

                      // Sort based on the 'name' property
                      if (nameA !== nameB) {
                        return nameA.localeCompare(nameB);
                      }

                      // If 'name' properties are equal, sort based on the 'productid' property
                      if (productIdA !== productIdB) {
                        return productIdA - productIdB;
                      }

                      // If 'productid' properties are equal, sort based on the extra third column
                      return requestlineidA - requestlineidB;
                    })
                    .map((row) => {
                      //   console.log(row, "row");
                      function handleClickCopyRow(
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                        rowtocopy: ReceivingLinesModel,
                      ): void {
                        if (myOrder && rowtocopy) {
                          const found = myOrder.find((obj) => {
                            return obj.id === rowtocopy.id;
                          });

                          const values = myOrder.map((a) => a.id);
                          const highestValue = Math.max(...values);

                          if (found) {
                            let newrow: ReceivingLinesModel = {
                              id: highestValue + 1,
                              receivingId: 0,
                              productid: found.productid,
                              product: found.product,
                              qty: 0,
                              qtyRemainingToReceive: 0,
                              lotid: 0,
                              receivinglocId: found.receivinglocId,
                              unitpurcostprice: found.unitpurcostprice,
                              originalpurcostpricebeforedisc: 0,
                              linediscountPerc: 0,
                              vatindex: found.vatindex,
                              conditionstatus: found.conditionstatus,
                              pooriginalvatindexNavigation:
                                found.pooriginalvatindexNavigation,
                              vatindexNavigation: found.vatindexNavigation,
                              polineId: found.polineId,
                              requestlineid: found.requestlineid,
                              notesaboutconditionstatus: "",
                            };

                            setmyOrder([...myOrder, newrow]);
                          }


                        }
                      }

                      function handleClickDeleteRow(
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                        id: number,
                      ): void {
                        setmyOrder(
                          (current) =>
                            current &&
                            current.filter((orderline) => orderline.id !== id),
                        );
                      }

                      const handleIconButtonClick = (
                        event: React.MouseEvent<HTMLButtonElement>,
                        rowId: number,
                      ) => {
                        setSelectedRowId(rowId);
                        setOpenDialog(true);
                      };

                      const handleTooltipOpen = () => {
                        setShowTooltip(true);
                      };

                      const handleTooltipClose = () => {
                        setShowTooltip(false);
                      };

                      return (
                        <TableRow key={row.id} hover>
                          <TableCell align="center">
                            {userContext?.currentUser &&
                              userContext?.currentUser
                                ?.claimCanReceiveItems && (
                                <>
                                  <Tooltip title="Copy Line" arrow>
                                    <IconButton
                                      sx={{
                                        "&:hover": {
                                          background:
                                            theme.colors.success.lighter,
                                        },
                                        color: theme.palette.success.main,
                                      }}
                                      color="inherit"
                                      size="small"
                                      onClick={(event) =>
                                        handleClickCopyRow(event, row)
                                      }
                                    >
                                      <CopyrequestIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Line" arrow>
                                    <IconButton
                                      sx={{
                                        "&:hover": {
                                          background:
                                            theme.colors.error.lighter,
                                        },
                                        color: theme.palette.error.main,
                                      }}
                                      color="inherit"
                                      size="small"
                                      onClick={(event) =>
                                        handleClickDeleteRow(event, row.id)
                                      }
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  {row.requestlineid != null &&
                                    !isNaN(row.requestlineid) && (
                                      <Tooltip
                                        title={
                                          "RequestID: " +
                                          row.requestlineid.toString()
                                        }
                                        arrow
                                      >
                                        <IconButton
                                          sx={{
                                            "&:hover": {
                                              background:
                                                theme.colors.primary.lighter,
                                            },
                                            color: theme.palette.primary.main,
                                          }}
                                          color="inherit"
                                          size="small"
                                        // onClick={event => handleClickDeleteRow(event, row.id)}
                                        >
                                          <RequestIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                </>
                              )}
                          </TableCell>
                          <TableCell>{row.product?.code}</TableCell>
                          <TableCell>{row.product?.name}</TableCell>
                          <TableCell align="center">
                            {" "}
                            {row.qtyOrdered}{" "}
                          </TableCell>
                          <TableCell align="center">
                            <div>
                              <FormControl fullWidth focused>
                                <TextField
                                  sx={{
                                    m: 0,
                                    minWidth: "5ch",
                                    maxWidth: "6ch",
                                  }}
                                  type="number"
                                  id="my-input"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  variant="standard"
                                  required
                                  error={isQtyValid(row.qty ?? 0)}
                                  helperText={
                                    isQtyValid(row.qty ?? 0) ? "Min 1" : ""
                                  }
                                  aria-describedby="my-helper-text"
                                  defaultValue={row.qty}
                                  inputProps={{
                                    minLength: 1,
                                    maxLength: 7,
                                    min: "1",
                                    max: "1000000",
                                  }}
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                  ) => handleQtyChange(event, row.id)}
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
                          <TableCell>
                            <div>
                              <LotsComboWithSearchAndAddNewDialog
                                availablelots1={availableLots ?? []}
                                // givenPOsupplierid={(myOrder && myOrder.length > 0) ? myOrder[0].defaultSupplierId : 0}
                                refreshLotsFunction={setavailableLots}
                                updateLineFn={updateOrderLine}
                                currentLine={row}
                              />
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <LocsComboWithSearchAndAddNewDialog
                                availablelocs1={availableLocs}
                                updateLineFn={updateOrderLine}
                                currentLine={row}
                              />
                            </div>
                          </TableCell>

                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <FormControl fullWidth focused>
                                <Select
                                  autoFocus
                                  size="small"
                                  value={row.conditionstatus.toString() ?? ""}
                                  onChange={(event) =>
                                    handleConditionStatusChange(event, row.id)
                                  }
                                  label="Rec. Condition"
                                  autoWidth
                                >
                                  {availableItemConditionStatuses?.map((vr) => (
                                    <MenuItem key={vr.id} value={vr.id}>
                                      {vr.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <div style={{ marginLeft: "10px" }}>
                                {row.notesaboutconditionstatus ? (
                                  <Tooltip
                                    title={
                                      "Notes: " + row.notesaboutconditionstatus
                                    }
                                  >
                                    <IconButton
                                      onClick={(event) =>
                                        handleIconButtonClick(event, row.id)
                                      }
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Add notes about the condition.">
                                    <IconButton
                                      onClick={(event) =>
                                        handleIconButtonClick(event, row.id)
                                      }
                                    >
                                      <AddIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                            <Dialog
                              open={selectedRowId !== null}
                              onClose={handleCloseDialog}
                            >
                              <DialogContent>
                                <TextField
                                  multiline
                                  fullWidth
                                  label={"Edit Notes"}
                                  value={
                                    myOrder.find(
                                      (row) => row.id === selectedRowId,
                                    )?.notesaboutconditionstatus || ""
                                  }
                                  onChange={(e) => {
                                    const updatedOrder = myOrder.map(
                                      (orderRow) =>
                                        orderRow.id === selectedRowId
                                          ? {
                                            ...orderRow,
                                            notesaboutconditionstatus:
                                              e.target.value,
                                          }
                                          : orderRow,
                                    );
                                    setmyOrder(updatedOrder);
                                  }}
                                />
                                <Button onClick={handleCloseDialog}>
                                  Close
                                </Button>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell align="center">
                            {" "}
                            {row.pooriginalvatindexNavigation.rate ?? ""}{" "}
                          </TableCell>
                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <FormControl fullWidth focused>
                                <Select
                                  autoFocus
                                  size="small"
                                  value={row.vatindexNavigation.id ?? ""}
                                  onChange={(event) =>
                                    handleVatRateChange(event, row.id)
                                  }
                                  label="Vat Rate"
                                  autoWidth
                                >
                                  {availableVatRates?.map((vr) => (
                                    <MenuItem key={vr.id} value={vr.id}>
                                      {vr.rate}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                            {/* Warning text for different VAT rates */}
                            {row.pooriginalvatindexNavigation.rate !==
                              row.vatindexNavigation.rate && (
                                <Typography variant="body2" color="warning">
                                  Warning: The invoice VAT rate (
                                  {row.vatindexNavigation.rate}%) is different
                                  than the original PO VAT rate (
                                  {row.pooriginalvatindexNavigation.rate}%). The
                                  PO line will be updated with the new VAT rate
                                  you have set.
                                </Typography>
                              )}
                          </TableCell>

                          <TableCell align="right">
                            {ccyFormat(row.originalPOUnitCostprice ?? 0)}
                          </TableCell>

                          <TableCell align="right">
                            <div>
                              <FormControl fullWidth focused>
                                <Tooltip title={row.unitpurcostprice}>
                                  <TextField
                                    sx={{
                                      m: 0,
                                      minWidth: "6ch",
                                      maxWidth: "12ch",
                                    }}
                                    type="number"
                                    id="my-input"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    variant="standard"
                                    required
                                    defaultValue={row.unitpurcostprice ?? 0.0}
                                    inputProps={{
                                      min: 0.0,
                                      max: 10000000.0,
                                      step: 1.0, // The step for increasing/decreasing the value
                                    }}
                                    onChange={(
                                      event: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      handleInvoiceUnitCostChange(event, row.id)
                                    }
                                  />
                                </Tooltip>
                              </FormControl>
                            </div>
                          </TableCell>

                          {/*   <TableCell align="right">{ccyFormat(row.linediscountPerc)}</TableCell>*/}
                          <TableCell align="center">
                            <div>
                              <FormControl fullWidth focused>
                                <TextField
                                  sx={{
                                    m: 0,
                                    minWidth: "5ch",
                                    maxWidth: "6ch",
                                  }}
                                  type="number"
                                  id="my-input"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  variant="standard"
                                  required
                                  defaultValue={row.linediscountPerc ?? 0.0}
                                  inputProps={{
                                    min: 0.0, // Minimum value for the discount percentage
                                    max: 100.0, // Maximum value for the discount percentage
                                    step: 1.0, // The step for increasing/decreasing the percentage
                                  }}
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                  ) => handleDiscountChange(event, row.id)}
                                />
                              </FormControl>
                            </div>
                          </TableCell>

                          {/*  <TableCell align="right">{ccyFormat(linecostprice(productsLiveData,row.id))}</TableCell>*/}

                          <TableCell align="right">
                            {ccyFormat(
                              row.unitpurcostprice *
                              (row?.qty ?? 0) *
                              (1 - row.linediscountPerc / 100),
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  <TableRow>
                    <TableCell align="right" colSpan={12}>
                      Initial Subtotal
                    </TableCell>
                    <TableCell defaultValue="" align="right" colSpan={2}>
                      <Typography>
                        {" "}
                        {ccyFormat(myOrdertotals?.initialsubtotalamount ?? 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" colSpan={12}>
                      Discount Total
                    </TableCell>
                    <TableCell defaultValue="" align="right" colSpan={2}>
                      <Typography>
                        {" "}
                        {ccyFormat(
                          (myOrdertotals?.totaldiscountamount ?? 0) * -1,
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" colSpan={12}>
                      Subtotal After Discount
                    </TableCell>
                    <TableCell defaultValue="" align="right" colSpan={2}>
                      <Typography>
                        {" "}
                        {ccyFormat(
                          myOrdertotals?.subtotalamountAfterDiscount ?? 0,
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="right" colSpan={12}>
                      Vat Total
                    </TableCell>
                    {/*<TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>*/}
                    <TableCell defaultValue="" align="right" colSpan={2}>
                      <Typography>
                        {" "}
                        {ccyFormat(myOrdertotals?.totalVATamount ?? 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" colSpan={12}>
                      Total Amount
                    </TableCell>
                    <TableCell defaultValue="" align="right" colSpan={2}>
                      <Typography>
                        {" "}
                        {ccyFormat(myOrdertotals?.totalamountAfterVat ?? 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                      <FormControl fullWidth focused>
                        <InputLabel htmlFor="mynoteshere">Notes</InputLabel>
                        <Input
                          placeholder="Write your notes here.."
                          aria-describedby="my-helper-text"
                          onChange={handleChangeOfFieldName}
                          value={myNotes}
                          multiline
                          autoComplete="off"
                          id="mynoteshere"
                          inputProps={{ minLength: 0, maxLength: 500 }}
                        />
                        {/* <FormHelperText id="my-helper-text">Enter your notes here.</FormHelperText>*/}
                      </FormControl>
                    </TableCell>
                    <TableCell defaultValue="" align="right" colSpan={2}>
                      <Button
                        fullWidth
                        onClick={sendNowF}
                        color="success"
                        variant="contained"
                        disabled={
                          btnSumbitDisabled ||
                          (myOrder.find((o) => (o.qty ?? 1) <= 0)
                            ? true
                            : false) ||
                          !myOrder ||
                          !(myOrder.length > 0)
                        }
                        startIcon={<SaveTwoToneIcon fontSize="small" />}
                      >
                        <Typography variant="h4">
                          <Box sx={{ pb: 0 }}>
                            <b>Save </b>
                          </Box>
                        </Typography>
                      </Button>
                    </TableCell>
                  </TableRow>

                  {sendResultResponse &&
                    sendResultResponse.status !== 200 &&
                    !btnSumbitDisabled && (
                      <TableRow
                        sx={{
                          backgroundColor: "orangered",
                        }}
                      >
                        <TableCell defaultValue="" align="right" colSpan={12}>
                          <Typography variant="h4">
                            <Box sx={{ pb: 0, color: "white" }}>
                              Error status: {sendResultResponse.status}
                              <Divider />
                              {typeof sendResultResponse.message == "object" &&
                                Array.isArray(sendResultResponse.message) && (
                                  <>
                                    {
                                      //  Errors
                                    }
                                    <List
                                      dense={true}
                                      sx={{
                                        width: "100%",
                                        bgcolor: "background.paper",
                                      }}
                                    >
                                      {
                                        //
                                        sendResultResponse.message.map(
                                          (row: string, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemIcon
                                                  sx={{ color: "red" }}
                                                >
                                                  <ErrorOutlineTwoTone fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                  sx={{ color: "black" }}
                                                  primary={row}
                                                //   secondary={secondary ? 'Secondary text' : null}
                                                />
                                              </ListItem>
                                            );
                                          },
                                        )
                                        //
                                      }
                                    </List>
                                  </>
                                )}
                              {typeof sendResultResponse.message ==
                                "string" && (
                                  <>Message: {sendResultResponse.message}</>
                                )}
                              <Divider />
                              {/*{sendResultResponse.data.toString()}*/}
                            </Box>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

      {sendResultResponse && sendResultResponse.status === 200 && (
        <VerticalLinearStepper />
      )}
    </>
  );
}
