import { FC } from "react";
import React from "react";
import {
  IconButton,
  Button,
  SelectChangeEvent,
  Paper,
  InputBase,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import FilterAltOff from "@mui/icons-material/FilterAltOff";

export interface Filters {
  itembuildingid?: number | null;
  itemroomid?: number | null;
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
    Object.entries(filts).forEach(([key, value]) => {
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
  const clearAllFilters = (): void => {
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    status: null, supplierstatus: null, itemcatid: null, itemstock: null
    //}));
    setmyFilters((filters: Filters) => ({
      ...filters,
      itemtextgiven: null,
      itembuildingid: null,
      itemroomid: null,
    }));
  };

  const isFilterSet1 = isFilterSet(filters);

  const handleStatusChangeBuildingId = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value !== "0") {
      value = Number(e.target.value);
    }

    setmyFilters((filters: Filters) => ({
      ...filters,
      itembuildingid: value,
    }));
  };

  const handleStatusChange22 = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value !== "") {
      value = e.target.value;
      // console.log(value);
    }
    // setmyFilters(value, 'itemcatid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemtextgiven: value,
    }));
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        minwidth: 400,
      }}
    >
      {/*  <IconButton sx={{ p: '10px' }} aria-label="menu">*/}
      {/*      <FilterIcon />*/}
      {/*</IconButton>*/}

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search.."
        inputProps={{ "aria-label": "search.." }}
        value={filters.itemtextgiven?.toString() || ""}
        onChange={handleStatusChange22}
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
