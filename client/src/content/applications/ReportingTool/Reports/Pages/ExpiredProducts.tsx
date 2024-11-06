import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableFooter,
 
} from "@mui/material";
import { ccyFormat, customDateFormat, ProductModel } from "../../../../../models/mymodels";

interface StockReportProps {
  data: ProductModel[]; // Update the type of data based on your API response
}

const StockReport: React.FC<StockReportProps> = ({ data }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Lot</TableCell>
              <TableCell>ExpDate</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((item, index) => (
              <React.Fragment key={item.id}>
                <TableRow style={{ background: "lightgrey" }}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{item.availabletotalstockqty}</TableCell>
                </TableRow>
                {item.availableStockAnalysis.map((stockItem, innerIndex) => (
                  <TableRow key={`${item.id}-${innerIndex}`}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {stockItem.buldingname} - {stockItem.roomname} -{" "}
                      {stockItem.locname}
                    </TableCell>
                    <TableCell>{stockItem.lotnumber}</TableCell>
                    <TableCell>
                      {customDateFormat(stockItem.expdate, "DateOnly")}
                    </TableCell>
                    <TableCell>{stockItem.qty}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
          <TableFooter sx={{ backgroundColor: "#f0f0f0"}} > 
            <TableRow>
              <TableCell align="right" colSpan={2}>
                Totals:
              </TableCell>
               
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <TablePagination
      sx={{ backgroundColor: "#e0e0e0"}} 
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default StockReport;
