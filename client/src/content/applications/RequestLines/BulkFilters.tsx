import React from "react";
import { useState, useRef, FC, useEffect } from "react";

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
  Grid,
  TextField,
} from "@mui/material";

import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

import { DecisionModel } from "../../../models/mymodels";
import FilterControls, {
  countAppliedFilters,
} from "../../../Components/Shared/FilterControls";
/*import { getAllDecisions } from '../../../services/user.service';*/

export interface Filters {
  /* status?: ProductStatus | null;*/
  dateFrom?: Date | null;
  dateTo?: Date | null;
  itemstatus?: boolean | null;
  itemdecisionid?: number | null;
  itemprojectid?: number | null;
  requestgroupid?: number | null;
  itemsupid?: number | null;
  itemstock?: string | null;
  itemdynamicstatus?: string | null;
  itemtextgiven?: string | null;
}

const localstorage_filtername: string = "page_requests_filters";

export const getFiltersFromLocalStorage = (): Filters | null => {
  const storedFilters = localStorage.getItem(localstorage_filtername);
  if (storedFilters) {
    const parsedFilters = JSON.parse(storedFilters) as Filters;
    // Check if the filters are valid (not null or empty)
    const isValidFilters = countAppliedFilters(parsedFilters);
    return isValidFilters ? parsedFilters : null;
  }
  return null;
};
export const setFiltersToLocalStorage = (filters: Filters): void => {
  localStorage.setItem(localstorage_filtername, JSON.stringify(filters));
};

export interface ComboOptions {
  id: number;
  name: string;
}
export interface customComboOptions {
  id: string;
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



interface myProps {
  className?: string;
  suppliersArray: ComboOptions[];
  dynamicdecisionssArray: ComboOptions[];
  dynamicstatusOptionsArray: customComboOptions[];
  dynamicProjectsArray: ComboOptions[];
  filters: Filters;
  setmyFilters: any;
}

const getDecisionStatuses = (
  decisionsList: DecisionModel[],
): ComboOptions[] => {
  let listItems: ComboOptions[] = [];
  listItems.push({ name: "All", id: 0 });
  decisionsList.forEach(function (line) {
    listItems.push({ name: line.name, id: line.id });
  });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};

const BulkFilters: FC<myProps> = ({
  suppliersArray,
  filters,
  setmyFilters,
  dynamicstatusOptionsArray,
  dynamicdecisionssArray,
  dynamicProjectsArray,
}) => {
  const location = useLocation();
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const [urlfilterappliedonce, seturlfilterappliedonce] =
    useState<boolean>(false);
  //const [decisionssArray, setdecisionssArray] = useState<ComboOptions[]>([{ id: 0, name: "Please Wait" }]);
  // const [dynamicstatusOptionsArray, setdynamicstatusOptionsArray] = useState<ComboOptions[]>([{ id: 0, name: "Please Wait" }]);
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const openMenu = (): void => {
    menuOpen(true);
  };

  const closeMenu = (): void => {
    menuOpen(false);
  };



  useEffect(() => {
    if (dynamicstatusOptionsArray.length > 0 && !urlfilterappliedonce) {
      const searchParams = new URLSearchParams(location.search);
      const givenstatusinurl = searchParams.get("status");

      if (givenstatusinurl) {
        const id = dynamicstatusOptionsArray.find(
          (option) =>
            option.name.toLowerCase() === givenstatusinurl.toLowerCase(),
        )?.id;
        if (id !== undefined) {
          seturlfilterappliedonce(true);
          setmyFilters((filters: Filters) => ({
            ...filters,
            itemdynamicstatus: id,
          }));
        }
      }
    }
  }, [dynamicstatusOptionsArray]);


  const itemStockOptions = [
    {
      id: "all",
      name: "All",
    },
    {
      id: "oos",
      name: "Out Of Stock",
    },
    {
      id: "ins",
      name: "In Stock",
    },
    {
      id: "minmqtyminus",
      name: "Minimum Quantity",
    },
  ];
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

  const handleStatusChange3 = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }
    //setmyFilters(value );

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemstock: value,
    }));
  };
  const clearAllFilters = (): void => {
    setmyFilters((filters: Filters) => ({
      ...filters,
      itemstatus: null,
      requestgroupid: null,
      itemdecisionid: null,
      itemprojectid: null,
      itemstock: null,
      itemtextgiven: null,
      itemsupid: null,
      dateFrom: null,
      dateTo: null,
      itemdynamicstatus: null,
    }));
  };

  const handleItemStatussChange = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value !== "all") {
      value = JSON.parse(e.target.value);
      //console.log(value);
    }

    // setmyFilters(value, 'itemstatus');
    setmyFilters((filters: Filters) => ({
      ...filters,
      itemstatus: value,
    }));
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    itemstatus: value
    //}));
  };
  const handleStatusChange2supid = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }


    setmyFilters((filters: Filters) => ({
      ...filters,
      itemsupid: value,
    }));

  };
  const handleDynamicStatusChange = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value !== "0") {
      value = e.target.value;

    }


    setmyFilters((filters: Filters) => ({
      ...filters,
      itemdynamicstatus: value,
    }));

  };

  const handleDynamicDecisionChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }
    // setmyFilters(value, 'itemdecisionid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemdecisionid: value,
    }));
  };

  const handleDynamicProjectChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }
    // setmyFilters(value, 'itemdecisionid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemprojectid: value,
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
  const handleStatusChange22groupid = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    let value: any = null; // Default to 0

    if (e.target.value !== "") {
      const numericValue = parseFloat(e.target.value);
      if (!isNaN(numericValue)) {
        value = numericValue;
      }
    }

    setmyFilters((filters: Filters) => ({
      ...filters,
      requestgroupid: value,
    }));
  };

  return (
    //  <Paper
    //      component="form"
    //    sx={{ pt: '20px', pb: '20px', display: 'flex', alignItems: 'center', minwidth: 400 }}
    //>

    <FilterControls filters={filters} clearAllFilters={clearAllFilters}>

      <Grid item xs={12} sm={6} md={2}>
        <FormControl
          sx={{ minWidth: "15ch", width: "100%" }}
          variant="outlined"
        >
          <InputLabel>Request Status</InputLabel>
          <Select
            value={filters.itemdynamicstatus?.toString() || "0"}
            onChange={handleDynamicStatusChange}
            label="Request Status"
            autoWidth
          >
            {dynamicstatusOptionsArray.map((statusOption) => (
              <MenuItem key={statusOption.id} value={statusOption.id}>
                {statusOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2} xl={1}>
        {" "}
        <FormControl
          sx={{ minWidth: "15ch", width: "100%" }}
          variant="outlined"
        >
          <InputLabel>Decision</InputLabel>
          <Select
            value={filters.itemdecisionid?.toString() || "0"}
            onChange={handleDynamicDecisionChange}
            label="Decision"
            autoWidth
          >
            {dynamicdecisionssArray.map((statusOption) => (
              <MenuItem key={statusOption.id} value={statusOption.id}>
                {statusOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2} xl={1}>
        <FormControl
          sx={{ minWidth: "15ch", width: "100%" }}
          variant="outlined"
        >
          <InputLabel>Item Status</InputLabel>
          <Select
            value={filters.itemstatus?.toString() || "all"}
            onChange={handleItemStatussChange}
            label="Item Status"
            autoWidth
          >
            {itemstatusOptions.map((statusOption) => (
              <MenuItem key={statusOption.id} value={statusOption.id}>
                {statusOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2} xl={1}>
        <FormControl
          sx={{ minWidth: "15ch", width: "100%" }}
          variant="outlined"
        >
          <InputLabel>Inventory</InputLabel>
          <Select
            value={filters.itemstock || "all"}
            onChange={handleStatusChange3}
            label="Stock"
            autoWidth
          >
            {itemStockOptions.map((statusOption) => (
              <MenuItem key={statusOption.id} value={statusOption.id}>
                {statusOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl
          sx={{ minWidth: "15ch", width: "100%" }}
          variant="outlined"
        >
          <InputLabel>Supplier</InputLabel>
          <Select
            value={filters.itemsupid?.toString() || "0"}
            onChange={handleStatusChange2supid}
            label="Supplier"
            autoWidth
          >
            {suppliersArray.map((statusOption) => (
              <MenuItem key={statusOption.id} value={statusOption.id}>
                {statusOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2} >
        {" "}
        <FormControl
          sx={{ minWidth: "15ch", width: "100%" }}
          variant="outlined"
        >
          <InputLabel>Project</InputLabel>
          <Select
            value={filters.itemprojectid?.toString() || "0"}
            onChange={handleDynamicProjectChange}
            label="Project"
            autoWidth
          >
            {dynamicProjectsArray.map((statusOption) => (
              <MenuItem key={statusOption.id} value={statusOption.id}>
                {statusOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2} xl={1}>
        <TextField
          fullWidth
          label="Group ID"
          variant="outlined"
          placeholder="Enter Group ID.."
          type="number" // Use type="number" to ensure numeric input
          value={filters.requestgroupid || ""}
          onChange={handleStatusChange22groupid}
          inputProps={{ min: 0 }} // Set minimum value to 0
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
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
      </Grid>

      {/*<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />*/}


    </FilterControls>
  );
};

export default BulkFilters;
