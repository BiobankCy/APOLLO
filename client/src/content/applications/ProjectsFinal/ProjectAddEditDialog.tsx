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
import { IUser, ProjectModel, UserprojectsassignedsModel, customDateFormat } from "src/models/mymodels";
import { addNewProject, getAllUsers, updateSingleProject } from "src/services/user.service";
import { EditNoteTwoTone } from "@mui/icons-material";
import { AxiosError, AxiosResponse } from "axios";
import { useAlert } from "src/contexts/AlertsContext";

interface Props {
    open: boolean;
    onClose: () => void;
    project?: ProjectModel; // Pass the tender object for editing
    updateSingleProjectInState?: (tender: ProjectModel) => void;
    addNewProjectInState?: (tender: ProjectModel) => void;
}

const ProjectDialog: React.FC<Props> = ({ open, onClose, project: project, updateSingleProjectInState: updateSingleTenderInState, addNewProjectInState: addNewProjectInState }) => {
    const { showAlert } = useAlert();
    const [selectedProjectForEdit, setSelectedTenderForEdit] = useState<ProjectModel | undefined>(project);
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [allUsersFromAPI, setAllUsersFromAPI] = useState<IUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [addMode, setAddMode] = useState(!project);
    const [apiResponseTenders, setApiResponseProjects] = useState<
        AxiosResponse<any> | AxiosError<any>
    >();

    const isAxiosError = (
        response: AxiosResponse<any, any> | AxiosError<any, any>,
    ): response is AxiosError<any, any> => {
        return (response as AxiosError<any, any>).isAxiosError !== undefined;
    };

    useEffect(() => {
        if (open) {
            if (project) {
                setSelectedTenderForEdit(project);
                setAddMode(false);

                // Set selected suppliers based on tendersuppliersassigneds
                const usersFromProject = project.userprojectsassigneds.map(tsa => tsa.uidNavigation);

                setSelectedUsers(usersFromProject);
            } else {
                setAddMode(true);
            }

            if (allUsersFromAPI && allUsersFromAPI.length <= 0) {
                setLoadingUsers(true);
                getAllUsers()
                    .then((response) => {
                        if (response.status === 200) {
                            setAllUsersFromAPI(response.data);
                        } else {
                            setAllUsersFromAPI([]);
                        }
                    })
                    .catch((error) => {
                        setAllUsersFromAPI([]);
                        console.error("Error fetching users data:", error);
                    })
                    .finally(() => {
                        setLoadingUsers(false);
                    });
            }
        }
    }, [open, project]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setApiResponseProjects(undefined);

        let newproject = selectedProjectForEdit;

        //if (selectedTenderForEdit.expdate) {
        //    const dt: any = format(parseISO(selectedTenderForEdit.expdate.toISOString()), 'yyyy-MM-dd');
        //    newtender.expdate = dt;
        //}
        if (!newproject) {

            // setApiResponseTenders(error);
            showAlert("Project not found! Nothing changed!", "error");
            return;
        }

        // Create the tendersuppliersassigneds array from selectedSuppliers
        const Userprojectsassigneds: UserprojectsassignedsModel[] = selectedUsers.map((user) => ({
            id: 0,
            pid: newproject?.id ?? 0, // Use the project ID
            uid: user.id, // Use the user ID
            uidNavigation: user,


        }));

        // Attach tendersuppliersassigneds to the newTender object
        const finalNewProject = {
            ...newproject,
            userprojectsassigneds: Userprojectsassigneds,
        };







        if (addMode) {
            addNewProject(finalNewProject).then(
                (response) => {
                    setApiResponseProjects(response);
                    if (response.status === 200) {
                        showAlert("Project Successfully Added!", "success");
                        addNewProjectInState && addNewProjectInState(response.data);


                        let newProjectAdded = finalNewProject;
                        handleClose();

                    } else {
                        setApiResponseProjects(response);
                    }
                },
                (error) => {
                    setApiResponseProjects(error);
                },
            );
        } else {
            updateSingleProject(finalNewProject)
                .then((response) => {
                    setApiResponseProjects(response);

                    if (response.status === 200) {
                        showAlert("Project Successfully Edited!", "success");
                        updateSingleTenderInState && updateSingleTenderInState(response.data);
                        handleClose();

                    } else {
                        //console.log(response, "sss2");
                        setApiResponseProjects(response);
                    }
                })
                .catch((error) => {
                    setApiResponseProjects(error);
                    //  console.log(error, "sss1");
                });
        }

    };

    const handleClose = () => {
        setSelectedTenderForEdit(undefined);
        setSelectedUsers([]);
        setApiResponseProjects(undefined);
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
                        IMS -  {addMode ? "Add Project" : "Edit Project"}
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Project Name"
                        variant="outlined"

                        inputProps={{
                            maxLength: 50,
                            minLength: 1
                        }}
                        fullWidth
                        required
                        value={selectedProjectForEdit?.name || ""}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, name: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createdDate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, userprojectsassigneds: [] },
                                name: e.target.value,
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
                        value={selectedProjectForEdit?.totalamount || ""}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, name: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createdDate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, userprojectsassigneds: [] },
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
                        value={selectedProjectForEdit?.presystemamountspent || "0"}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, name: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createdDate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, userprojectsassigneds: [] },
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
                        value={selectedProjectForEdit?.generalNotes || ""}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, name: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createdDate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, userprojectsassigneds: [] },
                                generalNotes: e.target.value,
                            }))
                        }
                    />

                    <FormControl fullWidth>
                        <Autocomplete
                            multiple
                            id="users-autocomplete"
                            options={allUsersFromAPI}
                            loading={loadingUsers}
                            getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
                            value={selectedUsers}
                            onChange={(event: any, newValue: IUser[] | null) => {
                                setSelectedUsers(newValue || []);
                            }}
                            renderTags={(value: IUser[], getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        //  key={option.id} // Use unique identifier as key
                                        label={option.firstName + ' ' + option.lastName}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Users"
                                    placeholder="Select users"
                                />
                            )}
                        />
                    </FormControl>

                    <Divider sx={{ height: 5, m: 0.5 }} orientation="vertical" />
                    <Typography>Status</Typography>
                    <Switch
                        color="success"
                        checked={addMode ? true : (selectedProjectForEdit?.activestatusflag ?? false)}
                        onChange={(e) =>
                            setSelectedTenderForEdit((prevState) => ({
                                ...prevState || { id: 0, name: "", activestatusflag: true, generalNotes: "", createdbyempid: 0, createdDate: new Date(), totalamount: 0, presystemamountspent: 0, thissystemamountspent: 0, remainingamount: 0, userprojectsassigneds: [] },
                                activestatusflag: (e.target.checked),
                            }))
                        }
                        inputProps={{ "aria-label": "controlled" }}
                    />
                    {!addMode && (
                        <>
                            <Divider sx={{ height: 5, m: 0.5 }} orientation="vertical" />
                            <Typography>
                                Project Created:{" "}
                                {customDateFormat(selectedProjectForEdit?.createdDate, "Datetime")}{" "}
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

export default ProjectDialog;
