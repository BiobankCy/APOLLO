import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import { CustomPurchaseOrderLine, VatRateModel } from "src/models/mymodels";
import MyTable from "./Table";
import {
  getAllDataForOrderLinesformNEW,
  getAllVatRates,
} from "src/services/user.service";

function ApiGetAllRows() {
  
  const [pordersCustomData, setpordersCustomData] = useState<
    CustomPurchaseOrderLine[]
  >([]);
  const [vatRates, setvatRates] = useState<VatRateModel[]>([]);

  useEffect(() => {
    getAllDataForOrderLinesformNEW().then(
      (response) => {
        setpordersCustomData(response.data);
      },
      (error) => {
        setpordersCustomData([]);
      },
    );
    getAllVatRates().then(
      (response) => {
        setvatRates(response.data);
      },
      (error) => {
        setvatRates([]);
      },
    );
  }, []);

  return (
    <Card>
      <MyTable
        vatRates={vatRates}
        pordersCustomData={pordersCustomData}
        updatePorderLinesList={setpordersCustomData}
      />
    </Card>
  );
}

export default ApiGetAllRows;
