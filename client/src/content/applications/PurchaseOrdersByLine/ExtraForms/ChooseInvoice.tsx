import React, { useState, Fragment } from "react";
import {
  MenuItem,
  Typography,
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Divider,
  Menu,
} from "@mui/material";
import {
  Add as AddIcon,
  LibraryBooks as LibraryBooksIcon,
} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  customDateFormat,
  SupplierInvoiceModel,
} from "../../../../models/mymodels";
import { Clear } from "@mui/icons-material";
import AddNewInvoiceDialog from "./AddInvoiceDialog";
import ChooseFromExistingInvoicesDialog from "./ChooseFromExistingInvoicesDialog";

interface InvoiceFormProps {
  selectedInvoice?: SupplierInvoiceModel;
  setSelectedInvoice: React.Dispatch<
    React.SetStateAction<SupplierInvoiceModel | undefined>
  >;
  suppliername?: string;
  supplierID: number;
}

const ChooseInvoice: React.FC<InvoiceFormProps> = ({
  supplierID,
  suppliername,
  selectedInvoice,
  setSelectedInvoice,
}) => {
 
  const [isAddNewInvoiceDialogOpen, setIsAddInvoiceDialogOpen] =
    useState(false);

  const handleOpenAddInvoiceDialog = () => {
    setAnchorEl(null);
    setIsAddInvoiceDialogOpen(true);
  };

  const handleCloseAddInvoiceDialog = () => {
    setIsAddInvoiceDialogOpen(false);
  };

  const [forceRefreshInvoices, setForceRefreshInvoices] = useState(false);

  const [chooseExistingInvoiceDialogOpen, setchooseExistingInvoiceDialogOpen] =
    useState(false);

  const handleOpenExistingInvoiceDialog = () => {
    setAnchorEl(null);
    setchooseExistingInvoiceDialogOpen(true);
  };

  const handleCloseExistingInvoiceDialog = () => {
    setchooseExistingInvoiceDialogOpen(false);
  };

  

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Card sx={{ width: "100%", bgcolor: "#2196F3" }}>
        <CardHeader
          avatar={
            <Avatar
              style={{ color: "#2196F3", backgroundColor: "white" }}
              aria-label="selectinvoice"
            >
              Inv
            </Avatar>
          }
          action={
            <IconButton
              aria-label="settings"
              onClick={handleClick}
              size="small"
              sx={{ ml: 2, color: "white" }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Typography variant="h4" style={{ color: "white" }} gutterBottom>
              Supplier Invoice{" "}
              {selectedInvoice && (
                <IconButton
                  onClick={() => setSelectedInvoice(undefined)}
                  size="small"
                  sx={{ ml: 0 }}
                >
                  <Typography variant="h6" component="span" color="error">
                    (Remove it <Clear fontSize="small" />)
                  </Typography>
                </IconButton>
              )}
            </Typography>
          }
          subheader={
            <>
              {selectedInvoice ? (
                <div>
                  <Typography variant="h6" color="white">
                    Connected Invoice: {selectedInvoice.supinvno} | Date:{" "}
                    {customDateFormat(selectedInvoice.supinvdate, "DateOnly")}
                  </Typography>
                </div>
              ) : (
                <Typography variant="h6" color="white">
                  Connected Invoice: None
                </Typography>
              )}
            </>
          }
        />
      </Card>

      <AddNewInvoiceDialog
        open={isAddNewInvoiceDialogOpen}
        handleClose={handleCloseAddInvoiceDialog}
        supplierID={supplierID}
        suppliername={suppliername}
        setSelectedInvoice={setSelectedInvoice}
        setForceRefreshInvoices={setForceRefreshInvoices}  
      />
      <ChooseFromExistingInvoicesDialog
        open={chooseExistingInvoiceDialogOpen}
        handleClose={handleCloseExistingInvoiceDialog}
        suppliername={suppliername}
        forceRefreshInvoices={forceRefreshInvoices} 
        setForceRefreshInvoices={setForceRefreshInvoices}  
        supplierID={supplierID}
        selectedInvoice={selectedInvoice}
        setSelectedInvoice={setSelectedInvoice}
      />
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleOpenAddInvoiceDialog}>
          <Avatar style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <AddIcon />
          </Avatar>
          Add a New Supplier Invoice
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleOpenExistingInvoiceDialog}>
          <Avatar style={{ backgroundColor: "#2196F3", color: "white" }}>
            <LibraryBooksIcon />
          </Avatar>
          Choose an Existing Supplier Invoice
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default ChooseInvoice;
