import React, { useState, useEffect, FC } from "react";
import { Card } from "@mui/material";
import AddProductForm from "./AddProductForm";
import { getBatchApiData } from "src/services/user.service";
import { FormEditProductValues, ProductModel } from "src/models/mymodels";

interface MyProps {
  className?: string;
  prid: number;
}

const ApiGetProps: FC<MyProps> = ({ prid }) => {
  const emptyFormProps = {} as FormEditProductValues;
  const [myProduct, setmyProduct] = useState(emptyFormProps);
  let emptyProduct = {} as ProductModel;

  emptyProduct.activestatusFlag = true;
  emptyProduct.categoryId = 0;
  emptyProduct.subcategoryId = 0;
  emptyProduct.brandId = 0;
  emptyProduct.vatId = 0;
  emptyProduct.defaultLocId = 0;
  emptyProduct.defaultSupplierId = 0;
  emptyProduct.manufacturerId = 0;
  emptyProduct.storageConditionId = 0;
  emptyProduct.code = "";
  emptyProduct.name = "";
  emptyProduct.barcode = "";
  emptyProduct.generalNotes = "";
  emptyProduct.concentration = "";
  emptyProduct.minstockqty = 0;
  emptyProduct.departments = [];
  emptyProduct.punits = "";
  emptyProduct.costprice = 0;
  emptyProduct.labMadeFlag = false;
  /*  emptyProduct.fordiagnosticsFlag = false;*/
  emptyProduct.forsequencingFlag = false;
  emptyProduct.multipleLocationsFlag = false;
  emptyProduct.expdateFlag = false;

  useEffect(() => {
    let vars = [] as unknown as FormEditProductValues;

    getBatchApiData(0).then(
      ([
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
        vars.initproduct = emptyProduct;
        vars.initlocations = locations;
        vars.initsuppliers = suppliers;
        vars.initdepartments = departments;
        vars.initstconds = storageConditions;
        vars.initcategories = categories;
        vars.initsubcategories = subcategories;
        vars.initbrands = brands;
        vars.initvatates = vatRates;
        vars.crudtype = "edit";
        vars.initmanufacturers = mans;

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
      <AddProductForm FormValuesProps={myProduct} />
    </Card>
  );
};

export default ApiGetProps;
