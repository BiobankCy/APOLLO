import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  TableFooter,
} from "@mui/material";
 
import { ReportForOrdersModel, ReportForOrdersModelHead } from "../Models/AllInterfaces";
import { ccyFormat } from "src/models/mymodels";
 

interface StockReportProps {
  data: ReportForOrdersModelHead;  
}

const OrdersByProduct: React.FC<StockReportProps> = ({ data }) => {
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

  const slicedData = data.rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (

    <Paper >
       
    <TableContainer style={{ overflow: "auto", maxHeight: "400px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Total Qty</TableCell>
              <TableCell align="right">Total Amount (VAT Excluded)</TableCell>
              <TableCell align="right">Total VAT Amount</TableCell>
              <TableCell align="right">Total Amount (VAT Included)</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((item, index) => (
              <TableRow key={index}>
                 <TableCell>{item.pcode}</TableCell>
                <TableCell>{item.pname}</TableCell>
                <TableCell align="right">{item.totalqty}</TableCell>
                <TableCell align="right">  {ccyFormat(item.totalamountVatExcluded)}</TableCell>
                <TableCell align="right">  {ccyFormat(item.totalVatAmount)} </TableCell>
                <TableCell align="right">  {ccyFormat(item.totalamountVatIncluded)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter sx={{ backgroundColor: "#f0f0f0"}} > 
            <TableRow>
              <TableCell align="right" colSpan={2}>
                Totals:
              </TableCell>
              <TableCell align="right">  {data.totalsline.totalqty}</TableCell>
              <TableCell align="right">  {ccyFormat(data.totalsline.totalamountVatExcluded)}</TableCell>
                <TableCell align="right">  {ccyFormat(data.totalsline.totalVatAmount)} </TableCell>
                <TableCell align="right">  {ccyFormat(data.totalsline.totalamountVatIncluded)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
       
      </TableContainer>
   
      <TablePagination
      sx={{ backgroundColor: "#e0e0e0"}} 
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={data.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
   


 
   
  );
};

export default OrdersByProduct;
