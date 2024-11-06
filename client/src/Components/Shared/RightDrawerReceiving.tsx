import React, { useState, Fragment, useEffect } from "react";
import {
  Typography,
  Button,
  ListItemAvatar,
  Avatar,
  Stack,
  Tooltip,
  IconButton,
  styled,
  Card,
  CardHeader,
} from "@mui/material";
/*import DeleteIcon from '@mui/icons-material/Delete';*/
import AddrequestIcon from "@mui/icons-material/PostAddTwoTone";
import ReceiveIcon from "@mui/icons-material/InventoryOutlined";
import ScienceIcon from "@mui/icons-material/Science";

import {
  customDateFormat,
  CustomPurchaseOrderLine,
  CustomPurchaseOrderModel,
  hasAdminAccess,
  ItemConditionStatusModel,
  LocationModel,
  LotOptionType,
  POrderLinesModel,
  VatRateModel,
} from "src/models/mymodels";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";

import {
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  Drawer,
  useTheme,
} from "@mui/material";

import {
  getAllItemConditionStatuses,
  getAllLocations,
  getAllLots,
  getAllVatRates,
  getPorderLinesById,
} from "../../services/user.service";
import { useAuth } from "src/contexts/UserContext";

import RecMainFormWithLines from "../../content/applications/PurchaseOrders/ReceiveForm";
//import LoadingIcon from "src/Components/Shared/LoadingIcon";
// create a new interface for prop types

const ButtonSuccess = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.success.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.success.dark};
     }
    `,
);

interface PostsProps {
  refreshUpdatedRow: (porderid: number) => void;
  orderlinescount: number;
  porderheader: CustomPurchaseOrderModel;
  porderline: CustomPurchaseOrderLine | CustomPurchaseOrderLine[] | null;
}

function Rightpopup(those: PostsProps) {
  // let anchor = "right";
  const userContext = useAuth();
  const theme = useTheme();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  type Anchor = "top" | "left" | "bottom" | "right";
  const toggleDrawer =
    (anchor: Anchor, open: boolean, receivingmodedirect: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        if (open) {
          if (receivingmodedirect) {
            setReceiveMode(true);
          }
          // setpOrderLines(undefined);
          setloadLinesFromAPI(true);
        } else {
          setloadLinesFromAPI(false);
          setpOrderLines(undefined);
          setReceiveMode(false);
        }

        setState({ ...state, [anchor]: open });
      };

  let anchora: Anchor = "right";
  //const theme = useTheme();

  const [loadLinesFromAPI, setloadLinesFromAPI] = useState<boolean>(false);
  const [pOrderLines, setpOrderLines] = useState<POrderLinesModel[]>();
  // const [availableLots, setavailableLots] = useState<LotModel[]>();
  const [availableLots, setavailableLots] = useState<LotOptionType[]>();
  const [availableLocs, setavailableLocs] = useState<LocationModel[]>();
  const [availableItemConditionStatuses, setavailableItemConditionStatuses] =
    useState<ItemConditionStatusModel[]>();
  const [availableVatRates, setavailableVatRates] = useState<VatRateModel[]>();
  //const [myInvoiceNo, setmymyInvoiceNo] = React.useState("");

  useEffect(() => {
    if (!loadLinesFromAPI) {
      //  setproductsLiveData(undefined);
      //  setPending Internal RequestsentFlag(false);
      //  refreshTotals({ subtotalamount: subtotal(myOrder), totalamount: vattotal(myOrder), totalVATamount: vattotal(myOrder) - subtotal(myOrder) });
    } else if (
      loadLinesFromAPI &&
      those.porderheader &&
      those.porderheader.id > 0
    ) {
      //let uniqueProductIds = [...new Set(myreqLinesList.map((item) => item.linepid))];

      getPorderLinesById(those.porderheader.id).then(
        (response) => {
          if (response.status === 200) {
            setpOrderLines(response.data);
          } else {
            setpOrderLines(undefined);
          }
        },
        (error) => {
          setpOrderLines(undefined);
          console.log(error, "Error Loading Plines");
        },
      );

      getAllLots().then(
        (response) => {
          if (response.status === 200) {
            setavailableLots(response.data);
          } else {
            setavailableLots(undefined);
          }
        },
        (error) => {
          setavailableLots(undefined);
          console.log(error, "Error Loading Lots");
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

      getAllVatRates().then(
        (response) => {
          if (response.status === 200) {
            setavailableVatRates(response.data);
          } else {
            setavailableVatRates(undefined);
          }
        },
        (error) => {
          setavailableLocs(undefined);
          console.log(error, "Error Loading Vat Rates");
        },
      );

      getAllItemConditionStatuses().then(
        (response) => {
          if (response.status === 200) {
            setavailableItemConditionStatuses(response.data);
          } else {
            setavailableItemConditionStatuses(undefined);
          }
        },
        (error) => {
          setavailableItemConditionStatuses(undefined);
          console.log(error, "Error Loading Item Conditions");
        },
      );
    }
  }, [loadLinesFromAPI]);

  const [mobile, setMobile] = useState(window.innerWidth <= 500);

  const handleWindowSizeChange = () => {
    setMobile(window.innerWidth <= 500);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const [receiveMode, setReceiveMode] = useState<boolean>(false);

  const handleClickReceiveModeOn = () => {
    console.log(receiveMode);
    setReceiveMode(true);
    console.log(receiveMode);
  };

  const handleClickReceiveModeOff = () => {
    setReceiveMode(false);
  };

  const successReceiving = (orderid: number) => {
    // toggleDrawer('right', false);
    setState({ ...state, [anchora]: false });
    //refresh porder from api after receiving succeeded
    those.refreshUpdatedRow(orderid);
  };

  return (
    <Fragment key={those.porderheader.id}>
      {those.porderline && Array.isArray(those.porderline) && (
        //if array of polines given
        <ButtonSuccess
          // onClick={openInternalReqFormFunc}
          disabled={
            !those.porderline.every(
              (line) =>
                line.orderid ===
                (those.porderline as CustomPurchaseOrderLine[])[0].orderid &&
                (line.dynamicstatus?.toLowerCase() === "pending" ||
                  line.dynamicstatus?.toLowerCase() === "partially received"),
            )
          }
          sx={{ ml: 1 }}
          startIcon={<AddrequestIcon fontSize="small" />}
          variant="contained"
          onClick={toggleDrawer(anchora, true, true)}
        >
          Receive Items
        </ButtonSuccess>
      )}

      {those.porderline && !Array.isArray(those.porderline) && (
        //if one order line is given
        <Tooltip title="Receive Item" arrow>
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
            onClick={toggleDrawer(anchora, true, true)}
          //    onClick={() => handleMarkAsSentBtn(porder.id)}
          >
            <ReceiveIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      )}

      {!those.porderline && (
        //else show button for whole order
        <Button onClick={toggleDrawer(anchora, true, false)}>
          Lines ({those.orderlinescount})
        </Button>
      )}

      {/*       <Button onClick={toggleDrawer(anchora, true)}>Lines ({those.orderlinescount})</Button>*/}

      <Drawer
        anchor={anchora}
        open={state[anchora]}
        onClose={toggleDrawer(anchora, false, false)}
      >
        {/*'show order lines box'*/}
        <Box
          sx={{ width: anchora === "right" && mobile ? "auto" : 600 }}
          p={0}
          mt={2}
          role="presentation"
          onClick={toggleDrawer(anchora, true, false)}
          onKeyDown={toggleDrawer(anchora, false, false)}
        >
          {hasAdminAccess(userContext?.currentUser) &&
            ((those.porderheader.statusName ?? "").toLowerCase() === "sent".toLowerCase() ||
              (those.porderheader.statusName ?? "").toLowerCase() === "partially received".toLowerCase()) && (
              !receiveMode &&
              <Stack
                direction="row"
                justifyContent="end"
              >
                <Button
                  sx={{ ml: 1, mr: 2, bgcolor: "#2196F3" }}
                  variant="contained"
                  onClick={() => handleClickReceiveModeOn()}
                  startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                  Receive Items
                </Button>
              </Stack>
            )}


          <Stack direction="row" justifyContent="flex-start">
            {/*<Avatar style={{ backgroundColor: '#2196F3', color: 'white' }}>*/}
            {/*    <ScienceIcon />*/}
            {/*</Avatar>*/}
            <Card
              sx={{ width: "100%", bgcolor: "#2196F3", ml: 2, mr: 2, mt: 2 }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    style={{ color: "#2196F3", backgroundColor: "white" }}
                  >
                    Ord
                  </Avatar>
                }
                title={
                  <Typography variant="h3" style={{ color: "white" }}>
                    Order Information
                  </Typography>
                }
                subheader={
                  <>
                    <Typography variant="h6" style={{ color: "white" }}>
                      {" "}
                      Number: {those.porderheader.id}{" "}
                    </Typography>
                    <Typography variant="h6" style={{ color: "white" }}>
                      {" "}
                      Created:{" "}
                      {customDateFormat(
                        those.porderheader.ordercreateddate,
                        "Datetime",
                      )}{" "}
                    </Typography>
                    <Typography variant="h6" style={{ color: "white" }}>
                      {" "}
                      Supplier: {those.porderheader.supName}{" "}
                    </Typography>
                    <Typography variant="h6" style={{ color: "white" }}>
                      {" "}
                      Status: {those.porderheader.statusName}{" "}
                    </Typography>

                    {those.porderheader?.supplier?.worknumber && (
                      <Typography variant="h6" style={{ color: "white" }}>
                        Work Number: {those.porderheader.supplier.worknumber}{" "}
                      </Typography>
                    )}
                    {!pOrderLines && (
                      <Typography variant="h6" sx={{ color: "white", mt: 2 }}>
                        Order Lines Not Found!
                      </Typography>
                    )}
                  </>
                }
              />
            </Card>

            {/*<Typography variant="h5">Order Number: {those.porderheader.id} </Typography>*/}
            {/*<Typography variant="h5">Supplier: {those.porderheader.supName} </Typography>*/}
            {/*<Typography variant="h5">Status: {those.porderheader.statusName ?? ""} </Typography>*/}
          </Stack>

          <Divider hidden={receiveMode} />
          {/*<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">*/}
          {/*    {those.category.name}*/}
          {/*</Typography>*/}

          <List hidden={receiveMode} dense={true}>
            {pOrderLines &&
              pOrderLines.map((orderline) => (
                <Fragment key={orderline.id}>
                  <ListItem
                    key={orderline.id}
                    secondaryAction={
                      <>
                      </>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        style={{ backgroundColor: "#2196F3", color: "white" }}
                      >
                        <ScienceIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={orderline.product?.code}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {orderline.product?.name}
                          </Typography>
                          <Typography
                            sx={{ display: "block" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Ordered Quantity: {orderline.qty}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>

              ))}
          </List>
        </Box>

        {/*'receiving box'*/}
        <Box
          hidden={!receiveMode}
          sx={{ width: anchora === "right" && mobile ? "auto" : "auto" }}
          p={0}
          mt={2}
          role="presentation"
          onClick={toggleDrawer(anchora, true, false)}
        //   onKeyDown={toggleDrawer(anchora, false)}
        >
          {hasAdminAccess(userContext?.currentUser) && (
            <>
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{ mx: "10px" }}
              >
                <Button
                  color="error"
                  sx={{ ml: 1 }}
                  variant="contained"
                  onClick={() => handleClickReceiveModeOff()}
                  startIcon={<CancelTwoToneIcon fontSize="small" />}
                >
                  Cancel Receiving
                </Button>
              </Stack>
            </>
          )}

          {RecMainFormWithLines(
            those.porderline && pOrderLines
              ? pOrderLines.filter((row) => {
                if (Array.isArray(those.porderline)) {
                  return those.porderline.some(
                    (line) => line.lineid === row.id,
                  );
                } else {
                  //  console.log('one item');
                  return those.porderline?.lineid === row.id;
                }
              })
              : pOrderLines ?? [],
            those.porderheader ?? null,
            () => void 0,
            availableVatRates ?? [],
            availableItemConditionStatuses ?? [],
            availableLots ?? [],
            setavailableLots,
            availableLocs ?? [],
            successReceiving,
          )}

          <Divider />
        </Box>
      </Drawer>
    </Fragment>
  );
}

export default Rightpopup;
