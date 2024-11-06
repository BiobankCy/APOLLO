import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FilterChangeType, ReportFilterModel } from "../../Models/AllInterfaces";
import {   LocationModel,
  LocBuildingModel,
  LocRoomModel, } from "../../../../../../models/mymodels";
 
import Checkbox from '@mui/material/Checkbox';
 
 
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Search } from "@mui/icons-material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface DropdownProductFilterProps {
  filter: ReportFilterModel;
  onChange: FilterChangeType;
}

const DropdownFilter: React.FC<DropdownProductFilterProps> = ({
  filter,
  onChange,
}) => {
  const handleChange = (
    _: React.ChangeEvent<{}> | null,
    selectedProducts: LocationModel[] | null
  ) => {
    if (selectedProducts) {
      const selectedIds = selectedProducts.map((product) => Number(product.id));
      onChange(filter.name, selectedIds);
    } else {
       onChange(filter.name, []);
    }
  };

  return (
    <Autocomplete 
    style={{ margin: "8px", minWidth: 300,  maxWidth:600 }}
      multiple
      disableCloseOnSelect
      limitTags={2}
      id="filter-autocomplete"
      options={filter.options as LocationModel[]}
      getOptionLabel={(option) => `${option.room?.building} - ${option.room?.room} - ${option.locname}`}
      value={(filter.options as LocationModel[])?.filter(
        (option) => (filter.value as number[])?.includes(Number(option.id))
      )}
      onChange={handleChange}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
         {`${option.room?.building} - ${option.room?.room} - ${option.locname}`}
        </li>
      )}

      renderInput={(params) => (
        <TextField
          {...params}
          label="Select an option(s)"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            // startAdornment: (
            //   <>
            //     <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            //     {params.InputProps.startAdornment}
            //   </>
            // ),
          }}
        />
      )}
    />
  );
};

export default DropdownFilter;
