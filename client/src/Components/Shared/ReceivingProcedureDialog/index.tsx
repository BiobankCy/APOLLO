import React, { Fragment, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Tooltip, IconButton, useTheme, DialogTitle, Button, DialogActions, Avatar, Card, CardHeader, Stack, Typography, Divider, CardContent, Paper, CircularProgress } from '@mui/material';
import ReceiveIcon from "@mui/icons-material/InventoryOutlined";
import { CustomPurchaseOrderModel, ProductModel, SupplierInvoiceModel, customDateFormat } from 'src/models/mymodels';
import ChooseInvoice from 'src/content/applications/PurchaseOrdersByLine/ExtraForms/ChooseInvoice';
import BarcodeScanner from '../BarcodeScanner';
import { ProductionQuantityLimits, QrCode } from '@mui/icons-material';
import ReceivedLinesTable from './ReceivedLinesTable';
import QRCodeGenerator from '../QRCodeGenerator';
import { ReceivingLineModelNew } from 'src/models/mymodels';
import { useAuth } from "src/contexts/UserContext";

import { getSomeProductsByText } from 'src/services/user.service';
import { useAlert } from 'src/contexts/AlertsContext';

interface OrderDialogProps {
  orderId: number;
  porderlineId: number;
}

const ReceivingDialog: React.FC<OrderDialogProps> = ({ orderId, porderlineId }) => {
  const theme = useTheme();
  const userContext = useAuth();

  const { showAlert } = useAlert();
  const [recOrder, setrecOrder] = useState<CustomPurchaseOrderModel>();
  const [selectedInvoice, setselectedInvoice] = React.useState<SupplierInvoiceModel>();
  const [open, setOpen] = useState(false);

  const [lastScannedData, setlastScannedData] = useState<string>("");
  const [tableData, settableData] = React.useState<ReceivingLineModelNew[]>([]);


  const handleOpen = () => {
    setOpen(true);
    //setStartCamera(true); 
  };

  const handleClose = () => {
    setOpen(false);
    settableData([]);
    setlastScannedData("");
    // console.log('cam closed!');
  };


  const [searchingDB, setSeachingDB] = useState(false);

  // ...

  useEffect(() => {
    const scd: string = lastScannedData;

    if (scd && scd.length > 0) {
      setSeachingDB(true);

      // Simulate a delay of x seconds before resolving the promise
      setTimeout(() => {
        getSomeProductsByText(scd).then(
          (response) => {
            const products: ProductModel[] = response.data;


            if (products && products.length === 0) {
              showAlert("Sorry, product not found!", "error");
            }

            if (products && products.length === 1) {
              addNewRowIfproductFoundInDB(products[0]);
              setlastScannedData("");
              showAlert("Product Found!", "success");
            }
            if (products && products.length > 1) {
              console.log(products);
              showAlert("Sorry, more than 1 product is found.!", "error");
            }


            //showAlert("This is an alert message!", "success");
          },
          (error) => {
            const _content =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
            showAlert("Error: " + _content, "error");

          }
        ).finally(() => {
          setSeachingDB(false);
        });
      }, 1000); // 1000 milliseconds (1 seconds)
    }
  }, [lastScannedData]);

  const handleScan = (data: string) => {


    console.log('Scanned data:', data);
    setlastScannedData(data);

  };

  function addNewRowIfproductFoundInDB(product: ProductModel) {



    const newRow: ReceivingLineModelNew = {
      id: Number(product.id),
      code: product.code,
      name: product.name,
      qty: 1,
      lotid: '',
      locid: product.defaultLocId,
      notes: '',
      datescanned: new Date(),
    };

    // Use the spread operator to create a new array with the existing data and the new row
    settableData((prevTableData) => [...prevTableData, newRow]);
  }


  useEffect(() => {
    const recOrdertest: CustomPurchaseOrderModel = {
      id: 1111,
      ordercreateddate: new Date(),
      podate: '',
      duedate: '',
      supplierid: 222,
      createdbyempid: 21212,
      statusid: 22100
    };
    setrecOrder(recOrdertest);
  }, []);




  return (
    <>
      {/* Add a trigger icon button in  other components to open the dialog */}


      <Tooltip title="Receive Items V2" arrow>
        <IconButton
          sx={{
            "&:hover": {
              background: theme.palette.info.light,
              color: theme.palette.info.dark,
            },
            color: theme.palette.info.dark,
          }}
          color="inherit"
          size="medium"
          onClick={handleOpen}

        >
          <ReceiveIcon fontSize="medium" />
        </IconButton>
      </Tooltip>



      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle sx={{ bgcolor: "#2196F3", color: "white" }}>

          <Typography variant="h4" style={{ color: "white" }}>
            Receiving Procedure Started..
          </Typography>
        </DialogTitle>
        <DialogContent>

          <Grid container>

            {/* Left column with 20% width */}
            <Grid item xs={2} sx={{ p: 2 }} style={{ backgroundColor: 'white' }}>
              {recOrder && (loadLeftColContent(recOrder, setselectedInvoice, selectedInvoice))}
            </Grid>

            {/* Middle column with 20% width */}
            <Grid item xs={2} sx={{ p: 2 }} style={{ backgroundColor: 'white' }}>
              <Card sx={{ width: "100%", bgcolor: "#2196F3" }}  >

                <CardHeader
                  avatar={<Avatar
                    style={{ color: "#2196F3", backgroundColor: "white" }}
                  >
                    <IconButton  >   <QrCode fontSize="small" /></IconButton>
                  </Avatar>}
                  title={<Typography variant="h4" style={{ color: "white" }}>
                    Barcode Reader
                  </Typography>}



                />
                <CardContent>

                  {userContext &&
                    userContext.currentUser &&
                    userContext.currentUser.claimCanMakePo === true && (
                      <>
                        <BarcodeScanner onScan={handleScan} dialogOpened={open} searchingDB={searchingDB} />
                        {lastScannedData.length > 0 && (
                          <QRCodeGenerator data={lastScannedData} size={100} />
                        )}
                      </>
                    )}

                  {searchingDB && (
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <CircularProgress style={{ color: "white" }} />
                      <Typography variant="h5" style={{ color: "white" }}>Please wait... searching for a product</Typography>

                    </div>
                  )}

                </CardContent>

              </Card>

            </Grid>

            {/* right column with 20% width */}
            <Grid item xs={8} sx={{ p: 2 }} style={{ backgroundColor: 'white' }}>
              <Card
                sx={{ width: "100%", bgcolor: "#2196F3" }}
              >

                <CardHeader
                  avatar={<Avatar
                    style={{ color: "#2196F3", backgroundColor: "white" }}
                  >
                    <IconButton  >   <ProductionQuantityLimits fontSize="small" /></IconButton>
                  </Avatar>}
                  title={<Typography variant="h4" style={{ color: "white" }}>
                    Received Products
                  </Typography>}
                  subheader={<>



                  </>}


                />
                <CardContent>
                  <ReceivedLinesTable data={tableData} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Dialog actions with a close button */}
        <DialogActions>
          <Button onClick={handleClose} color="success">
            Add
          </Button>
          <Button onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceivingDialog;

function loadLeftColContent(recOrder: CustomPurchaseOrderModel, setselectedInvoice: React.Dispatch<
  React.SetStateAction<SupplierInvoiceModel | undefined>>, selectedInvoice?: SupplierInvoiceModel
) {
  return <Stack direction="column" alignItems="center"
    spacing={2} justifyContent="flex-start" >


    <Card
      sx={{ width: "100%", bgcolor: "#2196F3" }}
    >

      <CardHeader
        avatar={<Avatar
          style={{ color: "#2196F3", backgroundColor: "white" }}
        >
          Order
        </Avatar>}
        title={<Typography variant="h4" style={{ color: "white" }}>
          Order Information
        </Typography>}
        subheader={<>
          <Typography variant="h6" style={{ color: "white" }}>
            {" "}
            Id: {recOrder.id}{" "}
          </Typography>
          <Typography variant="h6" style={{ color: "white" }}>
            {" "}
            Created:{" "}
            {customDateFormat(
              recOrder.ordercreateddate,
              "Datetime"
            )}{" "}
          </Typography>

          <Typography variant="h6" style={{ color: "white" }}>
            {" "}
            Status: {recOrder.statusName}{" "}
          </Typography>

        </>} />
    </Card>
    {/* <Divider sx={{ m: 1 }}></Divider> */}

    <Card
      sx={{ width: "100%", bgcolor: "#2196F3" }}
    >

      <CardHeader
        avatar={<Avatar
          style={{ color: "#2196F3", backgroundColor: "white" }}
        >
          Sup
        </Avatar>}
        title={<Typography variant="h4" style={{ color: "white" }}>
          Supplier Information
        </Typography>}
        subheader={<>
          <Typography variant="h6" style={{ color: "white" }}>
            {" "}
            Id: {recOrder.id}{" "}
          </Typography>

          <Typography variant="h6" style={{ color: "white" }}>
            {" "}
            Name: {"C Georgiou"}{" "}
          </Typography>

          <Typography variant="h6" style={{ color: "white" }}>
            Work Number: {"22606606"}{" "}
          </Typography>

          <Typography variant="h6" style={{ color: "white" }}>
            Email: {"dddd@ggg.com"}{" "}
          </Typography>

        </>} />
    </Card>
    {/* <Divider sx={{ m: 1 }}></Divider> */}

    {/* select invoice here - required for receiving */}
    <ChooseInvoice
      suppliername={recOrder.supName ?? ""}
      supplierID={recOrder.supplierid}
      selectedInvoice={selectedInvoice}
      setSelectedInvoice={setselectedInvoice}
    />



  </Stack>;
}

