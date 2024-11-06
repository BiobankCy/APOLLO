import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import {
  availableStockAnalysisModel,
  ccyFormat,
  customDateFormat,
  ProductModel,
} from "../../../../models/mymodels";

interface CurrentStockComponentProps {
  data: ProductModel;
}

const InventoryAnalysisComponent: React.FC<CurrentStockComponentProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardContent>
        {/*<Typography variant="h4" component="div">*/}
        {/*    Inventory Analysis*/}
        {/*</Typography>*/}
        {/*<Typography variant="body2" color="textSecondary">*/}
        {/*    Product Code: {data.code}*/}
        {/*</Typography>*/}
        {/*<Typography variant="body2" color="textSecondary">*/}
        {/*    Product Name: {data.name}*/}
        {/*</Typography>*/}

        {/* Render the table for availableStockAnalysis */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Qty</TableCell>

                <TableCell>Lot Number</TableCell>
                <TableCell>Expiration Date</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Building</TableCell>

                <TableCell>Room</TableCell>
                <TableCell>Location</TableCell>

                <TableCell>Primer Details</TableCell>
                <TableCell>Location Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.availableStockAnalysis.map(
                (item: availableStockAnalysisModel, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.qty}</TableCell>

                    <TableCell>{item.lotnumber}</TableCell>
                    <TableCell>
                      {item.expdate &&
                        customDateFormat(item.expdate, "DateOnly")}
                    </TableCell>

                    <TableCell>{item.conname}</TableCell>
                    <TableCell>{item.buldingname}</TableCell>

                    <TableCell>{item.roomname}</TableCell>
                    <TableCell>{item.locname}</TableCell>

                    <TableCell>
                      {item.si.length > 0 && item.ns.length > 0 && (
                        <Typography
                          variant="body2"
                          fontWeight="normal"
                          color="text.primary"
                        >
                          SI: {item.si} <br />
                          NS: {item.ns}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>{item.loctypename}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default InventoryAnalysisComponent;
