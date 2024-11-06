import { Typography, Button, Grid } from "@mui/material";
import React from "react";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useAuth } from "src/contexts/UserContext";

function PageHeader() {
  const userContext = useAuth();

  

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Transactions
        </Typography>
        <Typography variant="subtitle2">
          {userContext?.currentUser?.email ?? "No Logged In"}, these are your
          recent orders
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Add Order
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
