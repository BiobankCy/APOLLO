import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import { SupplierModel } from "../../models/mymodels";
import { useEffect, useState } from "react";
import { addNewSupplier, getAllSuppliers } from "../../services/user.service";
import { AxiosError, AxiosResponse } from "axios";

import { Alert, Divider, SxProps } from "@mui/material";
const filter = createFilterOptions<SupplierModel>();

interface MYPROPS {

  onsupplierChange?: (newSupplier?: SupplierModel) => void;
  sxgiven?: SxProps;
  defaultSupplier?: SupplierModel;
}

export default function SuppliersComboWithSearchAndAddNewDialog({
  onsupplierChange,
  sxgiven,
  defaultSupplier,
}: MYPROPS) {
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();
  const [value, setValue] = React.useState<SupplierModel | null>(null);
  const [open, toggleOpen] = React.useState(false);
  //   const [availableTenders, setavailableTenders] = React.useState<LotOptionType[]>([]);

  const [suppliers, setSuppliers] = React.useState<SupplierModel[]>([]);

  const [dialogValue, setDialogValue] = React.useState<SupplierModel>({
    name: "",
    code: "",
    id: 0,
    email: "",
    worknumber: "",
    address: "",
    country: "",
    website: "",
    generalNotes: "",
    createdDate: new Date(),
    excelattachmentinemailorderFlag: false,
    activestatusFlag: true,
    contactsofsuppliers: [],
  });

  useEffect(() => {
    if (suppliers && suppliers.length > 0) {
      return;
    }
    getAllSuppliers().then(
      (response) => {
        if (response.status === 200) {
          setSuppliers(response.data);
        } else {
          setSuppliers([]);
        }
      },
      (error) => {
        setSuppliers([]);
      },
    );
  }, []);

  useEffect(() => {
    if (defaultSupplier) {
      setValue(defaultSupplier);
    }
  }, [defaultSupplier]);


  const handleClose = () => {
    setDialogValue({
      name: "",
      code: "",
      id: 0,
      email: "",
      worknumber: "",
      address: "",
      country: "",
      website: "",
      generalNotes: "",
      createdDate: new Date(),
      excelattachmentinemailorderFlag: false,
      activestatusFlag: true,
      contactsofsuppliers: [],
    });

    toggleOpen(false);
    setApiResponse(undefined);
  };

  const handleSubmitAddSupplier = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();
    event.stopPropagation();


    addNewSupplier(dialogValue)
      .then((response) => {
        setApiResponse(response);

        if (response.status === 200) {
          setApiResponse(undefined);
          const newSupplier: SupplierModel = response.data;
          handleClose();

          setSuppliers((prevSuppliers) => [newSupplier, ...prevSuppliers]);
          setValue(newSupplier);

          if (onsupplierChange) {
            onsupplierChange(newSupplier);
          }
        } else {
          setApiResponse(response);
        }
      })
      .catch((error) => {
        setApiResponse(error);
      });
  };

  const isAxiosError = (
    response: AxiosResponse<any, any> | AxiosError<any, any>,
  ): response is AxiosError<any, any> => {
    return (response as AxiosError<any, any>).isAxiosError !== undefined;
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                name: newValue,
                code: "",
                id: 0,
                email: "",
                worknumber: "",
                address: "",
                country: "",
                website: "",
                generalNotes: "",
                createdDate: new Date(),
                excelattachmentinemailorderFlag: false,
                activestatusFlag: true,
                contactsofsuppliers: [],
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              code: "",
              id: 0,
              email: "",
              worknumber: "",
              address: "",
              country: "",
              website: "",
              generalNotes: "",
              createdDate: new Date(),
              excelattachmentinemailorderFlag: false,
              activestatusFlag: true,
              contactsofsuppliers: [],
            });
          } else {
            setValue(newValue);
            // let curow = currentLine;
            // curow.lotid = newValue?.id ?? 0;
            // updateLineFn(curow);
            if (onsupplierChange) {
              onsupplierChange(newValue ?? undefined);
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (
            params.inputValue !== "" &&
            //Following line: custom addition 20-01-2023 to hide proposal for add new supplier if given supplier already exists in array
            !filtered.find((obj) => {
              return obj.name.toLowerCase === params.inputValue.toLowerCase;
            })
          ) {
            // console.log(params.inputValue,'inputvalue');
            filtered.push({
              inputValue: params.inputValue,
              name: `Add new  "${params.inputValue}"`,
              code: "",
              id: 0,
              email: "",
              worknumber: "",
              address: "",
              country: "",
              website: "",
              generalNotes: "",
              createdDate: new Date(),
              excelattachmentinemailorderFlag: false,
              activestatusFlag: true,
              contactsofsuppliers: [],
            });
          }

          return filtered;
        }}
        id="brandscomboid"
        options={suppliers}
        getOptionLabel={(supplier) => {
          // e.g value selected with enter, right from the input
          if (typeof supplier === "string") {
            return supplier;
          }
          if (supplier.inputValue) {
            return supplier.inputValue;
          }
          return supplier.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        // sx={{ width: { sm: 100, md: 200 } }}
        sx={sxgiven ? sxgiven : { width: { sm: 100, md: 200 } }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose Supplier"
            variant="outlined"
            size={!sxgiven ? "small" : undefined}
          />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmitAddSupplier} autoComplete="off">
          <DialogTitle>Add a new supplier</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you forget to add a new supplier before creating this record?
              No problem, you can add it now!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="suppliername"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="Supplier Name"
              type="text"
              variant="standard"
            />

            <TextField
              autoFocus
              margin="dense"
              id="Code"
              value={dialogValue.code}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  code: event.target.value,
                })
              }
              label="Supplier Code"
              type="text"
              variant="standard"
            />

            <Divider />
            {apiResponse && isAxiosError(apiResponse) && (
              <Alert severity="error">
                Error! {apiResponse.response?.data}
              </Alert>
            )}

            {/*{apiResponse && typeof apiResponse !== 'undefined' && !(apiResponse.status === 200) && (<Alert severity="error"> Error! {apiResponse?.toString()}</Alert>)}*/}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
