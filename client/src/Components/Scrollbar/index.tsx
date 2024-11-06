import { FC, ReactNode } from "react";
import React from "react";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars-2";

import { Box, useTheme } from "@mui/material";

interface ScrollbarProps {
  className?: string;
  children?: ReactNode;
}

const Scrollbar: FC<ScrollbarProps> = ({ className, children, ...rest }) => {
  const theme = useTheme();

  return (
    <Scrollbars
      autoHide
      renderThumbVertical={() => {
        return (
          <Box
            sx={{
              width: 50,
              background: `${theme.colors.alpha.black[70]}`,
              borderRadius: `${theme.general.borderRadiusLg}`,
              transition: `${theme.transitions.create(["background"])}`,

              "&:hover": {
                background: `${theme.colors.alpha.black[100]}`,
              },
            }}
          />
        );
      }}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Scrollbar;
