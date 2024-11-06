import React, { useState, useEffect, FC } from "react";
import { Card } from "@mui/material";
import EditForm from "./EditForm";
import { getBatchApiDataManufacturer } from "src/services/user.service";
import { FormEditManufacturerValues } from "src/models/mymodels";

interface MyProps {
  className?: string;
  supid: number;
}

const ApiGet: FC<MyProps> = ({ supid }) => {
  const emptyFormProps = {} as FormEditManufacturerValues;
  const [myManufacturer, setmyManufacturer] = useState(emptyFormProps);

  useEffect(() => {
    let vars = [] as unknown as FormEditManufacturerValues;

    getBatchApiDataManufacturer(supid).then(
      ([{ data: manufacturer }]) => {
        vars.initmanufacturer = manufacturer;

        vars.crudtype = "edit";
        setmyManufacturer(vars);
      },
      (error) => {
       

        setmyManufacturer(emptyFormProps);
      },
    );
  }, []);

  return (
    <Card>
      <EditForm FormValuesProps={myManufacturer} />
    </Card>
  );
};

export default ApiGet;
