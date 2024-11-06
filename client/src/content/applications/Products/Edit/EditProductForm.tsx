import React, { FC, useEffect, useState } from "react";
import { updateSingleProduct } from "src/services/user.service";
import ResponsiveInfoDialog, {
  DialogType,
} from "src/Components/Shared/ResponsiveInfoDialog";
import {
  Brandmodel,
  FormEditProductValues,
  ProductModel,
  SubCategoryModel,
  SupplierModel,
  TenderModel,
} from "src/models/mymodels";
import { useNavigate } from "react-router-dom";
import {
  Switch,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Select,
  MenuItem,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  TextField,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  SelectChangeEvent,
  Stack,
  Button,
  Checkbox,
  ListItemText,
} from "@mui/material";
import BrandsComboWithSearchAndAddNewDialog from "../../../../Components/Shared/BrandsCombo";
import { useAlert } from "src/contexts/AlertsContext";

interface MyProps {
  className?: string;
  FormValuesProps: FormEditProductValues;
  formcalledby: "dialog" | "normal";
  onClose: () => void;
  handleUpdateSingleProduct?: (produtctToUpdate: ProductModel) => void;
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const applySubcatFilter = (
  subcatList: SubCategoryModel[],
  catid: number | string,
): SubCategoryModel[] => {
  let results = subcatList.filter(
    (x) => x.catid.toString() == catid.toString(),
  );
  if (results.length <= 0) {
    //  results.push({ name: 'No Subcategories found', id: "0", descr: "", catid: 0 });
  } else {
    //   results.push({ name: 'Please Choose', id: "", descr: "", catid: 0 });
    //   results.unshift({ name: 'No Subcategory Selected', id: "0", descr: "", catid: 0 });
  }
  return results;
};


const applySupplierTendersFilter = (
  supList: SupplierModel[],
  supid: number | string,
): TenderModel[] => {
  // Find the supplier with the given id
  const supplier = supList.find(
    (sup) => sup.id.toString() === supid.toString(),
  );

  // If the supplier is not found, return an empty array
  if (!supplier) {
    return [];
  }

  // Retrieve tenders from tendersuppliersassigneds array
  if (supplier.tendersuppliersassigneds) {
    return supplier.tendersuppliersassigneds
      .map(tsa => tsa.tidNavigation)
      .filter(tender => tender !== undefined) as TenderModel[];
  }

  // If tendersuppliersassigneds does not exist, return an empty array
  return [];
};

const EditProductForm: FC<MyProps> = ({ FormValuesProps, formcalledby, onClose, handleUpdateSingleProduct }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [dialogTitle, setdialogTitle] = React.useState("");
  const [dialogMessage, setdialogMessage] = React.useState("");
  const [dialogType, setdialogType] = React.useState<DialogType>("");
  const [openDialog, setOpenDialog] = useState(false);

  let productToSubmitFinal = FormValuesProps.initproduct;



  const FormValidation = () => {

    let validationresult: boolean = true;

    if (isCodeValid(code)) validationresult = false;
    if (isNameValid(name)) validationresult = false;
    // if (isCostPriceValid(costprice)) validationresult = false;
    if (
      costprice === "" ||
      (typeof costprice === "number" &&
        (costprice < 0 || costprice > 100000 || isNaN(costprice)))
    )
      validationresult = false;
    if (isminstockqtyValid(minstockqty)) validationresult = false;
    // if (ispunitsqtyValid(punits)) validationresult = false;

    if (validationresult) {
      onSubmit1();
      // return true;
    } else {
      setdialogTitle("Form Validation Failed");
      setdialogType("Error");
      setdialogMessage("Please correct the form fields and try again!");
      setOpenDialog(true);
      //return false;
    }
  };

  const onSubmit1 = () => {
    // if (openDialog) onChangeRetypePassword(false);

    // productToSubmitFinal.id = "0";
    updateSingleProduct(
      Number(productToSubmitFinal.id),
      productToSubmitFinal,
    ).then(
      (response) => {
        if (response.status === 200) {

          showAlert("Product Successfully Updated!", "success");
          if (formcalledby == 'normal') {
            setTimeout(function () {
              navigate("/management/products/", { replace: true });
            }, 1);
          } else {
            handleUpdateSingleProduct && handleUpdateSingleProduct(response.data as ProductModel);
            onClose();
          }

        } else {
          console.log(response.data);

          setdialogTitle("Update Error");
          setdialogType("Error");
          setdialogMessage(response.data);
          setOpenDialog(true);
        }
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error);

        setdialogTitle("Update Error");
        setdialogType("Error");
        setdialogMessage(
          `Error: Status ${error.response?.status ?? "Unknown"} - ${error.response?.data ?? error.message ?? "Unknown"}`,
        );
        setOpenDialog(true);
      },
    );
  };

  //Validation
  const isCodeValid = (value: string) => value.length <= 0 || value.length > 50;
  const isNameValid = (value: string) =>
    value.length <= 0 || value.length > 100;
  //  const isCostPriceValid = (value: number) => value < 0 || value > 100000
  const isCostPriceValid = (value?: number) =>
    value === undefined || value < 0 || value > 100000;
  const isminstockqtyValid = (value: number) => value < 0 || value > 1000;
  const ispunitsqtyValid = (value: number) => value < 1 || value > 1000;

  useEffect(() => {
    const product = FormValuesProps.initproduct;

    const tempbrands = FormValuesProps.initbrands;

    if (product && tempbrands) {
      const tempbrandfoundresult = tempbrands?.find(
        (brand) => brand.id === (product?.brandId ?? -1),
      );
      if (tempbrandfoundresult) {
        setselectedBrand(tempbrandfoundresult);
      }

      // tempbrands && setbrandId(Number(FormValuesProps.initproduct.brandId));
      const departmentIds = product.departments.map(
        (department) => department.id,
      );
      setSelectedDepartmentIds(departmentIds);
      setCheckedActiveStatusFlag(product?.activestatusFlag);
      setCategoryId(product?.categoryId);
      setSubCategoryId(product?.subcategoryId?.toString() ?? "-1");
      setVrate(product?.vatId);
      setLocation(product?.defaultLocId);
      setSupplier(product?.defaultSupplierId);
      setManufacturer(product?.manufacturerId);
      setStConds(product?.storageConditionId);
      setCode(product?.code.toString());
      setName(product?.name.toString());
      setBarcode(product?.barcode?.toString() ?? "");
      setGeneralnotes(product?.generalNotes.toString());
      setConcentration(product?.concentration.toString());
      setMinstockqty(product?.minstockqty);
      setPunits(product?.punits);
      setCostPrice(product?.costprice);
      setCheckedlabmade(product?.labMadeFlag);
      /*  setCheckedfordiagnostics(product?.fordiagnosticsFlag);*/
      setcheckedforsequencing(product?.forsequencingFlag);
      setCheckedformultiplelocs(product?.multipleLocationsFlag);
      setCheckedexpdate(product?.expdateFlag);
      setTenderId(product?.tenderId?.toString() ?? "-1");
    }
  }, [FormValuesProps.initproduct, FormValuesProps.initbrands]);


  const [code, setCode] = React.useState("");
  const handleChangeOfFieldCode = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCode(event.target.value);
    productToSubmitFinal.code = event.target.value;
  };

  const [name, setName] = React.useState("");
  const handleChangeOfFieldName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setName(event.target.value);
    productToSubmitFinal.name = event.target.value;
  };

  const [barcode, setBarcode] = React.useState<string>("");
  const handleChangeOfFieldBarcode = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBarcode(event.target.value);
    productToSubmitFinal.barcode = event.target.value;
  };

  const [generalnotes, setGeneralnotes] = React.useState("");
  const handleChangeOfFieldGenNotes = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGeneralnotes(event.target.value);
    productToSubmitFinal.generalNotes = event.target.value;
  };

  const [minstockqty, setMinstockqty] = React.useState(-1);
  const handleChangeOfFieldMinStockQty = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Math.max(0, Math.min(1000, Number(event.target.value)));
    setMinstockqty(Number(value));
    productToSubmitFinal.minstockqty = Number(value);
  };
  const [concentration, setConcentration] = React.useState("");
  const handleChangeOfFieldconcentration = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConcentration(event.target.value);
    productToSubmitFinal.concentration = event.target.value;
  };

  const [punits, setPunits] = React.useState("");
  const handleChangeOfFieldpunits = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    //const value = Math.max(1, Math.min(1000, Number(event.target.value)));
    setPunits(event.target.value);
    productToSubmitFinal.punits = event.target.value;
  };
  const [costprice, setCostPrice] = React.useState<number | "">(-1);

  const handleChangeOfFieldcostprice = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.trim();
    const parsedValue =
      value === "" ? "" : Math.max(0, Math.min(100000, Number(value)));
    setCostPrice(parsedValue);
    productToSubmitFinal.costprice = parsedValue === "" ? 0 : parsedValue;
  };

  const [checked, setCheckedActiveStatusFlag] = React.useState(false);
  const handleChangeActiveStatusFlag = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCheckedActiveStatusFlag(event.target.checked);
    productToSubmitFinal.activestatusFlag = event.target.checked;
  };

  const [checkedlabmade, setCheckedlabmade] = React.useState(false);
  const handleChangeLabMade = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedlabmade(event.target.checked);
    productToSubmitFinal.labMadeFlag = event.target.checked;
  };

  const [checkedexpdate, setCheckedexpdate] = React.useState(false);
  const handleChangeExpDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedexpdate(event.target.checked);
    productToSubmitFinal.expdateFlag = event.target.checked;
  };


  const [checkedforsequencing, setcheckedforsequencing] = React.useState(false);
  const handleChangeForSequencing = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setcheckedforsequencing(event.target.checked);
    productToSubmitFinal.forsequencingFlag = event.target.checked;
  };
  const [checkedformultiplelocs, setCheckedformultiplelocs] =
    React.useState(false);
  const handleChangemultiplelocs = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCheckedformultiplelocs(event.target.checked);
    productToSubmitFinal.multipleLocationsFlag = event.target.checked;
  };
  const [categoryId, setCategoryId] = React.useState<string | number>("");
  const [subcategoryId, setSubCategoryId] = React.useState<string | number>("");
  const [tenderId, setTenderId] = React.useState<string | number>("");
  // const [tenderId, setTenderId] = useState<string | number>("-1");

  // const [brandId, setbrandId] = React.useState<string | number>('');

  const [selectedBrand, setselectedBrand] = useState<Brandmodel>();
  //const [selectedDepartments, setselectedDepartments] = useState<DepartmentModel[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>([],);



  const handleChangeOfBrand = (newvalue?: Brandmodel) => {
    if (newvalue) {
      // setbrandId(Number(newvalue?.id));
      setselectedBrand(newvalue);
      productToSubmitFinal.brandId = Number(newvalue?.id);
    } else {
      //  setbrandId("");
      setselectedBrand(undefined);
      productToSubmitFinal.brandId = Number(0);
    }
  };


  const handleChangeOfDepartment = (event: SelectChangeEvent<number[]>) => {
    const selectedValues = event.target.value as number[];
    setSelectedDepartmentIds(selectedValues);
    productToSubmitFinal.departments = selectedValues.map((departmentId) => {
      const department = FormValuesProps?.initdepartments.find(
        (dep) => dep.id === departmentId,
      );
      return department ? { ...department } : { id: departmentId, name: "" };
    });
  };

  const handleChangeOfCategory = (event: SelectChangeEvent) => {
    setCategoryId(Number(event.target.value));
    productToSubmitFinal.categoryId = Number(event.target.value);
    setSubCategoryId("-1");
    productToSubmitFinal.subcategoryId = null;
  };

  const handleChangesubcat = (event: SelectChangeEvent) => {
    //  console.log("handleChangesubcat", event.target.value);
    if (event.target.value != null && event.target.value !== "-1") {
      setSubCategoryId(Number(event.target.value));
      productToSubmitFinal.subcategoryId = Number(event.target.value);
    } else {
      setSubCategoryId("-1");
      productToSubmitFinal.subcategoryId = null;
    }
  };

  const handleChangeTender = (event: SelectChangeEvent) => {
    // console.log("handleChangeTender", event.target.value);
    if (event.target.value != null && event.target.value !== "-1") {
      setTenderId(Number(event.target.value));
      productToSubmitFinal.tenderId = Number(event.target.value);
    } else {
      setTenderId("-1");
      productToSubmitFinal.tenderId = null;
    }
  };

  const [vrate, setVrate] = React.useState<string | number>("");
  const handleChangeVR = (event: SelectChangeEvent) => {
    setVrate(Number(event.target.value));
    productToSubmitFinal.vatId = Number(event.target.value);
  };

  const [location, setLocation] = React.useState<string | number>("");
  const handleChangeLOC = (event: SelectChangeEvent) => {
    setLocation(Number(event.target.value));
    productToSubmitFinal.defaultLocId = Number(event.target.value);
  };

  const [supplier, setSupplier] = React.useState<string | number>("");
  const handleChangeSUP = (event: SelectChangeEvent) => {
    setSupplier(Number(event.target.value));
    productToSubmitFinal.defaultSupplierId = Number(event.target.value);
    setTenderId("-1");
    productToSubmitFinal.tenderId = null;
  };

  const [manufacturer, setManufacturer] = React.useState<string | number>("");
  const handleChangeMAN = (event: SelectChangeEvent) => {
    setManufacturer(Number(event.target.value));
    productToSubmitFinal.manufacturerId = Number(event.target.value);
    // setTenderId("-1");
    // productToSubmitFinal.tenderId = null;
  };

  const [scond, setStConds] = React.useState<string | number>("");
  const handleChangeSTC = (event: SelectChangeEvent) => {
    setStConds(Number(event.target.value));
    productToSubmitFinal.storageConditionId = Number(event.target.value);
  };

  const emptySubsArrayForCategory = (): boolean => {
    let disabled = true;
    if (
      applySubcatFilter(FormValuesProps?.initsubcategories, categoryId).length >
      0
    ) {
      return false;
    }
    return disabled;
  };

  const emptyTendersArrayForSupplier = (): boolean => {
    let disabled = true;
    if (
      applySupplierTendersFilter(
        FormValuesProps?.initsuppliers,
        supplier?.toString() || "",
      ).length > 0
    ) {
      return false;
    }

    return disabled;
  };

  const isBrandIdValid = (value: string) => Number(value) <= 0;


  return (
    FormValuesProps.initproduct && (
      <Card>
        <CardHeader
          sx={{
            m: 2,
            p: 2,
            backgroundColor: "secondary.main",
            borderRadius: 1,
            border: 2,
            borderColor: "secondary.main",
          }}
          title={"You are editing the product: ".concat(
            FormValuesProps.initproduct?.name || "",
          )}
          subheader={"Code: ".concat(FormValuesProps.initproduct?.code || "")}
          titleTypographyProps={{
            color: "white",
            variant: "h1",
          }}
          subheaderTypographyProps={{
            color: "white",
            variant: "h4",
          }}
        />
        <Divider />
        <CardContent
          sx={{
            m: 2,
            p: 2,
          }}
        >
          <ResponsiveInfoDialog
            dialogTitle={dialogTitle}
            dialogContent={dialogMessage}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            dialogType={dialogType}
          />
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 0.5 /*, width: '25ch' */ },
              width: "100%",
              maxWidth: "100%",
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                sx={{ m: 0, width: "35ch", minWidth: "35ch" }}
                onChange={handleChangeOfFieldCode}
                value={code}
                required
                error={isCodeValid(code)}
                helperText={isCodeValid(code) ? "Code is not correct" : ""}
                inputProps={{ minLength: 1, maxLength: 50 }}
                id="code"
                label="Code"
              />

              <FormControl
                variant="outlined"
                sx={{ m: 0.5, minWidth: "10ch", maxWidth: "15ch" }}
              >
                <InputLabel>VatRate</InputLabel>
                <Select
                  onChange={handleChangeVR}
                  defaultValue=""
                  value={vrate?.toString() || ""}
                  label="VatRate"
                  autoWidth
                >
                  {FormValuesProps?.initvatates?.map((vr) => (
                    <MenuItem key={vr.id} value={vr.id}>
                      {vr.rate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>



              <FormControl
                variant="outlined"
                sx={{ m: 0.5, minWidth: "10ch", maxWidth: "15ch" }}
              >
                <InputLabel htmlFor="outlined-adornment-amount">
                  Price
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={handleChangeOfFieldcostprice}
                  value={costprice}
                  type="number"
                  inputProps={{
                    min: "0",
                    max: "100000",
                    "aria-label": "weight",
                  }}
                  error={
                    costprice === "" ||
                    (typeof costprice === "number" &&
                      (costprice < 0 || costprice > 100000 || isNaN(costprice)))
                  }
                  required
                  startAdornment={
                    <InputAdornment position="start">€</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                />
                <FormHelperText id="outlined-weight-helper-text">
                  {costprice === "" ||
                    (typeof costprice === "number" &&
                      (costprice < 0 || costprice > 100000 || isNaN(costprice)))
                    ? "Minimum 0 And Max 100000"
                    : ""}
                </FormHelperText>
              </FormControl>

              <TextField
                sx={{ m: 1, width: "15ch", minWidth: "10ch" }}
                id="concentration"
                label="Concentration"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputProps={{ minLength: 1, maxLength: 50 }}
                onChange={handleChangeOfFieldconcentration}
                value={concentration}
              />
              <TextField
                sx={{ m: 1, width: "15ch", minWidth: "10ch" }}
                id="productunits"
                label="Product Units"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputProps={{ minLength: 1, maxLength: 50 }}
                onChange={handleChangeOfFieldpunits}
                value={punits}
              />



              <TextField
                sx={{ m: 1, minWidth: "10ch", maxWidth: "15ch" }}
                id="standardnumber111111111"
                name="standardnumber111111111"
                label="Min. Stock Quantity"
                type="number"
                error={isminstockqtyValid(minstockqty)}
                helperText={
                  isminstockqtyValid(minstockqty)
                    ? "Minimum 0 And Max 1000"
                    : ""
                }
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputProps={{
                  min: "0",
                  max: "1000",
                }}
                onChange={handleChangeOfFieldMinStockQty}
                value={minstockqty}
                required
              />

              <TextField
                disabled
                id="datetime-local"
                label="Created Date"
                type="datetime-local"
                defaultValue={FormValuesProps.initproduct.createdDate}
                sx={{ width: 200 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                onChange={handleChangeOfFieldName}
                value={name}
                fullWidth
                required
                id="name"
                label="Name"
                error={isNameValid(name)}
                helperText={isNameValid(name) ? "Name is not correct" : ""}
                inputProps={{ minLength: 1, maxLength: 100 }}
              />
              <Divider />
              <Stack
                divider={<Divider orientation="vertical" flexItem />}
                sx={{ m: 1, p: 0, flexWrap: "wrap" }}
                spacing={1}
                justifyContent="space-evenly"
                alignItems="center"
                direction={{ xs: "column", sm: "column", md: "row" }}
              >
                <div>
                  <Typography>Status</Typography>
                  <Switch
                    color="success"
                    checked={checked}
                    onChange={handleChangeActiveStatusFlag}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>

                <div>
                  <Typography>Lab. Made</Typography>
                  <Switch
                    color="success"
                    checked={checkedlabmade}
                    onChange={handleChangeLabMade}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>



                <div>
                  <Typography>For Synthesis</Typography>
                  <Switch
                    color="success"
                    checked={checkedforsequencing}
                    onChange={handleChangeForSequencing}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>
                <div>
                  <Typography>Allow Multiple Locations</Typography>
                  <Switch
                    color="success"
                    checked={checkedformultiplelocs}
                    onChange={handleChangemultiplelocs}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>
                <div>
                  <Typography>Expiration date?</Typography>
                  <Switch
                    color="success"
                    checked={checkedexpdate}
                    onChange={handleChangeExpDate}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>
              </Stack>

              <TextField
                sx={{ m: 1, minWidth: "45ch" }}
                variant="outlined"
                id="outlined-required"
                label="Barcode"
                inputProps={{ maxLength: 50 }}
                onChange={handleChangeOfFieldBarcode}
                value={barcode}
              />

              <FormControl
                variant="outlined"
                sx={{ m: 1, width: "25ch", minWidth: "25ch" }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  onChange={handleChangeOfCategory}
                  defaultValue=""
                  value={categoryId.toString() || ""}
                  label="Category"
                  autoWidth
                >
                  {FormValuesProps?.initcategories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
                <InputLabel id="select-helper-labelsubcat">
                  Subcategory
                </InputLabel>
                <Select
                  autoWidth
                  labelId="select-helper-labelsubcat"
                  id="select-helper-labelsubcatid"
                  value={subcategoryId.toString() || "-1"}
                  label="Subcategory"
                  onChange={handleChangesubcat}
                  disabled={emptySubsArrayForCategory()}
                >
                  {applySubcatFilter(
                    FormValuesProps?.initsubcategories,
                    categoryId,
                  ).length > 0 ? (
                    <MenuItem value="-1">
                      {" "}
                      <em>None</em>{" "}
                    </MenuItem>
                  ) : (
                    <MenuItem value="-1">
                      {" "}
                      <em>None</em>{" "}
                    </MenuItem>
                  )}

                  {applySubcatFilter(
                    FormValuesProps?.initsubcategories,
                    categoryId,
                  ).map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>

              <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
                <InputLabel id="select-helper-labeltender">Tender</InputLabel>
                <Select
                  autoWidth
                  labelId="select-helper-labeltender"
                  id="select-helper-labeltenderid"
                  value={tenderId.toString() || "-1"}
                  label="Tender"
                  onChange={handleChangeTender}
                  disabled={emptyTendersArrayForSupplier()}
                >
                  {applySupplierTendersFilter(
                    FormValuesProps?.initsuppliers,
                    supplier?.toString() || "",
                  ).length > 0 ? (
                    <MenuItem value="-1">
                      {" "}
                      <em>None</em>{" "}
                    </MenuItem>
                  ) : (
                    <MenuItem value="-1">
                      {" "}
                      <em>None</em>{" "}
                    </MenuItem>
                  )}


                  {FormValuesProps?.initsuppliers &&
                    supplier?.toString() &&
                    applySupplierTendersFilter(
                      FormValuesProps.initsuppliers,
                      supplier.toString()
                    ).map((suppliertender) => (
                      <MenuItem
                        key={suppliertender.id}
                        value={suppliertender.id}
                        style={{ color: suppliertender.activestatusflag ? 'black' : 'red' }}
                      >
                        {suppliertender.tendercode}
                      </MenuItem>
                    ))}

                </Select>

              </FormControl>

              <FormControl
                variant="outlined"
                sx={{ mr: 1.5, width: "25ch", minWidth: "25ch" }}
                error={isBrandIdValid(selectedBrand?.id.toString() ?? "")}
              >
                <BrandsComboWithSearchAndAddNewDialog
                  defaultBrand={selectedBrand}
                  onBrandChange={handleChangeOfBrand}
                  sxgiven={{ ml: 0, mr: 0, mt: 0.5, minWidth: "25ch" }}
                />
                <FormHelperText sx={{ m: -0.5, pl: 3 }}>
                  {isBrandIdValid(selectedBrand?.id.toString() ?? "")
                    ? "Please select"
                    : ""}
                </FormHelperText>
              </FormControl>

              <FormControl
                sx={{ width: "15ch", minWidth: "15ch", m: 1 }}
                variant="outlined"
              >
                <InputLabel id="demo-multiple-checkbox-label">
                  Department
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={selectedDepartmentIds}
                  onChange={handleChangeOfDepartment}
                  input={<OutlinedInput label="Department" />}
                  renderValue={(selected) =>
                    (selected as number[])
                      .map((depid) => {
                        const department =
                          FormValuesProps?.initdepartments.find(
                            (option) => option.id === depid,
                          );
                        return department ? department.name : "";
                      })
                      .join(", ")
                  }
                  MenuProps={MenuProps}
                >
                  {FormValuesProps.initdepartments.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      <Checkbox
                        checked={selectedDepartmentIds?.some(
                          (departmentid) => departmentid === statusOption.id,
                        )}
                      />
                      <ListItemText primary={statusOption.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>



              <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
                <InputLabel>Default Location</InputLabel>
                <Select
                  onChange={handleChangeLOC}
                  defaultValue=""
                  value={location?.toString() || ""}
                  label="Default Location"
                  autoWidth
                >
                  {FormValuesProps?.initlocations?.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      [{location.room?.building?.building}] [
                      {location.room?.room}] {location.locname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
                <InputLabel>Storage Conditions</InputLabel>
                <Select
                  onChange={handleChangeSTC}
                  defaultValue=""
                  value={scond.toString() || ""}
                  label="Storage Conditions"
                  autoWidth
                >
                  {FormValuesProps.initstconds?.map((stcd) => (
                    <MenuItem key={stcd.id} value={stcd.id}>
                      {stcd.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
                <InputLabel>Default Supplier</InputLabel>
                <Select
                  onChange={handleChangeSUP}
                  defaultValue=""
                  value={supplier?.toString() || ""}
                  label="Default Supplier"
                  autoWidth
                >
                  {FormValuesProps.initsuppliers
                    ?.slice() // Creates a shallow copy to avoid mutating the original array
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sorts the array by the 'name' property
                    .map((stcd) => (
                      <MenuItem key={stcd.id} value={stcd.id}>
                        {stcd.name}
                      </MenuItem>
                    ))}

                  {/* {FormValuesProps.initsuppliers?.map((stcd) => (
                    <MenuItem key={stcd.id} value={stcd.id}>
                      {stcd.name}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>

              <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
                <InputLabel>Manufacturer</InputLabel>
                <Select
                  onChange={handleChangeMAN}
                  defaultValue=""
                  value={manufacturer?.toString() || ""}
                  label="Manufacturer"
                  autoWidth
                >
                  {FormValuesProps.initmanufacturers?.map((stcd) => (
                    <MenuItem key={stcd.id} value={stcd.id}>
                      {stcd.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider />

              <TextField
                fullWidth
                id="standard-number"
                label="General Notes"
                multiline
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={handleChangeOfFieldGenNotes}
                value={generalnotes}
                required
              />
            </div>
          </Box>
        </CardContent>
        <CardActions
          sx={{
            m: 2,
            p: 2,
          }}
        >
          <Box pb={0} sx={{ width: "100%" }}>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
            >
              {/* Buttons Without Confirmation*/}

              {formcalledby == "normal" && (

                <Grid item>
                  <Box component="span">
                    <Button
                      sx={{ mt: { xs: 2, md: 0 } }}
                      variant="contained"
                      onClick={() =>
                        navigate("/management/products/", { replace: true })
                      }
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>

              )}

              {formcalledby == "dialog" && (

                <Grid item>
                  <Box component="span">
                    <Button
                      sx={{ mt: { xs: 2, md: 0 } }}
                      variant="contained"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>

              )}


              <Grid item>
                <Box component="span">
                  <Button
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    color="success"
                    onClick={FormValidation}
                  >
                    Save
                  </Button>
                </Box>
              </Grid>


            </Grid>
          </Box>
        </CardActions>
      </Card>
    )
  );
};

export default EditProductForm;
