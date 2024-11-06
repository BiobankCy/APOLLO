import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material";

interface TooltipIconButtonProps {
  title: string;
  size?: "small" | "medium";
  icon: React.ReactElement;  // Add icon prop
}

const TooltipIconButton: React.FC<TooltipIconButtonProps> = ({
  title,
  size,
  icon,  // Destructure icon prop
}) => {
  const theme = useTheme();

  return (
    <Tooltip title={title} arrow>
      <IconButton
        sx={{
          "&:hover": {
            background: theme.palette.info.light,
          },
          color: theme.palette.info.main,
        }}
        color="inherit"
        size={size}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default TooltipIconButton;
