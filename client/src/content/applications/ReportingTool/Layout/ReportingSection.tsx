import React from "react";
import {
  Typography,
  Button,
  styled,
  Divider,
  Paper,
  Grid,
} from "@mui/material";


 
import { ReportGenerator } from "./ReportGenerator";
import { ReportModel } from "../Reports/Models/AllInterfaces";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.primary,
}));


interface ReportSectionProps {
  selectedReport: ReportModel | null;
  clearSelectedReport: () => void;
}



const ReportSection: React.FC<ReportSectionProps> = (props) => {
  //   const ReportSection: React.FC = (myParams: ReportSectionProps) => {
  // const reports = props.reports;

  return (
    <div>
      {props.selectedReport && (
        <Grid container spacing={2} sx={{ p: 2, pr: 4 }}>
          <Grid item xs={12} sm={6} >
            <Button onClick={props.clearSelectedReport} variant="contained">
              Back to Reports
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}  >
            <Typography pt={0} variant="h4">
              Selected Report: {props.selectedReport.category} / {props.selectedReport.shortname}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <ReportGenerator report={props.selectedReport} />
          </Grid>
        </Grid>
      )}
    </div>
  );

};

export default ReportSection;
