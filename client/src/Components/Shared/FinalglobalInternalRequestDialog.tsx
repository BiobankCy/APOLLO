import React, { Fragment, useEffect, useRef, useState } from "react";
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
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
  Checkbox,
  Tooltip,
  Zoom,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import AddTwoToneIcon from "@mui/icons-material/Send";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {
  ccyFormat,
  customDateFormat,
  ProductModel,
  InternalRequestOrder,
  RequestLinesModel,
  RequestHeaderModel,
  PrimerModel,
  PrimersRowsFromExcel,
  ProjectModel,
} from "../../models/mymodels";

import { addNewInternalRequest, getAssignedToMeOnlyActiveProjects } from "../../services/user.service";

import HelpTooltipButton from "./HelpTooltipButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Addicon from "@mui/icons-material/Add";
import Deleteicon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { read, utils, writeFile } from "xlsx";
import { AddCircleOutline } from "@mui/icons-material";
import PostAddTwoTone from "@mui/icons-material/PostAddTwoTone";

function fillInternalOrder(products: ProductModel[]): InternalRequestOrder[] {
  let finalinternalorder = [] as InternalRequestOrder[];
  products.map((product) => finalinternalorder.push(product));

  finalinternalorder.forEach((p) => {
    p.orderqty = 1;
    p.urgent = false;
    p.sequenceIdentifier = "";
    p.nucleotideSequence = "";
  });
  return finalinternalorder;
}

interface PurchaseOrderDialogProps {
  products: ProductModel[];
  onClose: () => void;
  onOrderSent: (reqids?: number[]) => void;
}







const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const InternalRequestDialog: React.FC<PurchaseOrderDialogProps> = ({
  products,
  onClose,
  onOrderSent,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [orderSavedInDB, setOrderSavedInDB] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOrderSavedResponseData, setNewOrderSavedResponseData] =
    useState<RequestHeaderModel>();
  const [myOrderToSend, setMyOrderToSend] = useState<InternalRequestOrder[]>(
    fillInternalOrder(products),
  );
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };




  const [myNotes, setmyNotes] = React.useState("");

  const [loadedProjects, setLoadedProjects] = useState<ProjectModel[]>([]);
  const [myFormErrors, setmyFormErrors] = useState<string[]>([]);

  const subtotal = myOrderToSend.reduce((total, product) => {
    return total + (product.orderqty ?? 0) * product.costprice;
  }, 0);

  const vatAmount = myOrderToSend.reduce((total, product) => {
    return (
      total +
      ((product.orderqty ?? 0) * product.costprice * product.vatRate) / 100
    );
  }, 0);

  const totalAmount = subtotal + vatAmount;


  const supplierId = myOrderToSend[0]?.defaultSupplierId;
  const sameSupplier = myOrderToSend.every(
    (product) => product.defaultSupplierId === supplierId,
  );

  const handleImportExcel = (
    $event: any,
    givenRequestRow: InternalRequestOrder,
  ) => {
    const files = $event.target.files;

    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const wb = read(event.target.result);
          const sheets = wb.SheetNames;

          if (sheets.length) {
            const loadedrows = utils.sheet_to_json<PrimersRowsFromExcel>(
              wb.Sheets[sheets[0]],
            );

            const newprimerList = loadedrows.map((loadedrow) => {

              const newprimer: PrimerModel = {
                sequenceIdentifier: loadedrow.sequenceIdentifier!,
                nucleotideSequence: loadedrow.nucleotideSequence!,
                id: 0,
                reqlineid: 0,
              };
              return newprimer;
            });


            const combinedPrimerList = [
              ...(givenRequestRow.primersList ?? []),
              ...newprimerList,
            ];


            const newRequestLine: InternalRequestOrder = {
              ...givenRequestRow,
              primersList: combinedPrimerList,
              orderqty: combinedPrimerList.length,
            };


            const index = myOrderToSend.findIndex(
              (row) => row.id === givenRequestRow.id,
            );

            if (index !== -1) {

              myOrderToSend[index] = newRequestLine;


              setMyOrderToSend([...myOrderToSend]);



              if (inputFileRef.current) {
                inputFileRef.current.value = "";
              }
            }
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };







  const handleOrderProjectChange = (productId: string, value: string) => {
    const updatedProducts = myOrderToSend.map((requestedProduct) => {
      if (requestedProduct.id === productId) {
        const orderQuantity = parseFloat(value);
        return {
          ...requestedProduct,
          projectid:
            isNaN(orderQuantity) || orderQuantity < 0 ? null : Number(orderQuantity),
        };
      }
      return requestedProduct;
    });

    setMyOrderToSend(updatedProducts);
  };


  const handleCopyProjectId = (projectId: number) => {
    setMyOrderToSend(myOrderToSend.map((line) => ({
      ...line,
      projectid: projectId,
    })));
  };













  const handleChangeUrgent = (
    e: React.ChangeEvent<HTMLInputElement>,
    pid: string,
  ) => {


    if (myOrderToSend) {
      setMyOrderToSend(
        myOrderToSend.map((line) => {
          if (line.id === pid) {
            return { ...line, urgent: e.target.checked };
          } else {

            return line;
          }
        }),
      );
    }
  };


  const handleOrderQuantityChange = (productId: string, value: string) => {
    const updatedProducts = myOrderToSend.map((requestedProduct) => {
      if (requestedProduct.id === productId) {
        const orderQuantity = parseFloat(value);
        return {
          ...requestedProduct,
          orderqty:
            isNaN(orderQuantity) || orderQuantity < 0 ? 0 : orderQuantity,
        };
      }
      return requestedProduct;
    });
    setMyOrderToSend(updatedProducts);
  };







  const handleDeleteAllPrimers = (productID: string) => {
    const updatedPrimerList = [...myOrderToSend];
    const rowToUpdate = updatedPrimerList.find((row) => row.id === productID);

    if (!rowToUpdate) {
      return;
    }






    rowToUpdate.primersList = [];


    setMyOrderToSend(updatedPrimerList);
  };

  const handleAddPrimer = (productID: string) => {
    setMyOrderToSend((prevOrder) => {
      return prevOrder.map((item) => {
        if (item.id === productID) {
          const primersList = item.primersList || [];
          const newPrimer: PrimerModel = {
            sequenceIdentifier: "",
            nucleotideSequence: "",
            id: 0,
            reqlineid: 0,
          };
          return { ...item, primersList: [...primersList, newPrimer] };
        }
        return item;
      });
    });
  };

  const isseqidentifierValid = (value: string) => value.length < 1;
  const isseqnucleotideValid = (value: string) => value.length < 1;

  const handleDeletePrimer = (rowId: string, index: number) => {
    const updatedPrimerList = [...myOrderToSend];
    const rowToUpdate = updatedPrimerList.find((row) => row.id === rowId);

    if (
      rowToUpdate &&
      rowToUpdate.primersList &&
      rowToUpdate.primersList[index]
    ) {

      rowToUpdate.primersList.splice(index, 1);


      setMyOrderToSend(updatedPrimerList);
    }
  };


  const handlePrimerSeqIdentifierChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    productID: string,
    index: number,
  ) => {
    const updatedPrimerList = [...myOrderToSend];
    const rowToUpdate = updatedPrimerList.find((row) => row.id === productID);

    if (
      rowToUpdate &&
      rowToUpdate.primersList &&
      rowToUpdate.primersList[index]
    ) {

      rowToUpdate.primersList[index].sequenceIdentifier = event.target.value;


      setMyOrderToSend(updatedPrimerList);
    }
  };


  const handlePrimerNucleotideSeqChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    productID: string,
    index: number,
  ) => {
    const updatedPrimerList = [...myOrderToSend];
    const rowToUpdate = updatedPrimerList.find((row) => row.id === productID);

    if (
      rowToUpdate &&
      rowToUpdate.primersList &&
      rowToUpdate.primersList[index]
    ) {

      rowToUpdate.primersList[index].nucleotideSequence = event.target.value;


      setMyOrderToSend(updatedPrimerList);
    }
  };





  const sendOrder = () => {

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Set submission in progress

    const invalidOrderLength = myOrderToSend.length;
    if (invalidOrderLength <= 0) {
      setmyFormErrors((errors) => [...errors, "Error: Empty Request"]);
      return;
    }

    const invalidOrderLineQty = myOrderToSend.some(
      (product) => (product.orderqty ?? 0) <= 0,
    );



    if (invalidOrderLineQty) {
      setmyFormErrors((errors) => [...errors, "Error: Items with 0 quantity"]);
      return;
    }






    let lines = [] as RequestLinesModel[];
    let newline = {} as RequestLinesModel;
    // console.table(myOrderToSend);
    myOrderToSend.forEach((p) => {

      newline = {
        id: 0,
        reqId: 0,
        primers: p.primersList ?? [],
        productid: Number(p.id),
        qty: p?.orderqty ?? 0,
        urgentFlag: p.urgent || false,
        comment: "",
        decisionId: 1,
        decisionByUserId: null,
        decisionLastUpdateDatetime: null,
        projectid: p.projectid ?? null,
      };
      lines.push(newline);
    });

    lines.forEach((p) => {
      if (p.qty < 0) return false;
    });





    let myInternalRequestObj: RequestHeaderModel = {
      id: 0,
      reqDate: new Date(),
      reqStatusId: 5,
      reqByUsrId: 0,
      notes: myNotes,
      requestlines: lines,
    };

    addNewInternalRequest(myInternalRequestObj).then(
      (response) => {
        setIsSubmitting(false);
        if (response.status === 200) {


          setOrderSavedInDB(true);
          const getNewOrder: RequestHeaderModel = response.data;
          setNewOrderSavedResponseData(getNewOrder);



          onOrderSent();
        } else {

          setmyFormErrors((errors) => [
            ...errors,
            "Error: " + (response.data ?? "Unknown"),
          ]);
          return;
        }


      },

      (error) => {
        let errorMessage = "Unknown Error";
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || error.response.data;
        } else if (error.message) {
          errorMessage = error.message;
        }

        console.log(error);
        setIsSubmitting(false);
        setmyFormErrors(["Error: " + errorMessage]);
      },


    );


  };


  useEffect(() => {
    if (!orderSavedInDB) {
      setMyOrderToSend(fillInternalOrder(products));
      setNewOrderSavedResponseData(undefined);
      setmyFormErrors([]);
      setmyNotes("");

    }
  }, [orderSavedInDB, products]);


  useEffect(() => {
    getAssignedToMeOnlyActiveProjects().then(
      (response) => {
        setLoadedProjects(response.data);
      },
      (error) => {
        console.error(error);
        setLoadedProjects([]);
      }
    );
  }, []);


  useEffect(() => {
    if (myOrderToSend && myOrderToSend.length > 0 && !orderSavedInDB) {
      const updatedOrderToSend = myOrderToSend.map((item) => {
        if (item.forsequencingFlag) {
          const count = item.primersList ? item.primersList.length : 0;
          return { ...item, orderqty: count };
        }
        return item;
      });



      setMyOrderToSend(updatedOrderToSend);
    }
  }, [myOrderToSend]);


  const hasProductForSequencing = myOrderToSend.some(
    (product) => product.forsequencingFlag,
  );


  const generateAndDownloadExcel = () => {

    const data: Array<Array<any>> = [
      ["sequenceIdentifier", "nucleotideSequence"],
      ["Data 1A", "Data 1B"],
      ["Data 2A", "Data 2B"],
    ];


    const workbook = utils.book_new();


    const worksheet = utils.aoa_to_sheet(data);


    utils.book_append_sheet(workbook, worksheet, "Sheet1");


    writeFile(workbook, "primer_template.xlsx");
  };

  const isQtyValid = (value: number): boolean | undefined =>
    value < 1 || value > 1000000;
  const isUnitCostpriceValid = (value: number): boolean | undefined =>
    value < 0;

  const handleChangeOfFieldName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setmyNotes(event.target.value);
  };


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
          <PostAddTwoTone />
        </IconButton>
        <Typography variant="h6" component="div">
          IMS - Request
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div>
          { }
          {!orderSavedInDB ? (
            <div>
              { }
              { }

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >


                {hasProductForSequencing ? (
                  <Tooltip
                    arrow
                    TransitionComponent={Zoom}
                    title="Download an Excel template to fill in primers for import."
                    placement="bottom-start"
                  >
                    <Button onClick={generateAndDownloadExcel}>
                      Download Primer Import Template
                    </Button>
                  </Tooltip>
                ) : null}


              </Stack>

              { }
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>PRODUCT CODE</TableCell>
                      <TableCell>DESCRIPTION</TableCell>

                      { }
                      <TableCell align="center">Request Quantity</TableCell>
                      <TableCell align="center">Urgent</TableCell>
                      <TableCell align="center">Project</TableCell>
                      <TableCell align="center">Available Quantity</TableCell>
                      <TableCell align="center">Product Units</TableCell>
                      <TableCell align="center">Vat (%)</TableCell>
                      <TableCell align="right">Unit</TableCell>
                      <TableCell align="right">Sum</TableCell>
                      <TableCell align="center">More</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myOrderToSend.map((row) => {
                      return (
                        <Fragment key={row.id}>
                          <TableRow key={row.id}>
                            <TableCell>
                              {row.code}
                              {row.forsequencingFlag && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <Button
                                    id={`import-excel-${row.id}`}
                                    component="label"
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<CloudUploadIcon />}
                                    href="#file-upload"
                                    style={{ width: "100%", marginBottom: 4 }}
                                  >
                                    Upload excel file
                                    <VisuallyHiddenInput
                                      onChange={(event) =>
                                        handleImportExcel(event, row)
                                      }
                                      ref={inputFileRef}
                                      id={`import-excel-${row.id}`}
                                      type="file"
                                      accept=".xlsx, .xls"
                                    />
                                  </Button>
                                  <Button
                                    id={`addnewprimer-rowid-${row.id}`}
                                    component="label"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Addicon />}
                                    size="small"
                                    onClick={() => handleAddPrimer(row.id)}
                                    style={{ width: "100%", marginBottom: 4 }}
                                  >
                                    Add New Primer
                                  </Button>
                                  {row.primersList &&
                                    row.primersList.length > 0 && (
                                      <Button
                                        id={`addnewprimer-rowid-${row.id}`}
                                        component="label"
                                        variant="contained"
                                        color="error"
                                        startIcon={<Deleteicon />}
                                        size="small"
                                        onClick={() =>
                                          handleDeleteAllPrimers(row.id)
                                        }
                                        style={{ width: "100%" }}
                                      >
                                        Delete All Primers (
                                        {row.primersList.length.toString()})
                                      </Button>
                                    )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>

                            { }
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
                                    error={isQtyValid(row.orderqty ?? 0)}
                                    helperText={
                                      isQtyValid(row.orderqty ?? 0)
                                        ? "Min 1"
                                        : ""
                                    }
                                    aria-describedby="my-helper-text"

                                    value={row.orderqty?.toString() ?? "0"}
                                    inputProps={{
                                      minLength: 1,
                                      maxLength: 7,
                                      min: "1",
                                      max: "1000000",
                                    }}
                                    onChange={(e) =>
                                      handleOrderQuantityChange(
                                        row.id,

                                        e.target.value,
                                      )
                                    }
                                  />

                                </FormControl>
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <div>
                                <FormControl fullWidth>
                                  <Checkbox
                                    checked={row.urgent}
                                    onChange={(
                                      event: React.ChangeEvent<HTMLInputElement>,
                                    ) => handleChangeUrgent(event, row.id)}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                </FormControl>
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs={9}>
                                  <FormControl fullWidth>
                                    <TextField
                                      select
                                      size="small"
                                      value={row.projectid ?? ''}
                                      onChange={(e) =>
                                        handleOrderProjectChange(
                                          row.id,
                                          e.target.value,
                                        )
                                      }
                                      sx={{
                                        '& .MuiSelect-root': {
                                          minWidth: '200px', // Set a minimum width for the dropdown menu
                                        },
                                      }}
                                      SelectProps={{
                                        MenuProps: {
                                          PaperProps: {
                                            style: {
                                              minWidth: '200px', // Set a minimum width for the dropdown menu
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <MenuItem value="">None</MenuItem> {/* Option to clear selection */}
                                      {loadedProjects.map((project) => (
                                        <MenuItem key={project.id} value={project.id}>
                                          {project.name}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                  {row.projectid && row.projectid > 0 && (
                                    <Tooltip
                                      arrow
                                      TransitionComponent={Zoom}
                                      title="Copy this project to all rows"
                                      placement="bottom-start"
                                    >
                                      <Button
                                        onClick={() => handleCopyProjectId(row.projectid ?? 0)}
                                        size="small" // Adjusting the size of the button
                                      >
                                        <FileCopyIcon sx={{ fontSize: 16 }} /> {/* Adjusting the size of the icon */}
                                      </Button>
                                    </Tooltip>
                                  )}
                                </Grid>
                              </Grid>
                            </TableCell>

                            <TableCell align="center">
                              {" "}
                              {row.availabletotalstockqty}{" "}
                            </TableCell>

                            <TableCell align="center"> {row.punits} </TableCell>
                            <TableCell align="center">
                              {" "}
                              {row.vatRate}{" "}
                            </TableCell>

                            <TableCell align="right">
                              {ccyFormat(row.costprice)}
                            </TableCell>

                            <TableCell align="right">
                              {ccyFormat(row.costprice * (row?.orderqty ?? 0))}
                            </TableCell>
                            <TableCell align="center">


                              <HelpTooltipButton
                                title={
                                  "Minimum Stock Quantity: " +
                                  row.minstockqty.toString()
                                }
                                size="small"
                                icon={<HelpIcon fontSize="small" />}
                              />

                            </TableCell>
                          </TableRow>
                          {row.forsequencingFlag &&
                            row.primersList &&
                            row.primersList.length > 0
                            ?
                            row.primersList.map((primer, index) => (
                              <React.Fragment key={index}>
                                { }
                                <TableRow id="forsequencing">
                                  <TableCell colSpan={7}>
                                    <div>
                                      <Button
                                        component="label"
                                        variant="contained"
                                        color="error"
                                        startIcon={<Deleteicon />}
                                        size="small"
                                        onClick={() =>
                                          handleDeletePrimer(row.id, index)
                                        }
                                      >
                                        Delete Primer
                                      </Button>
                                    </div>

                                    <div>
                                      Sequence Identifier
                                      <FormControl fullWidth focused>
                                        <TextField
                                          sx={{ m: 0, minWidth: "15ch" }}
                                          type="text"
                                          id={`primer-seq-identifier-${index}`}
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          variant="standard"
                                          required
                                          error={isseqidentifierValid(
                                            primer.sequenceIdentifier ?? "",
                                          )}
                                          helperText={
                                            isseqidentifierValid(
                                              primer.sequenceIdentifier ?? "",
                                            )
                                              ? "Min. Length: 1"
                                              : ""
                                          }
                                          aria-describedby="my-helper-text"
                                          value={primer.sequenceIdentifier}
                                          inputProps={{
                                            minLength: 1,
                                            maxLength: 200,
                                          }}
                                          onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                          ) =>
                                            handlePrimerSeqIdentifierChange(
                                              event,
                                              row.id,
                                              index,
                                            )
                                          }
                                        />
                                      </FormControl>
                                    </div>

                                    <div>
                                      Nucleotide Sequence
                                      <FormControl fullWidth focused>
                                        <TextField
                                          sx={{ m: 0, minWidth: "15ch" }}
                                          type="text"
                                          id={`primer-nucleotide-seq-${index}`}
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          variant="standard"
                                          required
                                          error={isseqnucleotideValid(
                                            primer.nucleotideSequence ?? "",
                                          )}
                                          helperText={
                                            isseqnucleotideValid(
                                              primer.nucleotideSequence ?? "",
                                            )
                                              ? "Min. Length: 1"
                                              : ""
                                          }
                                          aria-describedby="my-helper-text"
                                          value={primer.nucleotideSequence}
                                          inputProps={{
                                            minLength: 1,
                                            maxLength: 200,
                                          }}
                                          onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                          ) =>
                                            handlePrimerNucleotideSeqChange(
                                              event,
                                              row.id,
                                              index,
                                            )
                                          }
                                        />
                                      </FormControl>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            ))
                            : null}
                        </Fragment>
                      );
                    })}

                    { }

                    { }

                    <TableRow>
                      <TableCell align="right" colSpan={8}>
                        Subtotal
                      </TableCell>
                      <TableCell defaultValue="" align="right" colSpan={2}>
                        <Typography> {ccyFormat(subtotal ?? 0)}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="right" colSpan={8}>
                        Vat
                      </TableCell>
                      { }
                      <TableCell defaultValue="" align="right" colSpan={2}>
                        <Typography> {ccyFormat(vatAmount ?? 0)}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="right" colSpan={8}>
                        Total
                      </TableCell>
                      <TableCell defaultValue="" align="right" colSpan={2}>
                        <Typography> {ccyFormat(totalAmount ?? 0)}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="center" colSpan={8}>
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
                          { }
                        </FormControl>
                      </TableCell>
                      {/* <TableCell defaultValue="" align="right" colSpan={2}>
                        <Button
                          fullWidth
                          onClick={sendOrder}
                          variant="contained"
                          disabled={
                            (myOrderToSend.find((o) => (o.orderqty ?? 1) <= 0)
                              ? true
                              : false) ||
                            !myOrderToSend ||
                            !(myOrderToSend.length > 0)
                          }
                          startIcon={<AddTwoToneIcon fontSize="small" />}
                        >
                          <Typography variant="h4">
                            <Box sx={{ pb: 0 }}>
                              <b>Submit</b>
                            </Box>
                          </Typography>
                        </Button>
                      </TableCell> */}
                      <TableCell defaultValue="" align="right" colSpan={2}>
                        <Button
                          fullWidth
                          onClick={sendOrder}
                          variant="contained"
                          disabled={
                            (myOrderToSend.find((o) => (o.orderqty ?? 1) <= 0) ? true : false) ||
                            !myOrderToSend ||
                            !(myOrderToSend.length > 0) ||
                            isSubmitting // Disable button while submission is in progress
                          }
                          startIcon={<AddTwoToneIcon fontSize="small" />}
                        >
                          {isSubmitting ? (
                            // Show loader if submission is in progress
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            // Show "Submit" text if submission is not in progress
                            <Typography variant="h4">
                              <Box sx={{ pb: 0 }}>
                                <b>Submit</b>
                              </Box>
                            </Typography>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {myFormErrors && myFormErrors.length > 0 && (
                      <TableRow
                        sx={
                          {

                          }
                        }
                      >
                        <TableCell defaultValue="" align="right" colSpan={9}>
                          <Stack sx={{ width: "100%" }} spacing={0.5}>
                            {myFormErrors.map((error, index) => (
                              <Alert key={index} severity="error">
                                {error}!
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
                          Request saved successfully!
                        </Typography>
                        <Box sx={{ m: 2 }}>
                          <Typography gutterBottom variant="body1">
                            Please click 'Close' and await the decision from the
                            approver.
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Box sx={{ mt: 3, ml: 1, mb: 1 }}>

                            </Box>
                          </Stack>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="h4" component="div">
                          Request Details:
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          Id: {newOrderSavedResponseData.id}
                          <br />
                          Created:{" "}
                          {customDateFormat(
                            newOrderSavedResponseData.reqDate,
                            "Datetime",
                          )}{" "}
                          <br />
                          Lines:{" "}
                          {newOrderSavedResponseData.requestlines?.length.toString() ??
                            ""}{" "}
                          <br />
                          { }
                          Notes: {newOrderSavedResponseData.notes} <br />
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
        { }
      </DialogActions>
    </Dialog>
  );
};

export default InternalRequestDialog;
