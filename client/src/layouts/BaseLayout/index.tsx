import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";
import React from "react";

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
      }}
    >
      {children || <Outlet />}
    </Box>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node,
};

export default BaseLayout;
