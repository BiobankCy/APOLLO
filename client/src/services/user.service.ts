import axios from "axios";

/*import CryptoJS from 'crypto-js';*/

import {
  ProductModel,
  RequestHeaderModel,
  PorderHeaderModel,
  TenderModel,
  SupplierModel,
  CategoryModel,
  SubCategoryModel,
  LotModel,
  LocationModel,
  LocTypeModel,
  LocRoomModel,
  LocBuildingModel,
  ReceivingHeaderModel,
  StorageConditionModel,
  Brandmodel,
  InventoryRowsFromExcel,
  TransferInventoryItemModel,
  AdjustmentItemModel,
  ApiReportFilters,
  IUser,
  smtpSettings,
  EditSupplierInvoiceModel,
  SupplierContactsModel,
  UpdateBulkDecisionStatusModel,
  jobRole,
  ProjectModel,
  ProjectMultipleUserAssignmentModel,
  ManufacturerModel,
  DepartmentsBulkAssignmentToProductsModel,
} from "../models/mymodels";
import authHeader from "./auth-header";

import { BASE_URL } from "src/api/ApiSettings";

const API_URL = BASE_URL;

// export const getPublicContent = () => {
//   return axios.get(API_URL + "all");
// };



export const getAllProducts = () => {
  return axios.get(API_URL + "Products", { headers: authHeader() });
};

export const getAllNotifications = () => {
  return axios.get(API_URL + "Notifications", { headers: authHeader() });
};

export const getAssignedToMeOnlyActiveProjects = () => {
  return axios.get(API_URL + "Projects/AssignedToMeOnlyActiveProjects", { headers: authHeader() });
};


export const addNewProject = (newtender: ProjectModel) => {
  return axios.put(API_URL + "Projects/Add", newtender, {
    params: {},
    headers: authHeader(),
  });
};

export const addMultipleUsersToProject = (table: ProjectMultipleUserAssignmentModel) => {
  return axios.put(API_URL + "Projects/AddMultipleUsersToProject", table, {
    params: {},
    headers: authHeader(),
  });
};

export const updateSingleProject = (newtender: ProjectModel) => {
  return axios.put(API_URL + "Projects/Edit", newtender, {
    params: {},
    headers: authHeader(),
  });
};


export const getReport = (data: string) => {
  return axios.post(API_URL + "Reporting", data, {
    params: {},
    headers: authHeader(),
    responseType: "stream",
  });
};
export const getReportAnddownloadPDF = (data: string, fileName: string) => {
  axios({
    method: "post",
    url: API_URL + "Reporting",
    data: data,
    headers: authHeader(),
    responseType: "blob",
  }).then(function (response) {
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(response.data);
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
};

export const getALLInventoryTrans = () => {
  return axios.get(API_URL + "Transactions", { headers: authHeader() });
};

export const getALLInventoryTransByProductID = (pid: number) => {
  return axios.get(API_URL + "Transactions/" + pid.toString(), {
    headers: authHeader(),
  });
};

export const getSomeProductsByIds = (idss: number[]) => {
  return axios.get(
    API_URL +
    `Products/FilterByManyIds?${idss.map((n, index) => `ids=${n}`).join("&")}`,
    { params: {}, headers: authHeader() },
  );
};

export const getSomeProductsByTenderId = (tenderid: number) => {
  return axios.get(
    API_URL + "Products/FilterByTenderId/" + tenderid.toString(),
    { headers: authHeader() },
  );
};

export const getProjectUsers = (pid: number) => {
  return axios.get(
    API_URL + "Projects/" + pid.toString() + "/Users/",
    { headers: authHeader() },
  );
};

export const getSomeProductsByText = (text: string) => {
  return axios.get(
    API_URL + "Products/SearchByText/" + encodeURIComponent(text),
    { headers: authHeader() },
  );
};

export const getSingleProduct = (id: number) => {
  return axios.get(API_URL + "Products/" + id.toString(), {
    params: {
      /*id: id*/
    },
    headers: authHeader(),
  });
};

export const getSingleProject = (id: number) => {
  return axios.get(API_URL + "Projects/FilterByReqLineId/" + id.toString(), {
    params: {
      /*id: id*/
    },
    headers: authHeader(),
  });
};

export const updateSingleProduct = (id: number, product: ProductModel) => {
  return axios.put(API_URL + "Products/Edit/" + id.toString(), product, {
    params: {},
    headers: authHeader(),
  });
};

export const addNewProduct = (product: ProductModel) => {
  return axios.put(API_URL + "Products/Add", product, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllSuppliers = () => {
  return axios.get(API_URL + "Suppliers", { headers: authHeader() });
};

export const getAllManufacturers = () => {
  return axios.get(API_URL + "Manufacturers", { headers: authHeader() });
};
export const getSingleSupplier = (id: number) => {
  return axios.get(API_URL + "Suppliers/" + id.toString(), {
    params: {
      /*id: id*/
    },
    headers: authHeader(),
  });
};

export const getSinglePorder = (id: number) => {
  return axios.get(API_URL + "Porders/" + id.toString(), {
    params: {
      /*id: id*/
    },
    headers: authHeader(),
  });
};

export const getStatistics = () => {
  return axios.get(API_URL + "Statistics/", {
    params: {
      /*id: id*/
    },
    headers: authHeader(),
  });
};



export const updateSingleSupplier = (newSupplier: SupplierModel) => {
  return axios.put(API_URL + "Suppliers/Edit", newSupplier, {
    params: {},
    headers: authHeader(),
  });
};

export const addNewSupplier = (supplier: SupplierModel) => {
  return axios.put(API_URL + "Suppliers/Add", supplier, {
    params: {},
    headers: authHeader(),
  });
};

export const updateSingleManufacturer = (newSupplier: ManufacturerModel) => {
  return axios.put(API_URL + "Manufacturers/Edit", newSupplier, {
    params: {},
    headers: authHeader(),
  });
};
export const addNewManufacturer = (supplier: ManufacturerModel) => {
  return axios.put(API_URL + "Manufacturers/Add", supplier, {
    params: {},
    headers: authHeader(),
  });
};


export const sendOrderByEmail = (orderid: number) => {
  return axios.get(
    API_URL + "Porders/sendordertosupplier/" + orderid.toString(),
    { headers: authHeader() },
  );
};

export const markOrderAsSent = (orderid: number) => {
  return axios.get(API_URL + "Porders/markassent/" + orderid.toString(), {
    headers: authHeader(),
  });
};



export const getPorderLinesById = (id: number) => {
  return axios.get(API_URL + "Porders/readlines/" + id.toString(), {
    headers: authHeader(),
  });
};
export const getAllDataForOrderLinesform = () => {
  return axios.get(API_URL + "Porders/readalllinesforform", {
    headers: authHeader(),
  });
};

export const getAllDataForOrderLinesformNEW = () => {
  return axios.get(API_URL + "Porders/readalllinesforformnew", {
    headers: authHeader(),
  });
};
export const getAllPorders = () => {
  return axios.get(API_URL + "Porders", { headers: authHeader() });
};
export const getAllPOstatuses = () => {
  return axios.get(API_URL + "Porders/readallstatuses", {
    headers: authHeader(),
  });
};
export const getAllItemConditionStatuses = () => {
  return axios.get(API_URL + "Receiving/readallitemconditionstatuses", {
    headers: authHeader(),
  });
};

export const getPORelatedinvoices = (orderid: number) => {
  return axios.get(API_URL + "Invoices/Relatedinvoices/" + orderid.toString(), {
    params: {},
    headers: authHeader(),
  });
};



export const getInvoiceImage = (invoiceId: number) => {
  return axios.get(`${API_URL}Invoices/Attachment/Get/${invoiceId}`, {
    params: {},
    headers: authHeader(),
    responseType: "blob",
  });
};



export const uploadInvoiceDocument = (
  invoiceId: number,
  formData: FormData,
) => {
  return axios.post(
    `${API_URL}Invoices/Attachment/Upload/${invoiceId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeader(),
      },
    },
  );
};

export const getAllSupplierInvoices = (supplierid: number) => {
  return axios.get(
    API_URL +
    "Invoices/ForASupplierInvoicesWithoutAmounts/" +
    supplierid.toString(),
    { headers: authHeader() },
  );
};

export const addNewInvoice = (formData: FormData) => {
  return axios.put(API_URL + "Invoices/Add", formData, {
    headers: authHeader(),
  });
};

export const deleteInvoiceDocument = (invoiceId: number) => {
  return axios.delete(API_URL + "Invoices/Attachment/Delete", {
    data: invoiceId,
    headers: authHeader("application/json"),
  });
  
};

 

export const updateSupplierInvoice = (data: EditSupplierInvoiceModel) => {
  return axios.put(API_URL + "Invoices/UpdateInvoice", data, {
    params: {},
    headers: authHeader(),
  });
};

export const updateSinglePorder = (id: number, porder: PorderHeaderModel) => {
  return axios.put(API_URL + "Porders/Edit/" + id.toString(), porder, {
    params: {},
    headers: authHeader(),
  });
};


export const switchPorderLineCancelledStatus = (orderId: number) => {
  return axios.put(API_URL + "Porders/SwitchToCancelledStatus", orderId, {
    params: {},
    headers: authHeader("application/json"),
  });
};

export const aswitchPorderLineClosedStatus = (orderlineid: number) => {
  return axios.put(API_URL + "Porders/SwitchClosedStatus", orderlineid, {
    params: {},
    headers: authHeader("application/json"),
  });
};

export const switchEmailAttachmentFlag = (data: SupplierModel) => {
  return axios.put(API_URL + "Suppliers/SwitchEmailAttachmentFlag", data, {
    params: {},
    headers: authHeader(),
  });
};

export const switchUserStatus = (data: IUser) => {
  return axios.put(API_URL + "Auth/SwitchUserStatus", data, {
    params: {},
    headers: authHeader(),
  });
};

export const updatePorderStatusAsCancelled = (id: number) => {
  return axios.put(
    API_URL + "Porders/MarkAsCancelled",
    { id },
    { params: {}, headers: authHeader() },
  );
};

export const deleteSinglePorder = (id: number, porder: PorderHeaderModel) => {

  return axios.delete(API_URL + "Porders/Delete/" + id.toString(), {
    data: porder,
    headers: authHeader(),
  });
};

export const addNewReceiving = (newreceiving: ReceivingHeaderModel) => {
  return axios.put(API_URL + "Receiving/Add", newreceiving, {
    params: {},
    headers: authHeader(),
  });
};

export const addNewPO = (porder: PorderHeaderModel) => {
  return axios.put(API_URL + "Porders/Add", porder, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllCategories = () => {
  return axios.get(API_URL + "Categories", { headers: authHeader() });
};
export const updateSingleCategory = (id: number, category: CategoryModel) => {
  return axios.put(API_URL + "Categories/Edit/" + id.toString(), category, {
    params: {},
    headers: authHeader(),
  });
};

export const deleteSingleCategory = (id: number, category: CategoryModel) => {

  return axios.delete(API_URL + "Categories/Delete/" + id.toString(), {
    data: category,
    headers: authHeader(),
  });
};

export const addNewCategory = (newcategory: CategoryModel) => {
  return axios.put(API_URL + "Categories/Add", newcategory, {
    params: {},
    headers: authHeader(),
  });
};

export const addNewCategoriesBulk = (newcategory: CategoryModel[]) => {
  return axios.put(API_URL + "Categories/AddBulk", newcategory, {
    params: {},
    headers: authHeader(),
  });
};

export const addNewBuildingsBulk = (newbuildingsarray: LocBuildingModel[]) => {
  return axios.put(API_URL + "Buildings/AddBulk", newbuildingsarray, {
    params: {},
    headers: authHeader(),
  });
};

export const addNewProductsFromExcelBulk = (list: InventoryRowsFromExcel[]) => {
  return axios.put(API_URL + "Products/AddBulkFromExcel", list, {
    params: {},
    headers: authHeader(),
  });
};

export const addInventoryTransactionBulk = (
  list: TransferInventoryItemModel[],
  usernotes: string,
) => {
  return axios.put(API_URL + "Inventory/TransferInventory", list, {
    params: { usernotes },
    headers: authHeader(),
  });
};

export const InventoryAdjustmentTransactionBulk = (
  list: AdjustmentItemModel[],
  usernotes: string,
  reasonId: number,
) => {
  return axios.put(API_URL + "Inventory/InventoryAdjustment", list, {
    params: { usernotes, reasonId },
    headers: authHeader(),
  });
};

export const getReportStock = (
  usernotes: string,
  reasonId: number,
  list?: AdjustmentItemModel[],
) => {
  return axios.put(API_URL + "Reporting/StockReport", list, {
    params: { usernotes, reasonId },
    headers: authHeader(),
  });
};

export const getReportFromAPI = (filters: ApiReportFilters, apiurl: string) => {

  return axios.put(API_URL + "Reporting/" + apiurl.toString(), filters, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllSubcategories = () => {
  return axios.get(API_URL + "Subcategories", { headers: authHeader() });
};
export const updateSingleSubCategory = (
  id: number,
  subcategory: SubCategoryModel,
) => {
  return axios.put(
    API_URL + "Subcategories/Edit/" + id.toString(),
    subcategory,
    { params: {}, headers: authHeader() },
  );
};

export const updateSingleContact = (
  id: number,
  contact: SupplierContactsModel,
) => {
  return axios.put(
    API_URL + "Suppliers/Contacts/Edit/" + id.toString(),
    contact,
    { params: {}, headers: authHeader() },
  );
};

export const addNewContact = (contact: SupplierContactsModel) => {
  return axios.put(API_URL + "Suppliers/Contacts/Add", contact, {
    params: {},
    headers: authHeader(),
  });
};
export const deleteSingleContact = (
  id: number,
  contact: SupplierContactsModel,
) => {

  return axios.delete(API_URL + "Suppliers/Contacts/Delete/" + id.toString(), {
    data: contact,
    headers: authHeader(),
  });
};

export const deleteSingleSubCategory = (
  id: number,
  subcategory: SubCategoryModel,
) => {

  return axios.delete(API_URL + "Subcategories/Delete/" + id.toString(), {
    data: subcategory,
    headers: authHeader(),
  });
};

export const addNewSubCategory = (subcategory: SubCategoryModel) => {
  return axios.put(API_URL + "Subcategories/Add", subcategory, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllLots = () => {
  return axios.get(API_URL + "Lots", { headers: authHeader() });
};

export const getAllUsers = () => {
  return axios.get(API_URL + "Auth/GetUsers", { headers: authHeader() });
};

export const getAllSystemRoles = () => {
  return axios.get(API_URL + "Auth/GetSystemRoles", { headers: authHeader() });
};
export const getAllJobRoles = () => {
  return axios.get(API_URL + "Auth/GetJobRoles", { headers: authHeader() });
};
export const getSMTPSettings = () => {
  return axios.get(API_URL + "AppSettings/GetSMTPSettings", {
    headers: authHeader(),
  });
};

export const updateSingleUser = (user: IUser) => {
  return axios.put(API_URL + "Auth/Edit", user, {
    params: {},
    headers: authHeader(),
  });
};

export const addNewUser = (user: IUser) => {
  return axios.put(API_URL + "Auth/Add", user, {
    params: {},
    headers: authHeader(),
  });
};
export const addNewJobRole = (role: jobRole) => {
  return axios.put(API_URL + "Auth/AddSingleJobRoleAsync", role, {
    params: {},
    headers: authHeader(),
  });
};
export const updateJobRole = (role: jobRole) => {
  return axios.put(API_URL + "Auth/EditJobRole", role, {
    params: {},
    headers: authHeader(),
  });
};

export const resetUserPassword = (useridforreset: number) => {
  return axios.get(
    API_URL + "Auth/resetpassword/" + useridforreset.toString(),
    { headers: authHeader() },
  );
};

export const refreshToken = () => {
  return axios.get(API_URL + "Auth/refresh", { headers: authHeader() });
};

export const changeUserPassword = (
  currentpassword: string,
  newpassword: string,
) => {
  return axios.post(
    API_URL + "Auth/changepassword",
    { currentpassword, newpassword },
    { headers: authHeader() },
  );
};

export const saveSMTPsettings = (data: smtpSettings) => {
  return axios.post(API_URL + "AppSettings/SaveSMTPSettings", data, {
    headers: authHeader(),
  });
};

export const sendTestEmail = () => {
  return axios.get(API_URL + "AppSettings/SendTestEmail", {
    headers: authHeader(),
  });
};


export const changeSMTPpassword = async (
  newPasswordPlainText: string,
): Promise<boolean> => {
  try {
    // console.log(newPasswordPlainText,'newPassword');
    // Encrypt the new SMTP password  
    //  encrypt(newPassword, 'YourSecretKey12322')

    const encryptedPassword = newPasswordPlainText;
    await axios.post(
      API_URL + "AppSettings/ChangeSMTPpassword",
      { encryptedPassword },
      { headers: authHeader() },
    );

    return true;
  } catch (error) {
    console.error("Error changing password:", error);
    return false;
  }
};

export const updateSingleLot = (id: number, category: LotModel) => {
  return axios.put(API_URL + "Lots/Edit/" + id.toString(), category, {
    params: {},
    headers: authHeader(),
  });
};

export const deleteSingleLot = (id: number, lot: LotModel) => {
  return axios.delete(API_URL + "Lots/Delete/" + id.toString(), {
    data: lot,
    headers: authHeader(),
  });
};

export const addNewLot = (lot: LotModel) => {
  return axios.put(API_URL + "Lots/Add", lot, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllLocTypes = () => {
  return axios.get(API_URL + "Loctypes", { headers: authHeader() });
};

export const updateSingleLocType = (id: number, loctype: LocTypeModel) => {
  return axios.put(API_URL + "Loctypes/Edit/" + id.toString(), loctype, {
    params: {},
    headers: authHeader(),
  });
};

export const deleteSingleLocType = (id: number, loctype: LocTypeModel) => {
  return axios.delete(API_URL + "Loctypes/Delete/" + id.toString(), {
    data: loctype,
    headers: authHeader(),
  });
};

export const addNewLocType = (loctype: LocTypeModel) => {
  return axios.put(API_URL + "Loctypes/Add", loctype, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllRooms = () => {
  return axios.get(API_URL + "Rooms", { headers: authHeader() });
};

export const updateSingleRoom = (id: number, locroom: LocRoomModel) => {
  return axios.put(API_URL + "Rooms/Edit/" + id.toString(), locroom, {
    params: {},
    headers: authHeader(),
  });
};

export const deleteSingleRoom = (id: number, locroom: LocRoomModel) => {

  return axios.delete(API_URL + "Rooms/Delete/" + id.toString(), {
    data: locroom,
    headers: authHeader(),
  });
};

export const addNewRoom = (locroom: LocRoomModel) => {
  return axios.put(API_URL + "Rooms/Add", locroom, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllBuildings = () => {
  return axios.get(API_URL + "Buildings", { headers: authHeader() });
};

export const updateSingleBuilding = (
  id: number,
  locbuilding: LocBuildingModel,
) => {
  return axios.put(API_URL + "Buildings/Edit/" + id.toString(), locbuilding, {
    params: {},
    headers: authHeader(),
  });
};

export const deleteSingleBuilding = (
  id: number,
  locbuilding: LocBuildingModel,
) => {

  return axios.delete(API_URL + "Buildings/Delete/" + id.toString(), {
    data: locbuilding,
    headers: authHeader(),
  });
};

export const addNewBuilding = (locbuilding: LocBuildingModel) => {
  return axios.put(API_URL + "Buildings/Add", locbuilding, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllLocations = () => {
  return axios.get(API_URL + "Locations", { headers: authHeader() });
};
export const updateSingleLocation = (id: number, location: LocationModel) => {
  return axios.put(API_URL + "Locations/Edit/" + id.toString(), location, {
    params: {},
    headers: authHeader(),
  });
};

export const deleteSingleLocation = (id: number, location: LocationModel) => {

  return axios.delete(API_URL + "Locations/Delete/" + id.toString(), {
    data: location,
    headers: authHeader(),
  });
};

export const addNewLocation = (location: LocationModel) => {
  return axios.put(API_URL + "Locations/Add", location, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllDecisions = () => {
  return axios.get(API_URL + "Decisions", { headers: authHeader() });
};

export const getAllTransReasons = () => {
  return axios.get(API_URL + "TransactionReasons", { headers: authHeader() });
};

export const getAllVatRates = () => {
  return axios.get(API_URL + "VatRates", { headers: authHeader() });
};

export const getAllStorageConditions = () => {
  return axios.get(API_URL + "StorageConditions", { headers: authHeader() });
};

export const addNewStorageConditionsBulk = (list: StorageConditionModel[]) => {
  return axios.put(API_URL + "StorageConditions/AddBulk", list, {
    params: {},
    headers: authHeader(),
  });
};

export const addNewBrandsBulk = (list: Brandmodel[]) => {
  return axios.put(API_URL + "Brands/AddBulk", list, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllBrands = () => {
  return axios.get(API_URL + "Brands", { headers: authHeader() });
};

export const addNewBrand = (newbrand: Brandmodel) => {
  return axios.put(API_URL + "Brands/Add", newbrand, {
    params: {},
    headers: authHeader(),
  });
};

export const getBatchApiData = (id: number) => {
  let endpoints = [
    API_URL + "Products/" + id.toString(),
    API_URL + "Locations",
    API_URL + "Suppliers",
    API_URL + "StorageConditions",
    API_URL + "Categories",
    API_URL + "Subcategories",
    API_URL + "Brands",
    API_URL + "VatRates",
    API_URL + "Departments",
    API_URL + "Manufacturers",
  ];

  if (id <= 0) {
    var index = endpoints.indexOf(API_URL + "Products/" + id.toString());
    if (index !== -1) {
      endpoints.splice(index, 1);
    }
  }

  return Promise.all(
    endpoints.map((endpoint) => axios.get(endpoint, { headers: authHeader() })),
  );

};

export const getBatchApiDataSupplier = (id: number) => {
  let endpoints = [API_URL + "Suppliers/" + id.toString()];
  return Promise.all(
    endpoints.map((endpoint) => axios.get(endpoint, { headers: authHeader() })),
  );


};

export const getBatchApiDataManufacturer = (id: number) => {
  let endpoints = [API_URL + "Manufacturers/" + id.toString()];

  return Promise.all(
    endpoints.map((endpoint) => axios.get(endpoint, { headers: authHeader() })),
  );

};

export const addNewInternalRequest = (intreq: RequestHeaderModel) => {
  return axios.put(API_URL + "Requests/Add", intreq, {
    params: {},
    headers: authHeader(),
  });
};

export const getAllTenders = () => {
  return axios.get(API_URL + "Tenders", { headers: authHeader() });
};

export const getAllDepartments = () => {
  return axios.get(API_URL + "Departments", { headers: authHeader() });
};

export const getAllTendersWithCalculations = () => {
  return axios.get(API_URL + "Tenders/Calcs", { headers: authHeader() });
};

export const getAlProjectsWithCalculations = () => {
  return axios.get(API_URL + "Projects/Calcs", { headers: authHeader() });
};

export const getAlProjectsWithoutCalculations = () => {
  return axios.get(API_URL + "Projects/", { headers: authHeader() });
};

export const getTendersForSupplier = (supid: number) => {
  return axios.get(API_URL + "Tenders/Supplier/" + supid.toString(), {
    params: {
      /*id: id*/
    },
    headers: authHeader(),
  });
};

export const addNewTender = (newtender: TenderModel) => {
  return axios.put(API_URL + "Tenders/Add", newtender, {
    params: {},
    headers: authHeader(),
  });
};

export const updateSingleTender = (newtender: TenderModel) => {
  return axios.put(API_URL + "Tenders/Edit", newtender, {
    params: {},
    headers: authHeader(),
  });
};


export const getAllRequests = () => {
  return axios.get(API_URL + "Requests", { headers: authHeader() });
};

export const getSomeRequestsByIds = (idss: number[]) => {
  return axios.get(
    API_URL +
    `Requests/FilterByManyIds?${idss.map((n, index) => `ids=${n}`).join("&")}`,
    { params: {}, headers: authHeader() },
  );
};

export const getAllDataForOrderLinesformByIds = (porderid?: number) => {
  if (porderid) {
    return axios.get(
      API_URL + "Porders/readalllinesforformnew/" + porderid.toString(),
      { headers: authHeader() },
    );
  } else {
    return axios.get(API_URL + "Porders/readalllinesforformnew", {
      headers: authHeader(),
    });
  }
};


export const getAllRequestLinesCustom = (reqheaderid: number) => {
  return axios.get(API_URL + "Requests/readall/" + reqheaderid.toString(), {
    params: {
      /*id: id*/
    },
    headers: authHeader(),
  });
};

export const updateDecisionOfRequest = (
  reqlineid: number,
  newdecisionid: number,
) => {
  return axios.put(
    API_URL + "Requests/UpdateDecisionStatus",
    { reqlineid, newdecisionid },
    { params: {}, headers: authHeader() },
  );
};

export const updateBulkDecisionOfRequest = (
  data: UpdateBulkDecisionStatusModel,
) => {
  return axios.put(API_URL + "Requests/UpdateBulkDecisionStatus", data, {
    params: {},
    headers: authHeader(),
  });
};

export const departmentsBulkAssignmentToProducts = (
  data: DepartmentsBulkAssignmentToProductsModel,
) => {
  return axios.put(API_URL + "Departments/Bulkassigntoproducts", data, {
    params: {},
    headers: authHeader(),
  });
};
