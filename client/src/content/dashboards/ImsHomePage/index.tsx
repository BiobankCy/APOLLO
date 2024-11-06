import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/Components/PageTitleWrapper";
import { Container, Grid } from "@mui/material";
import Footer from "src/Components/Footer";
import AccountBalance from "./AccountBalance";
import LowStockProducts from "./LowStockProducts";
import { getStatistics } from "../../../services/user.service";
import { StatisticsDTO } from "../../../models/mymodels";

function DashboardIMS() {
  const [statistics, setStatistics] = useState<StatisticsDTO | null>(null);

  useEffect(() => {
    getStatistics().then(
      (response) => {
        setStatistics(response.data);
       
      },
      (error) => {
        setStatistics(null);
      },
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>IMS Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <AccountBalance {...statistics} />
          </Grid>
          <Grid item lg={12} xs={12}>
            <LowStockProducts {...statistics} />
          </Grid>
          <Grid item lg={4} xs={12}>
            {/* <AccountSecurity />*/}
          </Grid>
          <Grid item xs={12}>
            {/*<WatchList />*/}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardIMS;
