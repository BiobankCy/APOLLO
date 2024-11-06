import React, { useState, useEffect, FC } from "react";
import { Card } from "@mui/material";
import EditProductForm from "./EditProductForm";
import { getBatchApiData } from "src/services/user.service";
import { FormEditProductValues, ProductModel } from "src/models/mymodels";

interface MyProps {
  className?: string;
  prid: number;
  formcalledby: "dialog" | "normal";
  onClose: () => void;
  handleUpdateSingleProduct?: (produtctToUpdate: ProductModel) => void;
}


const ApiGetProduct: FC<MyProps> = ({ prid, formcalledby, onClose, handleUpdateSingleProduct }) => {
  const emptyFormProps = {} as FormEditProductValues;
  const [myProduct, setmyProduct] = useState(emptyFormProps);
  // const handleUpdateProduct = (updatedProduct: FormEditProductValues) => {
  //   setmyProduct(updatedProduct);
  // };
  useEffect(() => {
    let vars = [] as unknown as FormEditProductValues;

    getBatchApiData(prid).then(
      ([
        { data: product },
        { data: locations },
        { data: suppliers },
        { data: storageConditions },
        { data: categories },
        { data: subcategories },
        { data: brands },
        { data: vatRates },
        { data: departments },
        { data: mans },
      ]) => {
        vars.initproduct = product;
        vars.initlocations = locations;
        vars.initsuppliers = suppliers;
        vars.initmanufacturers = mans;
        vars.initstconds = storageConditions;
        vars.initcategories = categories;
        vars.initsubcategories = subcategories;
        vars.initbrands = brands;
        vars.initvatates = vatRates;
        vars.initdepartments = departments;
        vars.crudtype = "edit";
        setmyProduct(vars);
      },
      (error) => {
        //const _content =
        //    (error.response &&
        //        error.response.data &&
        //        error.response.data.message) ||
        //    error.message ||
        //    error.toString();

        setmyProduct(emptyFormProps);
      },
    );
  }, []);


  return (
    <Card>
      <EditProductForm handleUpdateSingleProduct={handleUpdateSingleProduct} onClose={onClose} formcalledby={formcalledby} FormValuesProps={myProduct} />
    </Card>
  );
};

export default ApiGetProduct;
