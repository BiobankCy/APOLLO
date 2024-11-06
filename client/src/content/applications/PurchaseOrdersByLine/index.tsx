import { Helmet } from "react-helmet-async";
import React from "react";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/Components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "src/Components/Footer";

import ApiGetAllRows from "./ApiGetAll";

function PurchaseOrders() {
  return (
    <>
      <Helmet>
        <title>IMS - Orders</title>
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

export default PurchaseOrders;
