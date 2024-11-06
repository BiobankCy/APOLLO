import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import { Brandmodel } from "../../models/mymodels";
import { useEffect, useState } from "react";
import { addNewBrand, getAllBrands } from "../../services/user.service";
import { AxiosResponse } from "axios";

import { Alert, SxProps } from "@mui/material";
const filter = createFilterOptions<Brandmodel>();

interface MYPROPS {
  onBrandChange?: (newBrand?: Brandmodel) => void;
  sxgiven?: SxProps;
  defaultBrand?: Brandmodel;
}

export default function BrandsComboWithSearchAndAddNewDialog({
  onBrandChange,
  sxgiven,
  defaultBrand,
}: MYPROPS) {
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();
  const [value, setValue] = React.useState<Brandmodel | null>(null);
  const [open, toggleOpen] = React.useState(false);

  const [brands, setbrands] = React.useState<Brandmodel[]>([]);

  const [dialogValue, setDialogValue] = React.useState<Brandmodel>({
    name: "",
    descr: "",
    id: 0,
  });

  useEffect(() => {
    if (brands && brands.length > 0) {
      return;
    }
    getAllBrands().then(
      (response) => {
        if (response.status === 200) {
          setbrands(response.data);
        } else {
          setbrands([]);
        }
      },
      (error) => {
        setbrands([]);
      },
    );
  }, []);

  useEffect(() => {
    if (defaultBrand) {
      setValue(defaultBrand);
    }
  }, [defaultBrand]);


  const handleClose = () => {
    setDialogValue({
      name: "",
      descr: "",
      id: 0,
    });
    toggleOpen(false);
    setApiResponse(undefined);
  };

  const handleSubmitAddBrand = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();



    addNewBrand(dialogValue).then(
      (response) => {
        setApiResponse(response);

        if (response.status === 200) {
          try {
            setApiResponse(undefined);
            let newbrand: Brandmodel = response.data;
            handleClose();

            let newList = brands;

            newList.unshift(newbrand);
            setbrands(newList);
            newList = [];
            setValue(newbrand);

            if (onBrandChange) {
              onBrandChange(newbrand);
            }
          } catch (e) { }


        } else {
          setApiResponse(response);
        }
      },
      (error) => {
        setApiResponse(error);
      },
    );
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
                descr: "",
                id: 0,
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              descr: "",
              id: 0,
            });
          } else {
            setValue(newValue);
            // let curow = currentLine;
            // curow.lotid = newValue?.id ?? 0;
            // updateLineFn(curow);
            if (onBrandChange) {
              onBrandChange(newValue ?? undefined);
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (
            params.inputValue !== "" &&
            //Following line: custom addition 20-01-2023 to hide proposal for add new brand if given brand already exists in array
            !filtered.find((obj) => {
              return obj.name.toLowerCase === params.inputValue.toLowerCase;
            })
          ) {
            // console.log(params.inputValue,'inputvalue');
            filtered.push({
              inputValue: params.inputValue,
              name: `Add new  "${params.inputValue}"`,
              id: 0,

              descr: "",
            });
          }

          return filtered;
        }}
        id="brandscomboid"
        options={brands}
        getOptionLabel={(brand) => {
          // e.g value selected with enter, right from the input
          if (typeof brand === "string") {
            return brand;
          }
          if (brand.inputValue) {
            return brand.inputValue;
          }
          return brand.name;
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
            label="Choose Brand"
            variant="outlined"
            size={!sxgiven ? "small" : undefined}
          />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmitAddBrand} autoComplete="off">
          <DialogTitle>Add a new brand</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you forget to add a new brand before creating this record? No
              problem, you can add it now!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="brandname"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="Brand"
              type="text"
              variant="standard"
            />

            <TextField
              autoFocus
              margin="dense"
              id="descr"
              value={dialogValue.descr}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  descr: event.target.value,
                })
              }
              label="Description"
              type="text"
              variant="standard"
            />

            {apiResponse &&
              typeof apiResponse !== "undefined" &&
              !(apiResponse.status === 200) && (
                <Alert severity="error">
                  {" "}
                  Error! {apiResponse?.toString()}
                </Alert>
              )}
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
