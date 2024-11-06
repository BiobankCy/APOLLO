import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";

import {
  getAllSupplierInvoices,
  getAllVatRates,
} from "../../../../services/user.service";
import {
  customDateFormat,
  SupplierInvoiceModel,
  SupplierModel,
} from "../../../../models/mymodels";

interface SelectInvoiceDialogProps {
  open: boolean;
  handleClose: () => void;
  setSelectedInvoice: React.Dispatch<
    React.SetStateAction<SupplierInvoiceModel | undefined>
  >;
  selectedInvoice: SupplierInvoiceModel | undefined;
  suppliername?: string;
  supplierID: number;
  forceRefreshInvoices: boolean;
  setForceRefreshInvoices: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseFromExistingInvoicesDialog: React.FC<SelectInvoiceDialogProps> = ({
  open,
  handleClose,
  suppliername,
  supplierID,
  setSelectedInvoice,
  selectedInvoice, forceRefreshInvoices, setForceRefreshInvoices
}) => {
  const handleSelectInvoice = (invoice: SupplierInvoiceModel | undefined) => {
    setSelectedInvoice(invoice);
  };
  const [vatRates, setVatRates] = useState<{ id: string; rate: number }[]>([]);
  const [error, setError] = useState<string>("");
  const [supplierInvoices, setsupplierInvoices] = useState<
    SupplierInvoiceModel[]
  >([]);


  const fetchSupplierInvoices = () => {
    getAllSupplierInvoices(supplierID)
      .then((response) => setsupplierInvoices(response.data))
      .catch((error) => console.error("Error fetching supplier invoices:", error));
  };


  useEffect(() => {

    // Fetch VAT rates from the API using the getAllVatRates function
    getAllVatRates()
      .then((response) => setVatRates(response.data))
      .catch((error) => console.error("Error fetching VAT rates:", error));
    fetchSupplierInvoices();
  }, []);


  useEffect(() => {
    if (forceRefreshInvoices) {
      fetchSupplierInvoices();
      setForceRefreshInvoices(false);
    }
  }, [forceRefreshInvoices]);


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Choose an Existing Supplier Invoice ({suppliername})
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Existing Invoices</InputLabel>
          <Select
            value={selectedInvoice?.id || ""}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedInvoice = supplierInvoices.find(
                (invoice) => invoice.id === selectedId,
              );
              handleSelectInvoice(selectedInvoice || undefined);
            }}
          >
            {supplierInvoices.map((invoice) => (
              <MenuItem key={invoice.id} value={invoice.id}>
                {`Doc.No: ${invoice.supinvno} (${customDateFormat(invoice.supinvdate, "DateOnly")})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChooseFromExistingInvoicesDialog;
