import { Brandmodel, CategoryModel, IUser, LocationModel, ProductModel, ProjectModel, SubCategoryModel, SupplierModel, TenderModel, TrueFalseModel } from "src/models/mymodels";
import StockReport from "../Pages/StockReport";
import ExpiredProducts from "../Pages/ExpiredProducts";
import OrdersBySupplier from "../Pages/OrdersBySupplier";
import OrdersByCategory from "../Pages/OrdersByCategory";
import OrdersByTender from "../Pages/OrdersByTender";
import OrdersByBrand from "../Pages/OrdersByBrand";
import OrdersByRequester from "../Pages/OrdersByRequester";
import OrdersByProduct from "../Pages/OrdersByProduct";
import OrdersByYearMonth from "../Pages/OrdersByYearMonth";
import OrdersByTenderByProduct from "../Pages/OrdersByTenderByProduct";
import ExpenditureByInvoice from "../Pages/ExpenditureByInvoice";
import OrdersBySupplierByCategory from "../Pages/OrdersBySupplierByCategory";


export interface ReportFilterModel {
  name: string;
  apiparamname: string;
  type:
  | "dropdown"
  | "dropdown_truefalse"
  | "checkbox"
  // | "datepicker"
  | "dropdown_product"
  | "dropdown_project"
  | "dropdown_tender"
  | "daterange"
  | "dropdown_category"
  | "dropdown_user"
  | "dropdown_supplier"
  | "dropdown_location";
  options?: (
    | string
    | TrueFalseModel
    | ProductModel
    | IUser
    | SupplierModel
    // | DateRange
    | CategoryModel
    | SubCategoryModel
    | TenderModel
    | ProjectModel
    | Brandmodel
    | LocationModel
  )[];
  value?:
  | string
  | number[]
  | DateRangeType
  | TrueFalseModel
  | IUser
  | ProductModel
  | CategoryModel
  | SubCategoryModel
  | TenderModel
  | ProjectModel
  | Brandmodel
  | LocationModel
  | null
  | undefined;
}




export interface DateRangeType {
  startDate?: Date;
  endDate?: Date;
}


export const isDateRangeType = (value: any): value is DateRangeType => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return false;
  }

  return (
    typeof value === 'object' &&
    ('startDate' in value && value.startDate instanceof Date) ||
    ('endDate' in value && value.endDate instanceof Date)
  );
};




export interface ReportModel {
  shortname: string;
  category: string;
  componnentname: string;
  apiurl: string;
  filters: ReportFilterModel[];
  columnsToInclude?: string[];
}

export interface ReportCategoryModel {
  category: string;
  reports: ReportModel[];
}

export type FilterChangeType = (name: string, value: any) => void;
export type ReportComponentsType = { [key: string]: React.ComponentType<any>; };

// Map the report names to their corresponding component references
export const reportComponents: ReportComponentsType = {
  StockReport, ExpenditureByInvoice,
  ExpiredProducts, OrdersBySupplier, OrdersByCategory, OrdersByTender, OrdersByBrand, OrdersByRequester, OrdersByProduct, OrdersByYearMonth, OrdersByTenderByProduct, OrdersBySupplierByCategory
};



export interface ReportForOrdersModel {
  suppliername: string | "";
  supplierid: number | 0;
  catid: number | 0;
  catname: string | "";
  brandid: number | 0;
  tenderid: number | 0;
  tendername: string | "";
  brandname: string | "";
  requserid: number | 0;
  requserfullname: string | "";
  pid: number | 0;
  year: number | 0;
  month: number | 0;
  pcode: string | "";
  pname: string | "";
  invno: string | "";
  invdate: Date | null;
  totalqty: number | 0;

  totalInvshippingamountVatIncluded: number;
  totalInvshippingamountVatExcluded: number;
  totalInvshippingVATamount: number;

  totalamountVatExcluded: number;
  totalamountVatIncluded: number;
  totalVatAmount: number;


}


export interface ReportForOrdersModelHead {
  rows: ReportForOrdersModel[];
  totalsline: ReportForOrdersModel;
  filters?: ReportFiltersReturned | null;
}

export interface ReportFiltersReturned {
  ProductIDS?: number[] | null;
  LocationIDS?: number[] | null;
  CategoryIDS?: number[] | null;
  DatePeriod?: DateRangeType | null;
}

