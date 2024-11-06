import React, { useState, useEffect, FC } from "react";
import { Card } from "@mui/material";
import AddForm from "./AddForm";
import { getBatchApiDataSupplier } from "src/services/user.service";
import { FormEditSupplierValues, SupplierModel } from "src/models/mymodels";

interface MyProps {
  className?: string;
  prid: number;
}

const ApiGetProps: FC<MyProps> = ({ prid }) => {
  const emptyFormProps = {} as FormEditSupplierValues;
  const [myNewSupplier, setmyNewSupplier] = useState(emptyFormProps);
  let emptySupplier = {} as SupplierModel;

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
    let vars = [] as unknown as FormEditSupplierValues;
    vars.initsupplier = emptySupplier;

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
