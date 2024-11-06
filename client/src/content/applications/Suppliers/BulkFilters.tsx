import { useState, FC } from "react";
import React from "react";
import {
  IconButton,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
  Paper,
  InputBase,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import FilterAltOff from "@mui/icons-material/FilterAltOff";


export interface Filters {
  supplierstatus?: boolean | null;

  itemsupid?: number | null;

  itemtextgiven?: string | null;
}

export interface ComboOptions {
  id: number;
  name: string;
}

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `,
);
const isFilterSet = (filts: Filters): boolean => {
  let showbutton = false;
  try {
    Object.entries(filts).forEach(([, value]) => {
      //console.log(`${key}: ${value}`);
      if (value != null) {
        showbutton = true;
      }
    });
  } catch (error) {
    showbutton = true;
  }

  return showbutton;
};

interface myProps {
  className?: string;
  filters: Filters;
  setmyFilters: any;
}

const BulkFilters: FC<myProps> = ({ filters, setmyFilters }) => {
  const [onMenuOpen, menuOpen] = useState<boolean>(false);


  const itemstatusOptions = [
    {
      id: "all",
      name: "All",
    },
    {
      id: "true",
      name: "Active",
    },
    {
      id: "false",
      name: "Inactive",
    },
  ];

  const clearAllFilters = (): void => {

    setmyFilters((filters: Filters) => ({
      ...filters,
      supplierstatus: null,
      itemtextgiven: null,
      itemsupid: null,
    }));
  };

  const isFilterSet1 = isFilterSet(filters);

  const handleStatusChange1 = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value !== "all") {
      value = JSON.parse(e.target.value);

    }


    setmyFilters((filters: Filters) => ({
      ...filters,
      supplierstatus: value,
    }));

  };

  const handletextGivenChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    let value: any = null;

    if (e.target.value !== "") {
      value = e.target.value;

    }


    setmyFilters((filters: Filters) => ({
      ...filters,
      itemtextgiven: value,
    }));

  };

  return (
    <Paper
      component="form"
      sx={{ p: "20px", display: "flex", alignItems: "center", minwidth: 400 }}
    >
      {/*  <IconButton sx={{ p: '10px' }} aria-label="menu">*/}
      {/*      <FilterIcon />*/}
      {/*</IconButton>*/}
      <FormControl sx={{ width: "15ch", minWidth: "15ch" }} variant="outlined">
        <InputLabel>Supplier Status</InputLabel>
        <Select
          value={filters.supplierstatus?.toString() || "all"}
          onChange={handleStatusChange1}
          label="Supplier Status"
          autoWidth
        >
          {itemstatusOptions.map((statusOption) => (
            <MenuItem key={statusOption.id} value={statusOption.id}>
              {statusOption.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search.."
        inputProps={{ "aria-label": "search.." }}
        value={filters.itemtextgiven?.toString() || ""}
        onChange={handletextGivenChange}
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <ButtonError
        disabled={!isFilterSet1}
        sx={{ ml: 1 }}
        variant="contained"
        onClick={clearAllFilters}
        startIcon={<FilterAltOff fontSize="small" />}
      >
        Clear Filters
      </ButtonError>
      {/*<IconButton */}
      {/*      onClick={clearAllFilters} color="primary" sx={{ p: '10px' }} aria-label="directions">*/}
      {/*    <FilterIcon />*/}
      {/*</IconButton>*/}
    </Paper>
  );
};

export default BulkFilters;
