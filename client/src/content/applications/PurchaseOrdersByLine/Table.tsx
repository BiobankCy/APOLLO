import PropTypes from "prop-types";
import React, { ChangeEvent, FC, useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import {
  ccyFormat,
  customDateFormat,
  CustomPurchaseOrderLine,
  CustomPurchaserderWithSupplierInvoicesModel,
  CustomSupplierInvoiceModel,
  hasAdminAccess,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
  EditSupplierInvoiceModel,
  VatRateModel,
} from "src/models/mymodels";
import { AxiosResponse } from "axios";
import { useAuth } from "src/contexts/UserContext";
import {
  getAllDataForOrderLinesformByIds,
  getPORelatedinvoices,
  sendOrderByEmail,
  aswitchPorderLineClosedStatus,
  markOrderAsSent,
  updateSupplierInvoice,
  switchPorderLineCancelledStatus,
  getInvoiceImage,
  uploadInvoiceDocument,
  deleteInvoiceDocument,
} from "../../../services/user.service";

import BulkFilters, {
  ComboOptionsCustom,
  getFiltersFromLocalStorage,
  setFiltersToLocalStorage,
  Filters,
} from "./BulkFilters";

import RightDrawerReceiving from "../../../Components/Shared/RightDrawerReceiving";

import PrimersTooltipIconButton from "../../../Components/Shared/TooltipIconButton";
import BulkActions from "./BulkActions";
import {
  AttachFileOutlined,
  MarkEmailRead,
  MarkEmailUnreadOutlined,
  ReceiptLong,
  ReceiptLongOutlined,
  SendOutlined,
} from "@mui/icons-material";
import { ComboOptions } from "../Suppliers/BulkFilters";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpIcon from "@mui/icons-material/Help";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import GlobalProductInfoDialog from "../../../Components/Shared/ProductInfoDialog";

import CancelTwoTone from "@mui/icons-material/DisabledByDefault";
import ImageDialog from "../../../Components/Shared/ImageDialog";
import RightDrawerV2 from "src/Components/Shared/ReceivingProcedureDialog";
import HelpTooltipButton from "../../../Components/Shared/HelpTooltipButton";

interface PordersTableProps {
  className?: string;
  pordersCustomData: CustomPurchaseOrderLine[];
  updatePorderLinesList: any;
  vatRates: VatRateModel[];
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 36,
      height: 36,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const getPOStatusesFilter = (
  mylist: CustomPurchaseOrderLine[],
): ComboOptionsCustom[] => {
  const distinctStatuses = Array.from(
    new Set(mylist.map((item) => item.dynamicstatus)),
  ).filter((status) => status !== null && status !== "");
  //   const listItems: ComboOptionsCustom[] = [{ name: 'All', id: '0' }];
  const listItems: ComboOptionsCustom[] = [];
  distinctStatuses.forEach((status, index) => {
    listItems.push({ name: status ?? "", id: status ?? "" });
  });

  return listItems;
};

const applyFilters = (
  pordersList: CustomPurchaseOrderLine[],
  filters: Filters,
): CustomPurchaseOrderLine[] => {
  return pordersList.filter((porderline) => {
    

    if (
      (filters.orderstatusids === undefined ||
        !filters.orderstatusids.includes("0")) &&
      filters.orderstatusids !== undefined &&
      filters.orderstatusids.length > 0 &&
      porderline?.dynamicstatus &&
      filters.orderstatusids.every(
        (statusId) =>
          statusId.toLowerCase().trim() !==
          porderline.dynamicstatus?.toLowerCase().trim(),
      )
    ) {
      return false;
    }

    if (filters.itemtextgiven !== undefined) {
      let givenvalue = (filters?.itemtextgiven ?? "").toUpperCase();

      if (
        givenvalue.length > 0 &&
        !(porderline.pname && porderline.pname.toUpperCase().includes(givenvalue)) &&

        !(porderline.pcode && porderline.pcode.toUpperCase().includes(givenvalue)
        ) &&
        !(porderline.pord?.supName && porderline.pord?.supName.toUpperCase().includes(givenvalue)
        )
        &&
        !(porderline.ponotes && porderline.ponotes.toUpperCase().includes(givenvalue)
        )
        &&
        !(porderline.pbrname && porderline.pbrname.toUpperCase().includes(givenvalue)
        )
        &&
        !(porderline.pcatname && porderline.pcatname.toUpperCase().includes(givenvalue)
        )
      ) {

        return false;
      } else {
        // Handle other conditions
      }
    }





    if (
      filters.supplierid != null &&
      filters.supplierid !== 0 &&
      porderline.pord?.supplierid !== filters.supplierid
    ) {
      return false;
    }
    if (
      filters.requestedbyid != null &&
      filters.requestedbyid !== 0 &&
      porderline.reqbyuid !== filters.requestedbyid
      // porderline.requestline?.headerreqbyuserid !== filters.requestedbyid
    ) {
      return false;
    }
    if (
      filters.brandid != null &&
      filters.brandid !== 0 &&
      porderline.pbrandid !== filters.brandid
    ) {
      return false;
    }
    if (
      filters.tenderid != null &&
      filters.tenderid !== 0 &&
      porderline.tenderid !== filters.tenderid
    ) {
      return false;
    }
    if (
      filters.categoryid != null &&
      filters.categoryid !== 0 &&
      porderline.pcatid !== filters.categoryid
    ) {
      return false;
    }
    if (
      filters.subcategoryid != null &&
      filters.subcategoryid !== 0 &&
      porderline.psubcatid !== filters.subcategoryid
    ) {
      return false;
    }

    const orderCreatedDate = porderline.pord?.ordercreateddate;
    const fromDate = filters.fromdate;
    const toDate = filters.todate;

    if (orderCreatedDate) {
      const orderCreatedDateWithoutTime = new Date(orderCreatedDate);
      orderCreatedDateWithoutTime.setHours(0, 0, 0, 0);

      if (fromDate) {
        const fromDateWithoutTime = new Date(fromDate);
        fromDateWithoutTime.setHours(0, 0, 0, 0);

        if (orderCreatedDateWithoutTime < fromDateWithoutTime) {
          return false;
        }
      }

      if (toDate) {
        const toDateWithoutTime = new Date(toDate);
        toDateWithoutTime.setHours(0, 0, 0, 0);

        if (orderCreatedDateWithoutTime > toDateWithoutTime) {
          return false;
        }
      }
    }

    return true;
  });
};

const applyPagination = (
  catsList: CustomPurchaseOrderLine[],
  page: number,
  limit: number,
): CustomPurchaseOrderLine[] => {
  return catsList.slice(page * limit, page * limit + limit);
};

const selectedPOLinesForBulkActions = (
  poLinesList: CustomPurchaseOrderLine[],
  selectedids: number[],
): CustomPurchaseOrderLine[] => {
  return poLinesList.filter((line) => selectedids.includes(line.lineid));
};

const PordersByLineTable: FC<PordersTableProps> = ({
  pordersCustomData,
  updatePorderLinesList,
  vatRates,
}) => {
  const userContext = useAuth();
 
  const [selectedPOLines, setSelectedPOlines] = useState<number[]>([]);
  const selectedBulkActions = selectedPOLines.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  // const [filters, setFilters] = useState<Filters>({ itemtextgiven: null, orderstatusids: ['Partially Received','Pending'] });
  const [filters, setFiltersState] = useState<Filters>({
    itemtextgiven: null,
    orderstatusids: [],
  });

  const [openSupplierInvoicesDialog, setOpenSupplierInvoicesDialog] =
    useState<boolean>(false);
  const [poInvoices, setPOinvoices] =
    useState<CustomPurchaserderWithSupplierInvoicesModel>();

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
    setErrorMessage("");
  };

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

 

  function handleClickCancelOrder(): void {
    setConfirmationDialogOpen(true);
  }
  const handleCloseDialogOfOrderCancellation = (): void => {
    setConfirmationDialogOpen(false);
    setErrorDialogOpen(false);
    setselectedOrderIDForSendingByEmail(0);
  };

  const handleCancelConfirmation = async (porderid: number) => {
    setConfirmationDialogOpen(false);

    try {
      setIsLoading(true);

      const response = await switchPorderLineCancelledStatus(porderid);

      if (response.status === 200 && response.data) {
        const updatedRows = response.data;
        const updatedList = pordersCustomData.map((c) => {
          const matchingRow = updatedRows.find(
            (row: CustomPurchaseOrderLine) => row.lineid === c.lineid,
          ) as CustomPurchaseOrderLine;

          return matchingRow || c;
        });

        updatePorderLinesList(updatedList);
      } else {
        const errorMessage = `Status ${response.status ?? "Unknown"} - ${response.data ?? "Unknown"}`;
        setErrorMessage(errorMessage);
        setErrorDialogOpen(true);
      }
    } catch (error: any) {
      //  const errorMessage = `An error occurred while cancelling the order: ${error.message ?? 'Unknown'}`;
      const errorMessage = `Status ${error.response?.status ?? "Unknown"} - ${error.response?.data ?? error.message ?? "Unknown"}`;
      setErrorMessage(errorMessage);
      setErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
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
    } else {
      setFiltersState((filters: Filters) => ({
        ...filters,
        orderstatusids: ["Partially Received", "Pending"],
      }));

      //  setFiltersState(storedFilters);
    }
  }, []);

  useEffect(() => {
    // Save filters to localStorage whenever they change
    setFiltersToLocalStorage(filters);
  }, [filters]);

  const handleCloseDialog = (): void => {
    handleCancelEditInvoice();
    setOpenSupplierInvoicesDialog(false);
    setPOinvoices(undefined);
    //setMessageOfResponseOfEmailProcess('');
  };

  const [apiResponse, setApiResponse] = useState<AxiosResponse>();

  const refreshPORDERS = (porderid: number): void => {
    // console.log(prevFilters1);
    updatePlinesfromResponse(porderid);
    setSelectedPOlines([]);
    // updatePorderLinesList(prevorderlines);
  };
  const [
    selectedOrderIDForSendingByEmail,
    setselectedOrderIDForSendingByEmail,
  ] = React.useState(0);
  const [openSendOrderbyEmail, setopenSendOrderbyEmail] = React.useState(false);
  const handleCloseSendOrderbyEmail = () => {
    setopenSendOrderbyEmail(false);
    setselectedOrderIDForSendingByEmail(0);
    setMessageOfResponseOfEmailProcess("");
    //  setApiResponse(undefined);
  };
  const [sendingEmailProcessStatus, setSendingEmailProcessStatus] =
    useState(false);
  const [messageOfResponseOfEmailProcess, setMessageOfResponseOfEmailProcess] =
    useState("");


  const updatePlinesfromResponse = (orderid: number) => {
    //  const ids: number[] = orderlines.map((orderline) => orderline.id);
    // const distinctIds = [...new Set(ids)];

    getAllDataForOrderLinesformByIds(orderid)
      .then((response) => {
        setApiResponse(response);
        if (response.status === 200) {
          if (response.data) {
            const updatedRows = response.data;

            const updatedList = pordersCustomData.map((c) => {
              const matchingRow = updatedRows.find(
                (row: CustomPurchaseOrderLine) => row.lineid === c.lineid,
              ) as CustomPurchaseOrderLine;

              if (matchingRow) {
                return matchingRow;
              } else {
                return c;
              }
            });

            updatePorderLinesList(updatedList);
          }
        } else {
          console.log(response.data, "Error updating pstatus as Sent!");
        }
      })
      .catch((error) => {
        console.log(error, "Error updating pstatus as Sent!");
        // setApiResponse(error);
      });
  };


  const selectedSomePOlines =
    selectedPOLines.length > 0 &&
    selectedPOLines.length < pordersCustomData.length;

  const selectedAllPOlines =
    selectedPOLines.length === pordersCustomData.length;

  const handleSelectAllCategories = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedPOlines(
      event.target.checked
        ? pordersCustomData.map((orderline) => orderline.lineid)
        : [],
    );
  };

  const handleSelectOnePOline = (
    event: ChangeEvent<HTMLInputElement>,
    orderlineid: number,
  ): void => {
    if (!selectedPOLines.includes(orderlineid)) {
      setSelectedPOlines((prevSelected) => [...prevSelected, orderlineid]);
    } else {
      setSelectedPOlines((prevSelected) =>
        prevSelected.filter((id) => id !== orderlineid),
      );
    }
  };

  const getInvoicesFromApiNowAndOpenDialog = (orderID: number): void => {
    setPOinvoices(undefined);

    getPORelatedinvoices(orderID)
      .then((response) => {
        setApiResponse(response);
        if (response.status === 200) {
          if (response.data) {
            //    setselectedOrderIDForSendingByEmail(orderId);
            setOpenSupplierInvoicesDialog(true);

            const porderWithInvoices = response.data;
            setPOinvoices(porderWithInvoices);
          }
        } else {
          console.log(response.data, "Error getting invoices!");
        }
      })
      .catch((error) => {
        console.log(error, "Error getting invoices!");
        // setApiResponse(error);
      });

  };

  const markAsClosed = async (
    event: ChangeEvent<HTMLInputElement>,
    orderlineid: number,
  ) => {
    try {
      //  setIsLoading(true);

      const response = await aswitchPorderLineClosedStatus(orderlineid);

      if (response.status === 200 && response.data) {
        const updatedRows = response.data;
        const updatedList = pordersCustomData.map((c) => {
          const matchingRow = updatedRows.find(
            (row: CustomPurchaseOrderLine) => row.lineid === c.lineid,
          ) as CustomPurchaseOrderLine;

          return matchingRow || c;
        });

        updatePorderLinesList(updatedList);
      } else {
        const errorMessage = `Status ${response.status ?? "Unknown"} - ${response.data ?? "Unknown"}`;
        console.log(errorMessage, errorMessage);
        
      }
    } catch (error: any) {
      console.log(error, "Error updating closed status!");
     
    } finally {
      //  setIsLoading(false);
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);

    if (filteredPorderLines.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredPorderLines.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredPorderLines.length / newlimitset) - 1);
      }
    }
  };

  const filteredPorderLines = applyFilters(pordersCustomData, filters);
  const paginatedPorders = applyPagination(filteredPorderLines, page, limit);

  const theme = useTheme();

  const handleSendByEmail = (porderid: number) => {
    setSendingEmailProcessStatus(true); // Set loading state to true before making the API call

    if (selectedOrderIDForSendingByEmail > 0) {
      sendOrderByEmail(porderid)
        .then((response) => {
          if (response) {
            if (response.status === 200) {
              const result = response.data ?? null;
              if (result.result === true) {
                setMessageOfResponseOfEmailProcess("Order sent successfully."); // Show success message
                updatePlinesfromResponse(porderid);
                handleCloseSendOrderbyEmail();
              } else {
                setMessageOfResponseOfEmailProcess("Error: " + result.message); // Show error message when result.result is false
              }
            } else {
              setMessageOfResponseOfEmailProcess(
                "Error: Unexpected response status.",
              ); // Show error message when response status is not 200
            }
          } else {
            setMessageOfResponseOfEmailProcess("Error: No response received."); // Show error message when no response is received
          }
        })
        .catch((error) => {
          setMessageOfResponseOfEmailProcess("Error: " + error.message); // Show error message when an error occurs
        })
        .finally(() => {
          setSendingEmailProcessStatus(false); // Set loading state to false after API call is completed
        });
    }
  };
  const handleMarkAsSentByEmail = (porderid: number) => {
    setSendingEmailProcessStatus(true); // Set loading state to true before making the API call

    if (selectedOrderIDForSendingByEmail > 0) {
      markOrderAsSent(porderid)
        .then((response) => {
          if (response) {
            if (response.status === 200) {
              const result = response.data ?? null;
              if (result.result === true) {
                setMessageOfResponseOfEmailProcess(
                  'Order "marked as sent" successfully.',
                ); // Show success message
                updatePlinesfromResponse(porderid);
                handleCloseSendOrderbyEmail();
              } else {
                setMessageOfResponseOfEmailProcess("Error: " + result.message); // Show error message when result.result is false
              }
            } else {
              setMessageOfResponseOfEmailProcess(
                "Error: Unexpected response status.",
              ); // Show error message when response status is not 200
            }
          } else {
            setMessageOfResponseOfEmailProcess("Error: No response received."); // Show error message when no response is received
          }
        })
        .catch((error) => {
          setMessageOfResponseOfEmailProcess("Error: " + error.message); // Show error message when an error occurs
        })
        .finally(() => {
          setSendingEmailProcessStatus(false); // Set loading state to false after API call is completed
        });
    }
  };

  const getSuppliersOptions = (
    pordersCustomData: CustomPurchaseOrderLine[],
  ): ComboOptions[] => {
    let listItems: ComboOptions[] = [];
    listItems.push({ name: "All", id: 0 });
    pordersCustomData.forEach(function (order) {
      listItems.push({
        name: order.pord?.supName ?? "",
        id: order.pord?.supplierid ?? 0,
      });
    });

    return [...new Map(listItems.map((item) => [item["id"], item])).values()];
  };

  const getReqEmpsOptions = (pordersCustomData: CustomPurchaseOrderLine[],): ComboOptions[] => {

    let listItems: ComboOptions[] = [];
    listItems.push({ name: "All", id: 0 });
    pordersCustomData.forEach(function (order) {
      const name = order.reqfn + " " + order.reqln;
      const id = order.reqbyuid;

      if (name !== undefined && id !== undefined && name !== null && id !== null) {
        listItems.push({ name, id });
      }
    });

    return [...new Map(listItems.map((item) => [item["id"], item])).values()];
  };

  const getBrandOptions = (
    pordersCustomData: CustomPurchaseOrderLine[],
  ): ComboOptions[] => {
    let listItems: ComboOptions[] = [];
    listItems.push({ name: "All", id: 0 });
    pordersCustomData.forEach(function (order) {
      const name = order.pbrname;
      const id = order.pbrandid;
      if (name !== undefined && id !== undefined) {
        listItems.push({ name, id });
      }
    });

    return [...new Map(listItems.map((item) => [item["id"], item])).values()];
  };

  const getTenderOptions = (
    pordersCustomData: CustomPurchaseOrderLine[],
  ): ComboOptions[] => {
    let listItems: ComboOptions[] = [];
    listItems.push({ name: "All", id: 0 });
    pordersCustomData.forEach(function (order) {
      const name = order.tendercode ?? undefined;
      const id = order.tenderid ?? undefined;
      if (name !== undefined && id !== undefined) {
        listItems.push({ name, id });
      }
    });

    return [...new Map(listItems.map((item) => [item["id"], item])).values()];
  };
  const getCategoryOptions = (
    pordersCustomData: CustomPurchaseOrderLine[],
  ): ComboOptions[] => {
    let listItems: ComboOptions[] = [];
    listItems.push({ name: "All", id: 0 });
    pordersCustomData.forEach(function (order) {
      const name = order.pcatname ?? undefined;
      const id = order.pcatid ?? undefined;
      if (name !== undefined && id !== undefined) {
        listItems.push({ name, id });
      }
    });

    return [...new Map(listItems.map((item) => [item["id"], item])).values()];
  };
  const getsubCategoryOptions = (
    pordersCustomData: CustomPurchaseOrderLine[],
  ): ComboOptions[] => {
    let listItems: ComboOptions[] = [];
    listItems.push({ name: "All", id: 0 });
    pordersCustomData.forEach(function (order) {
      const name = order.psubname ?? undefined;
      const id = order.psubcatid ?? undefined;
      if (name !== undefined && id !== undefined) {
        listItems.push({ name, id });
      }
    });

    return [...new Map(listItems.map((item) => [item["id"], item])).values()];
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedInvoice, setEditedInvoice] =
    useState<CustomSupplierInvoiceModel | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditInvoiceButtonClick = (
    invoice: CustomSupplierInvoiceModel,
  ) => {
    setEditedInvoice(invoice);
    setIsEditMode(true);
    setOpenEditDialog(true);
  };

  const handleSaveInvoiceButtonClick = async () => {
    if (editedInvoice) {
      const requestInvoiceEditedData: EditSupplierInvoiceModel = {
        invoiceid: editedInvoice.invoiceid ?? 0,
        //orderidrelatedtoinvoice:  poInvoices?.orderid ?? 0,
        // docno: editedInvoice.docno ?? "",
        shippingandhandlingcostexcludingvat:
          editedInvoice.shippingandhandlingcostexcludingvat ?? 0,
        shippingandhandlingcostvatindex:
          editedInvoice.shippingandhandlingcostvatindex ?? 0,
      };

      updateSupplierInvoice(requestInvoiceEditedData)
        .then((response) => {
          setApiResponse(response);
          if (response.status === 200) {
            if (response.data) {
              const updatedInvoice = response.data;

              const updatedInvoices = poInvoices?.invoices?.map((invoice) => {
                if (invoice.invoiceid === updatedInvoice.invoiceid) {
                  // If the invoiceid matches, update this invoice
                  return updatedInvoice;
                }
                // Otherwise, return the original invoice
                return invoice;
              });

              // Update the state with the modified invoices
              setPOinvoices(
                (
                  prevPOInvoices:
                    | CustomPurchaserderWithSupplierInvoicesModel
                    | undefined,
                ) => ({
                  ...prevPOInvoices!,
                  invoices: updatedInvoices,
                }),
              );

            
              handleCancelEditInvoice();
            }
          } else {
            console.log(response.data, "Error getting invoices!");
          }
        })
        .catch((error) => {
          console.log(error, "Error getting invoices!");
          // setApiResponse(error);
        });
       
       
    }
    setOpenEditDialog(false);
  };

  const handleCancelEditInvoice = () => {
    setEditedInvoice(null);
    setIsEditMode(false);
    setOpenEditDialog(false);
  };

  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false);
  //const [imageBlobUrl, setImageBlobUrl] = useState<string>('');

  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  const handleDeleteDocument = async (invoiceId: number) => {
    try {
      const response = await deleteInvoiceDocument(invoiceId);
      if (response.status === 200) {
        // File uploaded successfully
        // Update the invdocexist property in the state

        setPOinvoices((prevInvoices) => {
          if (!prevInvoices) {
            // Handle the case when the state is not initialized
            return prevInvoices;
          }

          const updatedInvoices = { ...prevInvoices };

          if (updatedInvoices.invoices) {
            const invoiceIndex = updatedInvoices.invoices.findIndex(
              (invoice) => invoice.invoiceid === invoiceId,
            );

            if (invoiceIndex !== -1) {
              updatedInvoices.invoices[invoiceIndex].invdocexist = false;
            }
          }

          return updatedInvoices;
        });
        // Clear the selected file
        setSelectedFile(null);
      } else {
        // Handle unexpected status codes or errors
        console.error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete document", error);
      // Handle error appropriately
    }
  };

  const handleOpenDocument = async (invoiceId: number) => {
    try {
      const response = await getInvoiceImage(invoiceId);
      const { data, headers } = response;

      const contentType = headers["content-type"];

      // Set the Blob URL and file type to state
      setFileUrl(URL.createObjectURL(new Blob([data], { type: contentType })));
      setFileType(contentType);

      // Open the dialog
      setOpenImageDialog(true);
    } catch (error) {
      console.error("Failed to open document", error);
      // Handle error appropriately
    }
  };

  const handleCloseImageDialog = () => {
    // Close the dialog and revoke the Blob URL
    setOpenImageDialog(false);
    URL.revokeObjectURL(fileUrl);
  };
  //  const handleCloseImageDialog = () => {
  //    // Close the dialog and revoke the Blob URL
  //    setOpenImageDialog(false);
  //    URL.revokeObjectURL(imageBlobUrl);

  //};

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Validate file type here
    if (file && /\.(pdf|png|jpe?g)$/i.test(file.name)) {
      setSelectedFile(file);
    } else {
      // Display an error message or take appropriate action
      console.error(
        "Invalid file type. Please select a PDF, PNG, or JPEG file.",
      );
      setSelectedFile(null);
    }


  };


  const handleUpload = async (invoiceId: number) => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await uploadInvoiceDocument(invoiceId, formData);

        // Check if the status code is 200 (indicating success)
        if (response.status === 200) {
          // File uploaded successfully
          // Update the invdocexist property in the state

          setPOinvoices((prevInvoices) => {
            if (!prevInvoices) {
              // Handle the case when the state is not initialized
              return prevInvoices;
            }

            const updatedInvoices = { ...prevInvoices };

            if (updatedInvoices.invoices) {
              const invoiceIndex = updatedInvoices.invoices.findIndex(
                (invoice) => invoice.invoiceid === invoiceId,
              );

              if (invoiceIndex !== -1) {
                updatedInvoices.invoices[invoiceIndex].invdocexist = true;
              }
            }

            return updatedInvoices;
          });
          // Clear the selected file
          setSelectedFile(null);
        } else {
          // Handle unexpected status codes or errors
          console.error(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        // Handle error appropriately
        console.error("Error during file upload:", error);
      }
    }
  };

  const determineDocumentType = (documentData: Uint8Array): "image" | "pdf" => {
   
    // Assume it's an image if the first byte is 0xFF (JPEG)

    if (documentData.length > 0 && documentData[0] === 0xff) {
      return "image";
    } else {
      return "pdf";
    }
  };

  const openImageInNewTab = (imageData: Uint8Array) => {
    // Convert Uint8Array to base64
    const base64Image = btoa(String.fromCharCode.apply(null, imageData as any));

    // Open the image in a new tab
    const newTab = window.open();
    newTab?.document.write(
      `<img src="data:image/jpeg;base64,${base64Image}" />`,
    );
  };

  const openPdfInNewTab = (pdfData: Uint8Array) => {
    // Convert Uint8Array to array of numbers
    const dataArray = Array.from(pdfData);

    // Convert array of numbers to base64
    const base64Pdf = btoa(String.fromCharCode.apply(null, dataArray));

    // Open the PDF in a new tab
    const newTab = window.open();
    newTab?.document.write(
      `<embed width="100%" height="100%" src="data:application/pdf;base64,${base64Pdf}" type="application/pdf" />`,
    );
  };

 

  return (
    <React.Fragment>
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
            <BulkActions
              selectedOrderLines={selectedPOLinesForBulkActions(
                pordersCustomData,
                selectedPOLines,
              )}
              refreshPORDERS={refreshPORDERS}
            />
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
                      {/*<Button*/}
                      {/*    sx={{ ml: 1 }}*/}
                      {/*    variant="contained"*/}
                      {/*                onClick={() => handleClickOpenAddCategDialog()}*/}

                      {/*    startIcon={<AddTwoToneIcon fontSize="small" />}*/}
                      {/*>*/}
                      {/*        Add Order*/}
                      {/*</Button>*/}
                    </Box>
                  </Grid>
                </>
              )
            }
            title="Orders"
          />
        )}

        <Box flex={1} p={2}>
          <BulkFilters
            setmyFilters={handleFilterChange}
            filters={filters}
            statusfilter={getPOStatusesFilter(pordersCustomData)}
            suppliersArray={getSuppliersOptions(pordersCustomData)}
            empArray={getReqEmpsOptions(pordersCustomData)}
            brandsArray={getBrandOptions(pordersCustomData)}
            tendersArray={getTenderOptions(pordersCustomData)}
            categoriesArray={getCategoryOptions(pordersCustomData)}
            subcategoriesArray={getsubCategoryOptions(pordersCustomData)}
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
                    checked={selectedAllPOlines}
                    indeterminate={selectedSomePOlines}
                    onChange={handleSelectAllCategories}
                  />
                </TableCell>

                {/*  <TableCell>Order Line ID</TableCell>*/}
                <TableCell align="center">Order Group/Line IDs</TableCell>

                <TableCell align="left">Product Code</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Requested By</TableCell>
                <TableCell align="left">Ordered By</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Ordered Quantity</TableCell>
                <TableCell align="center">
                  Received Quantity

                  <HelpTooltipButton
                    title="Total Received Quantity for order line"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />
                </TableCell>
                <TableCell valign="top" align="center">
                  Received
                  <Tooltip title="Last Date Received" arrow>
                    <IconButton
                      sx={{
                        "&:hover": {
                          background: theme.colors.info.lighter,
                        },
                        color: theme.palette.info.main,
                      }}
                      color="inherit"
                      size="small"
                    >
                      <HelpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                {/*<TableCell align="center">Closed?*/}

                {/*    <TooltipIconButton title="This status suggests that the purchase order line has been closed and will not be received in the future." size="small" />*/}

                {/*</TableCell>*/}
                {/*<TableCell align="left">cancelled</TableCell>*/}
                <TableCell align="center">Tender</TableCell>

                <TableCell align="left">More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPorders.map((porderLine) => {
                const isPOrderLineSelected = selectedPOLines.includes(
                  porderLine.lineid,
                );

                const generateReceivingLineTooltip = (
                  porderLine: CustomPurchaseOrderLine,
                ) => {
                  const linesWithNotes =
                    porderLine.receivings?.flatMap((header) =>
                      header.receivinglines?.filter(
                        (line) => line?.notesaboutconditionstatus !== "",
                      ),
                    ) || [];

                  if (linesWithNotes.length === 0) {
                    return null; // Return null if there are no receiving lines with notes
                  }

                  return (
                    <>
                      Receiving Status Extra Notes
                      <Divider sx={{ borderTop: 3 }} />
                      {linesWithNotes.map((line) => {
                        const receivingHeader = porderLine.receivings?.find(
                          (header) =>
                            header.receivinglines?.some(
                              (receivingLine) => receivingLine === line,
                            ),
                        );
                        const receivedatetime =
                          receivingHeader?.receivedatetime ?? "";

                        return (
                          <div key={line?.id}>
                            {`Rec.Line ID: ${line?.id ?? ""}`}
                            <br />
                            {`Date: ${customDateFormat(receivedatetime, "DateOnly") ?? ""}`}
                            <br />
                            {`Notes: ${line?.notesaboutconditionstatus ?? ""}`}
                            <Divider sx={{ borderTop: 0 }} />
                          </div>
                        );
                      })}
                    </>
                  );
                };

                function handleButtonClick(pordid: number): void {
                  // Use filter to select all order lines with matching pordid
                  const selectedLines = pordersCustomData.filter(
                    (order) => order.orderid === pordid,
                  );

                  // Extract the linereqid values from the selected lines
                  const selectedLineIds = selectedLines.map(
                    (order) => order.lineid,
                  );

                  // Update the selectedReqLines state with the selected line IDs
                  setSelectedPOlines([]);
                  setSelectedPOlines(selectedLineIds);

                  //    setFiltersState({ dateFrom: null, dateTo: null, requestgroupid: headerreqid, itemstatus: null, itemdecisionid: null, itemstock: null, itemtextgiven: null, itemdynamicstatus: null });
                }

             

                return (
                  <TableRow
                    hover
                    key={porderLine.lineid}
                    selected={isPOrderLineSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isPOrderLineSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOnePOline(event, porderLine.lineid)
                        }
                        value={isPOrderLineSelected}
                      />
                    </TableCell>
                    {/*<TableCell>*/}
                    {/*    <Typography*/}
                    {/*        variant="body1" fontWeight="bold"  gutterBottom noWrap>  {porderLine.lineId}*/}
                    {/*    </Typography>*/}
                    {/*</TableCell>*/}
                    <TableCell align="center">
                      <Button
                        size="small" // Set the size to "small"
                        onClick={() => handleButtonClick(porderLine.orderid)}
                        style={{
                          marginLeft: "5px", // Add some spacing between the text and the button
                          fontSize: "14px",  
                        
                        }}
                      >
                        {porderLine.orderid}/{porderLine.lineid}
                      </Button>
                    </TableCell>

                    <TableCell align="left">
                      {/*<Typography variant="body2" color="text" noWrap>*/}
                      {/*    {porderLine.product?.code}*/}
                      {/*</Typography>*/}
                      <GlobalProductInfoDialog
                        productId={Number(porderLine.productid)}
                        buttontext={porderLine.pcode ?? ""}
                        productStatus={porderLine.activestatusflag ?? true}
                      />
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="body2" color="text">
                        {porderLine.pname}
                      </Typography>
                    </TableCell>
                    {/*<Typography variant="body2" color="text" noWrap>*/}
                    {/*    {customDateFormat(porder.ordercreateddate, "DateOnly")}*/}
                    {/*  */}
                    {/*  {format(new Date(porder.ordercreateddate), "dd/MM/yyyy")}*/}
                    {/*    < Divider></Divider>*/}
                    {/*    {customDateFormat(porder.ordercreateddate, "TimeOnly")}*/}
                    {/*</Typography>*/}

                    <TableCell>
                      {porderLine.reqlineid != null &&
                        porderLine.reqlineid > 0 && (
                          <Tooltip
                            arrow
                            TransitionComponent={Zoom}
                            title={
                              <>
                                {porderLine.reqfn} {porderLine.reqln}
                                <Divider></Divider>
                                {customDateFormat(
                                  porderLine.reqdate,
                                  "Datetime",
                                )}
                                <Divider></Divider>
                                Quantity: {porderLine.reqqty}
                                <Divider></Divider>
                                {porderLine.linelastDecision && (
                                  <Typography
                                    //   variant="body1"
                                    // fontWeight="bold"
                                    color="lightgreen"
                                    gutterBottom
                                  >
                                    Approver:{" "}
                                    {porderLine.linelastDecision?.madebyuser
                                      ?.firstName +
                                      " " +
                                      porderLine.linelastDecision?.madebyuser
                                        ?.lastName}
                                    <Divider></Divider>
                                    On:{" "}
                                    {customDateFormat(
                                      porderLine.linelastDecision
                                        ?.decisiondatetime,
                                      "Datetime",
                                    )}
                                  </Typography>
                                )}
                                <Divider></Divider>
                                {porderLine.primers &&
                                  porderLine.primers.length > 0 && (
                                    <PrimersTooltipIconButton
                                      title="Primers:"
                                      primers={porderLine.primers ?? []}
                                    />
                                  )}
                                {/*{porderLine.requestline.linesequenceidentifier.length > 0 && (*/}
                                {/*    <Typography*/}
                                {/*        //   variant="body1"*/}
                                {/*        // fontWeight="bold"*/}
                                {/*        color="yellow"*/}
                                {/*        gutterBottom*/}
                                {/*    >*/}
                                {/*        SI: {porderLine.requestline.linesequenceidentifier}*/}
                                {/*        <Divider></Divider>*/}
                                {/*        NS: {porderLine.requestline.linenucleotideSequence}*/}
                                {/*    </Typography>*/}
                                {/*)}*/}
                                <Divider></Divider>
                              </>
                            }
                          >
                            <Avatar
                              {...stringAvatar(
                                porderLine.reqfn + " " + porderLine.reqln,
                              )}
                            />
                          </Tooltip>
                        )}
                    </TableCell>

                    <TableCell>
                      {porderLine.orderbyuid != null && (
                        <Tooltip
                          arrow
                          TransitionComponent={Zoom}
                          title={
                            <>
                              {" "}
                              {porderLine.ordfn + " " + porderLine.ordln}
                              <Divider></Divider>
                              {customDateFormat(
                                porderLine.ordercreateddate,
                                "Datetime",
                              )}
                              <Divider></Divider>
                              Order ID: {porderLine.orderid}
                              <br />
                              Order Status: {porderLine.orderstatus ?? ""}
                              <br />
                              Order Line ID: {porderLine.lineid}
                              <br />
                              Unit Cost Price:{" "}
                              {ccyFormat(porderLine.orderunitcp)} (Vat Excluded)
                              <br />
                              Vat Rate: {ccyFormat(porderLine.ordvrate)} %<br />
                              Supplier: {porderLine.supplierName ?? ""}
                            </>
                          }
                        >
                          <Avatar
                            {...stringAvatar(
                              porderLine.ordfn + " " + porderLine.ordln,
                            )}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                    {/*<TableCell align="center">*/}
                    {/*    <Typography variant="body2" color="text" noWrap>*/}

                    {/*        {format(new Date(porder.duedate), "dd/MM/yyyy")}*/}

                    {/*    </Typography>*/}
                    {/*</TableCell>*/}
                    <TableCell align="center">
                      <Typography variant="body2" color="text">
                        {porderLine.dynamicstatus ?? ""}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text" noWrap>
                        {porderLine.orderQty}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text" noWrap>
                        {
                          //porderLine.receivings && porderLine.receivings.length > 0
                          //    ? porderLine.receivings.reduce((sum, receiving) => sum + (receiving.receivinglines?.reduce((lineSum, line) => lineSum + line.qty, 0) || 0), 0)
                          //    : 0
                          porderLine.totalrecQty ?? 0
                        }
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" color="text" noWrap>
                        {porderLine.lastReceivedatetime && (
                          <>
                            {customDateFormat(
                              porderLine.lastReceivedatetime,
                              "DateOnly",
                            )}
                            <Divider></Divider>
                            {customDateFormat(
                              porderLine.lastReceivedatetime,
                              "TimeOnly",
                            )}
                          </>
                        )}

                         
                      </Typography>
                    </TableCell>

                   

                    <TableCell align="center">
                      <Typography variant="body2" color="text" noWrap>
                     
                        {porderLine.tendercode}
                      </Typography>

                      
                    </TableCell>

                  
                    <TableCell align="right">
                      <Stack direction="row" spacing={0}>
                        {porderLine.posentbyempid ? (
                          /*    <MarkEmailRead color="success" />*/
                          <Tooltip
                            title={
                              <>
                                Email Order Sent
                                <Divider sx={{ pb: 1, borderBottom: 3 }} />
                                {customDateFormat(
                                  porderLine.posentdate,
                                  "DateOnly",
                                )}{" "}
                                -{" "}
                                {customDateFormat(
                                  porderLine.posentdate,
                                  "TimeOnly",
                                )}
                                <Divider />
                                {porderLine.pord?.sentbyuserfullname}
                                <Divider sx={{ borderTop: 3 }} />
                              </>
                            }
                            arrow
                            TransitionComponent={Zoom}
                          >
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.success.lighter,
                                },
                                color: theme.colors.success.main,
                              }}
                              color="inherit"
                              size="medium"
                              //     onClick={toggleDrawer(anchora, true, true)}
                              onClick={() => {
                                const orderId = porderLine.orderid;

                                if (
                                  orderId &&
                                  userContext?.currentUser?.claimCanMakePo
                                ) {
                                  setselectedOrderIDForSendingByEmail(orderId);
                                  setopenSendOrderbyEmail(true);
                                }
                              }}
                            >
                              <MarkEmailRead fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          /*  <MailOutlined color="error" />*/
                          <Tooltip
                            title="Email Order Not Sent"
                            arrow
                            TransitionComponent={Zoom}
                          >
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.palette.info.light,
                                  color: theme.palette.info.dark,
                                },
                                color: theme.palette.info.dark,
                              }}
                              color="inherit"
                              size="medium"
                              onClick={() => {
                                const orderId = porderLine.orderid;

                                if (
                                  orderId &&
                                  (hasAdminAccess(userContext?.currentUser) ||
                                    userContext?.currentUser?.claimCanMakePo)
                                ) {
                                  setselectedOrderIDForSendingByEmail(orderId);
                                  setopenSendOrderbyEmail(true);
                                }
                              }}
                            >
                              <MarkEmailUnreadOutlined fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {userContext &&
                          userContext.currentUser &&
                          userContext.currentUser.claimCanReceiveItems ===
                          true && (
                            <>
                              {porderLine &&
                                !selectedBulkActions &&
                                porderLine.pord &&
                                ["Pending", "Partially Received"]
                                  .map((status) => status.toLowerCase())
                                  .includes(
                                    porderLine?.dynamicstatus?.toLowerCase() ??
                                    "",
                                  ) && (
                                  <>
                                    {
                                      <RightDrawerReceiving
                                        key={
                                          `porder-${porderLine.orderid}-${porderLine.lineid}`
                                        }
                                        porderheader={porderLine.pord}
                                        porderline={porderLine}
                                        orderlinescount={1}
                                        refreshUpdatedRow={refreshPORDERS}
                                      />
                                    }
                                  </>
                                )}

                            </>
                          )}

                        {/*receiviving v2*/}
                        {userContext &&
                          userContext.currentUser && userContext.currentUser.firstName == 'George' &&
                          userContext.currentUser.claimCanReceiveItems ===
                          true && (
                            <>
                              {porderLine &&
                                !selectedBulkActions &&
                                porderLine.pord &&
                                ["Pending", "Partially Received"]
                                  .map((status) => status.toLowerCase())
                                  .includes(
                                    porderLine?.dynamicstatus?.toLowerCase() ??
                                    "",
                                  ) && (
                                  <>
                                    {
                                      <RightDrawerV2
                                        key={
                                          `porder-${porderLine.orderid}-${porderLine.lineid}`
                                        }
                                        orderId={porderLine.orderid}
                                        porderlineId={porderLine.lineid}
                                      
                                      />
                                    }
                                  </>
                                )}


                            </>
                          )}

                        <Tooltip
                          title={
                            <>
                              Closed?
                              <Divider sx={{ borderTop: 3 }} />
                              This status suggests that the purchase order line
                              has been closed and will not be received in the
                              future.
                            </>
                          }
                          arrow
                          TransitionComponent={Zoom}
                        >
                          <Checkbox
                            color="success"
                            checked={porderLine.closedFlag}
                            value={porderLine.closedFlag}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              userContext &&
                              userContext.currentUser &&
                              userContext.currentUser.claimCanMakePo === true &&
                              markAsClosed(event, porderLine.lineid)
                            }
                          />
                        </Tooltip>

                        {userContext &&
                          userContext.currentUser &&
                          userContext.currentUser.claimCanMakePo === true && (
                            <>
                              {porderLine &&
                                porderLine.dynamicstatus &&
                                porderLine.invcounter <= 0 &&
                                porderLine.reccounter <= 0 &&
                                ["Pending"]
                                  .map((status) => status.toLowerCase())
                                  .includes(
                                    porderLine?.dynamicstatus?.toLowerCase() ??
                                    "",
                                  ) && (
                                  <>
                                    {
                                      <>
                                        <Tooltip title="Cancel Order" arrow>
                                          <IconButton
                                            sx={{
                                              "&:hover": {
                                                color: theme.palette.error.dark,
                                              },
                                              color: theme.palette.primary.dark,
                                            }}
                                            color="inherit"
                                            onClick={() => {
                                              const orderId =
                                                porderLine.orderid;

                                              if (
                                                orderId &&
                                                userContext?.currentUser
                                                  ?.claimCanMakePo
                                              ) {
                                                setselectedOrderIDForSendingByEmail(
                                                  orderId,
                                                );
                                                handleClickCancelOrder();
                                              }
                                            }}
                                          >
                                            <CancelTwoTone />
                                          </IconButton>
                                        </Tooltip>

                                        <Dialog
                                          open={
                                            confirmationDialogOpen ||
                                            errorDialogOpen
                                          }
                                          onClose={
                                            handleCloseDialogOfOrderCancellation
                                          }
                                        >
                                          <DialogTitle>
                                            {errorDialogOpen
                                              ? "Error"
                                              : "Confirm Order Cancellation"}
                                          </DialogTitle>
                                          <DialogContent>
                                            {errorDialogOpen ? (
                                              <Typography variant="body1">
                                                {errorMessage}
                                              </Typography>
                                            ) : (
                                              <Typography variant="body1">
                                                Are you sure you want to cancel
                                                this order (#
                                                {selectedOrderIDForSendingByEmail?.toString() ||
                                                  ""}
                                                )?
                                              </Typography>
                                            )}
                                          </DialogContent>
                                          <DialogActions>
                                            <Button
                                              onClick={
                                                handleCloseDialogOfOrderCancellation
                                              }
                                            >
                                              Close
                                            </Button>
                                            {!errorDialogOpen && (
                                              <Button
                                                onClick={() =>
                                                  handleCancelConfirmation(
                                                    selectedOrderIDForSendingByEmail,
                                                  )
                                                }
                                                color="error"
                                                disabled={isLoading}
                                              >
                                                {isLoading
                                                  ? "Cancelling..."
                                                  : "Confirm"}
                                              </Button>
                                            )}
                                          </DialogActions>
                                        </Dialog>
                                      </>
                                    }
                                  </>
                                )}

                              {
                                // edit order btn
                                //<Tooltip title="Edit Order" arrow>
                                //    <IconButton
                                //        sx={{
                                //            '&:hover': {
                                //                background: theme.colors.primary.lighter
                                //            },
                                //            color: theme.palette.primary.main
                                //        }}
                                //        color="inherit"
                                //        size="small"
                                //        onClick={() => handleClickOpen(porder)}
                                //    >
                                //        <EditTwoToneIcon fontSize="small" />
                                //    </IconButton>
                                //</Tooltip>
                              }
                            </>
                          )}

                        <Tooltip
                          sx={{ minWidth: "100%" }}
                          title={
                            <>
                              Supplier Invoices
                              <Divider sx={{ borderTop: 3 }} />
                              View Supplier invoices associated with this order,
                              along with the option to include shipping and
                              handling costs for each invoice.
                             
                            </>
                          }
                          arrow
                          TransitionComponent={Zoom}
                        >
                          <IconButton
                            sx={{
                              "&:hover": {
                                background: theme.palette.info.light,
                                color: theme.palette.info.dark,
                              },

                              color:
                                porderLine.invcounter > 0
                                  ? theme.palette.success.main
                                  : theme.palette.info.dark,
                            }}
                            color="inherit"
                            size="medium"
                            onClick={() => {
                              const orderId = porderLine.orderid;

                          
                              if (orderId) {
                                getInvoicesFromApiNowAndOpenDialog(orderId);
 
                              }
                            }}
                      
                          >
                            <ReceiptLong fontSize="medium" />
                          </IconButton>
                        </Tooltip>

                        {porderLine.receivings &&
                          porderLine.receivings.some((receiving) =>
                            receiving.receivinglines?.some(
                              (line) => line.notesaboutconditionstatus !== "",
                            ),
                          ) && (
                            <Tooltip
                              sx={{ minWidth: "100%" }}
                              title={generateReceivingLineTooltip(porderLine)}
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.palette.info.light,
                                    color: theme.palette.info.dark,
                                  },
                                  color: theme.palette.info.dark,
                                }}
                                color="inherit"
                                size="medium"
                              >
                                <InfoOutlinedIcon fontSize="medium" />
                              </IconButton>
                            </Tooltip>
                          )}

                        {porderLine.ponotes &&
                          porderLine.ponotes.length > 0 && (
                            <Tooltip
                              sx={{ minWidth: "100%" }}
                              title={
                                <>
                                  Notes with Order
                                  <Divider sx={{ borderTop: 3 }} />
                                  {"" + porderLine.ponotes}
                                </>
                              }
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.palette.info.light,
                                    color: theme.palette.info.dark,
                                  },
                                  color: theme.palette.info.dark,
                                }}
                                color="inherit"
                                size="medium"
                              >
                                <CommentOutlinedIcon fontSize="medium" />
                              </IconButton>
                            </Tooltip>
                          )}
                      </Stack>
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
            count={filteredPorderLines.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={
              !filteredPorderLines.length || filteredPorderLines.length <= 0
                ? 0
                : page
            }
            rowsPerPage={limit}
            rowsPerPageOptions={Pagingdefaultoptions}
          />
        </Box>
      </Card>

      <Dialog open={openSendOrderbyEmail} onClose={handleCloseSendOrderbyEmail}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="primary" aria-label="add" sx={{ marginRight: 1 }}>
            <SendOutlined />
          </IconButton>
          <Typography variant="h6" component="div">
            IMS - Send order by email
          </Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            To send this order to supplier, please click "Send Email Order".
          </DialogContentText>
          <Divider sx={{ height: 14, m: 0.5 }} orientation="vertical" />

          <div>
            {/* Render loading state or message */}
            {sendingEmailProcessStatus ? (
              <p>Sending...</p>
            ) : (
              messageOfResponseOfEmailProcess && (
                <Alert severity="error">
                  {" "}
                  {messageOfResponseOfEmailProcess}
                </Alert>
              )
            )}
          </div>
          {/*{apiResponse && typeof apiResponse !== 'undefined' && !(apiResponse.status === 200) && (<Alert severity="error"> Error! {apiResponse?.toString()}</Alert>)}*/}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleMarkAsSentByEmail(selectedOrderIDForSendingByEmail);
            }}
            disabled={
              selectedOrderIDForSendingByEmail <= 0 || sendingEmailProcessStatus
            }
          >
            Mark as Sent
          </Button>
          <Button onClick={handleCloseSendOrderbyEmail}>Cancel</Button>
          <Button
            onClick={() => {
              handleSendByEmail(selectedOrderIDForSendingByEmail);
            }}
            disabled={
              selectedOrderIDForSendingByEmail <= 0 || sendingEmailProcessStatus
            }
          >
            Send Email Order
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSupplierInvoicesDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="primary" aria-label="add" sx={{ marginRight: 1 }}>
            <ReceiptLongOutlined />
          </IconButton>
          <Typography variant="h6" component="div">
            IMS - Supplier invoices associated with this order
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="forestgreen" variant="body1">
            Order ID #{poInvoices?.orderid}
            <Divider />
            Order Total Value:{" "}
            {ccyFormat(poInvoices?.ordertotalamountincludingvat ?? 0)} (VAT
            Included)
            {poInvoices?.invoices && poInvoices?.invoices?.length > 0 && (
              <>
                <Divider />
                VS Receiving Invoices Total Value:{" "}
                {ccyFormat(
                  poInvoices?.invoices?.reduce(
                    (sum, invoice) =>
                      sum +
                      invoice.totalamountoflinestincludingVat +
                      (invoice.shippingandhandlingcostincludingvat ?? 0),
                    0,
                  ) ?? 0,
                )}{" "}
                (VAT Included)
              </>
            )}
            <Divider />
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Invoice</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">
                  Item Total
                  <br />
                  (VAT Included)
                </TableCell>
                <TableCell align="center">
                  Shipping/Handling
                  <br />
                  (VAT Excluded)
                </TableCell>
                <TableCell align="center">
                  Shipping/Handling
                  <br />
                  VAT Rate
                </TableCell>
                <TableCell align="center">
                  Invoice Total
                  <br />
                  (VAT Included)
                </TableCell>
                <TableCell align="center">Document</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poInvoices?.invoices?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Invoices Found!
                  </TableCell>
                </TableRow>
              ) : (
                poInvoices?.invoices?.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell>{invoice.docno}</TableCell>
                    <TableCell>
                      {customDateFormat(invoice.invdate, "DateOnly") ?? ""}
                    </TableCell>
                    <TableCell align="right">
                      {ccyFormat(invoice.totalamountoflinestincludingVat)}
                    </TableCell>
                    <TableCell align="right">
                      {ccyFormat(
                        invoice.shippingandhandlingcostexcludingvat ?? 0,
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {ccyFormat(invoice.shippingandhandlingcostvatrate ?? 0)}
                    </TableCell>

                    <TableCell align="right">
                      {ccyFormat(
                        invoice.totalamountoflinestincludingVat +
                        (invoice.shippingandhandlingcostincludingvat ?? 0),
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {invoice && invoice.invdocexist ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleOpenDocument(invoice.invoiceid ?? 0)
                            }
                          >
                            View
                          </Button>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            size="small"
                            onClick={() =>
                              handleDeleteDocument(invoice.invoiceid ?? 0)
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      ) : (
                        <div>
                          <Button
                            size="small"
                            component="label"
                            color={selectedFile ? "success" : "primary"}
                            variant="contained"
                            startIcon={<AttachFileOutlined />}
                          >
                            {selectedFile ? "File selected" : "Select file"}
                            <VisuallyHiddenInput
                              type="file"
                              accept=".pdf, .png, .jpeg, .jpg"
                              onChange={handleFileChange}
                            />
                          </Button>

                          <Button
                            size="small"
                            hidden={!selectedFile}
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={() => handleUpload(invoice.invoiceid ?? 0)}
                            disabled={!selectedFile}
                          >
                            Confirm Upload
                          </Button>
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div>
                        <ImageDialog
                          open={openImageDialog}
                          onClose={handleCloseImageDialog}
                          fileUrl={fileUrl}
                          fileType={fileType}
                        />
                      </div>

                      {userContext &&
                        userContext.currentUser &&
                        userContext.currentUser.claimCanReceiveItems ===
                        true && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleEditInvoiceButtonClick(invoice)
                            }
                          >
                            Edit Invoice
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {isEditMode && editedInvoice && (
            <DialogContent
              style={{
                border: "1px solid #e0e0e0", // Add a border
                padding: "1rem", // Add padding for spacing
                backgroundColor: "#f5f7fa",
              }}
            >
              <Stack direction="column" spacing={2}>
                <Button color="secondary">
                  Editing Invoice: {editedInvoice.docno}
                </Button>

                <FormControl variant="outlined">
                  <InputLabel>Vat Rate (%)</InputLabel>
                  <Select
                    onChange={(event) =>
                      setEditedInvoice((prevInvoice) => ({
                        ...(prevInvoice as CustomSupplierInvoiceModel),
                        shippingandhandlingcostvatindex: Number(
                          event.target.value,
                        ),
                      }))
                    }
                    value={
                      editedInvoice.shippingandhandlingcostvatindex?.toString() ||
                      ""
                    }
                    label="VatRate"
                  >
                    {vatRates.map((vr) => (
                      <MenuItem key={vr.id} value={vr.id}>
                        {vr.rate}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                 
                <TextField
                  label="Shipping/Handling Cost (Excluding VAT)"
                  value={editedInvoice.shippingandhandlingcostexcludingvat}
                  onChange={(event) => {
                    const parsedValue = parseFloat(event.target.value);
                    setEditedInvoice((prevInvoice) => ({
                      ...prevInvoice!,
                      shippingandhandlingcostexcludingvat: isNaN(parsedValue)
                        ? 0
                        : parsedValue,
                    }));
                  }}
                  inputProps={{
                    type: "number",
                  }}
                />

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveInvoiceButtonClick}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancelEditInvoice}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </DialogContent>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

PordersByLineTable.propTypes = {
  pordersCustomData: PropTypes.array.isRequired,
};

PordersByLineTable.defaultProps = {
  pordersCustomData: [],
};

export default PordersByLineTable;
