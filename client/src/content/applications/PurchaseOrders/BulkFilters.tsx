import { useState, useRef, FC, useEffect } from "react";
import React from "react";
import {
  IconButton,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
  useTheme,
  Paper,
  InputBase,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import FilterAltOff from "@mui/icons-material/FilterAltOff";

import { getAllPOstatuses } from "../../../services/user.service";
import { PorderStatusModel } from "../../../models/mymodels";

export interface Filters {
  itemtextgiven?: string | null;
  orderstatusid?: number | null;
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

const getPOStatuses = (mylist: PorderStatusModel[]): ComboOptions[] => {
  let listItems: ComboOptions[] = [];
  listItems.push({ name: "All", id: 0 });
  mylist.forEach(function (line) {
    listItems.push({ name: line.name, id: line.id });
  });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};

interface myProps {
  className?: string;
  filters: Filters;
  setmyFilters: any;
}

const BulkFilters: FC<myProps> = ({ filters, setmyFilters }) => {
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const [orderStatusesArray, setorderStatusesArray] = useState<ComboOptions[]>([
    { id: 0, name: "Please Wait" },
  ]);
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const openMenu = (): void => {
    menuOpen(true);
  };

  const closeMenu = (): void => {
    menuOpen(false);
  };

  useEffect(() => {
    getAllPOstatuses().then(
      (response) => {
        setorderStatusesArray(getPOStatuses(response.data));
      },
      (error) => {
        setorderStatusesArray([]);
      },
    );
  }, []);

  const clearAllFilters = (): void => {
    
    setmyFilters((filters: Filters) => ({
      ...filters,
      itemtextgiven: null,
      orderstatusid: null,
    }));
  };

  const isFilterSet1 = isFilterSet(filters);

  const handlePOstatusChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value !== "0") {
      value = Number(e.target.value);
    }

    setmyFilters((filters: Filters) => ({
      ...filters,
      orderstatusid: value,
    }));
  };
  const handleStatusChange22 = (
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
      sx={{
        pt: "20px",
        pb: "20px",
        display: "flex",
        alignItems: "center",
        minwidth: 400,
      }}
    >
      {/*  <IconButton sx={{ p: '10px' }} aria-label="menu">*/}
      {/*      <FilterIcon />*/}
      {/*</IconButton>*/}
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <FormControl sx={{ width: "15ch", minWidth: "15ch" }} variant="outlined">
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.orderstatusid?.toString() || "0"}
          onChange={handlePOstatusChange}
          label="Status"
          autoWidth
        >
          {orderStatusesArray.map((statusOption) => (
            <MenuItem key={statusOption.id} value={statusOption.id}>
              {statusOption.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
