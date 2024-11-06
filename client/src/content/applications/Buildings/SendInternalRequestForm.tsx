import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ProductModel } from "../../../models/mymodels";
import { FormControl, Input, InputLabel, Typography } from "@mui/material";

function fillInternalOrder(products: ProductModel[]): InternalOrder[] {
  let finalinternalorder = [] as InternalOrder[];
  products.map((product) => finalinternalorder.push(product));
  //products.forEach(p => finalinternalorder.push(p));
  finalinternalorder.forEach((p) => (p.orderqty = 1));
  return finalinternalorder;
}

function subtotal(items: InternalOrder[]) {
  return items
    .map(({ costprice, orderqty }) => costprice * (orderqty ?? 0))
    .reduce((sum, i) => sum + i, 0);
}
const TAX_RATE = 0.19;

function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}

interface InternalOrder extends ProductModel {
  orderqty?: number;
}

interface MyTotals {
  subtotalamount: number;
  totalamount: number;
  totalVATamount: number;
}

export default function InternalRequestForm(myproList: ProductModel[]) {
  const [myOrder, setmyOrder] = useState<InternalOrder[]>();
  const [myOrdertotals, setmyOrdertotals] = useState<MyTotals>();

  //let subt = myOrdertotals?.subtotalamount;

  function refreshTotals(newTotals: MyTotals) {
    setmyOrdertotals(newTotals);
  }

  //useEffect(() => {
  //    if (myOrdertotals) {
  //        console.log("2", myOrdertotals);
  //        console.log("1", myOrder);
  //    }
  //}, [myOrdertotals]);

  useEffect(() => {
    setmyOrder(fillInternalOrder(myproList));
  }, [myproList]);

  useEffect(() => {
    if (myOrder && myOrder.length > 0) {
      refreshTotals({
        subtotalamount: subtotal(myOrder),
        totalamount: subtotal(myOrder),
        totalVATamount: 0,
      });
      //   subt = myOrdertotals?.subtotalamount;
      //setmyOrdertotals(prevState => {
      //    return {
      //        ...prevState,
      //        subtotalamount: subtotal(myOrder)
      //    };
      //});
      //return () => {
      //    refreshTotals({ subtotalamount: subtotal(myOrder), totalamount: subtotal(myOrder), totalVATamount: 0 });
      //}
    } else {
      refreshTotals({ subtotalamount: 0, totalamount: 0, totalVATamount: 0 });
    }
  }, [myOrder]);

  //let  invoiceSubtotal = myOrder ? subtotal(myOrder) : 0;

  //let invoiceTaxes = TAX_RATE * invoiceSubtotal;
  //let invoiceTotal = invoiceTaxes + invoiceSubtotal;

  const handleQtyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    pid: string,
  ): void => {
    let value: any = null;
    if (e.target.value !== "") {
      value = e.target.value;
    }

    if (myOrder) {
      setmyOrder(
        myOrder.map((artwork) => {
          if (artwork.id === pid) {
            return { ...artwork, orderqty: Number(value) | 0 };
          } else {
            // No changes
            return artwork;
          }
        }),
      );
    }
  };

  return (
    <>
      <div>
        <FormControl fullWidth focused>
          <InputLabel htmlFor="my-input">Notes</InputLabel>
          <Input id="my-input" aria-describedby="my-helper-text" />
          {/* <FormHelperText id="my-helper-text">Enter your notes here.</FormHelperText>*/}
        </FormControl>
      </div>

      {myOrder && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    Details
                  </TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Desc</TableCell>
                  <TableCell align="right">Quantity.</TableCell>
                  <TableCell align="right">Unit</TableCell>
                  <TableCell align="right">Sum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myOrder.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">
                        <div>
                          <FormControl fullWidth focused>
                            {/*<InputLabel htmlFor="my-input">Quantity</InputLabel>*/}
                            <Input
                              type="number"
                              id="my-input"
                              aria-describedby="my-helper-text"
                              defaultValue={row.orderqty}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                              ) => handleQtyChange(event, row.id)}
                            />
                          </FormControl>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        {ccyFormat(row.costprice)}
                      </TableCell>
                      <TableCell align="right">
                        {ccyFormat(row.costprice * (row?.orderqty ?? 0))}
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell defaultValue="" align="right">
                    <Typography>
                      {" "}
                      {ccyFormat(myOrdertotals?.subtotalamount ?? 0)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax</TableCell>
                  {/*<TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>*/}
                  <TableCell align="right">
                    {ccyFormat(myOrdertotals?.totalVATamount ?? 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="right">
                    {ccyFormat(myOrdertotals?.totalamount ?? 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
