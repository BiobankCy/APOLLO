import React, { useState, useEffect } from "react";
import { Card, Divider } from "@mui/material";
import {
  DepartmentModel,
  ProductModel,
  TenderModel,
} from "src/models/mymodels";
import ProductsTable from "./Table";
import {
  getAllDepartments,
  getAllProducts,
  getAllTenders,
} from "src/services/user.service";

function ApiGetAllRows() {
  
  const [prodList, setprodList] = useState<ProductModel[]>([]);
  const [tenderList, settenderList] = useState<TenderModel[]>([]);
  const [departmentList, setdepartmentList] = useState<DepartmentModel[]>([]);
  useEffect(() => {
    getAllProducts().then(
      (response) => {
        setprodList(response.data);
      },
      (error) => {
        //const _content =
        //    (error.response &&
        //        error.response.data &&
        //        error.response.data.message) ||
        //    error.message ||
        //    error.toString();

        setprodList([]);
      },
    );

    getAllTenders().then(
      (response) => {
        settenderList(response.data);
      },
      (error) => {
        settenderList([]);
      },
    );

    getAllDepartments().then(
      (response) => {
        setdepartmentList(response.data);
      },
      (error) => {
        setdepartmentList([]);
      },
    );
  }, []);

  return (
    <Card>
      <ProductsTable
        prodList={prodList}
        updateProductList={setprodList}
        tenderList={tenderList}
        departmentList={departmentList}
      />
      {/*<Divider />*/}
      {/*<EnhancedTable rows=  {prodList} />*/}
    </Card>
  );
}

export default ApiGetAllRows;
