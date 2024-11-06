import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import {
  LotModel,
  lotnumbertransformation,
  LotOptionType,
  ReceivingLinesModel,
} from "../../models/mymodels";
import { useEffect, useState } from "react";
import {
  addNewLot,
} from "../../services/user.service";
import { AxiosResponse } from "axios";
import { parseISO, format } from "date-fns";

import { Alert, SxProps } from "@mui/material";
const filter = createFilterOptions<LotOptionType>();

interface MYPROPS {
  //  givenPOsupplierid: number;
  currentLine: ReceivingLinesModel;
  availablelots1: LotOptionType[];
  updateLineFn: Function;
  // refreshLotsFunction: (newType: LotOptionType | null) => void;
  refreshLotsFunction: any;
  onTenderIDchange?: (newType: LotOptionType | null) => void;
  sxgiven?: SxProps;
  defaultvalue?: LotOptionType | null;
}

export default function LotsComboWithSearchAndAddNewDialog({
  currentLine,
  availablelots1,
  refreshLotsFunction,
  onTenderIDchange,
  updateLineFn,
  sxgiven,
  defaultvalue,
}: MYPROPS) {
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();
  const [value, setValue] = React.useState<LotOptionType | null>(null);
  const [open, toggleOpen] = React.useState(false);
  //   const [availableTenders, setavailableTenders] = React.useState<LotOptionType[]>([]);

  const [dialogValue, setDialogValue] = React.useState<LotModel>({
    lotnumber: "",
    expdate: null,
    id: 0,
  });

  useEffect(() => {
    if (defaultvalue) {
      setValue(defaultvalue);
    }
  }, [defaultvalue]);


  const handleClose = () => {
    setDialogValue({
      lotnumber: "",
      expdate: null,
      id: 0,
    });
    toggleOpen(false);
    setApiResponse(undefined);
  };

  const handleSubmitAddLot = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    if (dialogValue.expdate) {
      const dt: any = format(
        parseISO(dialogValue.expdate.toISOString()),
        "yyyy-MM-dd",
      );
      dialogValue.expdate = dt;
    }

    addNewLot(dialogValue).then(
      (response) => {
        setApiResponse(response);

        if (response.status === 200) {
          try {
            setApiResponse(undefined);

            handleClose();

            let newList = availablelots1;

            newList.unshift(response.data);
            refreshLotsFunction(newList);
            newList = [];
            setValue(response.data);
            let curow = currentLine;
            curow.lotid = response.data.id ?? 0;
            updateLineFn(curow);
            if (onTenderIDchange) {
              onTenderIDchange(response.data);
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

  function handleChangeOfFieldLotExpDate(
    value: Date | null | undefined,
    keyboardInputValue?: string | undefined,
  ): void {
    setDialogValue({
      ...dialogValue,
      expdate: value ?? null,
    });
    console.log(value?.toDateString() ?? "");
  }

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
                lotnumber: newValue,
                expdate: null,
                id: 0,
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              lotnumber: newValue.inputValue,
              expdate: null,
              id: 0,
            });
          } else {
            setValue(newValue);
            let curow = currentLine;
            curow.lotid = newValue?.id ?? 0;
            updateLineFn(curow);
            if (onTenderIDchange) {
              onTenderIDchange(newValue);
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (
            params.inputValue !== "" &&
            //Following line: custom addition  20-01-2023 to hide proposal for add new lot if given lot already exists in array
            !filtered.find((obj) => {
              return (
                obj.lotnumber.toLowerCase === params.inputValue.toLowerCase
              );
            })
          ) {
            // console.log(params.inputValue,'inputvalue');
            filtered.push({
              inputValue: params.inputValue,
              lotnumber: `Add new lot  "${params.inputValue}"`,
              id: 0,

              expdate: null,
            });
          }

          return filtered;
        }}
        id="lotcomboid"
        options={availablelots1}
        getOptionLabel={(lot) => {
          // e.g value selected with enter, right from the input
          if (typeof lot === "string") {
            return lot;
          }
          if (lot.inputValue) {
            return lot.inputValue;
          }
          return lotnumbertransformation(lot);
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>{lotnumbertransformation(option)}</li>
        )}
        // sx={{ width: { sm: 100, md: 200 } }}
        sx={sxgiven ? sxgiven : { width: { sm: 100, md: 200 } }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose Lot"
            variant="outlined"
            size={!sxgiven ? "small" : undefined}
          />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmitAddLot} autoComplete="off">
          <DialogTitle>Add a new Lot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you forget to add a new lot before creating this record? No
              problem, you can add it now!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.lotnumber}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  lotnumber: event.target.value,
                })
              }
              label="Lot Number Code"
              type="text"
              variant="standard"
            />

            <DesktopDatePicker
              label="Lot Expdate"
              inputFormat="dd/MM/yyyy"
              value={dialogValue?.expdate}
              maxDate={undefined}
              //onChange={handleChangeOfPOdate}
              onChange={handleChangeOfFieldLotExpDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                //error={validateDates}
                // helperText={validateDates ? "PO Date can't be after Due Date" : ""}
                />
              )}
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
