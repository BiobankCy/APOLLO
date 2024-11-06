import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  OutlinedInput,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { SelectChangeEvent } from "@mui/material";
import {
  addNewInvoice,
  getAllVatRates,
} from "../../../../services/user.service";
import {
  SubmitSupplierInvoiceModel,
  SupplierInvoiceModel,
  SupplierModel,
} from "../../../../models/mymodels";

interface AddInvoiceDialogProps {
  open: boolean;
  handleClose: () => void;
  suppliername?: string;
  supplierID: number;
  setSelectedInvoice: React.Dispatch<
    React.SetStateAction<SupplierInvoiceModel | undefined>
  >;
  setForceRefreshInvoices: React.Dispatch<React.SetStateAction<boolean>>;

}

const AddInvoiceDialog: React.FC<AddInvoiceDialogProps> = ({
  open,
  handleClose,
  supplierID,
  suppliername,
  setSelectedInvoice, setForceRefreshInvoices
}) => {
  const handleSelectInvoice = (invoice: SupplierInvoiceModel) => {
    setSelectedInvoice(invoice);
  };
  const [vatRates, setVatRates] = useState<{ id: string; rate: number }[]>([]);
  const [error, setError] = useState<string>("");

  const [invoiceData, setInvoiceData] = useState({
    supid: supplierID,
    id: 0,
    orderid: 0,

    //  vatId: '',
    attachment: null as File | null,

    supinvno: "",
    supinvdate: new Date(),
    supInvShippingAndHandlingCost: 0,
    vatId: vatRates.length > 0 ? Number(vatRates[0].id) : "",
  });

  useEffect(() => {
    // Fetch VAT rates from the API using the getAllVatRates function
    getAllVatRates()
      .then((response) => setVatRates(response.data))
      .catch((error) => console.error("Error fetching VAT rates:", error));
  }, []); // Fetch VAT rates on component mount

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInvoiceDateChange = (newValue: Date | null) => {
    if (newValue) {
      setInvoiceData((prevData) => ({ ...prevData, supinvdate: newValue }));
    }
  };

  const handleVatSelectChange = (e: SelectChangeEvent<string>) => {
    setInvoiceData((prevData) => ({
      ...prevData,
      vatId: Number(e.target.value) ?? "",
    }));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setInvoiceData((prevData) => ({ ...prevData, attachment: file || null }));
  };

  const handleAdd = async () => {
    try {
      // Perform validation before submitting
      // if (!invoiceData.supInvShippingAndHandlingCost || !invoiceData.vatId) {
      //   setError("Please fill in all required fields.");
      //   return;
      // }

      if (!invoiceData.supInvShippingAndHandlingCost) {
        invoiceData.supInvShippingAndHandlingCost = 0;
      }

      if (invoiceData.supInvShippingAndHandlingCost > 0) {

        if (!invoiceData.vatId || Number(invoiceData.vatId) <= 0) {
          setError("Please fill Vat Rate.");
          return;
        }

      } else { invoiceData.vatId = ""; }


      // Prepare data for the PUT request
      const data = {
        ...invoiceData,
        id: 0,
      };



      const formData = new FormData();
      formData.append("supid", data.supid.toString());
      formData.append("supinvno", data.supinvno);
      formData.append("supInvShippingAndHandlingCost", (data.supInvShippingAndHandlingCost ?? 0).toString(),);
      formData.append("vatId", (data.vatId ?? 0).toString());
      formData.append("supinvdate", data.supinvdate.toISOString());
      formData.append("attachmentid", (0).toString() || ""); // Ensure it's a string or an empty string
      formData.append("orderid", data.orderid.toString());

      // Append file if available
      if (data.attachment) {
        formData.append("attachmentfile", data.attachment);
      }

      // Submit the new invoice using addNewInvoice function
      const response = await addNewInvoice(formData);
      console.log(response, "invoice added");
      handleSelectInvoice(response.data);
      handleClose();
      setInvoiceData(prevState => ({
        ...prevState,
        supinvno: "",
        supinvdate: new Date(),
        supInvShippingAndHandlingCost: 0,
        vatId: vatRates.length > 0 ? Number(vatRates[0].id) : "",
      }));
      setError('');
      setForceRefreshInvoices(true);

    } catch (error) {
      // Handle submission error
      setError("Failed to submit the invoice. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a New Supplier Invoice ({suppliername})</DialogTitle>
      <DialogContent>
        <TextField
          label="Document Number"
          autoComplete="off"
          autoFocus
          required
          variant="outlined"
          name="supinvno"
          sx={{ marginBottom: 1 }}
          value={invoiceData.supinvno}
          onChange={handleTextFieldChange}
          fullWidth
        />

        <DesktopDatePicker
          label="Document Date"
          inputFormat="dd/MM/yyyy"
          value={invoiceData.supinvdate}
          maxDate={undefined}
          onChange={handleInvoiceDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              autoComplete="off"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ marginBottom: 1 }}
            />
          )}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Shipping & Handling Cost"
              type="number"
              variant="outlined"
              required
              name="supInvShippingAndHandlingCost"
              value={invoiceData.supInvShippingAndHandlingCost}
              onChange={handleTextFieldChange}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>VAT Rate</InputLabel>
              <Select
                value={invoiceData.vatId?.toString() ?? ""}
                onChange={handleVatSelectChange}
                input={<OutlinedInput label="VAT Rate" />}
                required
                sx={{ marginBottom: 2 }}
              >
                {vatRates.map((vatRate) => (
                  <MenuItem key={vatRate.id} value={vatRate.id}>
                    {vatRate.rate}%
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <input
          type="file"
          accept=".pdf, .png, .jpeg"
          onChange={handleAttachmentChange}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInvoiceDialog;
