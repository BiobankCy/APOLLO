import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import {
  LocationModel,
  ReceivingLinesModel,
} from "../../models/mymodels";
import { useState } from "react";
import { addNewLocation } from "../../services/user.service";
import { AxiosResponse } from "axios";
import { Alert } from "@mui/material";
const filter = createFilterOptions<LocationModel>();

interface MYPROPS {
  //  givenPOsupplierid: number;
  currentLine: ReceivingLinesModel;
  availablelocs1: LocationModel[];
  updateLineFn: Function;
}

export default function LocsComboWithSearchAndAddNewDialog({
  currentLine,
  availablelocs1,
  updateLineFn,
}: MYPROPS) {
  const [apiResponse, setApiResponse] = useState<AxiosResponse>();
  const [value, setValue] = React.useState<LocationModel | null>(
    availablelocs1?.find((item) => item.id === currentLine.receivinglocId) ??
    null,
  );
  const [open, toggleOpen] = React.useState(false);
  //   const [availableTenders, setavailableTenders] = React.useState<LotOptionType[]>([]);

  const [dialogValue, setDialogValue] = React.useState<LocationModel>({
    id: 0,
    locname: "",
    roomid: 0,
    loctypeid: 0,
    descr: "",
    activestatusFlag: true,
  });


  const handleClose = () => {
    setDialogValue({
      id: 0,
      locname: "",
      roomid: 0,
      loctypeid: 0,
      descr: "",
      activestatusFlag: true,
    });
    toggleOpen(false);
    setApiResponse(undefined);
  };

  const handleSubmitAddLoc = (event: React.FormEvent<HTMLFormElement>) => {
    setApiResponse(undefined);
    event.preventDefault();

    addNewLocation(dialogValue).then(
      (response) => {
        setApiResponse(response);

        if (response.status === 200) {
          setApiResponse(undefined);

          handleClose();

          let newList = availablelocs1;

          newList.unshift(response.data);
          //refreshLotsFunction(newList);
          newList = [];
          setValue(response.data);
          let curow = currentLine;
          curow.receivinglocId = response.data.id ?? 0;
          updateLineFn(curow);

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
                id: 0,
                locname: newValue,
                roomid: 0,
                loctypeid: 0,
                descr: "",
                activestatusFlag: true,
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              id: 0,
              locname: newValue.inputValue,
              roomid: 0,
              loctypeid: 0,
              descr: "",
              activestatusFlag: true,
            });
          } else {
            setValue(newValue);
            let curow = currentLine;
            curow.receivinglocId = newValue?.id ?? 0;
            updateLineFn(curow);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          return filtered;
        }}
        id="locationcomboid"
        options={availablelocs1}
        getOptionLabel={(location) => {
          // e.g value selected with enter, right from the input
          if (typeof location === "string") {
            return location;
          }
          if (location.inputValue) {
            return location.inputValue;
          }
          return location.locname;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>
            {option.locname} (
            {option.room?.building?.building
              ? option.room.building.building
              : ""}
            :{option.room?.room ? option.room.room : ""})
          </li>
        )}
        sx={{ width: { sm: 100, md: 200 } }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Rec. Location"
            variant="outlined"
            size="small"
          />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmitAddLoc} autoComplete="off">
          <DialogTitle>Add a new Location</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you forget to add a new location before creating this
              Receiving? No problem, you can add it now!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.locname}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  locname: event.target.value,
                })
              }
              label="Location Name"
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