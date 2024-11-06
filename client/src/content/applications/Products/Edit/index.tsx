import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Container, Grid } from "@mui/material";
import Footer from "src/Components/Footer";
import ApiGetProduct from "./ApiGetProduct";

interface EditProductCrudProps {
  prid?: number;
}

const EditProductCrud: React.FC<EditProductCrudProps> = ({ prid }) => {
  const navigate = useNavigate();
  const params = useParams();
  const id: string | undefined = params.id;

  useEffect(() => {
    if (!prid && id && /[^\d]/g.test(id)) {
      navigate("/", { replace: true });
    }
  }, [id, navigate, prid]);

  const productid = prid !== undefined ? prid : Number(id) || 0;

  const passemptyVoidFunction = () => {

    //console.log("Closing...");
  };

  return (
    <>
      <Helmet>
        <title>IMS - Product Edit</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <ApiGetProduct onClose={passemptyVoidFunction} formcalledby="normal" prid={productid} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default EditProductCrud;
