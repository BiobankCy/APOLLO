import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ReceivingLineModelNew, customDateFormat } from 'src/models/mymodels';

interface SimpleTableProps {
  data: ReceivingLineModelNew[];
}

const ReceivedLinesTable: React.FC<SimpleTableProps> = ({ data }) => {
  // Sort the data array by datescanned in descending order
  const sortedData = [...data].sort((a, b) =>
    b.datescanned.toISOString().localeCompare(a.datescanned.toISOString())
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Scanned</TableCell>
            {/* <TableCell>ID</TableCell> */}
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Lot ID</TableCell>
            <TableCell>Location ID</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow key={`${row.id}-${index}`}>
              <TableCell>{customDateFormat(row.datescanned, "Datetime")}</TableCell>
              {/* <TableCell>{row.id}</TableCell> */}
              <TableCell>{row.code}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.qty}</TableCell>
              <TableCell>{row.lotid}</TableCell>
              <TableCell>{row.locid}</TableCell>
              <TableCell>{row.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReceivedLinesTable;
