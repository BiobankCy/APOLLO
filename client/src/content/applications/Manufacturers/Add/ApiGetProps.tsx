import React, { useState, useEffect, FC } from "react";
import { Card } from "@mui/material";
import AddForm from "./AddForm";
 
import { FormEditManufacturerValues, ManufacturerModel } from "src/models/mymodels";

interface MyProps {
  className?: string;
  prid: number;
}

const ApiGetProps: FC<MyProps> = ({ prid }) => {
  const emptyFormProps = {} as FormEditManufacturerValues;
  const [myNewSupplier, setmyNewSupplier] = useState(emptyFormProps);
  let emptySupplier = {} as ManufacturerModel;

  emptySupplier.code = "";
  emptySupplier.name = "";
  emptySupplier.activestatusFlag = true;
  emptySupplier.address = "";
  emptySupplier.country = "";
  emptySupplier.email = "";
  //  emptySupplier.faxnumber = '';
  emptySupplier.worknumber = "";
  emptySupplier.website = "";
  emptySupplier.generalNotes = "";

  useEffect(() => {
    let vars = [] as unknown as FormEditManufacturerValues;
    vars.initmanufacturer = emptySupplier;

    vars.crudtype = "add";
    setmyNewSupplier(vars);
  }, []);

  return (
    <Card>
      <AddForm FormValuesProps={myNewSupplier} />
    </Card>
  );
};

export default ApiGetProps;
