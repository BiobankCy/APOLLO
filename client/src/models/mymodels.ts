import { DateRangeType } from "src/content/applications/ReportingTool/Reports/Models/AllInterfaces";

export type ProductStatus = "completed" | "pending" | "failed" | "undefined";
export const Pagingdefaultoptions: number[] = [10, 50, 100];
export const Pagingdefaultselectedoption: number = 50;

export interface availableStockAnalysisModel {
  qty: number;
  locid: number;
  locname: string;
  lotid: number;
  lotnumber: string;
  expdate: Date;
  buildid: number;
  buldingname: string;
  roomid: number;
  roomname: string;
  conid: number;
  conname: string;
  loctypeid: number;
  loctypename: string;
  si: string;
  ns: string;
}


export enum SecureSocketOption {
  None = "None",
  SslOnConnect = "SslOnConnect",
  StartTls = "StartTls",
  Auto = "Auto",
}

export function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}
export const validateEmail = (email: string) => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function hasAdminAccess(currentUser: IUser | null | undefined) {
  if (!currentUser?.role || !currentUser?.role.roleName) {
    return false;
  }

  const adminRoles = ["administrator", "super admin"];
  const userRole = currentUser.role.roleName.toLowerCase();
  return adminRoles.includes(userRole);
}

export interface MyCustomAPIReturnType {
  message: string;
  result: boolean;
}

export interface TenderModel {
  inputValue?: string;
  id: number;
  tendercode: string;
  totalamount?: number;
  presystemamountspent?: number;
  thissystemamountspent?: number;
  remainingamount?: number;
  tendersuppliersassigneds: TenderSupplierAssignedModel[];
  createdbyempid: number;
  createddate: Date;
  generalNotes: string;
  activestatusflag: boolean;

}

export interface TenderSupplierAssignedModel {
  id: number;
  tid: number;
  sid: number;
  sidNavigation: SupplierModel;
  tidNavigation?: TenderModel;
}


export interface DepartmentModel {
  inputValue?: string;
  id: number;
  name: string;
}

export interface ProjectMultipleUserAssignmentModel {
  userId: number[];
  projectId: number;
  uidNavigation?: IUser;
}

export interface UserprojectsassignedsModel {
  id: number;
  pid: number;
  uid: number;

  pidNavigation?: ProjectModel | null;
  uidNavigation: IUser;
}

export interface ProjectModel {
  inputValue?: string;
  id: number;
  name: string;
  generalNotes: string; //nullable: true

  presystemamountspent?: number;
  totalamount?: number;
  activestatusflag: boolean;

  createdbyempid: number;
  createdDate: Date;
  userprojectsassigneds: UserprojectsassignedsModel[];

  thissystemamountspent?: number;
  remainingamount?: number;

}


export interface CustomTransactionLineDTO {
  transid: number;
  translineid: number;
  transdate: Date;
  transtype: string;
  transreason: string;
  qty: number;
  lotnumber: string | null;
  expdate: string | null;
  user: string;
  doclineid: number;
  pid: number;
  locid: number;
  lotid: number;
  unitcostprice: number;
  unitcostrecalflag: boolean;
  locname: string;
}

export interface TransactionLogHeaderModel {
  id: number;
  stockTransTypeId: number;
  stockTransReasonId: number;
  userid: number;
  transdate: Date;
  updatedat: Date;
  status: number;
  description: string;
  user?: IUser;
  stockTransReason?: TransReasonModel;
  stockTransType?: TransTypeModel;
  stockTransDetails: TransactionLogDetailsModel[];
}

export interface TransactionLogDetailsModel {
  id: number;
  transid: number;
  pid: number;
  qty: number;
  locid: number;
  lotid: number;
  conditionstatus: number;
  unitcostRecalculationFlag: boolean;
  unitcostprice: number;
  documentLineid: number;
  description: string;
  pidNavigation?: ProductModel;
  conditionstatusNavigation?: ItemConditionStatusModel;
  loc?: LocationModel;
  lot?: LotModel;
}


export interface BarcodeQRforProduct extends ProductModel {
  lotid: number;
  lotnumber: string;
  expdate: Date | null;
}

export interface TrueFalseModel {
  id: number;
  name: string;
}

export interface ProductModel {
  id: string;
  status?: ProductStatus;
  code: string;
  name: string;
  barcode: string;
  createdDate: number;
  defaultLocId: number;
  defaultSupplierId: number;

  categoryId: number;
  categoryName: string;
  subcategoryId: number | null;
  subCategoryName: string | null;
  brandId: number;
  brandName: string;

  expdateFlag: boolean;
  labMadeFlag: boolean;
  multipleLocationsFlag: boolean;
  punits: string;
  minstockqty: number;
  costprice: number;
  vatId: number;
  generalNotes: string;
  activestatusFlag: boolean;
  /*    fordiagnosticsFlag: boolean;*/
  forsequencingFlag: boolean;
  storageConditionId: number;
  availableStockAnalysis: availableStockAnalysisModel[];
  availabletotalstockqty: number;
  vatRate: number;
  defaultSupplierName: string;

  defaultLocName: string;
  storageCondsName: string;
  concentration: string;
  departments: DepartmentModel[];
  tenderId: number | null;
  tenderName?: string;
  manufacturerId: number;
  manufacturerName: string;
}
export interface VatRateModel {
  id: string;
  rate: number;
}
export interface POrderFormLine {
  id: string;
  code: string;
  name: string;
  orderQuantity: number;
  requestlineid: number;
  originalreqlineqty: number;
  vatId: number;
  vatRate: number;
  minstockqty: number;
  punits: string;
  availabletotalstockqty: number;
  defaultSupplierId: number;
  defaultSupplierName: string;
  costprice: number;
  editableCostpriceFlag: boolean;
  linePrimers?: PrimerModel[];
}

export interface Brandmodel {
  id: number;
  name: string;
  descr: string;
  inputValue?: string;
}

export interface SubCategoryModel {
  id: string;
  name: string;
  descr: string;
  catid: number;
}
export interface SupplierContactsModel {
  id: string;
  supplierid: number;
  firstname: string;
  lastname: string;
  email: string;
  workphone: string;
  department: string;
  role: string;
  city: string;
  address: string;
  zipcode: string;
  state: string;
  country: string;
  notes: string;
  cconpurchaseorder: boolean;
  activestatusflag: boolean;
}

export interface CategoryModel {
  id: string;
  name: string;
  descr: string;
  productsubcategories: SubCategoryModel[];
}

export interface NotificationModel {
  id: number;
  title: string;
  message: string;
  date?: Date;
}

export interface PorderHeaderModel {
  id: number;
  ordercreateddate: Date;
  podate: string;
  duedate: string;
  supplierid: number;
  createdbyempid: number;
  sentbyempid?: number | null;
  sentdate?: Date | null;
  statusid: number;
  notes?: string | null;
  tenderid?: number | null;
  porderlines?: POrderLinesModel[];
  supplier?: SupplierModel;
  status?: PorderStatusModel;
}

export interface SupplierInvoiceModel {
  id: number;
  supid: number;
  supinvno: string;
  supinvdate: Date;
  supInvShippingAndHandlingCost: number;
  vatId?: number;
  vat?: VatRateModel;
  invoiceimage?: Uint8Array;
  sup?: SupplierModel;
  attachmentid?: number;
  attachment?: AttachmentFile;
}

export interface SubmitSupplierInvoiceModel {
  supid: number;
  supinvno: string;
  supInvShippingAndHandlingCost: number;
  vatId: number;
  attachmentid?: number | null;
  supinvdate: Date;
  attachmentfile?: File | null;
  orderid: number | 0;
}

export interface AttachmentFile {
  id: number;
  file: Uint8Array;
}

export interface ReceivingHeaderModel {
  id: number;
  receivedatetime: Date;
  porderID: number;
  byuserID: number;
  notes: string;
  invoiceId?: number;
  supplierinvoice?: SupplierInvoiceModel;
  receivinglines?: ReceivingLinesModel[];
}

export interface CustomPurchaserderWithSupplierInvoicesModel {
  orderid: number;
  ordertotalamountexcludingvat: number;
  ordertotalvatamount: number;
  ordertotalamountincludingvat: number;
  invoices?: CustomSupplierInvoiceModel[];
}

export interface CustomSupplierInvoiceModel {
  invoiceid?: number;
  docno: string;
  invdate: Date;
  totalamountoflinestincludingVat: number;
  totalamountoflinesexcludingVat: number;
  shippingandhandlingcostexcludingvat?: number;
  shippingandhandlingcostincludingvat?: number;
  invoiceGrandTotalAmountexclVAT: number;
  invoiceGrandTotalAmountinclVAT: number;
  invoiceGrandTotalVATAmount: number;
  shippingandhandlingcostvatindex?: number;
  shippingandhandlingcostvatrate?: number;
  // invoicedocument?: ArrayBuffer | Blob;
  invoicedocument?: Uint8Array;
  invdocexist: boolean;
}

export interface EditSupplierInvoiceModel {
  invoiceid: number;
  shippingandhandlingcostexcludingvat: number;
  shippingandhandlingcostvatindex: number;
}

export interface ReceivingLinesModel {
  id: number;
  receivingId: number;
  productid: number;
  qty: number;
  lotid: number;
  receivinglocId: number;
  unitpurcostprice: number;
  originalPOUnitCostprice?: number;
  linediscountPerc: number;
  originalpurcostpricebeforedisc: number;
  vatindex: number;
  conditionstatus: number;
  product?: ProductModel;
  vatindexNavigation: VatRateModel;
  pooriginalvatindexNavigation: VatRateModel;
  qtyOrdered?: number;
  polineId?: number;
  requestlineid?: number;
  notesaboutconditionstatus: string;
  qtyRemainingToReceive: number;
}

export interface ReqanalysisytdbydecisionModel {
  decision?: string;
  count?: number;
}

export interface StatisticsDTO {
  total_pendingreqlinescount?: number;
  total_today_pendingreqlinescount?: number;
  total_ytd_reqlinescount?: number;
  lowstockproducts?: ProductModel[];
  reqanalysisytdbydecision?: ReqanalysisytdbydecisionModel[];
  pordersanalysisforpiechart?: PorderAnalysisByCategoryForChart[];
  inventory_stock_value?: number;
  inventory_stock_qty?: number;
  stockList?: stockListModelForAnalysis[];
}

export interface PorderAnalysisByCategoryForChart {
  categoryid: number;
  subcategoryid: number;
  categoryname: string;
  subcategoryname: string;
  subcategorytotalqty_thismonth: number;
  subcategorytotalqty_previousmonth: number;
}

export interface stockListModelForAnalysis {
  pid: number;

  pcode: string;
  pname: string;
  pcategory: string;
  pdefaultSupplier: string;
  pUnitWAVG: number;
  totalValue: number;
  totalQty: number;
}

export interface CustomPurchaseOrderModel {
  id: number;
  ordercreateddate: Date;
  podate: string;
  duedate: string;
  supplierid: number;
  supName?: string;
  statusName?: string;
  createdbyempid: number;
  sentbyempid?: number | null;
  sentdate?: Date | null;
  statusid: number;
  notes?: string | null;
  tenderid?: number | null;
  porderlines?: POrderLinesModel[];
  supplier?: SupplierModel;
  status?: PorderStatusModel;
  tendercode?: string | null;
  porderlinesCount?: number;
  createdbyuserfullname?: string | null;
  sentbyuserfullname?: string | null;
}

export interface ItemConditionStatusModel {
  id: number;
  name: string;
}

export interface PorderStatusModel {
  id: number;
  name: string;
  sorting: number;
}

export interface PrimersCustom {
  id: number;
  si: string;
  ns: string;
  rlid: number;
}
export interface ReceivingLineModelNew {
  id: number;
  code: string;
  name: string;
  qty: number;
  lotid: string;
  locid: number;
  notes: string;
  datescanned: Date;
}
export interface CustomPurchaseOrderLine {
  orderid: number;
  statusid: number;
  orderstatus: string;
  invcounter: number;
  reccounter: number; //total receivings for the order id
  lineid: number;
  productid: number;
  activestatusflag: boolean;
  pcode: string;
  pname: string;
  orderQty: number;
  reqlineid?: number;
  reqId: number;
  reqbyuid: number;
  reqfn: string;
  reqln: string;
  //primersData: string | null;
  primers?: PrimerModel[] | null;
  linelastDecision: Requestdecisionhistory | null;
  orderbyuid: number;
  ordfn: string;
  ordln: string;
  tenderid: number;
  tendercode: string;
  pcatid: number;
  psubcatid: number | null;
  pbrandid: number;
  psubname: string;
  pcatname: string;
  pbrname: string;

  orderunitcp: number;
  ordvatindex: number;
  ordvrate: number;
  closedFlag: boolean;
  reqdate: Date;
  reqqty: number;
  ordercreateddate: Date;
  duedate: Date;
  posentdate?: Date;
  posentbyempid?: number;
  supplierid: number;
  supplierName: string;
  supplierEmail: string;
  supworknumber: string;
  lastReceivedatetime?: Date;
  totalrecQty: number;
  difference: number;
  dynamicstatus?: string;
  ponotes?: string;
  product?: ProductModel;
  pord?: CustomPurchaseOrderModel;
  requestline?: CustomRequestLinesModel;
  receivings?: ReceivingHeaderModel[];
}

export interface CustomPurchaseOrderLineOLD {
  id: number;
  pordid: number;
  productid: number;
  qty: number;
  alreadyreceivedqty: number;
  unitpurcostprice: number;
  vatindex: number;
  vatrate: number;
  requestlineid?: number;
  closedflag: boolean;
  pord?: CustomPurchaseOrderModel;
  product?: ProductModel;
  requestline?: CustomRequestLinesModel;
  receivings?: ReceivingHeaderModel[];
  dynamiclinestatus?: string;
}

export interface POrderLinesModel {
  id: number;
  pordid: number;
  productid: number;
  qty: number;
  alreadyreceivedqty?: number;
  unitpurcostprice: number;
  vatindex: number;
  requestlineid?: number | null;
  product?: ProductModel;
  vatindexNavigation?: VatRateModel;
}

export interface LotModel {
  id: number;
  lotnumber: string;
  expdate: Date | null;
}

export interface DecisionModel {
  id: number;
  name: string;
  sorting: number;
}
export interface TransReasonModel {
  id: number;
  reasonName: string;
}

export interface TransTypeModel {
  id: number;
  typeName: string;
}

export interface StorageConditionModel {
  id: string;
  name: string;
  description: string;
}

export interface LocBuildingModel {
  id: number;
  building: string;
  descr: string;
  locrooms?: LocRoomModel[];
}

export interface LocRoomModel {
  id: number;
  room: string;
  descr: string;
  buildingid: number;
  building?: LocBuildingModel;
  locations?: LocationModel[];
}

export interface LocTypeModel {
  id: number;
  loctype: string;
  activestatus_flag: boolean;
}

export interface UpdateBulkDecisionStatusModel {
  reqlineids: number[];
  newdecisiontext: string;
}

export interface DepartmentsBulkAssignmentToProductsModel {
  productids: number[];
  departmentids: number[];
}

export interface LocationModel {
  id: number;
  locname: string;
  roomid: number;
  loctypeid: number;
  descr: string;
  activestatusFlag: boolean;
  room?: LocRoomModel;
  loctype?: LocTypeModel;
  inputValue?: string;

}


export interface ApiReportFilters {
  [key: string]: number[] | DateRangeType | undefined;

  DatePeriod?: DateRangeType;

}

export interface SupplierModel {
  id: number;
  code: string;
  name: string;
  createdDate: Date;
  email: string;
  excelattachmentinemailorderFlag: boolean;
  worknumber: string;
  address: string;
  country: string;
  website: string;
  activestatusFlag: boolean;
  generalNotes: string;
  tenders?: TenderModel[];
  tendersuppliersassigneds?: TenderSupplierAssignedModel[];
  inputValue?: string;
  contactsofsuppliers: SupplierContactsModel[];
}




export interface ManufacturerModel {
  id: number;
  code: string;
  name: string;
  createdDate: Date;
  email: string;
  worknumber: string;
  address: string;
  country: string;
  website: string;
  activestatusFlag: boolean;
  generalNotes: string;
  inputValue?: string;
}


export interface FormEditProductValues {
  initproduct: ProductModel;
  initcategories: CategoryModel[];
  initsubcategories: SubCategoryModel[];
  initbrands: Brandmodel[];
  initvatates: VatRateModel[];
  initstconds: StorageConditionModel[];
  initsuppliers: SupplierModel[];
  initlocations: LocationModel[];
  initdepartments: DepartmentModel[];
  crudtype: string;
  initmanufacturers: ManufacturerModel[];
}

export interface FormEditSupplierValues {
  initsupplier: SupplierModel;

  crudtype: string;
}


export interface FormEditManufacturerValues {
  initmanufacturer: ManufacturerModel;

  crudtype: string;
}


export interface RequestHeaderModel {
  id: number;
  reqDate: Date;
  reqStatusId: number;
  reqByUsrId: number;
  notes: string;
  requestlines?: RequestLinesModel[];
}

export interface RequestLinesModel {
  id: number;
  reqId: number;
  productid: number;
  qty: number;
  urgentFlag: boolean;
  comment: string;
  decisionId: number;
  decisionByUserId?: number | null;
  decisionLastUpdateDatetime?: number | null;
  primers?: PrimerModel[];
  projectid?: number | null;
}

export interface InternalRequestOrder extends ProductModel {
  orderqty?: number;
  urgent?: boolean;
  sequenceIdentifier?: string;
  nucleotideSequence?: string;
  primersList?: PrimerModel[];
  projectid?: number | null;
}

export interface PrimerModel {
  id: number;
  reqlineid: number;
  sequenceIdentifier: string;
  nucleotideSequence: string;
  reqline?: any;
}

//export function formatTime(date: Date): string {
//    const hours = date.getHours().toString().padStart(2, '0');
//    const minutes = date.getMinutes().toString().padStart(2, '0');
//    return `${hours}:${minutes}`;
//}

export function locationnamertransformation(
  location?: LocationModel | null,
): string {
  if (!location) return "";

  return `${location.room?.building?.building} -  ${location.room?.room} - ${location.locname}`;
}
export function lotnumbertransformation(lot?: LotOptionType | null): string {
  if (!lot) return "";

  const lotNumber = lot.lotnumber || "No Lot";
  if (lot.expdate) {
    return `${lotNumber} (${customDateFormat(lot.expdate, "DateOnly")})`;
  } else {
    return lotNumber;
  }
}

export function customDateFormat(
  date: any,
  typetoreturn: "DateOnly" | "TimeOnly" | "Datetime",
): string {
  if (!date) {
    return "";
  }

  switch (typetoreturn) {
    case "DateOnly":
      return new Date(date).toLocaleDateString("el-GR", {
        timeZone: "Europe/Athens",
        hour12: false,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    case "TimeOnly":
      return new Date(date).toLocaleTimeString("el-GR", {
        timeZone: "Europe/Athens",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    case "Datetime":
      const formattedDate = new Date(date).toLocaleDateString("el-GR", {
        timeZone: "Europe/Athens",
        hour12: false,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const formattedTime = new Date(date).toLocaleTimeString("el-GR", {
        timeZone: "Europe/Athens",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      return `${formattedDate} ${formattedTime}`;
    default:
      throw new Error(
        "Invalid typetoreturn value. Expected 'DateOnly', 'TimeOnly', or 'Datetime'.",
      );
  }
}

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 36,
      height: 36,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}


export interface Requestdecisionhistory {
  id: number;
  reqlineid: number;
  decisionid: number;
  madebyuserid: number;
  decisiondatetime: Date;
  comments: string;
  madebyuser?: IUser;
  decision?: DecisionModel;
}

export interface CustomRequestLinesModel {
  headerreqid: number;
  headerreqdate: Date;
  headerreqbyuserid: number;
  headerreqbyuserfirstn: string | "";
  headerreqbyuserlastn: string | "";
  headerreqstatusid: number;
  headerreqstatusname: string | "";
  headerreqnotes?: string | null;
  linereqid: number;
  linepid: number;
  linepcode: string | "";
  linepbarcode: string | "";
  linepname: string;
  lineqty: number;
  linepunitcost: number;
  linerequrgentflag: boolean;
  linereqcomment?: string | "";
  linelastDecision: Requestdecisionhistory | null;
  linedynamicstatus: string;
  linePrimers: PrimerModel[];
  linedefsupplierid: number;
  linedefsuppliername: string | "";
  lineprojectid: number | null;
  lineprojectname: string | "";
  linepActivestatusFlag: boolean;
  lineorderedqty: number | 0;
  linereceivedqty: number | 0;
  linelastreceivedDate?: Date;
}

export interface POrderProducts extends ProductModel {
  orderqty?: number;
  requestlineid?: number | null;
  originalreqlineqty?: number;
}

export interface TransferInventoryItemModel {
  lineid: string;
  pid: number;
  pcode: string;
  pname: string;
  fromlocid: number;
  fromlocname: string;
  tolocid: number;
  tolocname: string;
  lotnumber: string;
  lotid: number;
  condstatusid: number;
  condstatusname: string;
  qty: number;
  ns: string;
  si: string;
}

export interface AdjustmentItemModel {
  lineid: string;
  pid: number;
  pcode: string;
  pname: string;
  locid: number;
  locname: string;
  lotnumber: string;
  lotid: number;
  condstatusid: number;
  condstatusname: string;
  qty: number;
  ns: string;
  si: string;
}

export type DateOnlyTypeInNET = "2018-12-25";
//export type DateOnlyTypeInNET ={

//    year: number;
//    month: number;
//    day: number;
//    dayOfWeek: number;
//}

export interface LotOptionType {
  inputValue?: string;
  id: number;
  lotnumber: string;
  expdate?: Date | null;
}

export interface PrimersRowsFromExcel {
  [key: string]: string | null;

  sequenceIdentifier: string | null;
  nucleotideSequence: string | null;
}

export interface InventoryRowsFromExcel {
  [key: string]: string | null;
  // rowid: number;
  Category: string | null;
  Sub_category: string | null;

  Product: string | null;
  Brand: string | null;
  Product_Code: string | null;
  Product_Units: string | null;
  Price_exclVAT: string | null;
  locid: string | null;
  VAT_PERC: string | null;
  Expiry_Date: string | null;
  LOT: string | null;
  Stock_Quantity: string | null;
  Supplier: string | null;
  Building: string | null;
  Room: string | null;
  Locname: string | null;
  Storage_Conditions: string | null;
  Minimum_Stock: string | null;
  Lab_Made_Flag: string | null;
  Active_Flag: string | null;
  Diagnostics_Flag: string | null;
  Importresult: string | null;
  Tender: string | null;
}

export interface smtpSettings {
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpFromAddress: string;
  smtpTimeoutMs: number;
  smtpSecureSocketOption: SecureSocketOption;
  sendEmailByApp: boolean;
}
export interface systemRole {
  id: number;
  roleName: string;
}

export interface jobRole {
  id: number;
  roleName: string;
}

export interface IUser {
  id?: any | null;
  roleId: number;
  jobRoleId: number;

  jobRole: jobRole;
  role: systemRole;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  username: string;
  fullname: string;
  firstName: string;
  lastName: string;
  email: string;
  approverUid?: number;
  lockoutFlag: boolean;
  // roles?: Array<string>,

  avatar?: string | "/static/images/avatars/blank-avatar-small.jpg";

  claimCanApproveRequest: boolean;
  claimCanMakeInventoryAdjustment: boolean;
  claimCanMakePo: boolean;
  claimCanMakeRequest: boolean;
  claimCanViewReports: boolean;
  claimCanReceiveItems: boolean;
  claimCanTransferStock: boolean;
  cconpurchaseOrder: boolean;
}

export type JWTDeCode = {
  sub: number;
  name: string;
  FirstName: string;
  LastName: string;

  Systemrole: string;
  Jobrole: string;
  Systemroleid: number;
  Jobroleid: number;
  Approveruid?: number;
  //  roles: Array<string>,
  email: string;
  aud: string;
  iis: string;
  jti: string;
  Date: string;
  iat: number;
  exp: number;

  ClaimCanApproveRequest: boolean;
  ClaimCanMakeInventoryAdjustment: boolean;
  ClaimCanViewReports: boolean;
  ClaimCanMakePo: boolean;
  ClaimCanMakeRequest: boolean;
  ClaimCanReceiveItems: boolean;
  ClaimCanTransferStock: boolean;
  CConpurchaseOrder: boolean;
};

export interface AuthContextType {
  currentUser: IUser | null;
  error: any;
  login: (email: string, password: string) => Promise<{}>;
  register: (email: string, password: string) => void;
  logout: () => void;
  refreshUser: () => void;
  refreshSession?: () => Promise<{}>;
  changePassword?: (
    CurrentPassword: string,
    NewPassword: string,
  ) => Promise<{}>;
  recoverPassword: (email: string) => void;

  saveUser: (userobj: IUser) => void;
  checkUserLoggedIn: () => void;
  getCurrentUser: () => {} | null;
}

export function strToBool(str: string) {
  return str.toLowerCase() === "true";
}

export function strToBool1(str: string): boolean {
  return JSON.parse(str);
}

export function generateQRCodeDataForProduct(product: ProductModel): string {

  // const formattedExpDate = product.expdate ? product.expdate.toISOString() : 'null';

  // Combine the relevant data into a single string
  //  const qrData = `${product.id},${product.code},${product.name},${product.lotid},${product.lotnumber},${formattedExpDate}`;
  const qrData = `${product.id}|||${product.code}|||${product.name}|||null|||null|||null`;

  return qrData;
}