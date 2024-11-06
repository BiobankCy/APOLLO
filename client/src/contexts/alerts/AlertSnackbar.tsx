import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useAlert } from '../AlertsContext';

const AlertSnackbar = () => {
  const { alerts, removeAlert } = useAlert();

  const handleClose = (id: number) => {
    removeAlert(id);
  };

  return (
    <>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => handleClose(alert.id)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => handleClose(alert.id)}
            severity={alert.severity as "info" | "error" | "success" | "warning" | undefined}
          >
            {alert.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </>
  );
};

export default AlertSnackbar;
