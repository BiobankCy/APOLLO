import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { TenderModel } from "../../models/mymodels";
import { useEffect } from "react";
import {
  getTendersForSupplier,
} from "../../services/user.service";
import TenderDialog from "src/content/applications/Tenders/TenderAddEditDialog";

const filter = createFilterOptions<TenderModel>();

interface MYPROPS {
  givenPOsupplierid: number;
  onTenderIDchange?: (newType: TenderModel | null) => void;
}

export default function TenderComboWithSearchAndAddNewDialog({
  givenPOsupplierid,
  onTenderIDchange,
}: MYPROPS) {
  const [tendervalue, setTendervalue] = React.useState<TenderModel | null>(null);
  const [open, toggleOpen] = React.useState(false);
  const [availableTenders, setavailableTenders] = React.useState<TenderModel[]>(
    [],
  );
  const [dialogValue, setDialogValue] = React.useState({
    tendercode: "",
    totalamount: 0,
    notes: "",
  });

  useEffect(() => {
    if (availableTenders && availableTenders.length > 0) {
    } else {
      getTendersForSupplier(givenPOsupplierid).then(
        (response) => {
          if (response.status === 200) {
            const tempTenders: TenderModel[] = response.data;
            if (tempTenders && tempTenders.length > 0) {
              setavailableTenders(response.data);
            }
          } else {
            setavailableTenders([]);
          }
        },
        (error) => {
          setavailableTenders([]);
        },
      );
    }
  }, [availableTenders]);



  const aftercreation = (newTender: TenderModel) => {
    setavailableTenders([]);

    setTendervalue(newTender);
    onTenderIDchange?.(newTender);
  }


  const handleClose = () => {



    setDialogValue({
      tendercode: "",
      totalamount: 0,
      notes: "",
    });
    toggleOpen(false);
  };


  return (
    <React.Fragment>
      <Autocomplete
        value={tendervalue}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                tendercode: newValue,
                totalamount: 0,
                notes: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              tendercode: newValue.inputValue,
              totalamount: 0,
              notes: "",
            });
          } else {
            setTendervalue(newValue);
            onTenderIDchange?.(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (
            params.inputValue !== "" &&
            //Following line: custom addition  20-01-2023 to hide proposal for add new tender if written tender already exists in array
            !filtered.find((obj) => {
              return (
                obj.tendercode.toLowerCase === params.inputValue.toLowerCase
              );
            })
          ) {
            filtered.push({
              inputValue: params.inputValue,
              tendercode: `Add new tender  "${params.inputValue}"`,
              id: 0,
              tendersuppliersassigneds: [],
              createdbyempid: 0,
              createddate: new Date(),
              generalNotes: "",
              activestatusflag: false,
            });
          }

          return filtered;
        }}
        id="tendercomboid"
        options={availableTenders}
        getOptionLabel={(tender) => {
          // e.g value selected with enter, right from the input
          if (typeof tender === "string") {
            return tender;
          }
          if (tender.inputValue) {
            return tender.inputValue;
          }
          return tender.tendercode;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>
            {option.tendercode} (Amount:
            {option.totalamount ? option.totalamount : " ?"})
          </li>
        )}
        sx={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Active Tenders" variant="outlined" focused />
        )}
      />


      <TenderDialog
        open={open}
        onClose={handleClose}
        //tender={selectedTenderForEdit}
        addNewTenderInState={aftercreation}

      />

    </React.Fragment>
  );
}

