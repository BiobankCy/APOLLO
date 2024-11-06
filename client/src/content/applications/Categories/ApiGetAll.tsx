import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import { CategoryModel } from "src/models/mymodels";
import CategoriesTable from "./Table";
import { getAllCategories } from "src/services/user.service";


function ApiGetAllRows() {

  const [categoriesList, setCategoriesList] = useState<CategoryModel[]>([]);

  useEffect(() => {
    getAllCategories().then(
      (response) => {
        setCategoriesList(response.data);
      },
      (error) => {


        setCategoriesList([]);
      },
    );
  }, []);


  return (
    <Card>
      <CategoriesTable
        catsList={categoriesList}
        updateCategoriesList={setCategoriesList}
      />
      {/*<Divider />*/}

    </Card>
  );
}

export default ApiGetAllRows;
