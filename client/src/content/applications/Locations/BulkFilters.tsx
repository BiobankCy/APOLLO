import { useState, useRef, FC } from "react";
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
const isCategoryFilterSet = (
  catidfilter: number | null | undefined,
): boolean => {
  let enabled = false;
  try {
    //   console.log(catidfilter);
    if (catidfilter != null && catidfilter > 0) {
      enabled = true;
    }
  } catch (error) {
    enabled = false;
  }

  return enabled;
};
interface myProps {
  className?: string;
  buildingsArray: ComboOptions[];
  roomsArray: ComboOptions[];
  filters: Filters;
  setmyFilters: any;
}

const BulkFilters: FC<myProps> = ({
  filters,
  setmyFilters,
  roomsArray,
  buildingsArray,
}) => {
  const [onMenuOpen, menuOpen] = useState<boolean>(false);

  const moreRef = useRef<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const openMenu = (): void => {
    menuOpen(true);
  };

  const closeMenu = (): void => {
    menuOpen(false);
  };

  const clearAllFilters = (): void => {

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

  const handleStatusChangeRoomId = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value !== "0") {
      value = Number(e.target.value);
    }

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemroomid: value,
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
      <FormControl sx={{ width: "15ch", minWidth: "15ch" }} variant="outlined">
        <InputLabel>Building</InputLabel>
        <Select
          value={filters.itembuildingid?.toString() || "0"}
          onChange={handleStatusChangeBuildingId}
          label="Building"
          autoWidth
        >
          {buildingsArray.map((statusOption) => (
            <MenuItem key={statusOption.id} value={statusOption.id}>
              {statusOption.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: "15ch", minWidth: "15ch" }} variant="outlined">
        <InputLabel>Room</InputLabel>
        <Select
          value={filters.itemroomid?.toString() || "0"}
          onChange={handleStatusChangeRoomId}
          label="Room"
          autoWidth
        >
          {roomsArray.map((statusOption) => (
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
