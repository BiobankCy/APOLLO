import React, { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  fileType: string;
}

const ImageDialog: FC<ImageDialogProps> = ({
  open,
  onClose,
  fileUrl,
  fileType,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogActions
        style={{ justifyContent: "space-between", padding: "8px 32px" }}
      >
        <div>
          <DialogTitle>Invoice Preview</DialogTitle>
        </div>
        <div>
          <Button variant={"outlined"} onClick={onClose} color="error">
            Close
          </Button>
        </div>
      </DialogActions>

      <DialogContent>
        {fileType.startsWith("image/") ? (
          <img
            src={fileUrl}
            alt="Invoice Preview (IMAGE)"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        ) : (
          <iframe
            src={fileUrl}
            title="Invoice Preview (PDF)"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
