import React, { FC, useEffect, useState } from "react";
import { addNewProduct } from "src/services/user.service";
import ResponsiveInfoDialog, {
  DialogType,
} from "src/Components/Shared/ResponsiveInfoDialog";
import {
  Brandmodel,
  DepartmentModel,
  FormEditProductValues,
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
}
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const AddProductForm: FC<MyProps> = ({ FormValuesProps }) => {
  const navigate = useNavigate();
  const [dialogTitle, setdialogTitle] = React.useState("");
  const [dialogMessage, setdialogMessage] = React.useState("");
  const [dialogType, setdialogType] = React.useState<DialogType>("");
  const [openDialog, setOpenDialog] = useState(false);
  const { showAlert } = useAlert();

  let productToSubmitFinal = FormValuesProps.initproduct;
  // productToSubmitFinal.departments= [];
  //const [selectedDepartmentIds, setSelectedDepartmentIds] = React.useState<DepartmentModel[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>([]);


  const FormValidation = () => {


    let validationresult: boolean = true;

    if (isCodeValid(code)) validationresult = false;
    if (isNameValid(name)) validationresult = false;

    if (
      costprice === "" ||
      (typeof costprice === "number" &&
        (costprice < 0 || costprice > 100000 || isNaN(costprice)))
    )
      validationresult = false;

    if (isminstockqtyValid(minstockqty)) validationresult = false;

    if (isCategoryIdValid(categoryId.toString())) validationresult = false;
    if (isBrandIdValid(selectedBrand?.id.toString() ?? ""))
      validationresult = false;
    if (isSupplierIdValid(supplier.toString())) validationresult = false;
    if (isManufacturerValid(manufacturer.toString())) validationresult = false;
    if (isLocationIdValid(location.toString())) validationresult = false;
    if (isStorCondIdValid(scond.toString())) validationresult = false;
    if (isVatRateIdValid(vrate.toString())) validationresult = false;

    if (validationresult) {
      onSubmit1();

    } else {
      setdialogTitle("Form Validation Failed");
      setdialogType("Error");
      setdialogMessage("Please correct the form fields and try again!");
      setOpenDialog(true);

    }
  };

  const onSubmit1 = () => {



    addNewProduct(productToSubmitFinal).then(
      (response) => {
        if (response.status === 200) {
          showAlert("Product Successfully Added!", "success");
          setTimeout(function () {
            navigate("/management/products/", { replace: true });
          }, 1);

        } else {
          //  console.log(response.data);

          setdialogTitle("Error: Unable to Add Product");
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

        // setdialogTitle("Product Add Error");
        setdialogTitle("Error: Unable to Add Product");

        setdialogType("Error");
        // setdialogMessage(
        //   `Error: Status ${error.response?.status ?? "Unknown"} - ${error.response?.data ?? error.message ?? "Unknown"}`,
        // );
        setdialogMessage(
          `${error.response?.data ?? error.message ?? "Unknown"}`,
        );
        setOpenDialog(true);
      },
    );
  };


  const isCodeValid = (value: string) => value.length <= 0 || value.length > 50;
  const isNameValid = (value: string) =>
    value.length <= 0 || value.length > 100;


  const isCostPriceValid = (value?: number) =>
    value === undefined || value < 0 || value > 100000 || isNaN(value);

  const isminstockqtyValid = (value: number) => value < 0 || value > 1000;
  const ispunitsqtyValid = (value: number) => value < 1 || value > 1000;
  const isCategoryIdValid = (value: string) => Number(value) <= 0;
  const isBrandIdValid = (value: string) => Number(value) <= 0;
  const isSupplierIdValid = (value: string) => Number(value) <= 0;
  const isManufacturerValid = (value: string) => Number(value) <= 0;
  const isLocationIdValid = (value: string) => Number(value) <= 0;
  const isStorCondIdValid = (value: string) => Number(value) <= 0;
  const isVatRateIdValid = (value: string) => Number(value) <= 0;

  useEffect(() => {

    FormValuesProps.initproduct &&
      setCheckedActiveStatusFlag(FormValuesProps.initproduct.activestatusFlag);





    FormValuesProps.initproduct &&
      setCode(FormValuesProps.initproduct.code.toString());
    FormValuesProps.initproduct &&
      setName(FormValuesProps.initproduct.name.toString());
    FormValuesProps.initproduct &&
      setBarcode(FormValuesProps.initproduct.barcode.toString());
    FormValuesProps.initproduct &&
      setGeneralnotes(FormValuesProps.initproduct.generalNotes.toString());
    FormValuesProps.initproduct &&
      setconcentration(FormValuesProps.initproduct.concentration.toString());
    FormValuesProps.initproduct &&
      setminstockqty(FormValuesProps.initproduct.minstockqty);
    FormValuesProps.initproduct &&
      setpunits(FormValuesProps.initproduct.punits);
    FormValuesProps.initproduct && setCostPrice("");
    FormValuesProps.initproduct &&
      setCheckedlabmade(FormValuesProps.initproduct.labMadeFlag);

    FormValuesProps.initproduct &&
      setcheckedformultiplelocs(
        FormValuesProps.initproduct.multipleLocationsFlag,
      );
    FormValuesProps.initproduct &&
      setcheckedexpdate(FormValuesProps.initproduct.expdateFlag);
    FormValuesProps.initproduct &&
      setcheckedforsequencing(FormValuesProps.initproduct.forsequencingFlag);
  }, [FormValuesProps.initproduct]);



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

  const [barcode, setBarcode] = React.useState("");
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
  const [concentration, setconcentration] = React.useState("");
  const handleChangeOfFieldconcentration = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setconcentration(event.target.value);
    productToSubmitFinal.concentration = event.target.value;
  };
  const [minstockqty, setminstockqty] = React.useState(-1);
  const handleChangeOfFieldMinStockQty = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Math.max(0, Math.min(1000, Number(event.target.value)));
    setminstockqty(Number(value));
    productToSubmitFinal.minstockqty = Number(value);
  };

  const [punits, setpunits] = React.useState("");
  const handleChangeOfFieldpunits = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setpunits(event.target.value);
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

  const [checkedexpdate, setcheckedexpdate] = React.useState(false);
  const handleChangeExpDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setcheckedexpdate(event.target.checked);
    productToSubmitFinal.expdateFlag = event.target.checked;
  };







  const [checkedforsequencing, setcheckedforsequencing] = React.useState(false);
  const handleChangeForSequencing = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setcheckedforsequencing(event.target.checked);
    productToSubmitFinal.forsequencingFlag = event.target.checked;
  };

  const [checkedformultiplelocs, setcheckedformultiplelocs] =
    React.useState(false);
  const handleChangemultiplelocs = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setcheckedformultiplelocs(event.target.checked);
    productToSubmitFinal.multipleLocationsFlag = event.target.checked;
  };
  const [categoryId, setCategoryId] = React.useState<string | number>("");
  const handleChange = (event: SelectChangeEvent) => {
    setCategoryId(Number(event.target.value));
    productToSubmitFinal.categoryId = Number(event.target.value);
    setsubCategoryId("-1");
    productToSubmitFinal.subcategoryId = null;
  };
  const [tenderId, setTenderId] = React.useState<string | number>("");

  const [subcategoryId, setsubCategoryId] = React.useState<string | number>("");
  const handleChangesubcat = (event: SelectChangeEvent) => {
    productToSubmitFinal.subcategoryId = Number(event.target.value);
    if (productToSubmitFinal.subcategoryId <= 0) {
      productToSubmitFinal.subcategoryId = null;
    }
    setsubCategoryId(Number(event.target.value));
  };

  const handleChangeTender = (event: SelectChangeEvent) => {

    if (event.target.value != null && event.target.value !== "-1") {
      setTenderId(Number(event.target.value));
      productToSubmitFinal.tenderId = Number(event.target.value);
    } else {
      setTenderId("-1");
      productToSubmitFinal.tenderId = null;
    }
  };

  const [selectedBrand, setselectedBrand] = useState<Brandmodel>();


  const handleChangeOfBrand = (newvalue?: Brandmodel) => {
    if (newvalue) {

      setselectedBrand(newvalue);
      productToSubmitFinal.brandId = Number(newvalue?.id);
    } else {

      setselectedBrand(undefined);
      productToSubmitFinal.brandId = Number(0);
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





  const [scond, setStConds] = React.useState<string | number>("");
  const handleChangeSTC = (event: SelectChangeEvent) => {
    setStConds(Number(event.target.value));
    productToSubmitFinal.storageConditionId = Number(event.target.value);
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
        .filter(tender => tender !== undefined && tender.activestatusflag) as TenderModel[];
    }

    // If tendersuppliersassigneds does not exist, return an empty array
    return [];
  };




  const applySubcatFilter = (
    subcatList: SubCategoryModel[],
    catid: number | string,
  ): SubCategoryModel[] => {
    let results = subcatList.filter(
      (x) => x.catid.toString() == catid.toString(),
    );
    if (results.length <= 0) {

    } else {


    }
    return results;
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
          title={"You are adding the product: ".concat(
            FormValuesProps.initproduct?.name || "",
          )}
          subheader={"Product Code: ".concat(
            FormValuesProps.initproduct?.code || "",
          )}
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
              "& .MuiTextField-root": { m: 1 },
              width: "100%",
              maxWidth: "100%",
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                sx={{ m: 1, width: "35ch", minWidth: "35ch" }}
                onChange={handleChangeOfFieldCode}
                value={code}
                required
                error={isCodeValid(code)}
                helperText={
                  isCodeValid(code) ? "Product Code is not correct" : ""
                }
                inputProps={{ minLength: 1, maxLength: 50 }}
                id="code"
                label="Product Code"
              />

              <FormControl
                variant="outlined"
                sx={{ m: 1, minWidth: "10ch", maxWidth: "15ch" }}
              >
                <InputLabel>VAT</InputLabel>
                <Select
                  error={isVatRateIdValid(vrate.toString())}
                  onChange={handleChangeVR}
                  defaultValue=""
                  value={vrate?.toString() || ""}
                  label="VAT"
                  autoWidth
                >
                  {FormValuesProps?.initvatates?.map((vr) => (
                    <MenuItem key={vr.id} value={vr.id}>
                      {vr.rate}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {isVatRateIdValid(vrate.toString()) ? "Please select" : ""}
                </FormHelperText>
              </FormControl>

              <FormControl
                sx={{ m: 1, minWidth: "10ch", maxWidth: "15ch" }}
                variant="outlined"
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
                label="Minimum Stock"
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

              {/* <TextField
                disabled
                hidden
                id="datetime-local"
                label="Created Date"
                type="datetime-local"
                defaultValue={FormValuesProps.initproduct.createdDate}
                sx={{ width: 200 }}
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}

              <TextField
                disabled
                id="datetime-local"
                label="Created Date"
                type="datetime-local"
                defaultValue={FormValuesProps.initproduct.createdDate}
                sx={{ width: 200, display: 'none' }}  // This will hide the element completely
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
                  error={isCategoryIdValid(categoryId.toString())}
                  onChange={handleChange}
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
                <FormHelperText>
                  {isCategoryIdValid(categoryId.toString())
                    ? "Please select"
                    : ""}
                </FormHelperText>
              </FormControl>

              <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
                <InputLabel id="select-helper-labelsubcat">
                  Subcategory
                </InputLabel>
                <Select
                  defaultValue="-1"
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
                      supplier.toString(),
                    ).map((suppliertender) => (
                      <MenuItem
                        key={suppliertender.id}
                        value={suppliertender.id}
                      >
                        {suppliertender.tendercode}
                      </MenuItem>
                    ))}
                </Select>

              </FormControl>



              <FormControl
                variant="outlined"
                sx={{ mr: 2, width: "25ch", minWidth: "25ch" }}
                error={isBrandIdValid(selectedBrand?.id.toString() ?? "")}
              >
                <BrandsComboWithSearchAndAddNewDialog
                  defaultBrand={selectedBrand}
                  onBrandChange={handleChangeOfBrand}
                  sxgiven={{ m: 0, minWidth: "25ch" }}
                />
                <FormHelperText sx={{ m: -0.5, pl: 3 }}>
                  {isBrandIdValid(selectedBrand?.id.toString() ?? "")
                    ? "Please select"
                    : ""}
                </FormHelperText>
              </FormControl>



              <FormControl variant="outlined" sx={{ m: 1, minWidth: "25ch" }}>
                <InputLabel>Default Location</InputLabel>
                <Select
                  error={isLocationIdValid(location.toString())}
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
                <FormHelperText>
                  {isLocationIdValid(location.toString())
                    ? "Please select"
                    : ""}
                </FormHelperText>
              </FormControl>

              <FormControl variant="outlined" sx={{ m: 1, minWidth: "20ch" }}>
                <InputLabel>Storage Conditions</InputLabel>
                <Select
                  error={isStorCondIdValid(scond.toString())}
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
                <FormHelperText>
                  {isStorCondIdValid(scond.toString()) ? "Please select" : ""}
                </FormHelperText>
              </FormControl>

              <FormControl variant="outlined" sx={{ m: 1, minWidth: "20ch" }}>
                <InputLabel>Default Supplier</InputLabel>
                <Select
                  error={isSupplierIdValid(supplier.toString())}
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
                <FormHelperText>
                  {isSupplierIdValid(supplier.toString())
                    ? "Please select"
                    : ""}
                </FormHelperText>
              </FormControl>

              <FormControl variant="outlined" sx={{ m: 1, minWidth: "20ch" }}>
                <InputLabel>Manufacturer</InputLabel>
                <Select
                  error={isManufacturerValid(manufacturer.toString())}
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
                <FormHelperText>
                  {isManufacturerValid(manufacturer.toString())
                    ? "Please select"
                    : ""}
                </FormHelperText>
              </FormControl>
              <FormControl
                sx={{ width: "15ch", minWidth: "15ch", m: 1 }}
                variant="outlined"
              >
                <InputLabel id="demo-multiple-checkbox-label">
                  Department(s)
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
              { }
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
              <Grid item>
                <Box component="span">
                  <Button
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    color="success"
                    onClick={FormValidation}
                  >
                    Add
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



export default AddProductForm;
