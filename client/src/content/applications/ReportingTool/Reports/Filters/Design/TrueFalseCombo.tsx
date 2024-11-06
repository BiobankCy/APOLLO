import React from "react";

import {
  TrueFalseModel 
} from "../../../../../../models/mymodels";
 

import {
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { FilterChangeType, ReportFilterModel } from "../../Models/AllInterfaces";

interface DropdownLocationFilterProps {
  filter: ReportFilterModel;
  onChange: FilterChangeType;
}

const DropdownTrueFalseFilter: React.FC<DropdownLocationFilterProps> = ({
  filter,
  onChange,
}) => {
  

  return (
    <FormControl style={{ margin: "8px", minWidth: 200 }}>
      {/*  <InputLabel>{filter.name}</InputLabel>*/}
      <Select
        value={filter.value?.toString() ?? ""}
        onChange={(e) => onChange(filter.name, e.target.value as string)}
        displayEmpty
      >
        <MenuItem value="">
          <em>Select an option</em>
        </MenuItem>
       
        {filter.options?.map((option) => {
          const locationOption = option as TrueFalseModel;
        
          return (
            <MenuItem
              key={locationOption.id}
              value={locationOption.id.toString()}
            >
             {locationOption.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default DropdownTrueFalseFilter;
