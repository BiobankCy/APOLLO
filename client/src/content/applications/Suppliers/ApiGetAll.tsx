import React, { useState, useEffect } from "react";
import { Card, Divider } from "@mui/material";
import { SupplierModel } from "src/models/mymodels";
import ProductsTable from "./Table";
import { getAllSuppliers } from "src/services/user.service";

function ApiGetAllRows() {
 
  const [prodList, setprodList] = useState<SupplierModel[]>([]);

  useEffect(() => {
    getAllSuppliers().then(
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
      <ProductsTable supList={prodList} updateSupplierList={setprodList} />
       
    </Card>
  );
}

export default ApiGetAllRows;
