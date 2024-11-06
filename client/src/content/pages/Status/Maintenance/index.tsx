import {
  Box,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import Logo from "src/Components/LogoSign";

import { styled } from "@mui/material/styles";
import React from "react";

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`,
);

function StatusMaintenance() {
  return (
    <>
      <Helmet>
        <title>Status - Maintenance</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Logo />
          <Box textAlign="center">
            <Container maxWidth="xs">
              <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
                The site is currently down for maintenance
              </Typography>
              <Typography
                variant="h3"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                We apologize for any inconveniences caused
              </Typography>
            </Container>
            <img
              alt="Maintenance"
              height={250}
              src="/static/images/status/maintenance.svg"
            />
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
             
             
          </Box>
        </Container>
      </MainContent>
    </>
  );
}

export default StatusMaintenance;
