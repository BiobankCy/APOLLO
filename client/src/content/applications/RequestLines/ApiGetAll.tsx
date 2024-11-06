import React, { useState, useEffect } from "react";
import { Card, Divider } from "@mui/material";
import { CustomRequestLinesModel } from "src/models/mymodels";
import ProductsTable from "./Table";
import { getAllRequestLinesCustom } from "src/services/user.service";

function ApiGetAllRows() {
  const [prodList, setprodList] = useState<CustomRequestLinesModel[]>([]);

  useEffect(() => {
    getAllRequestLinesCustom(0).then(
      (response) => {
        setprodList(response.data);
      },
      (error) => {


        setprodList([]);
      },
    );
  }, []);

  return (
    <Card>
      <ProductsTable reqLinesListinitial={prodList} />

    </Card>
  );
}

export default ApiGetAllRows;
