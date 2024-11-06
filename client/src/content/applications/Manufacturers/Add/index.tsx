import { Helmet } from "react-helmet-async";
import React from "react";
import { Container, Grid } from "@mui/material";
import Footer from "src/Components/Footer";
import ApiGetProps from "./ApiGetProps";
 

const AddProductCrud: React.FC = () => {
  return (
    <>
      <Helmet>
        {" "}
        <title>IMS - Add Manufacturer</title>{" "}
      </Helmet>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <ApiGetProps prid={0} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};
export default AddProductCrud;
