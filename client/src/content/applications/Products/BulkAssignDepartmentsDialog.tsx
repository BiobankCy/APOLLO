import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, CircularProgress, SelectChangeEvent } from '@mui/material';
import { DepartmentModel, DepartmentsBulkAssignmentToProductsModel, ProductModel } from 'src/models/mymodels';
import {  departmentsBulkAssignmentToProducts } from 'src/services/user.service';
import { useAlert } from 'src/contexts/AlertsContext';
import axios from 'axios';

interface BulkAssignDepartmentsDialogProps {
    products: ProductModel[];
    initialdepartments: DepartmentModel[];
    onClose: () => void;
    onOrderSent: () => void;
    handleUpdateProducts: (updatedProducts: ProductModel[]) => void;  
}

const BulkAssignDepartmentsDialog: React.FC<BulkAssignDepartmentsDialogProps> = ({ products, initialdepartments, handleUpdateProducts,onClose, onOrderSent }) => {
    const [departmentsList, setDepartmentsList] = useState<DepartmentModel[]>(initialdepartments);
    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    
    const handleChangeOfDepartment = (event: SelectChangeEvent<number[]>) => {
        const selectedValues = event.target.value as number[];
        setSelectedDepartmentIds(selectedValues);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data: DepartmentsBulkAssignmentToProductsModel = {
            productids: products.map(p => Number(p.id)),
            departmentids: selectedDepartmentIds,
        };

        try {
            const res = await departmentsBulkAssignmentToProducts(data);
            if (res.status === 200) {

                showAlert("Assigning Done", "success");
                handleUpdateProducts(res.data);
                onOrderSent();
                onClose();
            } else {
                showAlert("Error assigning departments to products: " + res.statusText, "error");
            }
        } catch (error) {
            let errorMessage = 'Error submitting departments.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data || error.message || error.toString();
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showAlert("Error: " + errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog maxWidth="lg" open onClose={onClose}>
            <DialogTitle>Assign Departments to {products.length} Selected Products</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <FormControl sx={{ width: '35ch', minWidth: '15ch', m: 1 }} variant="outlined">
                        <InputLabel id="demo-multiple-checkbox-label">Department</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedDepartmentIds}
                            onChange={handleChangeOfDepartment}
                            input={<OutlinedInput label="Department" />}
                            renderValue={(selected) =>
                                (selected as number[])
                                    .map((depid) => {
                                        const department = departmentsList.find((option) => option.id === depid);
                                        return department ? department.name : '';
                                    })
                                    .join(', ')
                            }
                        >
                            {departmentsList.map((department) => (
                                <MenuItem key={department.id} value={department.id}>
                                    <Checkbox checked={selectedDepartmentIds.includes(department.id)} />
                                    <ListItemText primary={department.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BulkAssignDepartmentsDialog;
