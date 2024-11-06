import React, { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FilterAltOff from "@mui/icons-material/FilterAltOff";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  IconButton,
  Button,
  useTheme,
  Paper,
  Badge,
  Collapse,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const countAppliedFilters = (filters: any): number => {
  let count = 0;
  try {
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : true)
      ) {
        count++;
      }
    });
  } catch (error) {
    count = 0;
  }
  return count;
};

interface FilterControlsProps {
  filters: any;
  clearAllFilters: () => void;
  children?: React.ReactNode; // Include children in the type definition
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  clearAllFilters,
  children,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isCollapsed, setIsCollapsed] = useState(true);

  const appliedFiltersCount = countAppliedFilters(filters);
  const ButtonError = styled(Button)(
    ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `,
  );

  return (
    <>
      <Badge badgeContent={appliedFiltersCount} color="success" showZero>
        <IconButton
          sx={{ p: "10px" }}
          aria-label="toggle-filters"
          onClick={() => setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed)}
        >
          {isCollapsed ? (
            <>
              <ExpandMoreIcon color="action" />
              <Typography>Show Filters</Typography>
            </>
          ) : (
            <>
              <ExpandLessIcon color="action" />
              <Typography>Hide Filters</Typography>
            </>
          )}
        </IconButton>
        {appliedFiltersCount > 0 && (
          <ButtonError
            disabled={appliedFiltersCount <= 0}
            sx={{ ml: 1 }}
            variant="contained"
            onClick={clearAllFilters}
            startIcon={<FilterAltOff fontSize="small" />}
          >
            Clear Filters
          </ButtonError>
        )}
      </Badge>
      <Collapse in={!isCollapsed}>
        <Paper
          component="form"
          sx={{
            p: "20px",
            display: "flex",
            alignItems: "center",
            minWidth: isSmallScreen ? 0 : 400,
          }}
        >
          <Grid container spacing={2}>
            {children}
          </Grid>
        </Paper>
      </Collapse>
    </>
  );
};

export default FilterControls;
