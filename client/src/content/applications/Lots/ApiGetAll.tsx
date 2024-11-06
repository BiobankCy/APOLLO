import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import { LotModel } from "src/models/mymodels";
import LotsTable from "./Table";
import { getAllLots } from "src/services/user.service";

function ApiGetAllRows() {
  const [lotsList, setLotsList] = useState<LotModel[]>([]);

  useEffect(() => {
    getAllLots().then(
      (response) => {
        setLotsList(response.data);
      },
      (error) => {


        setLotsList([]);
      },
    );
  }, []);

  return (
    <Card>
      <LotsTable lotsList={lotsList} updateLotListFn={setLotsList} />
    </Card>
  );
}

export default ApiGetAllRows;
