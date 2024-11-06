import React, { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";

import {
  Tooltip,
  Divider,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  CardHeader,
  Button,
  Grid,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/FilterNone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

import {
  hasAdminAccess,
  ManufacturerModel,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
} from "src/models/mymodels";


import BulkFilters, { Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";

interface ManufacturersTableProps {
  className?: string;
  manufList: ManufacturerModel[];
  updateManufList: any;
}

const applyFilters = (
  prodList: ManufacturerModel[],
  filters: Filters,
): ManufacturerModel[] => {
  return prodList.filter((manufacturer) => {
    let matches = true;

    if (
      filters.supplierstatus != null &&
      manufacturer.activestatusFlag !== filters.supplierstatus
    ) {
      matches = false;
      return matches;
    }

    if (filters.itemtextgiven != undefined) {
      let aaa = filters?.itemtextgiven.toUpperCase() ?? "";

      if (
        aaa.length > 0 &&
        !(
          manufacturer.name.toUpperCase().includes(aaa) ||
          manufacturer.worknumber.toUpperCase().includes(aaa) ||
          manufacturer.code.toUpperCase().includes(aaa) ||
          manufacturer.address.toUpperCase().includes(aaa) ||
          manufacturer.email.toUpperCase().includes(aaa) ||
          manufacturer.country.toUpperCase().includes(aaa)
        )
      ) {
        matches = false;
        return matches;
      }
    }

    return matches;
  });
};

const applyPagination = (
  manList: ManufacturerModel[],
  page: number,
  limit: number,
): ManufacturerModel[] => {
  return manList.slice(page * limit, page * limit + limit);
};

const ProductsTable: FC<ManufacturersTableProps> = ({
  manufList: supList,
  updateManufList,
}) => {
  const userContext = useAuth();
  // const refreshSuppliers = (prevsups: ManufacturerModel[]): void => {
  //   // console.log(prevFilters1);
  //   updateSupplierList(prevsups);
  // };
  const [selectedManufacturers, setSelectedManufacturers] = useState<number[]>([]);
  const selectedBulkActions = selectedManufacturers.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({
    supplierstatus: null,
    itemtextgiven: null,
  });
  const navigate = useNavigate();

  const setmyFilters2 = (prevFilters1: Filters): void => {
    // console.log(prevFilters1);
    setFilters(prevFilters1);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);
    if (filteredManufacturers.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredManufacturers.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredManufacturers.length / newlimitset) - 1);
      }
    }
  };

  const filteredManufacturers = applyFilters(supList, filters);
  const paginatedSuppliers = applyPagination(filteredManufacturers, page, limit);

  const theme = useTheme();

  return (
    <Card>


      {selectedBulkActions && (
        <Box flex={1} p={2}>

        </Box>
      )}

      {!selectedBulkActions && (
        <CardHeader
          sx={{ pr: 2.6 }}
          action={
            hasAdminAccess(userContext?.currentUser) && (
              <>
                <Grid item>
                  <Box component="span">
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      onClick={() =>
                        navigate("/management/manufacturers/add", { replace: true })
                      }
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                      Add Manufacturer
                    </Button>
                  </Box>
                </Grid>
              </>
            )
          }
          title="Manufacturer List"
        />
      )}
      <Box flex={1} p={2}>
        <BulkFilters setmyFilters={setmyFilters2} filters={filters} />
      </Box>
      <Divider />
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={{ verticalAlign: "top" }}>
              {/*<TableCell padding="checkbox">*/}
              {/*    <Checkbox*/}
              {/*        color="primary"*/}
              {/*        checked={selectedAllSuppliers}*/}
              {/*        indeterminate={selectedSomeSuppliers}*/}
              {/*        onChange={handleSelectAllSuppliers}*/}
              {/*    />*/}
              {/*</TableCell>*/}

              {/*        <TableCell>Supplier Code</TableCell>*/}
              <TableCell>Manufacturer Name</TableCell>
              <TableCell>Work Number</TableCell>
              {/*    <TableCell>Fax Number</TableCell>*/}
              <TableCell>Email</TableCell>

              <TableCell>Address</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Website</TableCell>


              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSuppliers.map((manufacturer) => {
              const isSupplierSelected = selectedManufacturers.includes(
                manufacturer.id,
              );

              return (
                <TableRow hover key={manufacturer.id} selected={isSupplierSelected}>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                    >
                      {manufacturer.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >


                      {manufacturer.worknumber}
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="left"> {supplier.faxnumber} </TableCell>*/}
                  <TableCell align="left">
                    <a
                      href={"mailto:" + manufacturer.email.toLowerCase()}
                      target="_top"
                    >
                      {manufacturer.email.toLowerCase()}
                    </a>
                  </TableCell>

                  <TableCell align="left"> {manufacturer.address} </TableCell>
                  <TableCell align="left"> {manufacturer.country} </TableCell>
                  <TableCell align="left"> {manufacturer.website} </TableCell>

                  <TableCell align="right">
                    {hasAdminAccess(userContext?.currentUser) && (
                      <>
                        <Tooltip title="Edit Manufacturer" arrow>
                          <IconButton
                            sx={{
                              "&:hover": {
                                background: theme.colors.primary.lighter,
                              },
                              color: theme.palette.primary.main,
                            }}
                            color="inherit"
                            size="small"
                            component={RouterLink}
                            to={`/management/manufacturers/edit/${manufacturer.id}`}
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    {userContext?.currentUser &&
                      userContext?.currentUser?.claimCanMakeRequest && (

                        <></>
                      )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredManufacturers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={
            !filteredManufacturers.length || filteredManufacturers.length <= 0
              ? 0
              : page
          }
          rowsPerPage={limit}
          rowsPerPageOptions={Pagingdefaultoptions}
        />
      </Box>
    </Card>
  );
};

ProductsTable.propTypes = {
  manufList: PropTypes.array.isRequired,
};

ProductsTable.defaultProps = {
  manufList: [],
};

export default ProductsTable;
