import { useState, useEffect } from "react";
import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  List,
  Button,
  Divider,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  lighten,
  styled,
  CircularProgress,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Inventory";

import { format } from "date-fns";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import Label from "src/Components/Label";
import {
  availableStockAnalysisModel,
  LocationModel,
  lotnumbertransformation,
  LotOptionType,
  ProductModel,
  TransferInventoryItemModel,
} from "../../../models/mymodels";

import GlobalProductInfoDialog from "../../../Components/Shared/ProductInfoDialog";



const RootWrapper = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(2.5)};
  `,
);

const ListItemWrapper = styled(ListItemButton)(
  ({ theme }) => `
        &.MuiButtonBase-root {
            margin: ${theme.spacing(1)} 0;
        }
  `,
);


interface ChildComponentProps {
  addItem: (item: TransferInventoryItemModel) => void;

  prodList: ProductModel[];
  locsList: LocationModel[];
}

function SidebarContent(props: ChildComponentProps) {
  const { prodList, locsList } = props;

  function handleAddItem(item: TransferInventoryItemModel) {
    props.addItem(item);
    resetInputs();
  }

  const [filteredprodList, setfilteredprodList] = useState<ProductModel[]>(
    prodList.length ? prodList : [],
  );
  const [productSelected, setproductSelected] = useState<ProductModel>();

  useEffect(() => {
    setfilteredprodList(prodList);
  }, [prodList]);

  function resetInputs(): void {
    setproductSelected(undefined);
    setselectedQty(0);
    setselectedCondId(null);
    setselectedLotId(null);
    setselectedToLocationId(null);
    setselectedNS("");
    setselectedSI("");
  }
  const handleSearchTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    if (e.target.value !== "" && e.target.value.trim().length > 0) {
      const filteredList = applyFilters(e.target.value);
      setfilteredprodList(filteredList);
    } else {
      setfilteredprodList(prodList);
    }
  };
  function findLotNumberByLotId(lotid: number): string {
    if (productSelected) {
      const foundItem = productSelected.availableStockAnalysis.find(
        (item) => item.lotid === lotid,
      );
      return foundItem
        ? foundItem.lotnumber +
        (foundItem.expdate
          ? ` (${format(new Date(foundItem.expdate), "dd/MM/yyyy")})`
          : "")
        : "";
      // return foundItem ? foundItem.lotnumber : '';
    }
    return "";
  }
  function findConStatusNumberByLotId(condid: number): string {
    if (productSelected) {
      const foundItem = productSelected.availableStockAnalysis.find(
        (item) => item.conid === condid,
      );
      return foundItem ? foundItem.conname : "";
    }
    return "";
  }

  function getLocationById(locid: number): string {
    let location = locsList.find((location) => location.id === locid);

    if (location) {
      // Location found 
      return `${location.room?.building?.building} - ${location.room?.room} - ${location.locname}`;
    } else {
      // Location not found
      return "";
    }
  }

  const applyFilters = (textgiven: string): ProductModel[] => {
    return prodList.filter((product) => {
      let matches = true;

      if (textgiven != undefined) {
        let givenvalue = textgiven.toUpperCase() ?? "";

        if (
          givenvalue.length > 0 &&
          !product.name.toUpperCase().includes(givenvalue.toUpperCase()) &&
          !(
            product.barcode &&
            product.barcode.toUpperCase().includes(givenvalue.toUpperCase())
          ) &&
          !(
            product.code &&
            product.code.toUpperCase().includes(givenvalue.toUpperCase())
          )
          &&
          !(
            product.brandName &&
            product.brandName.toUpperCase().includes(givenvalue.toUpperCase())
          )
        ) {
          matches = false;
          return matches;
        } else {
        }
      }

      return matches;
    });
  };

  const [selectedQty, setselectedQty] = React.useState<number | null>(0);
  const [selectedFromLocationId, setselectedFromLocationId] = React.useState<
    number | null
  >(null);
  const [selectedLotId, setselectedLotId] = React.useState<number | null>(null);
  const [selectedCondId, setselectedCondId] = React.useState<number | null>(
    null,
  );
  const [selectedToLocationId, setselectedToLocationId] = React.useState<
    number | null
  >(null);
  const [selectedNS, setselectedNS] = React.useState<string | null>("");
  const [selectedSI, setselectedSI] = React.useState<string | null>("");

  const handleQtyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    if (e.target.value.trim().toString().length > 0) {
      setselectedQty(parseInt(e.target.value));
    } else {
      setselectedQty(0);
    }
  };

  const handleSIChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    if (e.target.value.trim().toString().length > 0) {
      setselectedSI(e.target.value);
    } else {
      setselectedSI("");
    }
  };

  const handleNSChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    if (e.target.value.trim().toString().length > 0) {
      setselectedNS(e.target.value);
    } else {
      setselectedNS("");
    }
  };

  const CopyLine = (line: availableStockAnalysisModel) => {
    setselectedNS(line.ns);
    setselectedSI(line.si);
  };

  const handleLocationChange = (e: SelectChangeEvent<string>) => {
    setselectedFromLocationId(parseInt(e.target.value));
    setselectedCondId(null);
    setselectedLotId(null);
  };

  const handleLotChange = (e: SelectChangeEvent<string>) => {
    setselectedLotId(parseInt(e.target.value));
  };

  const handleCondIdChange = (e: SelectChangeEvent<string>) => {
    setselectedCondId(parseInt(e.target.value));
  };

  const handleToLocationChange = (e: SelectChangeEvent<string>) => {
    setselectedToLocationId(parseInt(e.target.value));
  };

  interface GroupedItems {
    [key: number]: availableStockAnalysisModel[];
  }

  function generateLocationSelect(product: ProductModel) {
    const { availableStockAnalysis } = product;

    // Step 1: Group by locid
    const groupedItems: GroupedItems = availableStockAnalysis.reduce(
      (result: GroupedItems, item) => {
        const key = item.locid;
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(item);
        return result;
      },
      {},
    );

    // Step 2: Filter grouped items with sum of qty > 0
    const filteredItems: availableStockAnalysisModel[][] = Object.values(
      groupedItems,
    ).filter(
      (items: availableStockAnalysisModel[]) =>
        items.reduce(
          (sum: number, item: availableStockAnalysisModel) => sum + item.qty,
          0,
        ) > 0,
    );

    // Step 3: Map filtered items to create MenuItem components
    const menuItems = filteredItems.map(
      (items: availableStockAnalysisModel[]) => {
        const { buldingname, roomname, locid, locname } =
          items[0];
        const displayValue = `${buldingname} - ${roomname} - ${locname}`;

        return (
          <MenuItem key={locid} value={locid}>
            {displayValue}
          </MenuItem>
        );
      },
    );

    return (
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="product-label">From Location</InputLabel>
        <Select
          labelId="product-label"
          label="From Location"
          id="select-fromloc"
          defaultValue=""
          onChange={handleLocationChange}
        >
          {menuItems}
        </Select>
      </FormControl>
    );
  }

  function generateLotSelect(
    product: ProductModel,
    selectedLocationId: number,
  ) {
    const { availableStockAnalysis } = product;

    // Filter availableStockAnalysis by selectedLocationId
    const filteredItems = availableStockAnalysis.filter(
      (item) => item.locid === selectedLocationId,
    );

    // Step 1: Group by lotid
    const groupedItems: GroupedItems = filteredItems.reduce(
      (result: GroupedItems, item) => {
        const key = item.lotid;
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(item);
        return result;
      },
      {},
    );

    // Step 2: Filter grouped items with sum of qty > 0
    const filteredLots: availableStockAnalysisModel[][] = Object.values(
      groupedItems,
    ).filter(
      (items: availableStockAnalysisModel[]) =>
        items.reduce(
          (sum: number, item: availableStockAnalysisModel) => sum + item.qty,
          0,
        ) > 0,
    );

    // Step 3: Map filtered lots to create MenuItem components
    const menuItems = filteredLots.map(
      (items: availableStockAnalysisModel[]) => {
        const { lotid, lotnumber, expdate } = items[0];
        const newlot: LotOptionType = {
          id: lotid,
          lotnumber: lotnumber,
          expdate: expdate,
        };
        return (
          <MenuItem key={newlot.id} value={newlot.id}>
            {/*    {lotnumber}*/}
            {lotnumbertransformation(newlot)}
            {/* {lotnumber} {expdate && `(${format(new Date(expdate), 'dd/MM/yyyy')})`}*/}
          </MenuItem>
        );
      },
    );

    return (
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="lot-label">Lot Number</InputLabel>
        <Select
          labelId="lot-label"
          label="Lot Number"
          id="select-lot"
          value={selectedLotId?.toString() ?? ""}
          onChange={handleLotChange}
        >
          {menuItems}
        </Select>
      </FormControl>
    );
  }

  function generateConditionStatusSelect(
    product: ProductModel,
    selectedLocationId: number,
    selectedLotId1: number,
  ) {
    const { availableStockAnalysis } = product;

    // Filter availableStockAnalysis by selectedLocationId
    const filteredItems = availableStockAnalysis.filter(
      (item) =>
        item.locid === selectedLocationId && item.lotid === selectedLotId1,
    );

    // Step 1: Group by conid
    const groupedItems: GroupedItems = filteredItems.reduce(
      (result: GroupedItems, item) => {
        const key = item.conid;
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(item);
        return result;
      },
      {},
    );

    // Step 2: Filter grouped items with sum of qty > 0
    const filteredLots: availableStockAnalysisModel[][] = Object.values(
      groupedItems,
    ).filter(
      (items: availableStockAnalysisModel[]) =>
        items.reduce(
          (sum: number, item: availableStockAnalysisModel) => sum + item.qty,
          0,
        ) > 0,
    );

    // Step 3: Map filtered conds to create MenuItem components
    const menuItems = filteredLots.map(
      (items: availableStockAnalysisModel[]) => {
        const { conid, conname } = items[0];

        return (
          <MenuItem key={conid} value={conid}>
            {conname}
          </MenuItem>
        );
      },
    );

    return (
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="cond-label">Condition</InputLabel>
        <Select
          labelId="cond-label"
          label="Condition"
          id="select-cond"
          value={selectedCondId?.toString() ?? ""}
          onChange={handleCondIdChange}
        >
          {menuItems}
        </Select>
      </FormControl>
    );
  }




  return (
    <RootWrapper>


      <>
        {productSelected ? (
          // Render this if productSelected is defined

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              sx={{ m: 1 }}
              label="Product Code"
              InputLabelProps={{
                shrink: true,
              }}
              name="Code"
              value={productSelected.code}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              sx={{ m: 1 }}
              label="Product Name"
              InputLabelProps={{
                shrink: true,
              }}
              name="Code"
              value={productSelected.name}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              sx={{ m: 1 }}
              label="Quantity"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              name="quantity"
              value={selectedQty}
              onChange={handleQtyChange}
            />

            <div>
              {productSelected && generateLocationSelect(productSelected)}
              {selectedFromLocationId &&
                productSelected &&
                generateLotSelect(productSelected, selectedFromLocationId)}
              {selectedLotId &&
                selectedFromLocationId &&
                productSelected &&
                generateConditionStatusSelect(
                  productSelected,
                  selectedFromLocationId,
                  selectedLotId,
                )}
            </div>

            {/* Other components */}


            {productSelected.forsequencingFlag && (
              <div>
                <TextField
                  sx={{ m: 1 }}
                  label="SI"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="si"
                  value={selectedSI}
                  onChange={handleSIChange}
                />
                <TextField
                  sx={{ m: 1 }}
                  label="NS"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="ns"
                  value={selectedNS}
                  onChange={handleNSChange}
                />
              </div>
            )}

            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="product-label">To Location</InputLabel>
              <Select
                labelId="product-label"
                label="To Location"
                id="select-toloc"
                value={selectedToLocationId?.toString() ?? ""}
                onChange={handleToLocationChange}
              >
                {locsList.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.room?.building?.building} - {location.room?.room}{" "}
                    - {location.locname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                display:
                  (selectedQty ?? 0) <= 0 ||
                    (selectedFromLocationId ?? 0) <= 0 ||
                    (selectedToLocationId ?? 0) <= 0 ||
                    (selectedLotId ?? 0) <= 0 ||
                    (selectedCondId ?? 0) <= 0 ||
                    (parseInt(productSelected.id) ?? 0) <= 0
                    ? "none"
                    : "block",
              }}
              onClick={() =>
                handleAddItem({
                  lineid: "",
                  pid: parseInt(productSelected.id),
                  pcode: productSelected.code,
                  pname: productSelected.name,
                  fromlocid: selectedFromLocationId ?? 0,
                  fromlocname: getLocationById(selectedFromLocationId ?? 0),
                  tolocid: selectedToLocationId ?? 0,
                  tolocname: getLocationById(selectedToLocationId ?? 0),
                  lotnumber: findLotNumberByLotId(selectedLotId ?? 0),
                  lotid: selectedLotId ?? 0,
                  condstatusid: selectedCondId ?? 0,
                  condstatusname: findConStatusNumberByLotId(
                    selectedCondId ?? 0,
                  ),
                  qty: selectedQty ?? 0,
                  ns: selectedNS ?? "",
                  si: selectedSI ?? "",
                })
              }
            >
              Add to list
            </Button>
            <Divider orientation="horizontal" sx={{ my: 0.5 }} />
            <Button
              type="submit"
              variant="contained"
              color="error"
              onClick={() => resetInputs()}
            >
              Cancel
            </Button>

            <Box display="block" pb={1} mt={4} alignItems="center">
              {/*<Typography*/}
              {/*    sx={{*/}
              {/*        mr: 1*/}
              {/*    }}*/}
              {/*    variant="h3"*/}
              {/*>*/}
              {/*  Inventory Analysis*/}
              {/*</Typography>*/}
              <GlobalProductInfoDialog
                productId={Number(productSelected.id)}
                buttontext={"Inventory Analysis"}
                displaytype={"typographyonlywithbtn"}
              />

              <Label color="success">
                <b>{productSelected.availabletotalstockqty}</b>
              </Label>

              <Divider />

              <List disablePadding component="div">
                {productSelected.availableStockAnalysis.map((line) => (
                  <ListItem
                    onClick={() => CopyLine(line)}
                    disablePadding
                    alignItems="flex-start"
                    key={line.lotnumber.toString() + line.locname.toString()}
                    role={undefined}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <MailIcon />
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              <span>Building: {line.buldingname}</span>
                              <br />
                              <span>Room: {line.roomname}</span>
                              <br />
                              <span>Loc: {line.locname}</span> <br />
                              <span>Loc. Type: {line.loctypename}</span> <br />
                              <span>Quantity: {line.qty}</span> <br />
                              <span>Lot: {line.lotnumber}</span>
                              {line.expdate ? (
                                <span>
                                  <br />
                                  Exp:{" "}
                                  {format(new Date(line.expdate), "dd/MM/yyyy")}
                                </span>
                              ) : (
                                ""
                              )}
                              <br /> <span>Status: {line.conname}</span>
                              {line.si.length > 0 && line.ns.length > 0 && (
                                <>
                                  <br />
                                  <span>
                                    SI: {line.si}
                                    <br />
                                    NS: {line.ns}
                                  </span>
                                </>
                              )}
                            </Typography>
                            <hr />
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        ) : (

          // Render this if productSelected is not defined
          <>
            <TextField
              sx={{
                mt: 2,
                mb: 1,
              }}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search for product..."
              onChange={handleSearchTextChange}
            />

            <Box>
              <Typography
                sx={{
                  mt: 2,
                }}
                variant="h3"
              >
                Products
              </Typography>
              {prodList.length > 0 &&
                filteredprodList.length < prodList.length && (
                  <Typography
                    sx={{
                      mb: 1,
                    }}
                    variant="subtitle1"
                  >
                    filtered {filteredprodList.length} of {prodList.length}
                  </Typography>
                )}
              {prodList.length > 0 &&
                filteredprodList.length == prodList.length && (
                  <Typography
                    sx={{
                      mb: 1,
                    }}
                    variant="subtitle1"
                  >
                    total {prodList.length}
                  </Typography>
                )}

              {prodList.length <= 0 && (
                <>
                  <Typography
                    sx={{
                      mb: 1,
                    }}
                    variant="subtitle1"
                  >
                    Please wait..
                  </Typography>
                  <CircularProgress />
                </>
              )}
            </Box>
            <Box mt={2}>
              <List disablePadding component="div">
                {Array.isArray(filteredprodList) &&
                  filteredprodList.map((product) => {
                    function handleListItemClick(product: ProductModel): void {
                      setproductSelected(product);
                      //  console.log(product);
                    }

                    return (
                      <ListItemWrapper
                        key={product.id}
                        onClick={() => handleListItemClick(product)}
                      >
                        <ListItemAvatar>
                          <Avatar src="/static/images/placeholders/product.png" />
                        </ListItemAvatar>
                        <ListItemText
                          sx={{
                            mr: 1,
                          }}
                          primaryTypographyProps={{
                            color: "textPrimary",
                            variant: "h5",
                            noWrap: true,
                          }}
                          secondaryTypographyProps={{
                            color: "textSecondary",
                            noWrap: false,
                          }}
                          primary={product.code}
                          secondary={product.name}
                        />
                        <Label color="primary">
                          <b>{product.availabletotalstockqty.toString()}</b>
                        </Label>
                      </ListItemWrapper>
                    );
                  })}
              </List>


            </Box>
          </>
        )}
      </>


    </RootWrapper>
  );
}

export default SidebarContent;
