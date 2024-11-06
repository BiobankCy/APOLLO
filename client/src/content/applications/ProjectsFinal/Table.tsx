import React, { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";

import { format } from "date-fns";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HelpIcon from "@mui/icons-material/Help";
import VerifiedUser from "@mui/icons-material/VerifiedUser";

import {
  Tooltip,
  Divider,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  CardHeader,
  Button,
  Grid,
  Collapse,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

import {
  ccyFormat,
  hasAdminAccess,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
  ProductModel,
  ProjectModel,


} from "src/models/mymodels";

import BulkFilters, { Filters } from "./BulkFilters";
import { useAuth } from "src/contexts/UserContext";
import {

  getSomeProductsByTenderId,

} from "../../../services/user.service";

import { AxiosResponse, AxiosError } from "axios";

import TooltipIconButton from "../../../Components/Shared/HelpTooltipButton";
import ProgressBar from "../../../Components/Shared/Progressbar";
import { useAlert } from "src/contexts/AlertsContext";
import ProjectDialog from "./ProjectAddEditDialog";
//import ProgressBar from 'src/Components/Shared/ProgressBar';

interface TendersTableProps {
  className?: string;
  projectsList: ProjectModel[];
  // updateTenderListFn: any;
  updateTenderListFn: (tenders: ProjectModel[]) => void;
  updateSingleTenderInState: (tender: ProjectModel) => void;
  addNewTenderInState: (tender: ProjectModel) => void;
}

const applyFilters = (
  tendersList: ProjectModel[],
  filters: Filters,
): ProjectModel[] => {
  return tendersList.filter((tender) => {
    let matches = true;

    if (filters.itemtextgiven != undefined) {
      const searchText = filters.itemtextgiven.toUpperCase() ?? "";

      const tenderCodeMatch = tender.name.toUpperCase().includes(searchText);
      const createdDateMatch = format(new Date(tender.createdDate ?? 0), "dd/MM/yyyy")
        .toUpperCase()
        .includes(searchText);

      // Check if any supplier name in tendersuppliersassigneds matches the search text
      const supplierNameMatch = tender.userprojectsassigneds.some(
        (tsa) => tsa.uidNavigation?.firstName.toUpperCase().includes(searchText)
      );

      if (!tenderCodeMatch && !createdDateMatch && !supplierNameMatch) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = (
  tendersList: ProjectModel[],
  page: number,
  limit: number,
): ProjectModel[] => {
  return tendersList.slice(page * limit, page * limit + limit);
};

const ProjectsTable: FC<TendersTableProps> = ({
  projectsList: tendersList,
  updateTenderListFn,
  updateSingleTenderInState: updateSingleProjectInState,
  addNewTenderInState: addNewProjectInState,
}) => {
  const userContext = useAuth();
  const { showAlert } = useAlert();
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const selectedBulkActions = selectedProjects.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);
  const [filters, setFilters] = useState<Filters>({ itemtextgiven: null });
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<ProjectModel | undefined>();
  const [selectedTenderId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedTenderProducts, setSelectedProjectUsers] = useState<
    ProductModel[]
  >([]);

  //{ lotnumber: '', id: 0, expdate:  null }
  //  const [apiResponse, setApiResponse] = useState<ApiResponse>({ statuscode: null, message: null  });
  const [apiResponseTenders, setApiResponseTenders] = useState<
    AxiosResponse<any> | AxiosError<any>
  >();

  const refreshTenders = (prevlots: ProjectModel[]): void => {
    // console.log(prevFilters1);
    updateTenderListFn(prevlots);
  };

  const setmyFilters2 = (prevFilters1: Filters): void => {
    // console.log(prevFilters1);
    setFilters(prevFilters1);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);
    if (filteredTenders.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredTenders.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredTenders.length / newlimitset) - 1);
      }
    }
  };

  const filteredTenders = applyFilters(tendersList, filters);
  const paginatedProjects = applyPagination(filteredTenders, page, limit);

  const theme = useTheme();

  const [openRow, setOpenRow] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);



  const handleCloseDialog = () => {
    setOpenDialog(false);
  };



  // const [openEditDialog, setopenEditDialog] = React.useState(false);
  const handleClickOpenEditDialog = (tender: ProjectModel) => {
    setSelectedProjectForEdit(tender);
    setOpenDialog(true);
  };



  //const [openAddTenderialog, setOpenAddCategDialog] = React.useState(false);
  const handleClickOpenAddCategDialog = () => {
    setSelectedProjectForEdit(undefined); //lotnumber: '', id: 0, expdate: null
    setOpenDialog(true);
  };


  return (
    <React.Fragment>
      <Card>
        {/*{selectedBulkActions && (*/}
        {/*    <Box flex={1} p={2}>*/}
        {/*        <BulkActions*/}
        {/*            openInternalReqFormFunc={setshowINTREQDialog} */}
        {/*            openCreatePOFormFunc={setshowPODialog}*/}
        {/*        />*/}
        {/*    </Box>*/}
        {/*)}*/}

        {!selectedBulkActions && (
          <CardHeader
            sx={{ pr: 2.6 }}
            action={
              hasAdminAccess(userContext?.currentUser) && (
                <>
                  <Grid item>
                    <Box component="span">
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        onClick={() => handleClickOpenAddCategDialog()}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add Project
                      </Button>
                    </Box>
                  </Grid>
                </>
              )
            }
            title="Project List"
          />
        )}
        <Box flex={1} p={2}>
          <BulkFilters setmyFilters={setmyFilters2} filters={filters} />
        </Box>
        <Divider />
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow sx={{ verticalAlign: "top" }}>
                {/*<TableCell padding="checkbox">*/}
                {/*    <Checkbox*/}
                {/*        color="primary"*/}
                {/*        checked={selectedAllLots}*/}
                {/*        indeterminate={selectedSomeLots}*/}
                {/*        onChange={handleSelectAllTenders}*/}
                {/*    />*/}
                {/*    </TableCell>*/}
                <TableCell padding="none"></TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>
                  Approved Budget Amount
                  <TooltipIconButton
                    title="Approved Budget Amount"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />


                </TableCell>
                <TableCell>
                  Pre System Spending Amount

                  <TooltipIconButton
                    title="Pre System Spending Amount"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />
                </TableCell>

                <TableCell>
                  This System Spending Amount

                  <TooltipIconButton
                    title="This System Spending Amount"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />
                </TableCell>

                <TableCell>
                  Remaining Amount

                  <TooltipIconButton
                    title="Remaining Amount"
                    size="small"
                    icon={<HelpIcon fontSize="small" />}
                  />
                </TableCell>
                <TableCell>Users</TableCell>
                <TableCell>General Notes</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProjects.map((project) => {
                const isProjectSelected = selectedProjects.includes(project.id);

                const handleTableRowClick = async (projectId: number) => {
                  if (openRow) {
                    setSelectedProjectUsers([]);
                    setOpenRow(!openRow);
                    return;
                  }

                  setOpenRow(!openRow);

                  if (projectId > 0) {
                    setSelectedProjectId(projectId);

                    try {
                      const response =
                        await getSomeProductsByTenderId(projectId);
                      if (response.status === 200) {
                        const products = response.data;

                        setSelectedProjectUsers(products);
                      }
                    } catch (error) {
                      setSelectedProjectUsers([]);
                    }
                  }
                };

                return (
                  <React.Fragment key={project.id}>
                    <TableRow
                      sx={{ "& > *": { borderBottom: "unset" } }}
                      hover
                      key={project.id}
                      selected={isProjectSelected}
                    >
                      {/*<TableCell padding="checkbox">*/}
                      {/*    <Checkbox*/}
                      {/*        color="primary"*/}
                      {/*        checked={isTenderSelected}*/}
                      {/*        onChange={(event: ChangeEvent<HTMLInputElement>) =>*/}
                      {/*            handleSelectOneTender(event, tender.id)*/}
                      {/*        }*/}
                      {/*        value={isTenderSelected}*/}
                      {/*    />*/}
                      {/*</TableCell>*/}

                      <TableCell>
                        {/* <IconButton
                          aria-label="expand row"
                          size="small"
                         
                          onClick={() => handleTableRowClick(project.id)}
                        >
                          {openRow && selectedTenderId === project.id ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton> */}
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color={
                            project.activestatusflag === true
                              ? "text.primary"
                              : "red"
                          }
                          gutterBottom
                          noWrap
                        >
                          {project.name}
                        </Typography>
                        <ProgressBar
                          initialBudget={project.totalamount ?? 0}
                          totalAmountLeft={project.remainingamount ?? 0}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {ccyFormat(project.totalamount ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {ccyFormat(project.presystemamountspent ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {ccyFormat(project.thissystemamountspent ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {ccyFormat(project.remainingamount ?? 0)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >

                          {project.userprojectsassigneds && project.userprojectsassigneds.length > 0 && (
                            <TooltipIconButton
                              title={
                                "Assigned Users: " +
                                project.userprojectsassigneds
                                  ?.map((tsa) => tsa.uidNavigation?.firstName + " " + tsa.uidNavigation?.lastName)
                                  .join(", ")
                              }
                              size="medium"
                              icon={<VerifiedUser fontSize="small" />}  // Pass any icon you want
                            />
                          )}




                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          gutterBottom
                          noWrap
                        >
                          {project.generalNotes}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        {hasAdminAccess(userContext?.currentUser) && (
                          <>
                            <Tooltip title="Edit Project" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() =>
                                  handleClickOpenEditDialog(project)
                                  //handleOpenDialog (tender)
                                }
                              >
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                          //<Button size="small" variant="outlined" onClick={() => handleClickOpen(category)}>
                          //    Edit Category
                          //</Button>
                        )}
                      </TableCell>
                    </TableRow>

                    {selectedTenderId === project.id &&
                      selectedTenderProducts &&
                      openRow &&
                      (selectedTenderProducts.length > 0 ? (
                        // Render the list of products if available

                        <TableRow key={`project-${project.id}`}>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={8}
                          >
                            <Collapse in={openRow} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                >
                                  {selectedTenderProducts.length.toString()}{" "}
                                  Products in Tender
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Product Code</TableCell>
                                      <TableCell>Product Name</TableCell>
                                      <TableCell>Available Quantity</TableCell>
                                      <TableCell align="right">
                                        Unit Price
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {selectedTenderProducts.map((product) => (
                                      <TableRow key={`product-${product.id}`}>
                                        <TableCell component="th" scope="row">
                                          {product.code}
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                          {product.availabletotalstockqty}
                                        </TableCell>
                                        <TableCell align="right">
                                          {ccyFormat(product.costprice)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Render a loading indicator or message if products are still being fetched
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={8}
                          >
                            <p>Loading users...</p>
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredTenders.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={
              !filteredTenders.length || filteredTenders.length <= 0 ? 0 : page
            }
            rowsPerPage={limit}
            rowsPerPageOptions={Pagingdefaultoptions}
          />
        </Box>
      </Card>




      <ProjectDialog
        open={openDialog}
        onClose={handleCloseDialog}
        project={selectedProjectForEdit}
        addNewProjectInState={addNewProjectInState}
        updateSingleProjectInState={updateSingleProjectInState}
      />

    </React.Fragment>
  );
};

ProjectsTable.propTypes = {
  projectsList: PropTypes.array.isRequired,
};

ProjectsTable.defaultProps = {
  projectsList: [],
};

export default ProjectsTable;
