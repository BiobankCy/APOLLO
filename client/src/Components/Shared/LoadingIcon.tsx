import React from "react";
import { CircularProgress } from "@mui/material";

const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <CircularProgress />
      {/*       <CircularProgress color="secondary" />*/}
    </div>
  );
};

export default LoadingIcon;
