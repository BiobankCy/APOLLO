import { Calculate, ClosedCaption } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { CloseButton } from "react-toastify/dist/components";
import {
  ccyFormat,
  customDateFormat,
  CustomTransactionLineDTO,
  TransactionLogDetailsModel,
  TransactionLogHeaderModel,
} from "../../../../models/mymodels";
/*import "./Mycss.css";*/
interface TransactionsComponentProps {
  data: CustomTransactionLineDTO[];  
}

const TransactionsComponent: React.FC<TransactionsComponentProps> = ({
  data,
}) => {
  const isSmallScreen = useMediaQuery("(max-width:800px)");
  let runningTotal = 0;

  return (
    <Card>
      <CardContent>
        {/*<Typography variant="h4" component="div">*/}
        {/*    Product Transactions*/}
        {/*</Typography>*/}
        {!isSmallScreen && ( // Show table on large screens
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>UnitCost</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Lot</TableCell>
                  <TableCell>Expdate</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Running Total Qty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((line: CustomTransactionLineDTO, index) => {
                  let runningTotal = 0;

                  for (let i = 0; i <= index; i++) {
                    runningTotal += data[i].qty;
                  }

                  return (
                    <TableRow key={line.translineid}>
                      <TableCell>{line.transid}</TableCell>
                      <TableCell>
                        {customDateFormat(line.transdate, "Datetime")}
                      </TableCell>
                      <TableCell>{line.transtype}</TableCell>
                      <TableCell>{line.transreason}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={line.qty}
                          color={line.qty < 0 ? "error" : "primary"}
                        />
                      </TableCell>
                      <TableCell>
                        {line.unitcostrecalflag ? (
                          <Chip
                            size="small"
                            icon={<Calculate />}
                            label={ccyFormat(line.unitcostprice)}
                            color="primary"
                          />
                        ) : (
                          <Chip
                            size="small"
                            label={ccyFormat(line.unitcostprice)}
                            color="primary"
                          />
                        )}
                      </TableCell>
                      <TableCell>{line.locname}</TableCell>
                      <TableCell>{line.lotnumber}</TableCell>
                      <TableCell>
                        {customDateFormat(line.expdate, "DateOnly")}
                      </TableCell>
                      <TableCell>{line.user}</TableCell>
                      <TableCell>{runningTotal}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {isSmallScreen && ( // Show list on small screens
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
             {data.map((line: CustomTransactionLineDTO, index) => {
          runningTotal += line.qty;
      
          return (
            <React.Fragment key={index}>
                  <ListItem key={line.translineid} alignItems="flex-start">
                    <ListItemText
                      primary={line.transtype + " (" + line.transreason + ")"}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="darkorange"
                          >
                            {customDateFormat(line.transdate, "Datetime")}
                          </Typography>

                          <Typography>
                            <Chip
                              size="small"
                              label={"Qty: " + line.qty}
                              color={line.qty < 0 ? "error" : "primary"}
                            />
                          </Typography>
                          <Typography>
                            {"Unit Cost: "}
                            {line.unitcostrecalflag ? (
                              <Chip
                                size="small"
                                icon={<Calculate />}
                                label={ccyFormat(line.unitcostprice)}
                                color="primary"
                              />
                            ) : (
                              <Chip
                                size="small"
                                label={ccyFormat(line.unitcostprice)}
                                color="primary"
                              />
                            )}
                          </Typography>
                          <Typography>
                            {line.lotnumber &&
                              line.lotnumber.length > 0 &&
                              "Lot: " + line.lotnumber}
                            {line.expdate &&
                              line.expdate.length > 0 &&
                              "Expdate: " +
                                customDateFormat(line.expdate, "DateOnly")}
                          </Typography>

                          <Typography>Location: {line.locname}</Typography>
                          <Typography>User: {line.user}</Typography>
                          <Typography>
                            <Chip
                              size="small"
                              label={"Running Total Qty: " + runningTotal}
                              color="warning"
                            />
                          </Typography>
                          {""}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsComponent;
