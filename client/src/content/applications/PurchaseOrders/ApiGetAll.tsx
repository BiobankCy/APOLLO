import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import { CustomPurchaseOrderModel } from "src/models/mymodels";
import MyTable from "./Table";
import { getAllPorders } from "src/services/user.service";

function ApiGetAllRows() {
 
  const [pordersList, setPordersList] = useState<CustomPurchaseOrderModel[]>(
    [],
  );

  useEffect(() => {
    getAllPorders().then(
      (response) => {
        setPordersList(response.data);
      },
      (error) => {
       

        setPordersList([]);
      },
    );
  }, []);

  return (
    <Card>
      <MyTable pordersList={pordersList} updatePordersList={setPordersList} />
    </Card>
  );
}

export default ApiGetAllRows;
