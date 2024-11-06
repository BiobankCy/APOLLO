import React, { useState, useEffect } from "react";
import { Card, Divider } from "@mui/material";
import { ManufacturerModel } from "src/models/mymodels";
import ProductsTable from "./Table";
import { getAllManufacturers } from "src/services/user.service";

function ApiGetAllRows() {
 
  const [prodList, setprodList] = useState<ManufacturerModel[]>([]);

  useEffect(() => {
    getAllManufacturers().then(
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
      <ProductsTable manufList={prodList} updateManufList={setprodList} />
      {/*<Divider />*/}
      {/*<EnhancedTable rows=  {prodList} />*/}
    </Card>
  );
}

export default ApiGetAllRows;
