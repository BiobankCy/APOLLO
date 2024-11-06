import React, { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";

import {
  Tooltip,
  Divider,
  Box,
  Card,
  Checkbox,
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
  Zoom,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/FilterNone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

import {
  hasAdminAccess,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
  SupplierModel,
} from "src/models/mymodels";

import RightDrawerContacts from "./RightpopupContacts";
import BulkFilters, { Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import { switchEmailAttachmentFlag } from "../../../services/user.service";

interface SuppliersTableProps {
  className?: string;
  supList: SupplierModel[];
  updateSupplierList: any;
}

const applyFilters = (
  prodList: SupplierModel[],
  filters: Filters,
): SupplierModel[] => {
  return prodList.filter((supplier) => {
    let matches = true;

    if (
      filters.supplierstatus != null &&
      supplier.activestatusFlag !== filters.supplierstatus
    ) {
      matches = false;
      return matches;
    }

    if (filters.itemtextgiven != undefined) {
      let aaa = filters?.itemtextgiven.toUpperCase() ?? "";

      if (
        aaa.length > 0 &&
        !(
          supplier.name.toUpperCase().includes(aaa) ||
          supplier.worknumber.toUpperCase().includes(aaa) ||
          supplier.code.toUpperCase().includes(aaa) ||
          supplier.address.toUpperCase().includes(aaa) ||
          supplier.email.toUpperCase().includes(aaa) ||
          supplier.country.toUpperCase().includes(aaa)
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
  supList: SupplierModel[],
  page: number,
  limit: number,
): SupplierModel[] => {
  return supList.slice(page * limit, page * limit + limit);
};

const ProductsTable: FC<SuppliersTableProps> = ({
  supList,
  updateSupplierList,
}) => {
  const userContext = useAuth();
  const refreshSuppliers = (prevsups: SupplierModel[]): void => {
    // console.log(prevFilters1);
    updateSupplierList(prevsups);
  };
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const selectedBulkActions = selectedSuppliers.length > 0;
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
    if (filteredSuppliers.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredSuppliers.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredSuppliers.length / newlimitset) - 1);
      }
    }
  };

  const filteredSuppliers = applyFilters(supList, filters);
  const paginatedSuppliers = applyPagination(filteredSuppliers, page, limit);

  const theme = useTheme();
  const markSupplierExcelAttachment = (
    event: ChangeEvent<HTMLInputElement>,
    supplier: SupplierModel,
  ): void => {


    switchEmailAttachmentFlag(supplier)
      .then((response) => {
        // setApiResponse(response);
        if (response.status === 200) {
          if (response.data) {
            const updatedRows = response.data;
            const updatedList = supList.map((c) => {
              const matchingRow = updatedRows.find(
                (row: SupplierModel) => row.id === c.id,
              ) as SupplierModel;

              if (matchingRow) {
                return matchingRow;
              } else {
                return c;
              }
            });
            refreshSuppliers(updatedList);

          }
        } else {
          console.log(
            response.data,
            "Error updating supplier excel attachment flag!",
          );
        }
      })
      .catch((error) => {
        console.log(error, "Error updating supplier excel attachment flag");
        // setApiResponse(error);
      });

  };



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
                        navigate("/management/suppliers/add", { replace: true })
                      }
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                      Add supplier
                    </Button>
                  </Box>
                </Grid>
              </>
            )
          }
          title="Supplier List"
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

              <TableCell>Supplier Name</TableCell>
              <TableCell>Work Number</TableCell>
              {/*    <TableCell>Fax Number</TableCell>*/}
              <TableCell>Email</TableCell>

              <TableCell>Address</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Website</TableCell>
              <TableCell></TableCell>
              <TableCell>Attach Excel?</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSuppliers.map((supplier) => {
              const isSupplierSelected = selectedSuppliers.includes(
                supplier.id,
              );

              return (
                <TableRow hover key={supplier.id} selected={isSupplierSelected}>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                    >
                      {supplier.name}
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


                      {supplier.worknumber}
                    </Typography>
                  </TableCell>

                  <TableCell align="left">
                    <a
                      href={"mailto:" + supplier.email.toLowerCase()}
                      target="_top"
                    >
                      {supplier.email.toLowerCase()}
                    </a>
                  </TableCell>

                  <TableCell align="left"> {supplier.address} </TableCell>
                  <TableCell align="left"> {supplier.country} </TableCell>
                  <TableCell align="left"> {supplier.website} </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                    >
                      <RightDrawerContacts
                        key={supplier.id}
                        refreshSuppliers={refreshSuppliers}
                        supplierList={supList}
                        selectedSupplier={supplier}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        <>
                          Attach Excel file to email order?
                          <Divider sx={{ borderTop: 3 }} />
                          If checked, the supplier will receive an Excel file in
                          the email order.
                        </>
                      }
                      arrow
                      TransitionComponent={Zoom}
                    >
                      <Checkbox
                        color="success"
                        checked={supplier.excelattachmentinemailorderFlag}
                        value={supplier.excelattachmentinemailorderFlag}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          userContext &&
                          userContext.currentUser &&
                          userContext.currentUser.claimCanMakePo === true &&
                          markSupplierExcelAttachment(event, supplier)
                        }
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    {hasAdminAccess(userContext?.currentUser) && (
                      <>
                        <Tooltip title="Edit Supplier" arrow>
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
                            to={`/management/suppliers/edit/${supplier.id}`}
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
          count={filteredSuppliers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={
            !filteredSuppliers.length || filteredSuppliers.length <= 0
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
  supList: PropTypes.array.isRequired,
};

ProductsTable.defaultProps = {
  supList: [],
};

export default ProductsTable;
