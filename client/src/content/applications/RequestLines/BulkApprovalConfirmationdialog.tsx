import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { updateBulkDecisionOfRequest } from "../../../services/user.service";
import {
  CustomRequestLinesModel,
  UpdateBulkDecisionStatusModel,
} from "../../../models/mymodels";

interface ConfirmationDialogProps {
  open: boolean;
  selectedRequestLinesID: number[];
  decisionChoosen: string;
  onClose: () => void;
  refreshUpdatedRowsBatch: (updatedLines: CustomRequestLinesModel[]) => void;

  // onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  selectedRequestLinesID,
  decisionChoosen,
  onClose,
  refreshUpdatedRowsBatch,
  //   onConfirm,
}) => {
  const [response, setResponse] = useState<CustomRequestLinesModel[] | null>(
    null,
  );
  const [failedResponse, setFailedResponse] = useState<
    string[] | string | null
  >(null);

  useEffect(() => {
    setResponse(null);
    setFailedResponse(null);
  }, []);

  const handleCloseDialog = () => {
    setResponse(null);
    setFailedResponse(null);
    onClose();
  };


  const callAPIforBulkDecisions = () => {
    setFailedResponse(null);

    let sss: UpdateBulkDecisionStatusModel = {
      newdecisiontext: decisionChoosen,
      reqlineids: selectedRequestLinesID,
    };

    updateBulkDecisionOfRequest(sss)
      .then((res) => {
        if (res.status === 200) {
          let reqlinestorefresh: CustomRequestLinesModel[] = [];
          reqlinestorefresh = res.data;
         
          refreshUpdatedRowsBatch(reqlinestorefresh);

          handleCloseDialog();
        } else {
          setResponse(null);
         
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          
          setFailedResponse(
            "General Error! Cant Update Decision!(Message: " +
              error.response?.data +
              ")",
          );
        } else {
          //  setFailedResponse('General Error! Cant Update Decision!\n' + error.response?.data);
          let errorMessage = "General Error! Cant Update Decision!\n";

          if (Array.isArray(error.response?.data)) {
            setFailedResponse(error.response?.data);
          } else if (error.response?.data) {
            setFailedResponse(errorMessage);
          }

          //  alert('General Error! Cant Update Decision!(Message: ' + error.response?.data + ')');
        }
        setResponse(null);
      });

    //  handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Decision Confirmation</DialogTitle>
      <DialogContent>
        {failedResponse ? (
          <>
            <DialogContent>
              {Array.isArray(failedResponse) ? (
                <>
                  <DialogContentText>
                    The following {failedResponse.length} error(s) prevented any
                    decisions ({selectedRequestLinesID.length}) from being made:
                  </DialogContentText>
                  {failedResponse.map((line, index) => (
                    <DialogContentText key={index}>{line}</DialogContentText>
                  ))}
                </>
              ) : (
                <>
                  <DialogContentText>
                    The following error prevented any decisions (
                    {selectedRequestLinesID.length}) from being made:
                  </DialogContentText>
                  <DialogContentText>{failedResponse}</DialogContentText>
                </>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContentText>
              Are you sure you want to {decisionChoosen}{" "}
              {selectedRequestLinesID.length} request lines?
            </DialogContentText>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={callAPIforBulkDecisions} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
