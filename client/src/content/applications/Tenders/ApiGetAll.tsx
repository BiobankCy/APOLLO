import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import { TenderModel } from "src/models/mymodels";
import LotsTable from "./Table";
import { getAllTendersWithCalculations } from "src/services/user.service";

function ApiGetAllRows() {

  const [tendersList, settendersList] = useState<TenderModel[]>([]);
  const updateSingleTender = (tender: TenderModel) => {
    // Find the index of the tender in the list
    const index = tendersList.findIndex((t) => t.id === tender.id);
    if (index !== -1) {
      // Create a new list with the updated tender
      const updatedList = [...tendersList];
      updatedList[index] = tender;
      settendersList(updatedList);
    }
  };

  const addSingleTender = (newTender: TenderModel) => {
    // Create a new list with the new tender added
    const updatedList = [...tendersList, newTender];
    settendersList(updatedList);
  };


  useEffect(() => {
    getAllTendersWithCalculations().then(
      (response) => {
        settendersList(response.data);
      },
      (error) => {


        settendersList([]);
      },
    );
  }, []);

  return (
    <Card>
      <LotsTable
        tendersList={tendersList}
        updateTenderListFn={settendersList}
        updateSingleTenderInState={updateSingleTender}
        addNewTenderInState={addSingleTender}
      />
    </Card>
  );
}

export default ApiGetAllRows;
