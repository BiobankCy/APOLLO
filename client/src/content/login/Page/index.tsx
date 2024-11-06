import { Box, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Login from "../../../Components/Auth/Login";
import React from "react";
import { GLOBALVAR_APP_VERSION } from "src/Settings/AppSettings";

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`,
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`,
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`,
);


function Page() {
  return (
    <Container maxWidth="lg" sx={{ textAlign: "center" }}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={10} lg={8} mx="auto">
          <LabelWrapper color="success">Version {GLOBALVAR_APP_VERSION ?? ""}</LabelWrapper>
          <TypographyH1 sx={{ mb: 0 }} variant="h1">TrackNFlowIMS</TypographyH1>
          <TypographyH2 sx={{ mb: 2 }} variant="h2">Inventory Management System</TypographyH2>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            High performance web application built by biobank.cy
          </TypographyH2>
          <Login />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Page;
