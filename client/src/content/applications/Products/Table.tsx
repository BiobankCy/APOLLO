import numeral from "numeral";
import PropTypes from "prop-types";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import AddTwoToneIcon from "@mui/icons-material/FilterNone";
import MoreRoundedIcon from "@mui/icons-material/MoreHorizTwoTone";
import AddrequestIcon from "@mui/icons-material/PostAddTwoTone";
import EditProductDialog from "./Edit/EditProductDialog";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import {
  DepartmentModel,
  hasAdminAccess,
  Pagingdefaultoptions,
  Pagingdefaultselectedoption,
  POrderFormLine,
  ProductModel,
  TenderModel,
} from "src/models/mymodels";
import BulkActions from "./BulkActions";
import RightDrawer from "./Rightpopupstocklist";

import BulkFilters, {
  ComboOptions,
  Filters,
  getFiltersFromLocalStorage,
  setFiltersToLocalStorage,
} from "./BulkFilters";


import { useAuth } from "src/contexts/UserContext";
import InternalRequestDialog from "../../../Components/Shared/FinalglobalInternalRequestDialog";
import PurchaseOrderDialog from "../../../Components/Shared/Finalglobalpoformdialog";
import GlobalProductInfoDialog from "../../../Components/Shared/ProductInfoDialog";
import { useAlert } from "src/contexts/AlertsContext";
import BulkAssignDepartmentsDialog from "./BulkAssignDepartmentsDialog";

interface ProductsTableProps {
  className?: string;
  prodList: ProductModel[];
  updateProductList: (products: ProductModel[]) => void;
  tenderList: TenderModel[];
  departmentList: DepartmentModel[];
}


const getCategoriesOptions = (prodList: ProductModel[]): ComboOptions[] => {
  let listItems: ComboOptions[] = [];

  prodList.forEach(function (product) {
    listItems.push({ name: product.categoryName, id: product.categoryId });
  });
  // Sort the list by name
  listItems.sort((a, b) => a.name.localeCompare(b.name));
  // Add the "All" option to the beginning of the list
  listItems.unshift({ name: "All", id: 0 });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};
const getSuppliersOptions = (
  prodList: ProductModel[],
  filteritemcatid?: number | null,
  filteritemsubcatid?: number | null,
): ComboOptions[] => {
  const filteredProducts = prodList.filter((product) => {
    if (
      filteritemcatid &&
      filteritemsubcatid &&
      filteritemcatid > 0 &&
      filteritemsubcatid > 0
    ) {
      return (
        product.categoryId === filteritemcatid &&
        product.subcategoryId === filteritemsubcatid
      );
    } else if (filteritemcatid && filteritemcatid > 0) {
      return product.categoryId === filteritemcatid;
    }
    return true;
  });

  const listItems: ComboOptions[] = filteredProducts.map((product) => ({
    name: product.defaultSupplierName,
    id: product.defaultSupplierId,
  }));

  listItems.sort((a, b) => a.name.localeCompare(b.name));
  listItems.unshift({ name: "All", id: 0 });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};
const getManufsOptions = (
  prodList: ProductModel[],
  filteritemcatid?: number | null,
  filteritemsubcatid?: number | null,
): ComboOptions[] => {
  const filteredProducts = prodList.filter((product) => {
    if (
      filteritemcatid &&
      filteritemsubcatid &&
      filteritemcatid > 0 &&
      filteritemsubcatid > 0
    ) {
      return (
        product.categoryId === filteritemcatid &&
        product.subcategoryId === filteritemsubcatid
      );
    } else if (filteritemcatid && filteritemcatid > 0) {
      return product.categoryId === filteritemcatid;
    }
    return true;
  });

  const listItems: ComboOptions[] = filteredProducts.map((product) => ({
    name: product.manufacturerName,
    id: product.manufacturerId,
  }));

  listItems.sort((a, b) => a.name.localeCompare(b.name));
  listItems.unshift({ name: "All", id: 0 });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};
const getBrandsOptions = (
  prodList: ProductModel[],
  filteritemcatid?: number | null,
  filteritemsubcatid?: number | null,
): ComboOptions[] => {
  const filteredProducts = prodList.filter((product) => {
    if (
      filteritemcatid &&
      filteritemsubcatid &&
      filteritemcatid > 0 &&
      filteritemsubcatid > 0
    ) {
      return (
        product.categoryId === filteritemcatid &&
        product.subcategoryId === filteritemsubcatid
      );
    } else if (filteritemcatid && filteritemcatid > 0) {
      return product.categoryId === filteritemcatid;
    }
    return true;
  });

  const listItems: ComboOptions[] = filteredProducts.map((product) => ({
    name: product.brandName,
    id: product.brandId,
  }));

  listItems.sort((a, b) => a.name.localeCompare(b.name));
  listItems.unshift({ name: "All", id: 0 });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};
const getTendersOptions = (
  prodList: ProductModel[],
  tenderList: TenderModel[],
): ComboOptions[] => {
  let listItems: ComboOptions[] = [];

  prodList.forEach(function (product) {
    if (product.tenderId !== null) {
      const tender = tenderList.find(
        (tender) => tender.id === product.tenderId,
      );
      if (tender) {
        listItems.push({ name: tender.tendercode, id: tender.id });
      }
    }
  });

  // Sort the list by name
  listItems.sort((a, b) => a.name.localeCompare(b.name));
  // Add the "All" option to the beginning of the list
  listItems.unshift({ name: "All", id: 0 });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};
const getDepartmentssOptions = (
  prodList: ProductModel[],
  departmentsList: DepartmentModel[],
): ComboOptions[] => {
  const departmentIds = new Set<number>();
  const listItems: ComboOptions[] = [];

  prodList.forEach(function (product) {
    if (product.departments !== null) {
      product.departments.forEach(function (department) {
        departmentIds.add(department.id);
      });
    }
  });

  departmentIds.forEach(function (departmentId) {
    const department = departmentsList.find((dept) => dept.id === departmentId);
    if (department) {
      listItems.push({ name: department.name, id: department.id });
    }
  });

  // Sort the list by name
  listItems.sort((a, b) => a.name.localeCompare(b.name));
  // Add the "All" option to the beginning of the list
  //  listItems.unshift({ name: 'All', id: 0 });

  return listItems;
};
const getSubCategoriesOptions = (
  prodList: ProductModel[],
  itemcatid?: number | null,
): ComboOptions[] => {
  let listItems: ComboOptions[] = [];
  listItems.push({ name: "All", id: 0 });

  prodList.forEach(function (product) {
    if (
      !product.subcategoryId ||
      !product.subCategoryName ||
      product.categoryId !== itemcatid
    ) {
    } else {
      listItems.push({
        name: product.subCategoryName,
        id: product.subcategoryId,
      });
    }
  });

  return [...new Map(listItems.map((item) => [item["id"], item])).values()];
};
const applyFilterforPOForm = (
  prodList: ProductModel[],
  selectedids: string[],
): POrderFormLine[] => {
  return prodList
    .filter((x) => selectedids.includes(x.id))
    .map((product) => {
      const {
        id,
        code,
        name,
        vatId,
        vatRate,
        minstockqty,
        punits,
        availabletotalstockqty,
        defaultSupplierId,
        defaultSupplierName,

        costprice,
      } = product;

      return {
        id,
        code,
        name,
        orderQuantity: 1,
        requestlineid: 0,
        originalreqlineqty: 0,
        vatId,
        vatRate,
        minstockqty,
        punits,
        availabletotalstockqty,
        defaultSupplierId,
        defaultSupplierName,
        costprice,
        editableCostpriceFlag: product.forsequencingFlag,
      };
    });
};
const applyFilterforForm = (
  prodList: ProductModel[],
  selectedids: string[],
): ProductModel[] => {
  return prodList.filter((x) => selectedids.includes(x.id));
};
const applyFilters = (
  prodList: ProductModel[],
  filters: Filters,
): ProductModel[] => {
  return prodList.filter((product) => {
    let matches = true;

    if (
      filters.itemstatus != null &&
      product.activestatusFlag !== filters.itemstatus
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.forsequencing != null &&
      product.forsequencingFlag !== filters.forsequencing
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.itemcatid != null &&
      filters.itemcatid !== 0 &&
      product.categoryId !== filters.itemcatid
    ) {
      matches = false;
      return matches;
    }
    if (
      filters.itemsupid != null &&
      filters.itemsupid !== 0 &&
      product.defaultSupplierId !== filters.itemsupid
    ) {
      matches = false;
      return matches;
    }
    if (
      filters.itemmanufucturerid != null &&
      filters.itemmanufucturerid !== 0 &&
      product.manufacturerId !== filters.itemmanufucturerid
    ) {
      matches = false;
      return matches;
    }
    if (
      filters.itembrandid != null &&
      filters.itembrandid !== 0 &&
      product.brandId !== filters.itembrandid
    ) {
      matches = false;
      return matches;
    }
    if (
      filters.itemtenderid != null &&
      filters.itemtenderid !== 0 &&
      product.tenderId !== filters.itemtenderid
    ) {
      matches = false;
      return matches;
    }
    if (
      filters.itemsubcatid != null &&
      filters.itemsubcatid !== 0 &&
      product.subcategoryId !== filters.itemsubcatid
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.itemstock &&
      filters.itemstock === "oos" &&
      product.availabletotalstockqty > 0
    ) {
      matches = false;
      return matches;
    }
    if (
      filters.itemstock &&
      filters.itemstock === "ins" &&
      product.availabletotalstockqty <= 0
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.itemdepartmentids &&
      filters.itemdepartmentids?.length > 0 &&
      product.departments &&
      !product.departments.some((department) =>
        filters.itemdepartmentids?.includes(department.id),
      )
    ) {
      matches = false;
      return matches;
    }

    if (
      filters.itemstock &&
      filters.itemstock === "minmqtyminus" &&
      product.availabletotalstockqty >= product.minstockqty
    ) {
      matches = false;
      return matches;
    }



    if (filters.itemtextgiven !== undefined) {
      let givenvalue = (filters?.itemtextgiven ?? "").toUpperCase();

      if (
        givenvalue.length > 0 &&
        !(product.name && product.name.toUpperCase().includes(givenvalue)) &&
        !(
          product.barcode && product.barcode.toUpperCase().includes(givenvalue)
        ) &&
        !(
          product.brandName &&
          product.brandName.toUpperCase().includes(givenvalue)
        ) &&
        !(
          product.defaultSupplierName &&
          product.defaultSupplierName.toUpperCase().includes(givenvalue)
        ) &&
        !(product.code && product.code.toUpperCase().includes(givenvalue))
      ) {
        matches = false;
        return matches;
      } else {
        // Handle other conditions
      }
    }

    return matches;
  });
};
const applyPagination = (
  prodList: ProductModel[],
  page: number,
  limit: number,
): ProductModel[] => {
  return prodList.slice(page * limit, page * limit + limit);
};

const ProductsTable: FC<ProductsTableProps> = ({
  prodList, updateProductList,
  tenderList,
  departmentList,
}) => {
  const userContext = useAuth();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const selectedBulkActions = selectedProducts.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(Pagingdefaultselectedoption);

  const [filters, setFiltersState] = useState<Filters>({
    status: null,
    forsequencing: null,
    itemstatus: null,
    itemcatid: null,
    itemstock: null,
    itemtextgiven: null,
    itembrandid: null,
    itemsubcatid: null,
    itemsupid: null,
    itemmanufucturerid: null,
    itemtenderid: null,
    itemdepartmentids: [],
  });

  const handleUpdateSingleProduct = (updatedProduct: ProductModel) => {
    const updatedList = prodList.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    updateProductList(updatedList);
  };


  const handleUpdateProducts = (updatedProducts: ProductModel[]) => {
    const updatedList = prodList.map((product) => {
      const updatedProduct = updatedProducts.find((p) => p.id === product.id);
      return updatedProduct ? updatedProduct : product;
    });
    updateProductList(updatedList);
  };

  const [selectedProductForEdit, setSelectedProductForEdit] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpenDialog = (pid: number) => {
    setSelectedProductForEdit(pid);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProductForEdit(0);
    setDialogOpen(false);
  };

  // Function to handle filter changes
  const handleFilterChange = (newFilters: Filters) => {
    setFiltersState(newFilters);
  };
  useEffect(() => {
    // Load filters from localStorage when the component mounts
    const storedFilters = getFiltersFromLocalStorage();
    if (storedFilters) {
      setFiltersState(storedFilters);
    }
  }, []);

  useEffect(() => {
    // Save filters to localStorage whenever they change
    setFiltersToLocalStorage(filters);
  }, [filters]);
  const handleSelectAllProducts = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedProducts(
      event.target.checked ? prodList.map((product) => product.id) : [],
    );
  };

  const handleSelectOneProduct = (
    event: ChangeEvent<HTMLInputElement>,
    productId: string,
  ): void => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId),
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));

    const newlimitset = parseInt(event.target.value);
    if (filteredProducts.length <= newlimitset) {
      setPage(0);
    } else {
      if (page > Math.ceil(filteredProducts.length / newlimitset) - 1) {
        setPage(Math.ceil(filteredProducts.length / newlimitset) - 1);
      }
    }
  };

  const filteredProducts = applyFilters(prodList, filters);
  const paginatedProducts = applyPagination(filteredProducts, page, limit);
  const selectedSomeProducts =
    selectedProducts.length > 0 && selectedProducts.length < prodList.length;
  const selectedAllProducts = selectedProducts.length === prodList.length;
  const theme = useTheme();
  const alert = useAlert();
  const getTenderCodeById = (id: number): string => {
    const foundTender = tenderList.find((tender) => tender.id === id);
    return foundTender ? foundTender.tendercode : "";
  };

  //handler
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    pid: string,
  ): void => {
    setSelectedProducts([pid]);
    setInternalRequestDialogOpen(true);
  };


  //handler
  const handleClickEditPopup = (
    event: React.MouseEvent<HTMLButtonElement>,
    pid: string,
  ): void => {
    //setSelectedProducts([pid]);
    //setInternalRequestDialogOpen(true);
  };


  const [isPurchaseOrderDialogOpen, setPurchaseOrderDialogOpen] = useState(false);
  const [isInternalRequestDialogOpen, setInternalRequestDialogOpen] = useState(false);
  const [isBulkDepartmentsAssignDialogOpen, setisBulkDepartmentsAssignDialogOpen] = useState(false);

  const prepareSelectedProductsforPO = applyFilterforPOForm(
    prodList,
    selectedProducts,
  );
  const prepareSelectedProducts = applyFilterforForm(
    prodList,
    selectedProducts,
  );

  const handleOpenPurchaseOrderDialog = () => {
    const supplierId =
      prepareSelectedProductsforPO.length > 0
        ? prepareSelectedProductsforPO[0].defaultSupplierId
        : null;
    const isSameSupplier = prepareSelectedProductsforPO.every(
      (product) => product.defaultSupplierId === supplierId,
    );

    if (!isSameSupplier) {
      // Display error message or show a notification to inform the user that products have different suppliers
      alert.showAlert("Selected products have different suppliers! You cant create order!", "error");

      return;
    }

    // Open the Purchase Order dialog
    setPurchaseOrderDialogOpen(true);
  };

  const handleOpenInternalRequestDialog = () => {
    // Open the Request Order dialog
    setInternalRequestDialogOpen(true);
  };

  const handleOpenBulkDepartmentsAssignDialog = () => {
    // Open the Request Order dialog
    setisBulkDepartmentsAssignDialogOpen(true);
  };

  return (
    <Card>
      {isPurchaseOrderDialogOpen && (
        <PurchaseOrderDialog
          orderLines={prepareSelectedProductsforPO}
          onClose={() => setPurchaseOrderDialogOpen(false)}
          onOrderSent={() => setSelectedProducts([])}
        // onOrderSent={function (): void { setSelectedProducts([]) }}
        />
      )}

      {isInternalRequestDialogOpen && (
        <InternalRequestDialog
          products={prepareSelectedProducts}
          onClose={() => setInternalRequestDialogOpen(false)}
          onOrderSent={() => setSelectedProducts([])}
        // onOrderSent={function (): void { setSelectedProducts([]) }}
        />
      )}

      {isBulkDepartmentsAssignDialogOpen && (
        <BulkAssignDepartmentsDialog
          products={prepareSelectedProducts}
          initialdepartments={departmentList}
          onClose={() => setisBulkDepartmentsAssignDialogOpen(false)}
          onOrderSent={() => setSelectedProducts([])}
          handleUpdateProducts={handleUpdateProducts}

        />
      )}

      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions
            openInternalReqFormFunc={handleOpenInternalRequestDialog}
            openCreatePOFormFunc={handleOpenPurchaseOrderDialog}
            bulkassignDepartmentsFunc={handleOpenBulkDepartmentsAssignDialog}
          />
        </Box>
      )}

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
                      onClick={() =>
                        navigate("/management/products/add", { replace: true })
                      }
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                      Add item
                    </Button>
                  </Box>
                </Grid>
              </>
            )
          }
          title="Product List"
        />
      )}

      <Box flex={1} p={2}>
        <BulkFilters
          setmyFilters={handleFilterChange}
          filters={filters}
          brandsArray={getBrandsOptions(
            prodList,
            filters.itemcatid,
            filters.itemsubcatid,
          )}
          categoriesArray={getCategoriesOptions(prodList)}
          suppliersArray={getSuppliersOptions(
            prodList,
            filters.itemcatid,
            filters.itemsubcatid,
          )}
          manufucturersArray={getManufsOptions(
            prodList,
            filters.itemcatid,
            filters.itemsubcatid,
          )}
          tendersArray={getTendersOptions(prodList, tenderList)}
          departmentsArray={getDepartmentssOptions(prodList, departmentList)}
          subcategoriesArray={getSubCategoriesOptions(
            prodList,
            filters.itemcatid,
          )}
        />
      </Box>
      {hasAdminAccess(userContext?.currentUser) && (

        <EditProductDialog open={dialogOpen} handleUpdateSingleProduct={handleUpdateSingleProduct} onClose={handleCloseDialog} productid={selectedProductForEdit} />
      )}
      <Divider />
      <TableContainer sx={{ p: "20px" }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={{ verticalAlign: "top" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllProducts}
                  indeterminate={selectedSomeProducts}
                  onChange={handleSelectAllProducts}
                />
              </TableCell>

              <TableCell>Product Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell>Price</TableCell>
              {/*<TableCell align="center">Status to delete</TableCell>*/}
              {/*  <TableCell align="center">Diagnostics</TableCell>*/}
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Tender</TableCell>
              <TableCell align="center">Brand</TableCell>
              <TableCell align="center">Supplier</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => {
              const isProductSelected = selectedProducts.includes(product.id);

              return (
                <TableRow hover key={product.id} selected={isProductSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isProductSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneProduct(event, product.id)
                      }
                      value={isProductSelected}
                    />
                  </TableCell>
                  <TableCell>
                    {/*<Typography*/}
                    {/*    variant="body1" fontWeight="bold"*/}
                    {/*    color= {product.activestatusFlag === true*/}
                    {/*        ?  "text.primary"*/}
                    {/*        :  "red"*/}
                    {/*    }*/}

                    {/*      noWrap>*/}
                    {/*    {product.code}*/}
                    {/*</Typography>*/}

                    <GlobalProductInfoDialog
                      productId={Number(product.id)}
                      buttontext={product.code}
                      productStatus={product.activestatusFlag}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"

                    /* gutterBottom*/
                    >
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      // gutterBottom
                      noWrap
                    >
                      <RightDrawer
                        stocklist={product.availableStockAnalysis}
                        productid={parseInt(product.id)}
                        availqty={product.availabletotalstockqty}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      //   gutterBottom
                      noWrap
                    >
                      {numeral(product.costprice).format(`"0,0.00`)}
                    </Typography>
                  </TableCell>

                  {/*<TableCell align="center">*/}
                  {/*    <Typography*/}
                  {/*        variant="body1"*/}
                  {/*        fontWeight="bold"*/}
                  {/*        color="text.primary"*/}
                  {/*        gutterBottom*/}
                  {/*        noWrap*/}
                  {/*    >*/}
                  {/*    </Typography>*/}

                  {/*    {product.activestatusFlag === true*/}
                  {/*        ? <ToggleOnIcon color="success" fontSize="small" />*/}
                  {/*        : <ToggleOffIcon color="error" fontSize="small" />*/}
                  {/*    }*/}

                  {/*</TableCell>*/}
                  {/*<TableCell align="center">*/}

                  {/*    {product.fordiagnosticsFlag === true*/}
                  {/*        ? <ToggleOnIcon color="success" fontSize="small" />*/}
                  {/*        : <ToggleOffIcon color="error" fontSize="small" />*/}
                  {/*    }*/}
                  {/*</TableCell>*/}
                  <TableCell align="center">{product.defaultLocName}</TableCell>
                  <TableCell align="center">
                    {getTenderCodeById(product.tenderId ?? 0)}
                  </TableCell>
                  <TableCell align="center">{product.brandName}</TableCell>
                  <TableCell align="center">
                    {product.defaultSupplierName}
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={0}
                      justifyContent="flex-end"
                    >
                      {/* {hasAdminAccess(userContext?.currentUser) && (
                        <Tooltip title="Edit Product" arrow>
                          <IconButton
                            sx={{
                              "&:hover": {
                                background: theme.colors.primary.lighter,
                              },
                              color: theme.palette.primary.main,
                            }}
                            color="inherit"
                            size="small"

                            component={RouterLink}
                            to={`/management/products/edit/${product.id}`}
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )} */}

                      {hasAdminAccess(userContext?.currentUser) && (
                        <>
                          {/* <EditProductDialog open={dialogOpen} onClose={handleCloseDialog} productid={Number(product.id)} /> */}

                          <Tooltip title="Edit Product" arrow>


                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={(event) => handleOpenDialog(Number(product.id))}
                            >
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {userContext?.currentUser &&
                        userContext?.currentUser?.claimCanMakeRequest && (
                          <Tooltip title="Request Item" arrow>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.success.lighter,
                                },
                                color: theme.palette.success.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={(event) =>
                                handleClick(event, product.id)
                              }
                            >
                              <AddrequestIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      {/*<Tooltip title={product.barcode} arrow>*/}
                      {/*    <IconButton*/}
                      {/*        sx={{*/}
                      {/*            '&:hover': {*/}
                      {/*                background: theme.colors.primary.lighter*/}
                      {/*            },*/}
                      {/*            color: theme.palette.primary.main*/}
                      {/*        }}*/}
                      {/*        color="inherit"*/}
                      {/*        size="small"*/}
                      {/*    >*/}
                      {/*        <QrCode2Icon fontSize="small" />*/}
                      {/*    </IconButton>*/}
                      {/*</Tooltip>*/}

                      <Tooltip
                        title={
                          <>
                            {/*<Checkbox*/}
                            {/*    sx={{*/}
                            {/*        '&:hover': {*/}
                            {/*            background: theme.colors.primary.lighter*/}
                            {/*        },*/}
                            {/*        color: theme.palette.primary.main*/}
                            {/*    }}*/}
                            {/*    color="success"*/}
                            { }
                            {/*    value={product.fordiagnosticsFlag}*/}
                            {/*/>*/}
                            For Synthesis:{" "}
                            {product.forsequencingFlag ? "Yes" : "No"}
                            <Divider sx={{ borderTop: 3 }} />
                            Lab. Made: {product.labMadeFlag ? "Yes" : "No"}
                            {/*<Divider sx={{ borderTop: 3 }} />*/}
                            {/*For Diagnostics: {product.fordiagnosticsFlag ? 'Yes' : 'No'}*/}

                            <Divider sx={{ borderTop: 3 }} />
                            Category: {product.categoryName}
                            <Divider sx={{ borderTop: 3 }} />
                            Subcategory:{" "}
                            {product.subCategoryName
                              ? product.subCategoryName
                              : ""}
                            <Divider sx={{ borderTop: 3 }} />
                            Default Tender: {product.tenderName}

                            <Divider sx={{ borderTop: 3 }} />
                            Default Supplier: {product.defaultSupplierName}
                            <Divider sx={{ borderTop: 3 }} />
                            Manufacturer: {product.manufacturerName}
                            <Divider sx={{ borderTop: 3 }} />
                            Barcode: {product.barcode ? product.barcode : ""}
                            <Divider sx={{ borderTop: 3 }} />
                            Concentration: {product.concentration}
                            <Divider sx={{ borderTop: 3 }} />
                            Units: {product.punits}
                            <Divider sx={{ borderTop: 3 }} />
                            Vat Rate: {product.vatRate}%
                          </>
                        }
                        arrow
                        TransitionComponent={Zoom}
                      >
                        <IconButton
                          sx={{
                            "&:hover": {
                              background: theme.colors.primary.lighter,
                            },
                            color: theme.palette.primary.main,
                          }}
                          color="inherit"
                          size="small"
                        >
                          <MoreRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredProducts.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={
            !filteredProducts.length || filteredProducts.length <= 0 ? 0 : page
          }
          rowsPerPage={limit}
          rowsPerPageOptions={Pagingdefaultoptions}
        />
      </Box>
    </Card>
  );
};

ProductsTable.propTypes = {
  prodList: PropTypes.array.isRequired,
};

ProductsTable.defaultProps = {
  prodList: [],
};

export default ProductsTable;
