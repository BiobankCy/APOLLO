import React, { useState, useEffect } from "react";
import {
  Dialog,
  AppBar,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Chip,
  Button,
  Typography, useTheme,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import axios from "axios";
import TabPanel from "./TabPanel";
import ProductInfoComponent from "./Tabs/ProductInfoComponent";
import TransactionsComponent from "./Tabs/TransactionsComponent";
import InventoryAnalysisComponent from "./Tabs/InventoryAnalysisComponentComponent";
import {
  Close as CloseIcon,
  MoreHorizRounded,
  MoreVertRounded,
} from "@mui/icons-material";

import {
  getALLInventoryTransByProductID,
  getSingleProduct,
} from "../../../services/user.service";
import {
  CustomTransactionLineDTO,
  ProductModel,
  TransactionLogHeaderModel,
} from "../../../models/mymodels";
import { GridVisibilityOffIcon } from "@mui/x-data-grid";

interface GlobalProductInfoDialogProps {
  productId: number;
  buttontext: string;
  productStatus?: boolean;
  /*onClose?: () => void; // A callback function to close the dialog*/
  displaytype?:
  | "iconOnly"
  | "chipWithcode"
  | "ProductOverviewtextwithbtn"
  | "typographyonlywithbtn";
}

const GlobalProductInfoDialog: React.FC<GlobalProductInfoDialogProps> = ({
  productId,
  productStatus,
  /*onClose,*/ buttontext,
  displaytype,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [productInfo, setProductInfo] = useState<ProductModel | null>(null);
  const [transactions, setTransactions] = useState<
    CustomTransactionLineDTO[] | null
  >(null);
  const [currentStock, setCurrentStock] = useState<ProductModel | null>(null);
  const [loading, setLoading] = useState(false);

  //const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
  //    setTabValue(newValue);
  //};
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);

    // Determine which tab is selected and call the corresponding API function
    switch (newValue) {
      case 0:
        fetchProductInfo();
        break;
      case 1:
        fetchTransactions();
        break;
      case 2:
        fetchCurrentStock();
        break;
      default:
        break;
    }
  };

  const fetchProductInfo = async () => {
    //try {
    //    const response = await axios.get('/api/productInfo');
    //    setProductInfo(response.data);
    //    setLoading(false);
    //} catch (error) {
    //    // Handle error
    //    setLoading(false);
    //}
    setLoading(true);
    getSingleProduct(productId).then(
      (response) => {
        setProductInfo(response.data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      },
    );
  };
  const fetchTransactions = async () => {
    //try {
    //    const response = await axios.get('/api/productInfo');
    //    setProductInfo(response.data);
    //    setLoading(false);
    //} catch (error) {
    //    // Handle error
    //    setLoading(false);
    //}
    setLoading(true);
    getALLInventoryTransByProductID(productId).then(
      (response) => {
        setTransactions(response.data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      },
    );
  };
  const fetchCurrentStock = async () => {
    //try {
    //    const response = await axios.get('/api/productInfo');
    //    setProductInfo(response.data);
    //    setLoading(false);
    //} catch (error) {
    //    // Handle error
    //    setLoading(false);
    //}
    setLoading(true);
    getSingleProduct(productId).then(
      (response) => {
        setCurrentStock(response.data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      },
    );
  };

  //const fetchCurrentStock = async () => {
  //    setLoading(true);
  //    try {
  //        const response = await axios.get('/api/currentStock');
  //        setCurrentStock(response.data);
  //        setLoading(false);
  //    } catch (error) {
  //        // Handle error
  //        setLoading(false);
  //    }
  //};

  useEffect(() => {
    if (open) {
      fetchProductInfo();
    }
  }, [open]);

  return (
    <div>
      {/* Trigger to open the dialog */}
      <Stack spacing={1} alignItems="center">
        {displaytype === undefined || displaytype === "chipWithcode" ? (
          <Stack direction="row" spacing={1}>
            <Chip
              title="Product Overview"
              size="small"
              icon={<MoreVertRounded />}
              label={buttontext}
              color={productStatus ? "primary" : "error"}
              onClick={() => setOpen(true)}
            />
          </Stack>
        ) : displaytype === "iconOnly" ? (
          <IconButton
            color={productStatus ? "primary" : "error"}
            onClick={() => setOpen(true)}
          >
            <MoreVertIcon /> Product Overview
          </IconButton>
        ) : displaytype === "ProductOverviewtextwithbtn" ? (
          <Button
            color={productStatus ? "primary" : "error"}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            {buttontext}
          </Button>
        ) : displaytype === "typographyonlywithbtn" ? (
          <Stack direction="row" spacing={1}>
            <Typography
              sx={{
                mr: 1,
              }}
              variant="h3"
            >
              {buttontext}
            </Typography>
            <IconButton
              color={productStatus ? "primary" : "error"}
              size="small"
              onClick={() => setOpen(true)}
              title="Product Overview"
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>
        ) : null}
      </Stack>

      {/*<button onClick={() => setOpen(true)}>{buttontext}</button>*/}

      <Dialog fullScreen open={open}>
        <AppBar position="static" color="transparent" enableColorOnDark>
          {/*    <AppBar position="static">*/}

          {/*<IconButton*/}
          {/*    edge="end"*/}
          {/*    color="inherit"*/}
          {/*    size="small"*/}
          {/*    onClick={() => {*/}
          {/*        setOpen(false); // Close the dialog*/}
          {/*        onClose(); // Call the provided onClose callback*/}
          {/*    }}*/}
          {/*>*/}
          {/*   (<CloseIcon />)*/}
          {/*</IconButton>*/}
          {productInfo && (
            <Chip
              size="medium"
              icon={<MoreVertRounded />}
              deleteIcon={<GridVisibilityOffIcon />}
              label={
                "Product Overview" +
                ": " +
                productInfo.code +
                " (" +
                productInfo.name + ")"
              }
              // color="info"
              sx={{ bgcolor: theme.colors.alpha.black[50], color: theme.palette.info.contrastText }}
              onDelete={() => {
                setOpen(false);

                //if (onClose) {
                //    onClose(); // Call the provided onClose callback if it's defined
                //}
              }}
              onClick={() => {
                setOpen(false); // Close the dialog
                //if (onClose) {
                //    onClose(); // Call the provided onClose callback if it's defined
                //}
              }}
            />
          )}
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Product Info" />
            <Tab label="Inventory Transactions" />
            <Tab label="Inventory Analysis" />
          </Tabs>
        </AppBar>

        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <CircularProgress />
          ) : (
            productInfo && <ProductInfoComponent data={productInfo} />
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <CircularProgress />
          ) : (
            transactions && <TransactionsComponent data={transactions} />
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            currentStock && <InventoryAnalysisComponent data={currentStock} />
          )}
        </TabPanel>
      </Dialog>
    </div>
  );
};

export default GlobalProductInfoDialog;
