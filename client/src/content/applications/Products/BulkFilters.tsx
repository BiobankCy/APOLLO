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
  InputBase,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Grid,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

import { ProductStatus } from "../../../models/mymodels";
import useMediaQuery from "@mui/material/useMediaQuery";
import FilterControls, {
  countAppliedFilters,
} from "../../../Components/Shared/FilterControls";

export interface Filters {
  status?: ProductStatus | null;
  itemstatus?: boolean | null;
  forsequencing?: boolean | null;
  itemcatid?: number | null;
  itemsupid?: number | null;
  itemmanufucturerid?: number | null;
  itemstock?: string | null;
  itemtextgiven?: string | null;
  itemsubcatid?: number | null;
  itembrandid?: number | null;
  itemtenderid?: number | null;
  itemdepartmentids: number[];
}
const localstorage_filtername: string = "page_products_filters";

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

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `,
);

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
  categoriesArray: ComboOptions[];
  suppliersArray: ComboOptions[];
  manufucturersArray: ComboOptions[];
  brandsArray: ComboOptions[];
  subcategoriesArray: ComboOptions[];
  tendersArray: ComboOptions[];
  departmentsArray: ComboOptions[];
  filters: Filters;
  setmyFilters: any;
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const BulkFilters: FC<myProps> = ({
  subcategoriesArray,
  brandsArray,
  tendersArray,
  suppliersArray,
  manufucturersArray,
  categoriesArray,
  filters,
  setmyFilters,
  departmentsArray,
}) => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);

  const openMenu = (): void => {
    menuOpen(true);
  };

  const closeMenu = (): void => {
    menuOpen(false);
  };

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

  const forsequencingOptions = [
    {
      id: "all",
      name: "All",
    },
    {
      id: "true",
      name: "Yes",
    },
    {
      id: "false",
      name: "No",
    },
  ];
  const statusOptions = [
    {
      id: "all",
      name: "All",
    },
    {
      id: "completed",
      name: "Completed",
    },
    {
      id: "pending",
      name: "Pending",
    },
    {
      id: "failed",
      name: "Failed",
    },
    {
      id: "undefined",
      name: "Undefined",
    },
  ];

  const handleStatusChange = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }
    setmyFilters((filters: Filters) => ({
      ...filters,
      status: value,
    }));
    //  setmyFilters(value,'status');
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    status: value
    //}));
  };
  const handleItemStockChange = (e: SelectChangeEvent): void => {
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

  const handleDepartmentChange = (e: SelectChangeEvent<number[]>) => {
    const selectedDepartments = e.target.value as number[]; // Array of selected department IDs
    setmyFilters((prevFilters: Filters) => ({
      ...prevFilters,
      itemdepartmentids: selectedDepartments ?? [],
    }));
    return;


    // Check if selectedDepartments includes a value greater than 0
    if (selectedDepartments.some((department) => department > 0)) {
      // If yes, remove the value 0 from selectedDepartments
      const filteredDepartments = selectedDepartments.filter(
        (department) => department !== 0,
      );

      // Update the state with the filteredDepartments
      setmyFilters((prevFilters: Filters) => ({
        ...prevFilters,
        itemdepartmentids:
          filteredDepartments.length > 0 ? filteredDepartments : null,
      }));
    } else {
      // Otherwise, update the state with the selectedDepartments
      setmyFilters((prevFilters: Filters) => ({
        ...prevFilters,
        itemdepartmentids: selectedDepartments,
      }));
    }
  };



  const clearAllFilters = (): void => {
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    status: null, itemstatus: null, itemcatid: null, itemstock: null
    //}));
    setmyFilters((filters: Filters) => ({
      ...filters,
      status: null,
      itemstatus: null,
      itemcatid: null,
      itemstock: null,
      itemtextgiven: null,
      itemsupid: null,
      itemsubcatid: null,
      itembrandid: null,
      itemtenderid: null,
      forsequencing: null,
      itemdepartmentids: [],
    }));
  };

  //  const isFilterSet1 = isFilterSet(filters);
  const isCategoryFilterSet1 = isCategoryFilterSet(filters.itemcatid);

  const handleforSeqFlagChange = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value !== "all") {
      value = JSON.parse(e.target.value);
      //console.log(value);
    }

    // setmyFilters(value, 'itemstatus');
    setmyFilters((filters: Filters) => ({
      ...filters,
      forsequencing: value,
    }));
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    itemstatus: value
    //}));
  };
  const handleItemStatusChange1 = (e: SelectChangeEvent): void => {
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

  const handleMansChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);

    if (e.target.value) {
      if (e.target.value.toString() !== "0") {
        value = Number(e.target.value);
        // console.log(value);
      }
    }

    // setmyFilters(value, 'itemcatid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemmanufucturerid: value,
    }));
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    itemcatid: value
    //}));
  };

  const handleSupplierChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);

    if (e.target.value) {
      if (e.target.value.toString() !== "0") {
        value = Number(e.target.value);
        // console.log(value);
      }
    }

    // setmyFilters(value, 'itemcatid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemsupid: value,
    }));
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    itemcatid: value
    //}));
  };
  const handleCategoryChange = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value) {
      if (e.target.value.toString() !== "0") {
        value = Number(e.target.value);
        // console.log(value);
      }
    }

    // setmyFilters(value, 'itemcatid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemcatid: value,
    }));
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    itemcatid: value
    //}));
  };
  const handleItemTextChange = (
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
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    itemcatid: value
    //}));
  };
  const handleStatusChange2brands = (e: SelectChangeEvent): void => {
    let value: any = null;
    // console.log(e.target.value);

    if (e.target.value) {
      if (e.target.value.toString() !== "0") {
        value = Number(e.target.value);
      }
    }

    // setmyFilters(value, 'itemcatid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      itembrandid: value,
    }));
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    itemcatid: value
    //}));
  };
  const handleTenderChange = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value) {
      if (e.target.value.toString() !== "0") {
        value = Number(e.target.value);
        // console.log(value);
      }
    }

    // setmyFilters(value, 'itemcatid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemtenderid: value,
    }));
    //setFilters((prevFilters) => ({
    //    ...prevFilters,
    //    itemcatid: value
    //}));
  };
  const handleStatusChange2subcats = (e: SelectChangeEvent): void => {
    let value: any = null;
    console.log(e.target.value);
    if (e.target.value !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }

    setmyFilters((filters: Filters) => ({
      ...filters,
      itemsubcatid: value,
    }));

  };

  return (
    <>
      <FilterControls filters={filters} clearAllFilters={clearAllFilters}>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl
            sx={{ minWidth: "15ch", width: "100%" }}
            variant="outlined"
          >
            <InputLabel>Item Status</InputLabel>
            <Select
              value={filters.itemstatus?.toString() || "all"}
              onChange={handleItemStatusChange1}
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
        <Grid item xs={12} sm={6} md={2}>
          <FormControl
            sx={{ minWidth: "15ch", width: "100%" }}
            variant="outlined"
          >
            <InputLabel>Primers</InputLabel>
            <Select
              value={filters.forsequencing?.toString() || "all"}
              onChange={handleforSeqFlagChange}
              label="Primers"
              autoWidth
            >
              {forsequencingOptions.map((row) => (
                <MenuItem key={row.id} value={row.id}>
                  {row.name}
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
            <InputLabel id="demo-multiple-checkbox-label">
              Department
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={filters?.itemdepartmentids ?? []}
              onChange={handleDepartmentChange}
              input={<OutlinedInput label="Department" />}
              renderValue={(selected) =>
                (selected as number[])
                  .map((id) => {
                    const department = departmentsArray.find(
                      (option) => option.id === id,
                    );
                    return department ? department.name : "";
                  })
                  .join(", ")
              }
              MenuProps={MenuProps}
            >
              {departmentsArray.map((statusOption) => (
                <MenuItem key={statusOption.id} value={statusOption.id}>
                  <Checkbox
                    checked={filters.itemdepartmentids?.some(
                      (department) => department === statusOption.id,
                    )}
                  />
                  <ListItemText primary={statusOption.name} />
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
            <InputLabel>Inventory</InputLabel>
            <Select
              value={filters.itemstock || "all"}
              onChange={handleItemStockChange}
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
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.itemcatid?.toString() || "0"}
              onChange={handleCategoryChange}
              label="Category"
              autoWidth
            >
              {categoriesArray.map((statusOption) => (
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
            <InputLabel>Sub Category</InputLabel>
            <Select
              disabled={!isCategoryFilterSet1}
              value={filters.itemsubcatid?.toString() || "0"}
              onChange={handleStatusChange2subcats}
              label="Sub Category"
              autoWidth
            >
              {subcategoriesArray.map((statusOption) => (
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
            <InputLabel>Brand</InputLabel>
            <Select
              value={filters.itembrandid?.toString() || "0"}
              onChange={handleStatusChange2brands}
              label="Brand"
              autoWidth
            >
              {brandsArray.map((statusOption) => (
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
            <InputLabel>Tender</InputLabel>
            <Select
              value={filters.itemtenderid?.toString() || "0"}
              onChange={handleTenderChange}
              label="Tender"
              autoWidth
            >
              {tendersArray.map((statusOption) => (
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
              onChange={handleSupplierChange}
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
        <Grid item xs={12} sm={6} md={2}>
          <FormControl
            sx={{ minWidth: "15ch", width: "100%" }}
            variant="outlined"
          >
            <InputLabel>Manufucturer</InputLabel>
            <Select
              value={filters.itemmanufucturerid?.toString() || "0"}
              onChange={handleMansChange}
              label="Manufucturer"
              autoWidth
            >
              {manufucturersArray.map((statusOption) => (
                <MenuItem key={statusOption.id} value={statusOption.id}>
                  {statusOption.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            onChange={handleItemTextChange}
          />
        </Grid>
      </FilterControls>
    </>
  );
};

export default BulkFilters;
