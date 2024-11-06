import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import { ProjectModel } from "src/models/mymodels";
import LotsTable from "./Table";
import { getAlProjectsWithCalculations } from "src/services/user.service";

function ApiGetAllRows() {
 
  const [tendersList, settendersList] = useState<ProjectModel[]>([]);
  const updateSingleTender = (tender: ProjectModel) => {
    // Find the index of the tender in the list
    const index = tendersList.findIndex((t) => t.id === tender.id);
    if (index !== -1) {
      // Create a new list with the updated tender
      const updatedList = [...tendersList];
      updatedList[index] = tender;
      settendersList(updatedList);
    }
  };

  const addSingleTender = (newTender: ProjectModel) => {
    // Create a new list with the new tender added
    const updatedList = [...tendersList, newTender];
    settendersList(updatedList);
};


  useEffect(() => {
    getAlProjectsWithCalculations().then(
      (response) => {
        settendersList(response.data);
      },
      (error) => {
        //const _content =
        //    (error.response &&
        //        error.response.data &&
        //        error.response.data.message) ||
        //    error.message ||
        //    error.toString();

        settendersList([]);
      },
    );
  }, []);

  return (
    <Card>
      <LotsTable
        projectsList={tendersList}
        updateTenderListFn={settendersList}
        updateSingleTenderInState={updateSingleTender}
        addNewTenderInState={addSingleTender}
      />
    </Card>
  );
}

export default ApiGetAllRows;
