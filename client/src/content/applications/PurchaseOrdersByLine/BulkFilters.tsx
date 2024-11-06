import { FC } from "react";
import {
  IconButton,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
  InputBase,
  TextField,
  Checkbox,
  OutlinedInput,
  ListItemText,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ComboOptions } from "../PurchaseOrders/BulkFilters";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import FilterControls, {
  countAppliedFilters,
} from "../../../Components/Shared/FilterControls";
import React from "react";

export interface Filters {
  itemtextgiven?: string | null;
  orderstatusids?: string[];
  supplierid?: number | null;
  requestedbyid?: number | null;
  brandid?: number | null;
  tenderid?: number | null;
  categoryid?: number | null;
  subcategoryid?: number | null;
  fromdate?: Date | null;
  todate?: Date | null;
  //  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]> ([]);

}
const localstorage_filtername: string = "page_poorderlines_filters";

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
 
export interface ComboOptionsCustom {
  id: string;
  name: string;
}

interface myProps {
  className?: string;
  filters: Filters;
  setmyFilters: any;
  statusfilter: ComboOptionsCustom[];
  suppliersArray: ComboOptions[];
  empArray: ComboOptions[];
  brandsArray: ComboOptions[];
  tendersArray: ComboOptions[];
  categoriesArray: ComboOptions[];
  subcategoriesArray: ComboOptions[];
}

const BulkFilters: FC<myProps> = ({
  filters,
  setmyFilters,
  statusfilter,
  suppliersArray,
  empArray,
  brandsArray,
  tendersArray,
  categoriesArray,
  subcategoriesArray,
}) => {
  const clearAllFilters = (): void => {
    setmyFilters((filters: Filters) => ({
      ...filters,
      itemtextgiven: null,
      orderstatusids: [],
      supplierid: null,
      requestedbyid: null,
      brandid: null,
      tenderid: null,
      categoryid: null,
      subcategoryid: null,
      fromdate: null,
      todate: null,
    }));
  };

  const handleSearchTextChange = (
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
  const handleStatusChange2supid = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value.toString() !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }
    // setmyFilters(value, 'itemdecisionid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      supplierid: value,
    }));
  };

  const handleRequestedByChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value.toString() !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }
    // setmyFilters(value, 'itemdecisionid');
    //console.log(value,"reqbyempid");
    setmyFilters((filters: Filters) => ({
      ...filters,
      requestedbyid: value,
    }));
  };

  const handleBrandByChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value.toString() !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }
    // setmyFilters(value, 'itemdecisionid');

    setmyFilters((filters: Filters) => ({
      ...filters,
      brandid: value,
    }));
  };
  const handleTenderChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value.toString() !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }

    setmyFilters((filters: Filters) => ({
      ...filters,
      tenderid: value,
    }));
  };
  const handleCategoryChange = (e: SelectChangeEvent): void => {
    let value: any = null;

    if (e.target.value.toString() !== "0") {
      value = Number(e.target.value);
    }

    setmyFilters((filters: Filters) => ({
      ...filters,
      categoryid: value,
    }));
  };
  const handleChangeOfStatus = (event: SelectChangeEvent<string[]>) => {
    const selectedValues = event.target.value as string[];
    setmyFilters((filters: Filters) => ({
      ...filters,
      orderstatusids: selectedValues,
    }));
  };
  const handleSubCategoryChange = (e: SelectChangeEvent): void => {
    let value: any = null;
    //console.log(e.target.value);
    if (e.target.value.toString() !== "0") {
      value = Number(e.target.value);
      // console.log(value);
    }

    setmyFilters((filters: Filters) => ({
      ...filters,
      subcategoryid: value,
    }));
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };

  const handleFromDateChange = (newValue: Date | null) => {
    setmyFilters((prevFilters: Filters) => ({
      ...prevFilters,
      fromdate: newValue === null ? null : newValue,
    }));
  };

  const handleToDateChange = (newValue: Date | null) => {
    setmyFilters((prevFilters: Filters) => ({
      ...prevFilters,
      todate: newValue === null ? null : newValue,
    }));
  };

  return (
    <FilterControls filters={filters} clearAllFilters={clearAllFilters}>
      {/* Place your Grid items and components here */}
      <Grid item xs={12} sm={6} md={2}>
        <DesktopDatePicker
          label="From Date"
          inputFormat="dd/MM/yyyy"
          value={filters.fromdate || null}
          onChange={handleFromDateChange}
          renderInput={(params) => (
            <TextField sx={{ width: "100%" }} {...params} />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <DesktopDatePicker
          label="To Date"
          inputFormat="dd/MM/yyyy"
          value={filters.todate || null}
          onChange={handleToDateChange}
          renderInput={(params) => (
            <TextField sx={{ width: "100%" }} {...params} />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl
          sx={{ minWidth: "15ch", width: "100%" }}
          variant="outlined"
        >
          <InputLabel id="demo-multiple-checkbox-label">Status</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={filters.orderstatusids}
            onChange={handleChangeOfStatus}
            input={<OutlinedInput label="Department" />}
            renderValue={(selected) => {
              const selectedDepartments = (selected as string[])
                .map((depid) => {
                  const department = statusfilter.find(
                    (option) => option.id === depid,
                  );
                  return department ? department.name : "";
                })
                .filter(Boolean); // Remove any empty strings

              return selectedDepartments.length > 0
                ? selectedDepartments.join(", ")
                : "Select status"; // Display "Select status" if no departments are selected
            }}
            MenuProps={MenuProps}
          >
            {statusfilter.map((statusOption) => (
              <MenuItem key={statusOption.id} value={statusOption.id}>
                <Checkbox
                  checked={filters.orderstatusids?.some(
                    (departmentid) =>
                      departmentid.toString() === statusOption.id,
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
          <InputLabel>Supplier</InputLabel>
          <Select
            value={filters.supplierid?.toString() || "0"}
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
      <Grid item xs={12} sm={6} md={2}>
        <FormControl
          sx={{ minWidth: "15ch", width: "100%" }}
          variant="outlined"
        >
          <InputLabel>Request by</InputLabel>
          <Select
            value={filters.requestedbyid?.toString() || "0"}
            onChange={handleRequestedByChange}
            label="Request by"
            autoWidth
          >
            {empArray.map((statusOption) => (
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
            value={filters.brandid?.toString() || "0"}
            onChange={handleBrandByChange}
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
            value={filters.tenderid?.toString() || "0"}
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
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.categoryid?.toString() || "0"}
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
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={filters.subcategoryid?.toString() || "0"}
            onChange={handleSubCategoryChange}
            label="Subcategory"
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
        <IconButton type="button" aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          placeholder="Search.."
          inputProps={{ "aria-label": "search.." }}
          value={filters.itemtextgiven?.toString() || ""}
          onChange={handleSearchTextChange}
        />
      </Grid>
    </FilterControls>
  );
};

export default BulkFilters;
