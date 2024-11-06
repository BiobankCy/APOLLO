import { Helmet } from "react-helmet-async";
import React from "react";
import { Grid, Container } from "@mui/material";
import Footer from "src/Components/Footer";
 

import ApiGetAllRows from "./ApiGetAll";

function Suppliers() {
  return (
    <>
      <Helmet>
        <title>IMS - Suppliers Management</title>
      </Helmet>
      {/*     <PageTitleWrapper>
              <PageHeader />
          </PageTitleWrapper>
          */}
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <ApiGetAllRows />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Suppliers;
