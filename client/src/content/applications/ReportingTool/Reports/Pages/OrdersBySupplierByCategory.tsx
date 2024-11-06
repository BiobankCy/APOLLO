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
  Alert,
} from "@mui/material";
 
import { ReportForOrdersModel, ReportForOrdersModelHead } from "../Models/AllInterfaces";
import { ccyFormat } from "src/models/mymodels";
 

interface StockReportProps {
  data: ReportForOrdersModelHead;  
}

const OrdersBySuppplierByCategory: React.FC<StockReportProps> = ({ data }) => {
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

  const calculatePivotTableData = (
    rows: ReportForOrdersModel[],
    categories: string[],
    suppliers: string[]
  ) => {
    const pivotData: { [supplier: string]: any }[] = [];
  
    suppliers.forEach((supplier) => {
      const rowData: { [key: string]: any } = { supplier: supplier, total: 0 };
      categories.forEach((category) => {
        const totalAmount = rows
          .filter((row) => row.suppliername === supplier && row.catname === category)
          .reduce((sum, row) => sum + row.totalamountVatIncluded, 0);
        rowData[category] = totalAmount;
        rowData.total += totalAmount;
      });
      pivotData.push(rowData);
    });
  
    return pivotData;
  };
  
  const categories = Array.from(new Set(data.rows.map((row) => row.catname)));
  const suppliers = Array.from(new Set(data.rows.map((row) => row.suppliername)));

  const pivotTableData = calculatePivotTableData(data.rows, categories, suppliers);

  return (
    <Paper>
      {/* Original Table */}
      <Alert sx={{mt:3}} variant="filled" severity="info">Normal View</Alert>
      <TableContainer style={{ overflow: "auto", maxHeight: "300px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier ID</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Category ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Total Amount (VAT Excluded)</TableCell>
              <TableCell align="right">Total VAT Amount</TableCell>
              <TableCell align="right">Total Amount (VAT Included)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.supplierid}</TableCell>
                <TableCell>{item.suppliername}</TableCell>
                <TableCell>{item.catid}</TableCell>
                <TableCell>{item.catname}</TableCell>
                <TableCell align="right">{ccyFormat(item.totalamountVatExcluded)}</TableCell>
                <TableCell align="right">{ccyFormat(item.totalVatAmount)}</TableCell>
                <TableCell align="right">{ccyFormat(item.totalamountVatIncluded)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell align="right" colSpan={4}>
                Totals:
              </TableCell>
              <TableCell align="right">{ccyFormat(data.totalsline.totalamountVatExcluded)}</TableCell>
              <TableCell align="right">{ccyFormat(data.totalsline.totalVatAmount)}</TableCell>
              <TableCell align="right">{ccyFormat(data.totalsline.totalamountVatIncluded)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
           
      {/* Pivot Table */}
    
      <Alert   sx={{mt:3}}  variant="filled" severity="info">Pivot View</Alert>
      <TableContainer style={{ overflow: "auto", maxHeight: "300px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier</TableCell>
              {categories.map((category, index) => (
                <TableCell key={index}>{category}</TableCell>
              ))}
              <TableCell>Total Amount (VAT INCLUDED)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pivotTableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.supplier}</TableCell>
                {categories.map((category, index) => (
                  <TableCell key={index}>{row[category] || "-"}</TableCell>
                ))}
                <TableCell>{ccyFormat(row.total)}</TableCell>
             
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        sx={{ backgroundColor: "#e0e0e0" }}
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

export default OrdersBySuppplierByCategory;
