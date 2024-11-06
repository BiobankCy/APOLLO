using System.Data;
using System.Data.Common;
using System.Security.Claims;
using IMSwebAPI.Models.CustomModels;

namespace IMSwebAPI.Services.MyService
{
    public interface IGlobalService
    {
        public DateTime? ConvertToUtc(DateTime? dateTime);

        int LoggedInUserID(ClaimsPrincipal principal);
        Task<bool> IsUserAuthorizedToViewReports(int userId);
        Task<bool> IsUserAuthorizedToMakeRequests(int userId);
        Task<bool> IsUserAdminOrSuperAdmin(int userId);

        Task<bool> IsUserAuthorizedToTransferStock(int userId);
        Task<bool> IsUserAuthorizedToMakeInventoryAdjustment(int userId);
        Task<bool> IsUserAuthorizedToReceiveItems(int userId);
        Task<bool> IsUserAuthorizedToMakePO(int userId);
        //Products
        public Task<List<CustomProduct>> GetAllProducts(int? pid, List<int>? pids = null, List<int>? catids = null, List<int>? locids = null, bool? expiredonly = false);
        public Task<List<ReportingPorder>> GetReportDataForOrders(List<int>? pids = null, List<int>? catids = null, DateTime? startdate = null, DateTime? enddate = null, List<int>? supplierIDS = null, List<int>? tenderIDS = null, List<int>? orderedByUserIDS = null, List<int>? requestedByUserIDS = null, bool? excludeCancOrders = false);
        public Task<List<ReportingExpenditure>> GetReportDataForExpenditure(List<int>? pids = null, List<int>? catids = null, DateTime? startdate = null, DateTime? enddate = null, List<int>? supplierIDS = null, List<int>? tenderIDS = null, List<int>? orderedByUserIDS = null, List<int>? requestedByUserIDS = null);



        public Task<List<CustomPurchaseOrderLine>> GetAllCustomPurchaseOrderLines(int? pid);

        Product UpdateSingleProduct(Product product);

        Task<Product> AddSingleProductAsync(Product newproduct);

        List<AvailableStockLine> getProductAvailableStockAnalysis(int pid);
        //int getAvailableStockQty(int pid);
        DataTable FillDataTable(string sqlQuery, params DbParameter[] parameters);

        //Invoices
        Task<List<SupplierInvoice>> GetInvoices(int? cid = 0);

        //Categories
        Task<List<Productcategory>> GetCategories(int? cid = 0);
        Task<List<Lot>> GetLots(int? id = 0);
        Task<List<Locroom>> GetLocRooms(int? id = 0);
        Task<List<Locationtype>> GetLocTypes(int? id = 0);
        Task<List<RequestDecision>> GetDecisions(int? id = 0);
        Task<List<StockTransReason>> GetReasons(int? id = 0);
        Task<List<Productbrand>> GetBrands(int? id = 0);
        Task<List<Productsubcategory>> GetSubCategories(int? id = 0);
        //VatRates
        Task<List<Vatrate>> GetVatRates(int? vrid = 0);
        Task<List<StorageCondition>> GetStorageConditions(int? id = 0);
        Task<List<Supplier>> GetSuppliers(int? id = 0);
        Task<List<Manufacturer>> GetManufacturers(int? id = 0);
        Task<List<Location>> GetLocations(int? id = 0);

        Task<List<Locbuilding>> GetLocbuildings(int? id = 0);
        //Stock
     
        Task<List<Request>> GetRequests(int? id = 0);

        Task<Request> AddSingleRequestAsync(Request newrequest);
        Task<List<Porder>> GetAllPorders(int? id = 0);

        Task<Porder> AddSinglePOrderAsync(Porder newporder);

        Task<CustomTender> AddSingleTenderAsync(Tender newtender);
        Task<CustomProject> AddSingleProjectAsync(Project newproject);
        Task<Tender> EditSingleTenderAsync(Tender updatedTender);
        Task<Project> EditSingleProjectAsync(Project updatedProject);
        Task<Jobrole> EditSingleJobRoleAsync(Jobrole updateJobRole);

        Task<Supplier> EditSingleSupplierAsync(Supplier updatedSupplier);

        Task<Manufacturer> EditSingleManufacturerAsync(Manufacturer updatedSupplier);
        Task<List<CustomTender>> GetAllTenders(int? tenderid = 0, int? supid = 0, bool? calcs = false);
        Task<List<Productdepartment>> GetAllDepartments(int? id = 0);
        Task<List<CustomProject>> GetAllProjects(int? projectid = 0, int? userid = 0, string? projectstatusFilter = "", bool? calcs = false);
        Task<CustomPurchaserderWithSupplierInvoices?> GetAllCustomPorderRelatedSupplierInvoices(int orderid);
        Task<CustomSupplierInvoiceModel?> GetSupplierInvoiceNew(int invoiceid);
        Task<CustomPurchaserderWithSupplierInvoices?> GetRelatedInvoicesNEW(int orderid);


        Task<List<MyCustomUser>> GetAllUsers(int? id = 0);
        Task<MyCustomUser> AddSingleUserAsync(User newuser);
        Task<User> EditSingleUserAsync(User updatedUsers);
        Task<List<Role>> GetAllSystemRoles();
        Task<List<Jobrole>> GetAllJobRoles();
        Task<Jobrole> AddSingleJobRoleAsync(Jobrole newjobRole);
        //Task<List<object>> GetCustomRequstLines(int? reqheaderid);
        Task<List<CustomRequestLines>> GetCustomRequstLines(int? reqheaderid);


        Task<CustomRequestLines> UpdateRequestDecision(int reqlineid, int newdecisionid, int userId);


        public Task<List<CustomPurchaseOrder>> GetAllPurchaseOrders(int? pid = 0);
        //   Task<List<CustomPurchaseOrderLine>> GetAllCustomPurchaseOrderLines(int? pid = 0);

        //public async Task<List<Porderline>> GetAllPurchaseOrderLines1(int? pid, IIMSService imsservice)
        //{
        //   var porderLines = await imsservice.GetPorderLines(pid);


        //    return porderLines;
        //}



        Task<List<Receiving>> GetAllReceivings(int? pid = 0);
        Task<List<CustomTransactionLineDTO>> GetAllTransactions(int? pid = 0);

        Task<List<PordersStatus>> GetPorderStatuses(int? pid = 0);
        Task<List<Itemconditionstatus>> GetItemConditionStatuses(int? pid = 0);

        Task<List<CustomPorderline>> GetPorderLines(int? pid = 0);
        public Task<CustomRequestLines> GetCustomRequstLine(int reqlineid);

        Task<CustomRequestLines?> LatestRequestDecision(int reqlineid);
        Task<List<Receivingline>>? GetReceivingLines(int pid);
        Task<Receiving> AddSingleReceivingAsync(Receiving newreceiving, int UserID);

        Task<MyCustomReturnType> SendEmailCustom(string toemail, string subject, string htmltext, bool toIncludeALLadminsalso, bool CCIncludeALLadminsalso, bool CCIncludeALLOrderRecs, string customCC, byte[]? attachmentData, string? attachmentFileName);



    }


}
