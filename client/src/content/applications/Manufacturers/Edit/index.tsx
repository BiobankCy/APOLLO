import { useEffect } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Container, Grid } from "@mui/material";
import Footer from "src/Components/Footer";
import ApiGet from "./ApiGet";



const EditCrud: React.FC = () => {


  const navigate = useNavigate();
  const params = useParams();
  const id: string | undefined = params.id;

  useEffect(() => {
    if (id && /[^\d]/g.test(id)) {
      navigate("/", { replace: true });
    }
  }, [id, navigate]);

  let productid = Number(id) || 0;

  return (
    <>
      <Helmet>
        {" "}
        <title>IMS - Manufacturer Edit</title>{" "}
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
            <ApiGet supid={productid | 0} />

          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};
export default EditCrud;
