import React, { useState, useEffect, FC } from "react";
import { Card } from "@mui/material";
import EditForm from "./EditForm";
import { getBatchApiDataSupplier } from "src/services/user.service";
import { FormEditSupplierValues } from "src/models/mymodels";

interface MyProps {
  className?: string;
  supid: number;
}

const ApiGet: FC<MyProps> = ({ supid }) => {
  const emptyFormProps = {} as FormEditSupplierValues;
  const [mySupplier, setmySupplier] = useState(emptyFormProps);

  useEffect(() => {
    let vars = [] as unknown as FormEditSupplierValues;

    getBatchApiDataSupplier(supid).then(
      ([{ data: supplier }]) => {
        vars.initsupplier = supplier;

        vars.crudtype = "edit";
        setmySupplier(vars);
      },
      (error) => {
    

        setmySupplier(emptyFormProps);
      },
    );
  }, []);

  return (
    <Card>
      <EditForm FormValuesProps={mySupplier} />
    </Card>
  );
};

export default ApiGet;
