import React from "react";
import { Box, Container, Link, Typography, styled } from "@mui/material";

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`,
);



function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        pb={4}
        display={{ xs: "block", md: "flex" }}
        alignItems="center"
        textAlign={{ xs: "center", md: "left" }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; {new Date().getFullYear()} TrackNFlowIMS - Inventory Management System
          </Typography>
          <Typography variant="subtitle1">          
            Licensed under the MIT License
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              pt: { xs: 2, md: 0 },
            }}
            variant="subtitle1"
          >
            Powered by{" "}
            <Link
              href="https://biobank.cy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              biobank.cy
            </Link>
          </Typography>
        </Box>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
