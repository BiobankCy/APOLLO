import { Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import React from 'react';

function PageHeader() {
  const navigate = useNavigate();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Products
        </Typography>
        <Typography variant="subtitle2">
          Here you can manage the products
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          onClick={() =>
            navigate("/management/products/add", { replace: true })
          }
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Add New product
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
