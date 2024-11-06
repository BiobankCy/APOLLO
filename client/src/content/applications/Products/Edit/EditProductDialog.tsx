import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import EditProductCrud from "./ApiGetProduct";
import { ProductModel } from "src/models/mymodels";

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  productid: number;
  handleUpdateSingleProduct?: (produtctToUpdate: ProductModel) => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({ open, onClose, productid, handleUpdateSingleProduct }) => {
  return (
    <Dialog open={open} maxWidth={"lg"} onClose={onClose}>
      <DialogTitle>Edit Product Dialog</DialogTitle>
      <DialogContent>
        <EditProductCrud handleUpdateSingleProduct={handleUpdateSingleProduct} onClose={onClose} formcalledby="dialog" prid={productid} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {/* <Button type="submit">Save</Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
