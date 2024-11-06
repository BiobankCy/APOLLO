import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    Chip,
    Divider,
    Switch,
    Typography,
    IconButton,
    Alert,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { SupplierModel, TenderModel, TenderSupplierAssignedModel, customDateFormat } from "src/models/mymodels";
import { addNewTender, getAllSuppliers, updateSingleTender } from "src/services/user.service";
import { EditNoteTwoTone } from "@mui/icons-material";
import { AxiosError, AxiosResponse } from "axios";
import { useAlert } from "src/contexts/AlertsContext";

interface Props {
    open: boolean;
    onClose: () => void;
    tender?: TenderModel; // Pass the tender object for editing
    updateSingleTenderInState?: (tender: TenderModel) => void;
    addNewTenderInState?: (tender: TenderModel) => void;
}

const TenderDialog: React.FC<Props> = ({ open, onClose, tender, updateSingleTenderInState, addNewTenderInState }) => {
    const { showAlert } = useAlert();
    const [selectedTenderForEdit, setSelectedTenderForEdit] = useState<TenderModel | undefined>(tender);
    const [selectedSuppliers, setSelectedSuppliers] = useState<SupplierModel[]>([]);
    const [allSuppliersFromAPI, setAllSuppliersFromAPI] = useState<SupplierModel[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [addMode, setAddMode] = useState(!tender);
    const [apiResponseTenders, setApiResponseTenders] = useState<
        AxiosResponse<any> | AxiosError<any>
    >();

    const isAxiosError = (
        response: AxiosResponse<any, any> | AxiosError<any, any>,
    ): response is AxiosError<any, any> => {
        return (response as AxiosError<any, any>).isAxiosError !== undefined;
    };

    useEffect(() => {
        if (open) {
            if (tender) {
                setSelectedTenderForEdit(tender);
                setAddMode(false);

                // Set selected suppliers based on tendersuppliersassigneds
                const suppliersFromTender = tender.tendersuppliersassigneds.map(tsa => tsa.sidNavigation);
                setSelectedSuppliers(suppliersFromTender);
            } else {
                setAddMode(true);
            }

            if (allSuppliersFromAPI && allSuppliersFromAPI.length <= 0) {
                setLoadingSuppliers(true);
                getAllSuppliers()
                    .then((response) => {
                        if (response.status === 200) {
                            setAllSuppliersFromAPI(response.data);
                        } else {
                            setAllSuppliersFromAPI([]);
                        }
                    })
                    .catch((error) => {
                        setAllSuppliersFromAPI([]);
                        console.error("Error fetching suppliers data:", error);
                    })
                    .finally(() => {
                        setLoadingSuppliers(false);
                    });
            }
        }
    }, [open, tender]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setApiResponseTenders(undefined);
        // Implement submit logic for adding or editing tender
        let newtender = selectedTenderForEdit;

        //if (selectedTenderForEdit.expdate) {
        //    const dt: any = format(parseISO(selectedTenderForEdit.expdate.toISOString()), 'yyyy-MM-dd');
        //    newtender.expdate = dt;
        //}
        if (!newtender) {
            showAlert("Tender not found! Nothing changed!", "error");
            return;
        }

        // Create the tendersuppliersassigneds array from selectedSuppliers
        const tendersuppliersassigneds: TenderSupplierAssignedModel[] = selectedSuppliers.map((supplier) => ({
            id: 0,
            tid: newtender?.id ?? 0,
            sid: supplier.id,
            sidNavigation: supplier,
        }));

        // Attach tendersuppliersassigneds to the newTender object
        const finalNewTender = {
            ...newtender,
            tendersuppliersassigneds,
        };

        if (addMode) {
            addNewTender(finalNewTender).then(
                (response) => {
                    setApiResponseTenders(response);
                    if (response.status === 200) {
                        showAlert("Tender Successfully Added!", "success");
                        addNewTenderInState && addNewTenderInState(response.data);

                        let newTenderAdded = finalNewTender;
                        handleClose();

                    } else {
                        setApiResponseTenders(response);
                    }
                },
                (error) => {
                    setApiResponseTenders(error);
                },
            );
        } else {
            updateSingleTender(finalNewTender)
                .then((response) => {
                    setApiResponseTenders(response);

                    if (response.status === 200) {
                        showAlert("Tender Successfully Edited!", "success");
                        updateSingleTenderInState && updateSingleTenderInState(response.data);
                        handleClose();

                    } else {

                        setApiResponseTenders(response);
                    }
                })
                .catch((error) => {
                    setApiResponseTenders(error);

                });
        }

    };

    const handleClose = () => {
        setSelectedTenderForEdit(undefined);
        setSelectedSuppliers([]);
        setApiResponseTenders(undefined);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit} autoComplete="off">
                <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        color="primary"
                        aria-label="add"
                        sx={{ marginRight: 1 }}
                    >
                        <EditNoteTwoTone />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        IMS -  {addMode ? "Add Tender" : "Edit Tender"}
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="tendercode"
                        label="Tender Code"
                        variant="outlined"

                        inputProps={{
                            maxLength: 50,
                            minLength: 1
                        }}
                        fullWidth
                        required
                        value={selectedTenderForEdit?.tendercode || ""}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, tendercode: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createddate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, tendersuppliersassigneds: [] },
                                tendercode: e.target.value,
                            }))
                        }
                    />

                    <TextField
                        margin="normal"
                        id="totalamount"
                        label="Approved Amount"
                        type="number"
                        variant="outlined"
                        required
                        value={selectedTenderForEdit?.totalamount || ""}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, tendercode: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createddate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, tendersuppliersassigneds: [] },
                                totalamount: parseFloat(e.target.value),
                            }))
                        }
                    />
                    <TextField
                        margin="normal"
                        id="presystemamountspent"
                        label="Pre System Spent Amount"
                        type="number"
                        variant="outlined"
                        required
                        value={selectedTenderForEdit?.presystemamountspent || "0"}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, tendercode: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createddate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, tendersuppliersassigneds: [] },
                                presystemamountspent: parseFloat(e.target.value),
                            }))
                        }
                    />

                    <TextField
                        sx={{ minWidth: "20ch" }}
                        id="notes"
                        name="notes"
                        label="Notes"
                        margin="normal"
                        multiline
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={selectedTenderForEdit?.generalNotes || ""}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, tendercode: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createddate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, tendersuppliersassigneds: [] },
                                generalNotes: e.target.value,
                            }))
                        }
                    />

                    <FormControl fullWidth>
                        <Autocomplete
                            multiple
                            id="suppliers-autocomplete"
                            options={allSuppliersFromAPI}
                            loading={loadingSuppliers}
                            getOptionLabel={(option) => option.name}
                            value={selectedSuppliers}
                            onChange={(event: any, newValue: SupplierModel[] | null) => {
                                setSelectedSuppliers(newValue || []);
                            }}
                            renderTags={(value: SupplierModel[], getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        //  key={option.id}  
                                        label={option.name}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Suppliers"
                                    placeholder="Select suppliers"
                                />
                            )}
                        />
                    </FormControl>

                    <Divider sx={{ height: 5, m: 0.5 }} orientation="vertical" />
                    <Typography>Status</Typography>
                    <Switch
                        color="success"
                        checked={addMode ? true : (selectedTenderForEdit?.activestatusflag ?? false)}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, tendercode: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createddate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, tendersuppliersassigneds: [] },
                                activestatusflag: (e.target.checked),
                            }))
                        }
                        inputProps={{ "aria-label": "controlled" }}
                    />
                    {!addMode && (
                        <>
                            <Divider sx={{ height: 5, m: 0.5 }} orientation="vertical" />
                            <Typography>
                                Tender Created:{" "}
                                {customDateFormat(selectedTenderForEdit?.createddate, "Datetime")}{" "}
                            </Typography>
                        </>
                    )}

                    <Divider />
                    {apiResponseTenders && isAxiosError(apiResponseTenders) && (
                        <Alert severity="error">
                            Error! {apiResponseTenders.response?.data}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">{addMode ? "Add" : "Save"}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TenderDialog;
