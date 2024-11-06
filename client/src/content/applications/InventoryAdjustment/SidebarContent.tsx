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
  Autocomplete,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Inventory";

import {
  format,
} from "date-fns";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import Label from "src/Components/Label";

import {
  availableStockAnalysisModel,
  AdjustmentItemModel,
  ItemConditionStatusModel,
  LocationModel,
  LotOptionType,
  ProductModel,
  ReceivingLinesModel,
  lotnumbertransformation,
  locationnamertransformation,
} from "../../../models/mymodels";


import LotsComboWithSearchAndAddNewDialog from "src/Components/Shared/LotsCombo";
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
  addItem: (item: AdjustmentItemModel) => void;

  prodList: ProductModel[];
  locsList: LocationModel[];
  lotsList: LotOptionType[];
  prodCondStatusList: ItemConditionStatusModel[];
  refreshLotList: (lots: LotOptionType[]) => void;
}

function SidebarContent(props: ChildComponentProps) {
  const { prodList, locsList, lotsList, prodCondStatusList } = props;

  function handleAddItem(item: AdjustmentItemModel) {
    props.addItem(item);
    resetInputs();
  }

  const getLotsListTrick = (): LotOptionType[] => {
    if (!productSelected || !selectedQty || selectedQty >= 0) {
      return lotsList;
    }

    let distinctLotIds = Array.from(
      new Set(
        productSelected.availableStockAnalysis.map((stock) => stock.lotid),
      ),
    );

    if (selectedLocation && selectedLocation.id > 0) {
      distinctLotIds = distinctLotIds.filter((lotId) =>
        productSelected.availableStockAnalysis.some(
          (stock) =>
            stock.lotid === lotId && stock.locid === selectedLocation.id,
        ),
      );
    }

    if (selectedCondId && selectedCondId > 0) {
      distinctLotIds = distinctLotIds.filter((lotId) =>
        productSelected.availableStockAnalysis.some(
          (stock) => stock.lotid === lotId && stock.conid === selectedCondId,
        ),
      );
    }

    return lotsList.filter((lot) => distinctLotIds.includes(lot.id));
  };

  const findLotById = (lotid?: number) => {
    if (lotid) {
      const foundLot = lotsList.find((lot) => lot.id === lotid);
      return foundLot || null;
    }
    return null;
  };

  const findLocById = (locid?: number) => {
    if (locid) {
      const foundLoc = locsList.find((loc) => loc.id === locid);
      return foundLoc || null;
    }
    return null;
  };



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
    setSelectedLot(null);
    setselectedLocation(null);
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

  function findConStatusNumberById(condid: number): string {
    if (productSelected) {
      const foundItem = prodCondStatusList.find((item) => item.id === condid);
      return foundItem ? foundItem.name : "";
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
  /*     const [selectedFromLocationId, setselectedFromLocationId] = React.useState<number | null>(null);*/
  // const [selectedLotId, setselectedLotId] = React.useState<number | null>(null);
  const [selectedLot, setSelectedLot] = useState<LotOptionType | null>(null);
  const [selectedLocation, setselectedLocation] =
    useState<LocationModel | null>(null);

  const [selectedCondId, setselectedCondId] = React.useState<number | null>(
    null,
  );
  // const [selectedLocId, setselectedLocId] = React.useState<number | null>(null);
  const [selectedNS, setselectedNS] = React.useState<string | null>("");
  const [selectedSI, setselectedSI] = React.useState<string | null>("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);


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
    // Perform the desired operations using the `line` object
    setselectedCondId(line.conid);
    //  setselectedLocId(line.locid);
    setselectedLocation(findLocById(line.locid));
    setSelectedLot(findLotById(line.lotid));
    setselectedNS(line.ns);
    setselectedSI(line.si);
  };



  const handleCondIdChange = (e: SelectChangeEvent<string>) => {
    setselectedCondId(parseInt(e.target.value));
  };




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



            <Autocomplete
              sx={{ m: 1, minWidth: 120 }}
              disablePortal
              id="combo-box-loc"
              options={locsList ?? []}
              getOptionLabel={(option) => locationnamertransformation(option)}
              value={selectedLocation}
              onChange={(event, newValue) => {
                setselectedLocation(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Location" />
              )}
            />

            <LotsComboWithSearchAndAddNewDialog
              availablelots1={getLotsListTrick() ?? []}
              // givenPOsupplierid={(myOrder && myOrder.length > 0) ? myOrder[0].defaultSupplierId : 0}
              refreshLotsFunction={props.refreshLotList}
              updateLineFn={() => { }}
              currentLine={{} as ReceivingLinesModel}
              sxgiven={{ m: 1, minWidth: 120 }}
              onTenderIDchange={setSelectedLot}
              defaultvalue={selectedLot}
            />

            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="cond-label">Condition</InputLabel>
              <Select
                labelId="cond-label"
                label="Condition"
                id="select-cond"
                value={selectedCondId?.toString() ?? ""}
                onChange={handleCondIdChange}
              >
                {prodCondStatusList.map((condstatus) => (
                  <MenuItem key={condstatus.id} value={condstatus.id}>
                    {condstatus.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                display:
                  (selectedQty ?? 0) === 0 ||
                    /*   || (selectedFromLocationId ?? 0) <= 0*/
                    // || (selectedLocId ?? 0) <= 0
                    (selectedLocation?.id ?? 0) <= 0 ||
                    (selectedLot?.id ?? 0) <= 0 ||
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
                  //  locid: selectedLocId ?? 0,
                  locid: selectedLocation?.id ?? 0,
                  locname: getLocationById(selectedLocation?.id ?? 0),
                  lotnumber: lotnumbertransformation(selectedLot),

                  //    lotnumber: findLotNumberByLotId(selectedLotId ?? 0),
                  lotid: selectedLot?.id ?? 0,
                  condstatusid: selectedCondId ?? 0,
                  condstatusname: findConStatusNumberById(selectedCondId ?? 0),
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
                    onClick={() => CopyLine(line)} // Call `CopyLine` with the `line` object as a parameter
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
                                    Si: {line.si} <br />
                                    Ns: {line.ns}
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
                          secondary={
                            <>
                              {product.name}
                              <Divider></Divider>
                              Brand: {product.brandName}
                            </>
                          }
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
