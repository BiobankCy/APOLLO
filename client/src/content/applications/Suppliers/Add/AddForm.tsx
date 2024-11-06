import React, { FC, useEffect, useState } from "react";
import { addNewSupplier } from "src/services/user.service";
import ResponsiveInfoDialog, {
  DialogType,
} from "src/Components/Shared/ResponsiveInfoDialog";
import { FormEditSupplierValues } from "src/models/mymodels";
import { useNavigate } from "react-router-dom";
import {
  Switch,
  Divider,
  Box,
  Card,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { useAlert } from "src/contexts/AlertsContext";

interface MyProps {
  className?: string;
  FormValuesProps: FormEditSupplierValues;
}

const AddForm: FC<MyProps> = ({ FormValuesProps }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [dialogTitle, setdialogTitle] = React.useState("");
  const [dialogMessage, setdialogMessage] = React.useState("");
  const [dialogType, setdialogType] = React.useState<DialogType>("");
  const [openDialog, setOpenDialog] = useState(false);

  let newSupplierToSubmitFinal = FormValuesProps.initsupplier;



  const FormValidation = () => {


    // event.preventDefault();
    let validationresult: boolean = true;

    if (isCodeValid(code)) validationresult = false;
    if (isNameValid(name)) validationresult = false;
    if (isWebsiteValid(website)) validationresult = false;

    if (isCountryValid(country)) validationresult = false;
    if (isEmailWrong(email)) validationresult = false;
    if (isWorkNumberValid(worknumber)) validationresult = false;
    if (isFaxNumberValid(faxnumber)) validationresult = false;
    if (isAddressValid(address)) validationresult = false;

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
    addNewSupplier(newSupplierToSubmitFinal)
      .then((response) => {
        if (response.status === 200) {

          showAlert("Supplier Successfully Added!", "success");

          setTimeout(function () {
            navigate("/management/suppliers/", { replace: true });
          }, 1);
        } else {
          // Handle error case
          setdialogTitle("Add Error");
          setdialogType("Error");
          setdialogMessage(response.data);
          setOpenDialog(true);
        }
      })
      .catch((error) => {
        let errorMessage;
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || error.response.data;
        } else if (error.response && error.response.statusText) {
          errorMessage = error.response.statusText;
        } else {
          errorMessage = error.toString();
        }
        setdialogTitle("Add Error");
        setdialogType("Error");
        setdialogMessage(errorMessage);
        setOpenDialog(true);
      });
  };

  //Validation
  const isCodeValid = (value: string) => value.length <= 0 || value.length > 50;
  const isNameValid = (value: string) =>
    value.length <= 0 || value.length > 100;
  const isCountryValid = (value: string) =>
    value.length < 0 || value.length > 50;
  // const isEmailValid = (value: string) => value.length <= 0 || value.length > 50
  const emailRegex = /\S+@\S+\.\S+/;

  const isEmailWrong = (email: string) => {
    if (email.length === 0) {
      return false;
    }
    if (email.length > 50) {
      return true;
    }
    return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  };


  const isWorkNumberValid = (value: string) =>
    value.length < 0 || value.length > 50;
  const isWebsiteValid = (value: string) =>
    value.length < 0 || value.length > 50;
  const isFaxNumberValid = (value: string) =>
    value.length < 0 || value.length > 50;
  const isAddressValid = (value: string) =>
    value.length < 0 || value.length > 100;

  useEffect(() => {
    if (FormValuesProps.initsupplier) {
      setCode(FormValuesProps.initsupplier.code.toString());
      setName(FormValuesProps.initsupplier.name.toString());
      setAddress(FormValuesProps.initsupplier.address.toString());
      setEmail(FormValuesProps.initsupplier.email.toString());
      setWorkNumber(FormValuesProps.initsupplier.worknumber.toString());
      //setFaxNumber(FormValuesProps.initsupplier.faxnumber.toString());
      setCountry(FormValuesProps.initsupplier.country.toString());
      setWebsite(FormValuesProps.initsupplier.website.toString());
      setCheckedActiveStatusFlag(FormValuesProps.initsupplier.activestatusFlag);
      setGeneralnotes(FormValuesProps.initsupplier.generalNotes.toString());
    }
  }, [FormValuesProps.initsupplier]);

  // const theme = useTheme();
  const [code, setCode] = React.useState("");
  const handleChangeOfFieldCode = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCode(event.target.value);
    newSupplierToSubmitFinal.code = event.target.value;
  };

  const [name, setName] = React.useState("");
  const handleChangeOfFieldName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setName(event.target.value);
    newSupplierToSubmitFinal.name = event.target.value;
  };

  const [email, setEmail] = React.useState("");
  const handleChangeOfFieldEmail = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(event.target.value);
    newSupplierToSubmitFinal.email = event.target.value;
  };

  const [worknumber, setWorkNumber] = React.useState("");
  const handleChangeOfFieldWorkNumber = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setWorkNumber(event.target.value);
    newSupplierToSubmitFinal.worknumber = event.target.value;
  };
  const [address, setAddress] = React.useState("");
  const handleChangeOfFieldAddress = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAddress(event.target.value);
    newSupplierToSubmitFinal.address = event.target.value;
  };

  const [faxnumber, setFaxNumber] = React.useState("");
  //const handleChangeOfFieldFaxNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
  //    setFaxNumber(event.target.value);
  //    newSupplierToSubmitFinal.faxnumber = event.target.value;

  //};

  const [country, setCountry] = React.useState("");
  const handleChangeOfFieldCountry = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCountry(event.target.value);
    newSupplierToSubmitFinal.country = event.target.value;
  };

  const [website, setWebsite] = React.useState("");
  const handleChangeOfFieldWebsite = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setWebsite(event.target.value);
    newSupplierToSubmitFinal.website = event.target.value;
  };



  const [generalnotes, setGeneralnotes] = React.useState("");
  const handleChangeOfFieldGenNotes = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGeneralnotes(event.target.value);
    newSupplierToSubmitFinal.generalNotes = event.target.value;
  };

  const [checked, setCheckedActiveStatusFlag] = React.useState(false);
  const handleChangeActiveStatusFlag = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCheckedActiveStatusFlag(event.target.checked);
    newSupplierToSubmitFinal.activestatusFlag = event.target.checked;
  };
  const [excelattachmentinemailorderFlag, setExcelattachmentinemailorderFlag] =
    React.useState(false);
  const handleChangexcelattachmentinemailorderFlag = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setExcelattachmentinemailorderFlag(event.target.checked);
    newSupplierToSubmitFinal.excelattachmentinemailorderFlag =
      event.target.checked;
  };

  return (
    FormValuesProps.initsupplier && (
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
          title={"You are adding the supplier: ".concat(
            FormValuesProps.initsupplier?.name || "",
          )}
          subheader={"Product Code: ".concat(
            FormValuesProps.initsupplier?.code || "",
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
        <CardContent>
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
              "& .MuiTextField-root": { m: 1 /*, width: '25ch' */ },
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
                helperText={isCodeValid(code) ? "Code is not correct" : ""}
                inputProps={{ minLength: 1, maxLength: 50 }}
                id="code"
                label="Code"
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

              <TextField
                onChange={handleChangeOfFieldEmail}
                value={email}
                id="email"
                label="Email"
                error={isEmailWrong(email)}
                helperText={isEmailWrong(email) ? "Email is not correct" : ""}
                inputProps={{ minLength: 0, maxLength: 50 }}
              />
              <TextField
                onChange={handleChangeOfFieldWebsite}
                value={website}
                id="website"
                label="Website"
                error={isWebsiteValid(website)}
                helperText={
                  isCountryValid(website) ? "Website is not correct" : ""
                }
                inputProps={{ minLength: 0, maxLength: 50 }}
              />

              <TextField
                onChange={handleChangeOfFieldWorkNumber}
                value={worknumber}
                id="worknumber"
                label="Work Number"
                error={isWorkNumberValid(email)}
                helperText={
                  isWorkNumberValid(email) ? "Work Number is not correct" : ""
                }
                inputProps={{ minLength: 0, maxLength: 50 }}
              />


              <Divider />

              <TextField
                onChange={handleChangeOfFieldAddress}
                value={address}
                fullWidth
                id="address"
                label="Address"
                error={isAddressValid(address)}
                helperText={
                  isAddressValid(address) ? "Address is not correct" : ""
                }
                inputProps={{ minLength: 0, maxLength: 50 }}
              />

              <TextField
                onChange={handleChangeOfFieldCountry}
                value={country}
                id="country"
                label="Country"
                error={isCountryValid(country)}
                helperText={
                  isCountryValid(country) ? "Country is not correct" : ""
                }
                inputProps={{ minLength: 0, maxLength: 50 }}
              />

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

              <Divider />

              <Stack
                divider={<Divider orientation="vertical" flexItem />}
                sx={{ m: 1, p: 0, flexWrap: "wrap" }}
                spacing={1}
                justifyContent="space-evenly"
                alignItems="left"
                direction={{ xs: "column", sm: "column", md: "column" }}
              >
                <Typography>Status</Typography>
                <Switch
                  color="success"
                  checked={checked}
                  onChange={handleChangeActiveStatusFlag}
                  inputProps={{ "aria-label": "controlled" }}
                />

                <Typography>Attach Excel file to email order</Typography>
                <Switch
                  color="success"
                  checked={excelattachmentinemailorderFlag}
                  onChange={handleChangexcelattachmentinemailorderFlag}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Stack>
            </div>
          </Box>
        </CardContent>
        <CardActions>
          <Box pb={2} sx={{ width: "100%" }}>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
            >
              {/* Buttons Without Confirmation*/}
              <Grid item>
                <Box component="span">
                  <Button
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    onClick={() =>
                      navigate("/management/suppliers/", { replace: true })
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

export default AddForm;
