import React from "react";
import {
  TextField,
  FormControl,
  Button,
  Box,
  TableContainer,
  TableCell,
  TableRow,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { TransferInventoryItemModel } from "../../../models/mymodels";


interface TransferFormProps {
  transList: TransferInventoryItemModel[];
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, newQty: number) => void;
}

const CenterForm: React.FC<TransferFormProps> = ({
  transList,
  removeItem,
  updateItemQuantity,
}) => {

  const handleQtyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    pid: string,
  ): void => {
    let value: any = null;
    if (e.target.value !== "") {
      value = e.target.value;
    }

    updateItemQuantity(pid, Number(value) | 0);
  };

  return (
    <Box p={3}>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 300, width: "100%" }}
          aria-label="spanning table"
          size={"small"}
        >
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell align="center">From Location</TableCell>
              <TableCell align="center">Lot</TableCell>
              <TableCell align="center">Condition</TableCell>
              <TableCell>Primer Details</TableCell>
              <TableCell align="center">To Location</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transList &&
              transList.map((row) => {
                return (
                  <TableRow key={row.lineid} hover>
                    <TableCell>{row.pcode}</TableCell>
                    <TableCell>{row.pname}</TableCell>
                    {/*     <TableCell align="center">  {row.qty}   </TableCell>*/}
                    <TableCell align="center">
                      <div>
                        <FormControl fullWidth focused>
                          <TextField
                            sx={{ m: 0, minWidth: "5ch", maxWidth: "6ch" }}
                            type="number"
                            id="my-input"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="standard"
                            required
                            //  error={isQtyValid(row.orderqty ?? 0)}
                            //   helperText={isQtyValid(row.orderqty ?? 0) ? "Min 1" : ""}
                            aria-describedby="my-helper-text"
                            defaultValue={row.qty}
                            inputProps={{
                              minLength: 1,
                              maxLength: 7,
                              min: "1",
                              max: "1000000",
                            }}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => handleQtyChange(event, row.lineid)}
                          />
                        </FormControl>
                      </div>
                    </TableCell>
                    <TableCell align="center"> {row.fromlocname} </TableCell>
                    <TableCell align="center"> {row.lotnumber} </TableCell>
                    <TableCell align="center"> {row.condstatusname} </TableCell>
                    <TableCell>
                      {" "}
                      {row.si.length > 0 && row.ns.length > 0 && (
                        <>
                          <br />
                          <span>
                            SI: {row.si}
                            <br />
                            NS: {row.ns}
                          </span>
                        </>
                      )}
                    </TableCell>
                    <TableCell align="center"> {row.tolocname} </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => removeItem(row.lineid)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
};

export default CenterForm;
