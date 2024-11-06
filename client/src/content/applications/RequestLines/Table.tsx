import React, { FC, ChangeEvent, useState, useEffect } from "react";
import PropTypes from "prop-types";

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
  Zoom,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { ExpandMore, ExpandLess } from "@mui/icons-material";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CommentIcon from "@mui/icons-material/Comment";
import SingleRequestSendOrderIcon1 from "@mui/icons-material/Create";
import SingleRequestSendOrderIcon from "@mui/icons-material/PostAddOutlined";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import {
  ccyFormat,
  customDateFormat,
  CustomRequestLinesModel,
  hasAdminAccess,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
  POrderFormLine,
  ProductModel,
  stringAvatar,
} from "src/models/mymodels";
import BulkActions from "./BulkActions";
import BulkFilters, {
  ComboOptions,
  customComboOptions,
  Filters,
  getFiltersFromLocalStorage,
  setFiltersToLocalStorage,
} from "./BulkFilters";
import ConfirmationDialog from "./BulkApprovalConfirmationdialog";
import MoreRoundedIcon from "@mui/icons-material/MoreHorizTwoTone";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Label from "src/Components/Label";
import DecisionMenuButton from "./DecisionMenu";
import {
  getSomeProductsByIds,
  getSomeRequestsByIds,
} from "../../../services/user.service";
import PurchaseOrderDialog from "../../../Components/Shared/Finalglobalpoformdialog";
import { useAuth } from "../../../contexts/UserContext";
import GlobalProductInfoDialog from "../../../Components/Shared/ProductInfoDialog";
import CustomProductInfoTooltip from "../../../Components/Shared/CustomTooltip";
import ExpandableRowCell from "./ExpandableRowCell";
import LineStatusButton from "./LineStatusBtn";
import { useAlert } from "src/contexts/AlertsContext";

interface RequestsProps {
  className?: string;
  reqLinesListinitial: CustomRequestLinesModel[];
}

const getStatusButton = (
  requestCurrentDecision: string,
  linereqID: number,
  refreshUpdatedRow: any,
): JSX.Element => {
  let color1:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning" = "primary";

  switch (requestCurrentDecision) {
    case "Approved":
      color1 = "success";
      break;
    //case "Ordered":
    //    color1 = 'success'
    //    break;
    case "Pending Approval":
      color1 = "warning";
      break;
    case "Rejected":
      color1 = "error";
      break;
    case "Cancelled":
      color1 = "error";
      break;
    case "Received":
      color1 = "success";
      break;
    default:
      color1 = "primary";
      break;
  }

  return (
    /* <Label color={color1}>{requestDecision}</Label>*/
    <DecisionMenuButton
      color={color1}
      buttonvaluetext={requestCurrentDecision}
      linereqID={linereqID}
      setreqlines={refreshUpdatedRow}
    />
  );
};

const getSuppliersOptions = (
  reqLinesList: CustomRequestLinesModel[],
): ComboOptions[] => {
  let listItems: ComboOptions[] = [];
  listItems.push({ name: "All", id: 0 });
  reqLinesList.forEach(function (product) {
    listItems.push({
      name: product.linedefsuppliername,
      id: product.linedefsupplierid,
    });
  });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};

const getDynamicDecisionOptions = (
  reqLinesList: CustomRequestLinesModel[],
): ComboOptions[] => {
  let listItems: ComboOptions[] = [];
  listItems.push({ name: "All", id: 0 });

  reqLinesList.forEach(function (row) {
    const decisionId = row.linelastDecision?.decision?.id;
    if (decisionId !== undefined && decisionId > 0) {
      const decisionName = row.linelastDecision?.decision?.name || "";
      listItems.push({ name: decisionName, id: decisionId });
    }
  });

  return [...new Map(listItems.map((item) => [item.id, item])).values()];
};

const getDynamicProjectOptions = (
  reqLinesList: CustomRequestLinesModel[],
): ComboOptions[] => {
  let listItems: ComboOptions[] = [];
  listItems.push({ name: "All", id: 0 });

  reqLinesList.forEach(function (row) {
    const projectId = row.lineprojectid;
    if (projectId !== undefined && projectId !== null && projectId > 0) {
      const projectName = row.lineprojectname || "";
      listItems.push({ name: projectName, id: projectId });
    }
  });

  return [...new Map(listItems.map((item) => [item.id, item])).values()];
};

const getDynamicStatusOptions = (
  reqLinesList: CustomRequestLinesModel[],
): customComboOptions[] => {
  let listItems: customComboOptions[] = [];
  listItems.push({ name: "All", id: "0" });
  reqLinesList.forEach(function (row) {
    listItems.push({ name: row.linedynamicstatus, id: row.linedynamicstatus });
  });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};

const applyFilters = (
  reqLinesList: CustomRequestLinesModel[],
  filters: Filters,
): CustomRequestLinesModel[] => {
  return reqLinesList.filter((line) => {
    let matches = true;

    if (
      filters.itemstatus != null &&
      line.linepActivestatusFlag !== filters.itemstatus
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.itemdecisionid != null &&
      filters.itemdecisionid !== 0 &&
      line.linelastDecision?.decisionid !== filters.itemdecisionid
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.requestgroupid != null &&
      line.headerreqid !== filters.requestgroupid
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.itemdynamicstatus != null &&
      line.linedynamicstatus.toLowerCase() !==
      filters.itemdynamicstatus.toLowerCase()
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.itemsupid != null &&
      filters.itemsupid !== 0 &&
      line.linedefsupplierid !== filters.itemsupid
    ) {
      matches = false;
      return matches;
    }


    if (
      filters.itemprojectid != null &&
      filters.itemprojectid !== 0 &&
      (line.lineprojectid !== filters.itemprojectid)
    ) {
      matches = false;
      return matches;
    }



    if (filters.itemtextgiven !== undefined) {
      let givenvalue = (filters?.itemtextgiven ?? "").toUpperCase();

      if (
        givenvalue.length > 0 &&
        !(line.linepname && line.linepname.toUpperCase().includes(givenvalue)) &&
        !(
          line.linepbarcode && line.linepbarcode.toUpperCase().includes(givenvalue)
        ) &&
        !(
          line.linepcode &&
          line.linepcode.toUpperCase().includes(givenvalue)
        ) &&
        !(line.linedefsuppliername &&
          line.linedefsuppliername &&
          line.linedefsuppliername.toUpperCase().includes(givenvalue)
        )
      ) {
        matches = false;
        return matches;
      } else {
        // Handle other conditions
      }
    }



    return matches;
  });
};

const applyPagination = (
  reqLinesList: CustomRequestLinesModel[],
  page: number,
  limit: number,
): CustomRequestLinesModel[] => {
  return reqLinesList.slice(page * limit, page * limit + limit);
};

const ProductsTable: FC<RequestsProps> = ({ reqLinesListinitial }) => {
  const userContext = useAuth();
  const alert = useAlert();
  const [reqlines, setreqlines] =
    useState<CustomRequestLinesModel[]>(reqLinesListinitial);
  const [polines, setpolines] = useState<POrderFormLine[]>([]);

  const [selectedReqLines, setSelectedReqLines] = useState<number[]>([]);
  const selectedBulkActions = selectedReqLines.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  // const [filters, setFilters] = useState<Filters>({ dateFrom: null, dateTo: null, itemstatus: null, itemdecisionid: null, itemstock: null, itemtextgiven:null, itemdynamicstatus:null});
  const [filters, setFiltersState] = useState<Filters>({
    dateFrom: null,
    dateTo: null,
    requestgroupid: null,
    itemstatus: null,
    itemdecisionid: null,
    itemstock: null,
    itemtextgiven: null,
    itemdynamicstatus: null,
    itemprojectid: null,
  });

  const [
    openConfirmationDialogAfterDecisionChoosed,
    setopenConfirmationDialogAfterDecisionChoosed,
  ] = useState(false);
  const [expandPrimerList, setExpandPrimerList] = useState(false);

  const [decisionChoosen, setdecisionChoosen] = useState("");

  const [uniqueProductIds, setUniqueProductIds] = useState<number[]>([]);

  const handleBulkDecisionChoosedforSelectedLines = async (
    message: string,
  ): Promise<void> => {
    // Show the confirmation dialog with the provided message
    setdecisionChoosen(message);
    setopenConfirmationDialogAfterDecisionChoosed(true);
  };

  const handleCloseDialog = () => {
    // Close the dialog
    setopenConfirmationDialogAfterDecisionChoosed(false);
  };

  // Function to handle filter changes
  const handleFilterChange = (newFilters: Filters) => {
    setFiltersState(newFilters);
  };
  useEffect(() => {
    // Load filters from localStorage when the component mounts
    const storedFilters = getFiltersFromLocalStorage();
    if (storedFilters) {
      setFiltersState(storedFilters);
    }
  }, []);

  useEffect(() => {
    // Save filters to localStorage whenever they change
    setFiltersToLocalStorage(filters);
  }, [filters]);

  //const [updatedIds, setupdatedIds] = React.useState<number[] >([]);

  useEffect(() => {
    if (reqLinesListinitial.length > 0) {
      setreqlines(reqLinesListinitial);
    }
  }, [reqLinesListinitial]); // Makes the useEffect dependent on response.

  useEffect(() => {
    if (uniqueProductIds.length == 1) {
      console.log(uniqueProductIds, "yes");
      handleOpenPurchaseOrderDialog();
    }
  }, [uniqueProductIds]);

  const handleOpenPurchaseOrderDialog = async () => {
    const myOrderProducts: POrderFormLine[] =
      prepareSelectedProductsforPO ?? [];
    const uniqueProductIds1 = [
      ...new Set(myOrderProducts.map((item) => Number(item.id))),
    ];

    // console.log(uniqueProductIds1, 'yes');

    try {
      const response = await getSomeProductsByIds(uniqueProductIds1);
      if (response.status === 200) {
        const tempprodlist: ProductModel[] = response.data;

        // Create a map of product details using product IDs for quick access
        const productDetailsMap = new Map(
          tempprodlist.map((item) => [item.id.toString().toLowerCase(), item]),
        );

        myOrderProducts.forEach((p) => {
          const item = productDetailsMap.get(p.id.toString().toLowerCase());

          if (item) {
            p.defaultSupplierName = item.defaultSupplierName ?? "";
            p.defaultSupplierId = item.defaultSupplierId ?? 0;
            p.vatId = item.vatId ?? 0;
            p.vatRate = item.vatRate ?? 0;
            p.costprice = item.costprice ?? 0;
            p.punits = item.punits ?? "";
            p.minstockqty = item.minstockqty ?? 0;
            p.availabletotalstockqty = item.availabletotalstockqty ?? 0;
          }
        });

        const supplierId =
          prepareSelectedProductsforPO.length > 0
            ? prepareSelectedProductsforPO[0].defaultSupplierId
            : null;
        const isSameSupplier = prepareSelectedProductsforPO.every(
          (product) => product.defaultSupplierId === supplierId,
        );

        if (!isSameSupplier) {
          // Display error message or show a notification to inform the user that products have different suppliers
          alert.showAlert("Selected products have different suppliers! You cant create order!", "error");

          return;
        }

        //   console.log(myOrderProducts, 'afterapi');

        setpolines(myOrderProducts);
        setPurchaseOrderDialogOpen(true);
        //    console.log(myOrderProducts, "final");
      } else {
        // Handle error response
      }
    } catch (error) {
      // Handle API call error
    }
  };

  const handleSelectAllRequests = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedReqLines(
      event.target.checked ? reqlines.map((reqline) => reqline.linereqid) : [],
    );
  };

  const handleSelectOneReqLine = (
    event: ChangeEvent<HTMLInputElement>,
    reqLineID: number,
  ): void => {
    if (!selectedReqLines.includes(reqLineID)) {
      setSelectedReqLines((prevSelected) => [...prevSelected, reqLineID]);
    } else {
      setSelectedReqLines((prevSelected) =>
        prevSelected.filter((id) => id !== reqLineID),
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);
    if (filteredProducts.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredProducts.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredProducts.length / newlimitset) - 1);
      }
    }
  };

  const applyFilterforPOForm = (
    customreqlines: CustomRequestLinesModel[],
    selectedids: number[],
  ): POrderFormLine[] => {
    let finalinternalorder = [] as POrderFormLine[];
    const filteredReqLines: CustomRequestLinesModel[] = customreqlines.filter(
      (x) => selectedids.includes(x.linereqid),
    );

    finalinternalorder = filteredReqLines.map((reqLine) => {
      const pOrderLine: POrderFormLine = {
        id: reqLine.linepid.toString(),
        code: reqLine.linepcode,
        name: reqLine.linepname,
        orderQuantity: reqLine.lineqty,
        requestlineid: reqLine.linereqid,
        originalreqlineqty: reqLine.lineqty,
        editableCostpriceFlag: reqLine.linePrimers.length > 0,
        vatId: 0,
        vatRate: 0,
        minstockqty: 0,
        punits: "",
        availabletotalstockqty: 0,
        defaultSupplierId: 0,
        defaultSupplierName: "",
        costprice: 0,
        linePrimers: reqLine.linePrimers,
      };
      return pOrderLine;
    });

    return finalinternalorder;
  };

  const prepareSelectedProductsforPO = applyFilterforPOForm(
    reqlines,
    selectedReqLines,
  );
  const [isPurchaseOrderDialogOpen, setPurchaseOrderDialogOpen] =
    useState(false);


  const filteredProducts = applyFilters(reqlines, filters);
  const paginatedRequestLines = applyPagination(filteredProducts, page, limit);
  const selectedSomeRequests = selectedReqLines.length > 0 && selectedReqLines.length < reqlines.length;
  const selectedAllRequests = selectedReqLines.length === reqlines.length;
  const theme = useTheme();

  function refreshUpdatedRowsBatch(updatedLines: CustomRequestLinesModel[]) {
    setreqlines((prevLines) => {
      const updatedSet = new Set(updatedLines.map((line) => line.linereqid));
      return prevLines.map((line) => {
        if (updatedSet.has(line.linereqid)) {
          // Update the specific line with the updated values
          const updatedLine = updatedLines.find(
            (updatedLine) => updatedLine.linereqid === line.linereqid,
          );
          return updatedLine ? { ...line, ...updatedLine } : line;
        } else {
          return line;
        }
      });
    });
  }

  function refreshUpdatedRow(linetorefresh: CustomRequestLinesModel) {
    if (linetorefresh) {
      const nextCounters = reqlines.map((c) => {
        if (c.linereqid === linetorefresh.linereqid) {
          //    console.log(linetorefresh, "line");
          return linetorefresh;
        } else {
          // The rest haven't changed
          return c;
        }
      });

      setreqlines(nextCounters);
    }
  }
  const handleOrderSent = (updatethoseIds?: number[]) => {
    if (updatethoseIds && updatethoseIds.length > 0) {
      getSomeRequestsByIds(updatethoseIds).then(
        (response222) => {
          if (response222.status === 200) {
            let reqlinestorefresh: CustomRequestLinesModel[] = [];
            reqlinestorefresh = response222.data;
            // console.log(response222.data,"response data");
            refreshUpdatedRowsBatch(reqlinestorefresh);
            //reqlinestorefresh.forEach((element) => refreshUpdatedRow(element));
          } else {
            // Handle error response
          }
        },
        (error) => {
          // Handle API call error
        },
      );
    }
  };


  const handleClickSingleProductPO = (
    reqLineselected: CustomRequestLinesModel,
  ) => {
    setUniqueProductIds([]);
    setUniqueProductIds([reqLineselected.linereqid]);
    setSelectedReqLines([reqLineselected.linereqid]);

  };

  const [expandedRows, setExpandedRows] = useState<number[]>([]);



  return (
    <Card>
      {isPurchaseOrderDialogOpen && (
        <PurchaseOrderDialog
          orderLines={polines}
          onClose={() => {
            setPurchaseOrderDialogOpen(false);
            setSelectedReqLines([]);
          }}
          onOrderSent={handleOrderSent}

        />
      )}



      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions
            handleBulkDecisionChoosedforSelectedLines={(message) =>
              handleBulkDecisionChoosedforSelectedLines(message)
            }
            openCreatePOFormFunc={handleOpenPurchaseOrderDialog}
          />
        </Box>
      )}

      {!selectedBulkActions && (
        <CardHeader
          sx={{ pr: 2.6 }}

          title="Request List"
        />
      )}
      <Box flex={1} p={2}>
        <ConfirmationDialog
          open={openConfirmationDialogAfterDecisionChoosed}
          selectedRequestLinesID={selectedReqLines}
          decisionChoosen={decisionChoosen}
          onClose={handleCloseDialog}
          refreshUpdatedRowsBatch={(updatedLines: CustomRequestLinesModel[]) =>
            refreshUpdatedRowsBatch(updatedLines)
          }

        />
        <BulkFilters
          setmyFilters={handleFilterChange}
          filters={filters}
          suppliersArray={getSuppliersOptions(reqlines)}
          dynamicstatusOptionsArray={getDynamicStatusOptions(reqlines)}
          dynamicdecisionssArray={getDynamicDecisionOptions(reqlines)}
          dynamicProjectsArray={getDynamicProjectOptions(reqlines)}
        />
      </Box>
      <Divider />
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={{ verticalAlign: "top" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllRequests}
                  indeterminate={selectedSomeRequests}
                  onChange={handleSelectAllRequests}
                />
              </TableCell>
              <TableCell align="center">Request Group/Line IDs</TableCell>
              {/* <TableCell align="center">Request Line ID</TableCell>*/}
              <TableCell align="center">Request Date</TableCell>
              <TableCell align="center">By</TableCell>
              <TableCell>Product Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">REQUESTED QUANTITY</TableCell>
              <TableCell align="center">Ordered QUANTITY</TableCell>
              <TableCell align="center">Supplier</TableCell>
              {/*     <TableCell align="center">Decision</TableCell>*/}
              {/* <TableCell align="center">By</TableCell>*/}
              <TableCell align="center">Status</TableCell>

              {/*<TableCell align="center">Expected Delivery</TableCell>*/}
              {/*<TableCell align="center">Last Receiving</TableCell>*/}
              <TableCell align="left">More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRequestLines.map((reqline) => {
              const isLineSelected = selectedReqLines.includes(
                reqline.linereqid,
              );
              const shouldShowTable = (reqline.linePrimers?.length ?? 0) > 0;
              const isRowExpanded = expandedRows.includes(reqline.linereqid);

              const handleToggleExpansion = (rowId: number) => {
                // Toggle the expansion state for the specified row
                setExpandedRows((prevRows) =>
                  prevRows.includes(rowId)
                    ? prevRows.filter((id) => id !== rowId)
                    : [...prevRows, rowId],
                );
              };

              function handleButtonClick(headerreqid: number): void {
                // Use filter to select all request lines with matching headerreqid
                const selectedLines = reqlines.filter(
                  (reqline) => reqline.headerreqid === headerreqid,
                );

                // Extract the linereqid values from the selected lines
                const selectedLineIds = selectedLines.map(
                  (reqline) => reqline.linereqid,
                );

                // Update the selectedReqLines state with the selected line IDs
                setSelectedReqLines(selectedLineIds);
                //    setFiltersState({ dateFrom: null, dateTo: null, requestgroupid: headerreqid, itemstatus: null, itemdecisionid: null, itemstock: null, itemtextgiven: null, itemdynamicstatus: null });
              }

              return (
                <React.Fragment key={reqline.linereqid}>
                  <TableRow
                    hover
                    key={reqline.linereqid}
                    selected={isLineSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isLineSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOneReqLine(event, reqline.linereqid)
                        }
                        value={isLineSelected}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleButtonClick(reqline.headerreqid)}
                        style={{
                          marginLeft: "5px",
                          fontSize: "14px",

                        }}
                      >
                        {reqline.headerreqid}/{reqline.linereqid}
                      </Button>
                    </TableCell>
                    {/*<TableCell align="center">*/}

                    {/*        {reqline.linereqid}*/}

                    {/*</TableCell>*/}

                    <TableCell align="center">
                      <Typography variant="body2" color="text" noWrap>
                        {customDateFormat(reqline.headerreqdate, "DateOnly")}
                        {/*   {format(new Date(reqline.headerreqdate), "dd/MM/yyyy")}*/}
                        <Divider></Divider>
                        {customDateFormat(reqline.headerreqdate, "TimeOnly")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        arrow
                        TransitionComponent={Zoom}
                        title={
                          reqline.headerreqbyuserfirstn +
                          " " +
                          reqline.headerreqbyuserlastn
                        }
                      >
                        <Avatar
                          {...stringAvatar(
                            reqline.headerreqbyuserfirstn +
                            " " +
                            reqline.headerreqbyuserlastn,
                          )}
                        />
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <GlobalProductInfoDialog
                        productId={reqline.linepid}
                        buttontext={reqline.linepcode}
                        productStatus={reqline.linepActivestatusFlag}
                      />

                      {/*<Typography*/}
                      {/*    variant="body1" fontWeight="bold"*/}
                      {/*    color="text.primary"*/}

                      {/*    gutterBottom noWrap>*/}
                      {/*    {reqline.linepcode}*/}

                      {/*</Typography>*/}
                    </TableCell>
                    <ExpandableRowCell
                      reqline={reqline}
                      onToggleExpansion={() =>
                        handleToggleExpansion(reqline.linereqid)
                      }
                    />


                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {reqline.lineqty}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {reqline.lineorderedqty}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      {reqline.linedefsuppliername}
                    </TableCell>


                    <TableCell align="center">
                      <LineStatusButton
                        reqline={reqline}
                        refreshUpdatedRow={refreshUpdatedRow}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={0}>
                        <CustomProductInfoTooltip
                          title={"Product Info"}
                          reqline={reqline}
                        />

                        {reqline.headerreqnotes &&
                          reqline.headerreqnotes.length > 0 && (
                            <Tooltip
                              title={
                                <>
                                  <b>Notes with request</b>
                                  <Divider></Divider>
                                  {"" + reqline.headerreqnotes}
                                </>
                              }
                              arrow
                            >
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                              >
                                <CommentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                        {userContext &&
                          userContext.currentUser &&
                          userContext.currentUser.claimCanMakePo === true &&
                          reqline.linelastDecision &&
                          reqline.linelastDecision.decisionid &&
                          reqline.linelastDecision.decision?.name.toLowerCase() ==
                          "Approved".toLowerCase() &&
                          reqline.linedynamicstatus?.toLowerCase() ==
                          "Approved".toLowerCase() && (
                            <Tooltip
                              title={"Create an order for the selected request"}
                              arrow
                            >
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
                                  handleClickSingleProductPO(reqline)
                                }
                              >
                                <SingleRequestSendOrderIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                        {reqline.linerequrgentflag && (
                          <Tooltip title={"Urgent"} arrow>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.error.lighter,
                                },
                                color: theme.palette.error.main,
                              }}
                              color="inherit"
                              size="small"
                            >
                              <PriorityHighIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {reqline.linereqcomment &&
                          reqline.linereqcomment.length > 0 && (
                            <Tooltip title={reqline.linereqcomment} arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                              >
                                <CommentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}


                      </Stack>
                    </TableCell>
                  </TableRow>

                  {shouldShowTable && isRowExpanded && (
                    <TableRow>
                      <TableCell colSpan={13}>
                        {reqline.linePrimers &&
                          reqline.linePrimers.length > 0 && (
                            <>
                              <Collapse in={isRowExpanded}>
                                <TableContainer>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>SI</TableCell>
                                        <TableCell>NS</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {reqline.linePrimers.map(
                                        (primer, index) => (
                                          <TableRow key={index}>
                                            <TableCell>
                                              <Typography
                                                variant="body1"
                                                style={{ whiteSpace: "nowrap" }}
                                              >
                                                {`${primer.sequenceIdentifier}`}
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography
                                                variant="body1"
                                                style={{ whiteSpace: "nowrap" }}
                                              >
                                                {`${primer.nucleotideSequence}`}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        ),
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Collapse>
                            </>
                          )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredProducts.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={
            !filteredProducts.length || filteredProducts.length <= 0 ? 0 : page
          }
          rowsPerPage={limit}
          rowsPerPageOptions={Pagingdefaultoptions}
        />
      </Box>
    </Card>
  );
};

ProductsTable.propTypes = {
  reqLinesListinitial: PropTypes.array.isRequired,
};

ProductsTable.defaultProps = {
  reqLinesListinitial: [],
};

export default ProductsTable;
