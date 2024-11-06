import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <>
      <div style={{ display: "block" }}>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}% remaining`}</Typography>
        </Box>
      </div>
      <div style={{ display: "block" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
      </div>
    </>
  );
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  initialBudget,
  totalAmountLeft,
}) => {


  const calculatePercentageLeft = (
    totalAmountLeft: number,
    initialBudget: number,
  ): number => {
    if (isNaN(totalAmountLeft) || isNaN(initialBudget) || initialBudget <= 0) {
      return 0; // Set to 0 if any value is not a valid number or initialBudget is zero or less
    }

    const percentageLeft = (totalAmountLeft / initialBudget) * 100;

    return Math.max(0, percentageLeft); // Ensure the result is not negative
  };

  const percentageLeft = calculatePercentageLeft(
    totalAmountLeft,
    initialBudget,
  );

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={percentageLeft} />
    </Box>
  );
};

interface ProgressBarProps {
  initialBudget: number;
  totalAmountLeft: number;
}

export default ProgressBar;
