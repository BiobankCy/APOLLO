import { CategoryModel, IUser, LocationModel, ProductModel, ProjectModel, SupplierModel, TenderModel, TrueFalseModel } from "src/models/mymodels";
import { getAllProducts, getAllLocations, getAllLots, getAllCategories, getAllItemConditionStatuses, getAllTransReasons, getAllSuppliers, getAllTenders, getAllUsers, getAlProjectsWithoutCalculations } from "src/services/user.service";
import { ReportCategoryModel } from "./AllInterfaces";


export const getInitialReports = async (): Promise<ReportCategoryModel[]> => {

  // const optionsData: TrueFalseModel[] = [
  //   { id: 0, name: "Active" },
  //   { id: 1, name: "Not Active" },
  // ];

  const optionsDataYesNo: TrueFalseModel[] = [
    { id: 0, name: "Yes" },
    { id: 1, name: "No" },
  ];

  // Fetch dynamic data asynchronously
  const prodList = await getAllProducts();
  const availableLocs = await getAllLocations();
  const catList = await getAllCategories();
  const supplierList = await getAllSuppliers();
  const tenderList = await getAllTenders();
  const projectList = await getAlProjectsWithoutCalculations();
  const userList = await getAllUsers();
  // const availableLots = await getAllLots();

  // const availableItemCondStatuses = await getAllItemConditionStatuses();
  // const availableReasons = await getAllTransReasons();


  const prodListOptions = prodList.data.map((product: ProductModel) => (product));
  const availableLocsOptions = availableLocs.data.map((location: LocationModel) => (location));
  const catListOptions = catList.data.map((category: CategoryModel) => (category));
  const supListOptions = supplierList.data.map((supplier: SupplierModel) => (supplier));
  const tenderListOptions = tenderList.data.map((tender: TenderModel) => (tender));
  const projectListOptions = projectList.data.map((project: ProjectModel) => (project));
  const userListOptions = userList.data.map((user: IUser) => {
    // If fullname is empty, derive it from firstName and lastName
    const updatedUser: IUser = {
      ...user,
      fullname: user.fullname || `${user.firstName} ${user.lastName}`,
    };

    return updatedUser;
  });


  const initialReports: ReportCategoryModel[] = [
    // {
    //   category: "Transactions",
    //   reports: [
    //     //{
    //     //    name: 'Daily',apiurl:'',
    //     //    filters: [
    //     //        { name: 'Date', apiparamname: 'ProductIDS', type: 'datepicker' },
    //     //        { name: 'Product', apiparamname: 'ProductIDS', type: 'dropdown_product', options: prodList, value: '' },
    //     //        { name: 'Region', apiparamname: 'ProductIDS', type: 'dropdown', options: ['Region 1', 'Region 2', 'Region 3'], value: '' },
    //     //    ],
    //     //},
    //     //{
    //     //    name: 'Monthly', apiurl: '',
    //     //    filters: [
    //     //        { name: 'Month', apiparamname: 'ProductIDS', type: 'dropdown', options: ['January', 'February', 'March'], value: '' },
    //     //        { name: 'Year', apiparamname: 'ProductIDS', type: 'dropdown', options: ['2021', '2022', '2023'], value: '' },
    //     //        { name: 'Category', apiparamname: 'ProductIDS', type: 'dropdown_category', options: catList, value: '' },
    //     //    ],
    //     //},
    //   ],
    // },

    {
      category: "Expenditure",
      reports: [
        {
          shortname: "By Supplier (Totals)",
          category: "Expenditure",
          apiurl: "ExpenditureReport/BySupplier/Totals",
          componnentname: "OrdersBySupplier",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },
        {
          shortname: "By Supplier/Category - Pivot (Totals)",
          category: "Expenditure",
          apiurl: "ExpenditureReport/BySupplierByCategory/Totals",
          componnentname: "OrdersBySupplierByCategory",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },
        {
          shortname: "By Invoice (Totals)",
          category: "Expenditure",
          apiurl: "ExpenditureReport/ByInvoice/Totals",
          componnentname: "ExpenditureByInvoice",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            {
              name: "Project",
              apiparamname: "ProjectIDS",
              type: "dropdown_project",
              options: projectListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },
        {
          category: "Expenditure",
          shortname: "By Category (Totals)",
          apiurl: "ExpenditureReport/ByCategory/Totals",
          componnentname: "OrdersByCategory",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            {
              name: "Project",
              apiparamname: "ProjectIDS",
              type: "dropdown_project",
              options: projectListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },

        {
          category: "Expenditure",
          shortname: "By Tender (Totals)",
          apiurl: "ExpenditureReport/ByTender/Totals",
          componnentname: "OrdersByTender",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            {
              name: "Project",
              apiparamname: "ProjectIDS",
              type: "dropdown_project",
              options: projectListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },



        {
          category: "Expenditure",
          shortname: "By Brand (Totals)",
          apiurl: "ExpenditureReport/ByBrand/Totals",
          componnentname: "OrdersByBrand",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            {
              name: "Project",
              apiparamname: "ProjectIDS",
              type: "dropdown_project",
              options: projectListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },

        {
          category: "Expenditure",
          shortname: "By Requester (Totals)",
          apiurl: "ExpenditureReport/ByRequester/Totals",
          componnentname: "OrdersByRequester",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },
        {
          category: "Expenditure",
          shortname: "By Product (Totals)",
          apiurl: "ExpenditureReport/ByProduct/Totals",
          componnentname: "OrdersByProduct",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },
        {
          category: "Expenditure",
          shortname: "By Year/Month (Totals)",
          apiurl: "ExpenditureReport/ByYearMonth/Totals",
          componnentname: "OrdersByYearMonth",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        },



      ],
    },
    {
      category: "Orders",
      reports: [
        {
          category: "Orders",
          shortname: "By Supplier (Totals)",
          apiurl: "OrdersReport/BySupplier/Totals",
          componnentname: "OrdersBySupplier",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Exclude Canceled Orders",
              apiparamname: "ExcludeCanceledOrders",
              type: "dropdown_truefalse",
              options: optionsDataYesNo,
              value: "0",
            },

          ],
        },
        {
          category: "Orders",
          shortname: "By Category (Totals)",
          apiurl: "OrdersReport/ByCategory/Totals",
          componnentname: "OrdersByCategory",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Exclude Canceled Orders",
              apiparamname: "ExcludeCanceledOrders",
              type: "dropdown_truefalse",
              options: optionsDataYesNo,
              value: "0",
            },

          ],
        },

        {
          category: "Orders",
          shortname: "By Tender (Totals)",
          apiurl: "OrdersReport/ByTender/Totals",
          componnentname: "OrdersByTender",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Exclude Canceled Orders",
              apiparamname: "ExcludeCanceledOrders",
              type: "dropdown_truefalse",
              options: optionsDataYesNo,
              value: "0",
            },

          ],
        },

        {
          category: "Orders",
          shortname: "By Tender/Product (Totals)",
          apiurl: "OrdersReport/ByTenderByProduct/Totals",
          componnentname: "OrdersByTenderByProduct",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Exclude Canceled Orders",
              apiparamname: "ExcludeCanceledOrders",
              type: "dropdown_truefalse",
              options: optionsDataYesNo,
              value: "0",
            },

          ],
        },

        {
          category: "Orders",
          shortname: "By Brand (Totals)",
          apiurl: "OrdersReport/ByBrand/Totals",
          componnentname: "OrdersByBrand",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Exclude Canceled Orders",
              apiparamname: "ExcludeCanceledOrders",
              type: "dropdown_truefalse",
              options: optionsDataYesNo,
              value: "0",
            },

          ],
        },

        {
          category: "Orders",
          shortname: "By Requester (Totals)",
          apiurl: "OrdersReport/ByRequester/Totals",
          componnentname: "OrdersByRequester",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Exclude Canceled Orders",
              apiparamname: "ExcludeCanceledOrders",
              type: "dropdown_truefalse",
              options: optionsDataYesNo,
              value: "0",
            },

          ],
        },
        {
          category: "Orders",
          shortname: "By Product (Totals)",
          apiurl: "OrdersReport/ByProduct/Totals",
          componnentname: "OrdersByProduct",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Exclude Canceled Orders",
              apiparamname: "ExcludeCanceledOrders",
              type: "dropdown_truefalse",
              options: optionsDataYesNo,
              value: "0",
            },

          ],
        },
        {
          category: "Orders",
          shortname: "By Year/Month (Totals)",
          apiurl: "OrdersReport/ByYearMonth/Totals",
          componnentname: "OrdersByYearMonth",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Exclude Canceled Orders",
              apiparamname: "ExcludeCanceledOrders",
              type: "dropdown_truefalse",
              options: optionsDataYesNo,
              value: "0",
            },

          ],
        },



      ],
    },
    {
      category: "Inventory",
      reports: [
        {
          category: "Inventory",
          shortname: "Level By Product/Location/Lot",
          apiurl: "Stockreportv1",
          componnentname: "StockReport",
          filters: [
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Product Status",
            //   apiparamname: "ProductStatusFlag",
            //   type: "dropdown_truefalse",
            //   options: optionsData,
            //   value: "",
            // },
            // {
            //   name: "Category",
            //   apiparamname: "CategoryIDS",
            //   type: "dropdown_category",
            //   options: catListOptions,
            //   value: "",
            // },

            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Inv. Location",
              apiparamname: "LocationIDS",
              type: "dropdown_location",
              options: availableLocsOptions,
              value: "",
            },
          ],
          columnsToInclude: ['code', 'name', 'qty', 'expdate', 'buldingname', 'roomname', 'locname', 'lotnumber', 'conname', 'activestatusFlag', 'defaultSupplierName']
        },
        {
          category: "Inventory",
          shortname: "Level By Product",
          apiurl: "Stockreportv1",
          componnentname: "StockReport",
          filters: [
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },


            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Inv. Location",
              apiparamname: "LocationIDS",
              type: "dropdown_location",
              options: availableLocsOptions,
              value: "",
            },
          ],
          columnsToInclude: ['code', 'name', 'availabletotalstockqty', 'activestatusFlag', 'categoryName', 'defaultSupplierName']
        },
        //{
        //    name: 'Stock Level By Product/Location', apiurl: '',
        //    filters: [
        //        { name: 'Product', apiparamname: 'ProductIDS', type: 'dropdown_product', options: prodList, value: '' },
        //        { name: 'Category', apiparamname: 'CategoryIDS', type: 'dropdown_category', options: catList, value: '' },
        //        { name: 'Location', apiparamname: 'LocationIDS', type: 'dropdown_location', options: availableLocs, value: '' },
        //    ],
        //},
        //{
        //    name: 'Stock Level By Location/Product', apiurl: '',
        //    filters: [
        //        { name: 'Product', apiparamname: 'ProductIDS', type: 'dropdown_product', options: prodList, value: '' },
        //        { name: 'Category', apiparamname: 'CategoryIDS', type: 'dropdown_category', options: catList, value: '' },
        //        { name: 'Location', apiparamname: 'LocationIDS', type: 'dropdown_location', options: availableLocs, value: '' },
        //    ],
        //},
        {
          category: "Inventory",
          shortname: "Expired Products",
          apiurl: "ExpiredStockreportv1",
          componnentname: "ExpiredProducts",
          filters: [],
          columnsToInclude: ['code', 'name', 'qty', 'expdate', 'buldingname', 'roomname', 'locname', 'lotnumber', 'conname', 'activestatusFlag', 'defaultSupplierName']
        },
      ],
    },
    {
      category: "Transactions",
      reports: [
        {
          shortname: "By Product",
          category: "Transactions",
          apiurl: "ExpenditureReport/BySupplier/Totals",
          componnentname: "OrdersBySupplier",
          filters: [
            {
              name: "Period",
              apiparamname: "DatePeriod",
              type: "daterange",
              options: undefined,
              value: null,
              // value: {
              //   startDate: undefined,  
              //   endDate: undefined,  
              // },
            },
            {
              name: "Supplier",
              apiparamname: "SupplierIDS",
              type: "dropdown_supplier",
              options: supListOptions,
              value: [] as number[],
            },
            {
              name: "Product",
              apiparamname: "ProductIDS",
              type: "dropdown_product",
              options: prodListOptions,
              value: [] as number[],
            },
            {
              name: "Category",
              apiparamname: "CategoryIDS",
              type: "dropdown_category",
              options: catListOptions,
              value: [] as number[],
            },
            {
              name: "Tender",
              apiparamname: "TenderIDS",
              type: "dropdown_tender",
              options: tenderListOptions,
              value: [] as number[],
            },
            // {
            //   name: "Sub Category",
            //   apiparamname: "LocationIDS",
            //   type: "dropdown_location",
            //   options: availableLocsOptions,
            //   value: "",
            // },
            {
              name: "Requested By",
              apiparamname: "RequestedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            },
            {
              name: "Ordered By",
              apiparamname: "OrderedByUserIDS",
              type: "dropdown_user",
              options: userListOptions,
              value: [] as number[],
            }

          ],
        }


      ],
    }


  ];
  return initialReports;
};