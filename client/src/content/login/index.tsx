import { Box, Container, Card } from "@mui/material";
import { Helmet } from "react-helmet-async";

import { styled } from "@mui/material/styles";
import Logo from "src/Components/LogoSign";
import Page from "./Page";
import React from "react";

const OverviewWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`,
);

function Login() {
  return (
    <OverviewWrapper>
      <Helmet>
        <title>TrackNFlowIMS - Inventory Management System</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={5} alignItems="center">
          <Logo />
        </Box>
        <Card sx={{ p: 10, mb: 10, borderRadius: 12 }}>
          <Page />
        </Card>
      </Container>
    </OverviewWrapper>
  );
}

export default Login;
