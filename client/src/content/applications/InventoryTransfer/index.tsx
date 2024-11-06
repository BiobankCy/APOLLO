import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet-async";
import React from "react";
import TopBarContent from "./TopBarContent";
import BottomBarContent from "./BottomBarContent";
import SidebarContent from "./SidebarContent";
import CenterForm from "./CenterForm";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";

import Scrollbar from "src/Components/Scrollbar";

import {
  Box,
  styled,
  Divider,
  Drawer,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  CustomRequestLinesModel,
  LocationModel,
  ProductModel,
  TransferInventoryItemModel,
} from "../../../models/mymodels";
import {
  getAllProducts,
  getAllLocations,
  addInventoryTransactionBulk,
} from "../../../services/user.service";
import { useAlert } from "src/contexts/AlertsContext";

const RootWrapper = styled(Box)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display: flex;
`,
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 450px;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`,
);

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`,
);

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(2)};
        align-items: center;
`,
);

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  background: ${theme.colors.alpha.white[100]};
`,
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`,
);

function ApplicationsMessenger() {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [prodList, setprodList] = useState<ProductModel[]>([]);
  const [availableLocs, setavailableLocs] = useState<LocationModel[]>();

  useEffect(() => {
    getAllProducts().then(
      (response) => {
        if (response.status === 200) {
          setprodList(response.data);
        } else {
          setprodList([]);
        }
      },
      (error) => {
        console.log(error, "Error Loading Products");
        setprodList([]);
      },
    );

    getAllLocations().then(
      (response) => {
        if (response.status === 200) {
          setavailableLocs(response.data);
        } else {
          setavailableLocs(undefined);
        }
      },
      (error) => {
        setavailableLocs(undefined);
        console.log(error, "Error Loading Locations");
      },
    );
  }, []);

  const [transferList, setTransferList] = useState<
    TransferInventoryItemModel[]
  >([]);
  function addItemToList(item: TransferInventoryItemModel) {
    item.lineid = uuidv4();
    setTransferList((prevList) => [...prevList, item]);
  }
  function removeItemFromList(id: string) {
    setTransferList((prevList) =>
      prevList.filter((item) => item.lineid !== id),
    );
  }
  function updateItemQuantity(id: string, newQty: number) {
    setTransferList((prevList) =>
      prevList.map((item) => {
        if (item.lineid === id) {
          return { ...item, qty: newQty };
        } else {
          return item;
        }
      }),
    );
  }

  function clearTransferList() {
    setTransferList([]);
  }


  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const [mynotes, setMynotes] = useState("");

  async function sendInventoryTransaction() {
    try {
      const response = await addInventoryTransactionBulk(transferList, mynotes);

      if (response) {
        // Response is not null

        if (response.status === 200) {
          // Success
          showAlert(response.data, "success");
          // showDialog("Success", response.data);
          clearTransferList();
          setMynotes("");
        } else {
          // Client-side error
          showDialog(
            "Error",
            `(${response.status}), Message: ${response.data}`,
          );
        }
      } else {
        // Response is null
        showDialog("Error", "Received null response.");
      }
    } catch (error: any) {
      if (error.response) {
        // Server-side error
        showDialog(
          "Error",
          `Error: ${error.response.status}, Message: ${error.response.data}`,
        );
      } else {
        // Exception
        showDialog(
          "Error",
          "An exception occurred while processing the request.",
        );
        // console.error('Request failed:', error);
      }
    }
  }

  function showDialog(title: string, message: string) {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  }

  function handleClose() {
    setDialogOpen(false);
  }


  return (
    <>
      <Helmet>
        <title>IMS - Inventory Transfer</title>
      </Helmet>
      <RootWrapper className="Mui-FixedWrapper">
        <DrawerWrapperMobile
          sx={{
            display: { lg: "none", xs: "inline-block" },
          }}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          <Scrollbar>
            <SidebarContent
              prodList={prodList}
              locsList={availableLocs ?? []}
              addItem={addItemToList}
            />
          </Scrollbar>
        </DrawerWrapperMobile>
        <Sidebar
          sx={{
            display: { xs: "none", lg: "inline-block" },
          }}
        >
          <Scrollbar>
            <SidebarContent
              prodList={prodList}
              locsList={availableLocs ?? []}
              addItem={addItemToList}
            />
          </Scrollbar>
        </Sidebar>
        <ChatWindow>
          <ChatTopBar
            sx={{
              display: { xs: "flex", lg: "inline-block" },
            }}
          >
            <IconButtonToggle
              sx={{
                display: { lg: "none", xs: "flex" },
                mr: 2,
              }}
              color="primary"
              onClick={handleDrawerToggle}
              size="small"
            >
              <MenuTwoToneIcon />
            </IconButtonToggle>
            <TopBarContent clearList={clearTransferList} />
          </ChatTopBar>
          <Box flex={1}>
            <Scrollbar>
              <CenterForm
                transList={transferList}
                removeItem={removeItemFromList}
                updateItemQuantity={updateItemQuantity}
              />
            </Scrollbar>
          </Box>
          <Divider />
          <BottomBarContent
            sendNowTheRequest={sendInventoryTransaction}
            myNotes={mynotes}
            setMynotes={setMynotes}
            counterOFList={transferList.length}
          />
        </ChatWindow>
      </RootWrapper>

      <Dialog onClose={handleClose} open={dialogOpen} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ApplicationsMessenger;
