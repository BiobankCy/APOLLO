import React, { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";

import { format } from "date-fns";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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
  Collapse,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import HelpIcon from "@mui/icons-material/Help";

import {
  ccyFormat,
  hasAdminAccess,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
  ProductModel,
  TenderModel,
} from "src/models/mymodels";

import BulkFilters, { Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import {
  getSomeProductsByTenderId,
} from "../../../services/user.service";

import { AxiosResponse, AxiosError } from "axios";

import TooltipIconButton from "../../../Components/Shared/HelpTooltipButton";
import ProgressBar from "../../../Components/Shared/Progressbar";
import { useAlert } from "src/contexts/AlertsContext";
import TenderDialog from "./TenderAddEditDialog";

interface TendersTableProps {
  className?: string;
  tendersList: TenderModel[];
  // updateTenderListFn: any;
  updateTenderListFn: (tenders: TenderModel[]) => void;
  updateSingleTenderInState: (tender: TenderModel) => void;
  addNewTenderInState: (tender: TenderModel) => void;
}

const applyFilters = (
  tendersList: TenderModel[],
  filters: Filters,
): TenderModel[] => {
  return tendersList.filter((tender) => {
    let matches = true;

    if (filters.itemtextgiven != undefined) {
      const searchText = filters.itemtextgiven.toUpperCase() ?? "";

      const tenderCodeMatch = tender.tendercode.toUpperCase().includes(searchText);
      const createdDateMatch = format(new Date(tender.createddate ?? 0), "dd/MM/yyyy")
        .toUpperCase()
        .includes(searchText);

      // Check if any supplier name in tendersuppliersassigneds matches the search text
      const supplierNameMatch = tender.tendersuppliersassigneds.some(
        (tsa) => tsa.sidNavigation.name.toUpperCase().includes(searchText)
      );

      if (!tenderCodeMatch && !createdDateMatch && !supplierNameMatch) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = (
  tendersList: TenderModel[],
  page: number,
  limit: number,
): TenderModel[] => {
  return tendersList.slice(page * limit, page * limit + limit);
};

const TendersTable: FC<TendersTableProps> = ({
  tendersList,
  updateTenderListFn,
  updateSingleTenderInState,
  addNewTenderInState,
}) => {
  const userContext = useAuth();
  const { showAlert } = useAlert();
  const [selectedTenders, setSelectedTenders] = useState<number[]>([]);
  const selectedBulkActions = selectedTenders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({ itemtextgiven: null });
  const [selectedTenderForEdit, setSelectedTenderForEdit] = useState<TenderModel | undefined>();
  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);

  const [selectedTenderProducts, setSelectedTenderProducts] = useState<
    ProductModel[]
  >([]);

  const [apiResponseTenders, setApiResponseTenders] = useState<AxiosResponse<any> | AxiosError<any>>();


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
    if (filteredTenders.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredTenders.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredTenders.length / newlimitset) - 1);
      }
    }
  };

  const filteredTenders = applyFilters(tendersList, filters);
  const paginatedTenders = applyPagination(filteredTenders, page, limit);
  const theme = useTheme();
  const [openRow, setOpenRow] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const handleClickOpenEditDialog = (tender: TenderModel) => {
    setSelectedTenderForEdit(tender);
    setOpenDialog(true);
  };


  const handleClickOpenAddCategDialog = () => {
    setSelectedTenderForEdit(undefined); //lotnumber: '', id: 0, expdate: null
    setOpenDialog(true);
  };


  return (
    <React.Fragment>
      <Card>


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
                        onClick={() => handleClickOpenAddCategDialog()}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add Tender
                      </Button>
                    </Box>
                  </Grid>
                </>
              )
            }
            title="Tender List"
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

                <TableCell padding="none"></TableCell>
                <TableCell>Tender Code</TableCell>
                <TableCell>Approved Budget Amount

                  <TooltipIconButton
                    title="Approved Budget Amount"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />
                </TableCell>
                <TableCell>
                  Pre System Spending Amount
                  <TooltipIconButton
                    title="Pre System Spending Amount"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />

                </TableCell>

                <TableCell>
                  This System Spending Amount
                  <TooltipIconButton
                    title="This System Spending Amount"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />


                </TableCell>

                <TableCell>
                  Remaining Amount
                  <TooltipIconButton
                    title="Remaining Amount"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />

                </TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>General Notes</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTenders.map((tender) => {
                const isTenderSelected = selectedTenders.includes(tender.id);

                const handleTableRowClick = async (tenderId: number) => {
                  if (openRow) {
                    setSelectedTenderProducts([]);
                    setOpenRow(!openRow);
                    return;
                  }

                  setOpenRow(!openRow);

                  if (tenderId > 0) {
                    setSelectedTenderId(tenderId);

                    try {
                      const response =
                        await getSomeProductsByTenderId(tenderId);
                      if (response.status === 200) {
                        const products = response.data;

                        setSelectedTenderProducts(products);
                      }
                    } catch (error) {
                      setSelectedTenderProducts([]);
                    }
                  }
                };

                return (
                  <React.Fragment key={tender.id}>
                    <TableRow
                      sx={{ "& > *": { borderBottom: "unset" } }}
                      hover
                      key={tender.id}
                      selected={isTenderSelected}
                    >


                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          //onClick={() => setOpenRow(!openRow)}
                          onClick={() => handleTableRowClick(tender.id)}
                        >
                          {openRow && selectedTenderId === tender.id ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color={
                            tender.activestatusflag === true
                              ? "text.primary"
                              : "red"
                          }
                          gutterBottom
                          noWrap
                        >
                          {tender.tendercode}
                        </Typography>
                        <ProgressBar
                          initialBudget={tender.totalamount ?? 0}
                          totalAmountLeft={tender.remainingamount ?? 0}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {ccyFormat(tender.totalamount ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {ccyFormat(tender.presystemamountspent ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {ccyFormat(tender.thissystemamountspent ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {ccyFormat(tender.remainingamount ?? 0)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {tender.tendersuppliersassigneds?.map(tsa => tsa.sidNavigation.name).join(", ")}
                          {/* {tender.supplier?.name} */}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {tender.generalNotes}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        {hasAdminAccess(userContext?.currentUser) && (
                          <>
                            <Tooltip title="Edit Tender" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() =>
                                  handleClickOpenEditDialog(tender)
                                
                                }
                              >
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                         
                        )}
                      </TableCell>
                    </TableRow>

                    {selectedTenderId === tender.id &&
                      selectedTenderProducts &&
                      openRow &&
                      (selectedTenderProducts.length > 0 ? (
                        // Render the list of products if available

                        <TableRow key={`tender-${tender.id}`}>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={8}
                          >
                            <Collapse in={openRow} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                >
                                  {selectedTenderProducts.length.toString()}{" "}
                                  Products in Tender
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Product Code</TableCell>
                                      <TableCell>Product Name</TableCell>
                                      <TableCell>Available Quantity</TableCell>
                                      <TableCell align="right">
                                        Unit Price
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {selectedTenderProducts.map((product) => (
                                      <TableRow key={`product-${product.id}`}>
                                        <TableCell component="th" scope="row">
                                          {product.code}
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                          {product.availabletotalstockqty}
                                        </TableCell>
                                        <TableCell align="right">
                                          {ccyFormat(product.costprice)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Render a loading indicator/message if products are still being fetched
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={8}
                          >
                            <p>Loading products...</p>
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredTenders.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={
              !filteredTenders.length || filteredTenders.length <= 0 ? 0 : page
            }
            rowsPerPage={limit}
            rowsPerPageOptions={Pagingdefaultoptions}
          />
        </Box>
      </Card>

      <TenderDialog
        open={openDialog}
        onClose={handleCloseDialog}
        tender={selectedTenderForEdit}
        addNewTenderInState={addNewTenderInState}
        updateSingleTenderInState={updateSingleTenderInState}
      />

    </React.Fragment>
  );
};

TendersTable.propTypes = {
  tendersList: PropTypes.array.isRequired,
};

TendersTable.defaultProps = {
  tendersList: [],
};

export default TendersTable;
