using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ReportingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ReportingController> _logger;
        private readonly IGlobalService _superHeroService;
        private readonly MyCustomLogger _mylogger;
        public ReportingController(ILogger<ReportingController> logger, AppDbContext context, IGlobalService superHeroService, MyCustomLogger mylogger)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
            _mylogger = mylogger;
        }

        [HttpPut("Stockreportv1")]
        public async Task<ActionResult<List<CustomProduct>>> Stockreportv1([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.


            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            //        var loggedInUser = await _context.Users
            //.Include(c => c.Role)
            //.Where(xx => xx.Id == userId && !xx.LockoutFlag &&
            //             (xx.ClaimCanViewReports ||
            //             xx.Role.RoleName.ToLower() == "administrator" ||
            //             xx.Role.RoleName.ToLower() == "super admin"))
            //.SingleOrDefaultAsync();

            //        if (loggedInUser is null)
            //        {
            //            return Unauthorized("Unauthorized");
            //        }




            if (filters == null)
            {
                var allproducts = await _superHeroService.GetAllProducts(null, null);
                await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/Stockreportv1", oldEntity: "", newEntity: "", extranotes: allproducts.Count.ToString() + " Products Returned", actionbyip: "");
                return allproducts;
            }
            else
            {

                var allproducts = await _superHeroService.GetAllProducts(null, filters.ProductIDS, filters.CategoryIDS, filters.LocationIDS);
                await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/Stockreportv1", oldEntity: "", newEntity: "", extranotes: allproducts.Count.ToString() + " Products Returned", actionbyip: "");
                return allproducts;
            }

        }





        [HttpPut("ExpenditureReport/ByInvoice/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportByInvoice([FromBody] ReportFilters filters)
        {


            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }


            //var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
            //                    filters.ExcludeCanceledOrders.Count == 1 &&
            //                    filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Supplierid, row.Supname, row.Invno, row.Supinvdate })
     .Select(groupedRow => new ReportForOrdersModel
     {
         supplierid = groupedRow.Key.Supplierid,
         suppliername = groupedRow.Key.Supname,
         invno = groupedRow.Key.Invno,
         invdate = groupedRow.Key.Supinvdate,
         totalInvshippingamountVatExcluded = groupedRow.Max(row => row.ShippingCostAmountVatExcluded ?? 0),
         totalInvshippingamountVatIncluded = groupedRow.Max(row => row.ShippingCostVatIncluded ?? 0),
         totalInvshippingVATamount = groupedRow.Max(row => row.ShippingCostVatIncluded ?? 0) - groupedRow.Max(row => row.ShippingCostAmountVatExcluded ?? 0),
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),

     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
                retValue.totalsline.totalInvshippingamountVatExcluded = retValue.rows.Sum(x => x.totalInvshippingamountVatExcluded);
                retValue.totalsline.totalInvshippingVATamount = retValue.rows.Sum(x => x.totalInvshippingVATamount);
                retValue.totalsline.totalInvshippingamountVatIncluded = retValue.rows.Sum(x => x.totalInvshippingamountVatIncluded);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/ByInvoice", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("ExpenditureReport/BySupplier/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportBySupplier([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }
            //var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
            //                    filters.ExcludeCanceledOrders.Count == 1 &&
            //                    filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Supplierid, row.Supname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         supplierid = groupedRow.Key.Supplierid,
         suppliername = groupedRow.Key.Supname,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/BySupplier", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }
        [HttpPut("ExpenditureReport/BySupplierByCategory/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportBySupplierByCategory([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }
            //var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
            //                    filters.ExcludeCanceledOrders.Count == 1 &&
            //                    filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Supplierid, row.Supname, row.Pcatid, row.Pcatname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         supplierid = groupedRow.Key.Supplierid,
         suppliername = groupedRow.Key.Supname,
         catid = groupedRow.Key.Pcatid,
         catname = groupedRow.Key.Pcatname,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.suppliername)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/BySupplier", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");

            return retValue;


        }

        [HttpPut("ExpenditureReport/ByTender/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportByTender([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Tenderid, row.Tendercode })
     .Select(groupedRow => new ReportForOrdersModel
     {
         tenderid = groupedRow.Key.Tenderid,
         tendername = groupedRow.Key.Tendercode,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/ByTender/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("ExpenditureReport/ByCategory/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportByCategory([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }


            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }


            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Pcatid, row.Pcatname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         catid = groupedRow.Key.Pcatid,
         catname = groupedRow.Key.Pcatname,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/ByCategory/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("ExpenditureReport/ByBrand/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportByBrand([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }


            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }


            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Pbrandid, row.Pbrandmame })
     .Select(groupedRow => new ReportForOrdersModel
     {
         brandid = groupedRow.Key.Pbrandid,
         brandname = groupedRow.Key.Pbrandmame,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/ByBrand/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("ExpenditureReport/ByRequester/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportByRequester([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }


            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }


            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.UserReqId, row.UserReqFullname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         requserid = groupedRow.Key.UserReqId,
         requserfullname = groupedRow.Key.UserReqFullname,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/ByRequester/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }
        [HttpPut("ExpenditureReport/ByProduct/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportByProduct([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
      .GroupBy(row => new { row.Pid, row.Pcode, row.Pname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         pid = groupedRow.Key.Pid,
         pcode = groupedRow.Key.Pcode,
         pname = groupedRow.Key.Pname,
         totalqty = groupedRow.Sum(row => row.Qty ?? 0),
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalqty = retValue.rows.Sum(x => x.totalqty);
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/ByProduct/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }


        [HttpPut("ExpenditureReport/ByYearMonth/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> ExpenditureReportByYearMonth([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingExpenditure>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForExpenditure(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
      .GroupBy(row => new { Month = row.Supinvdate?.Month, Year = row.Supinvdate?.Year })
     .Select(groupedRow => new ReportForOrdersModel
     {
         month = groupedRow.Key.Month,
         year = groupedRow.Key.Year,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "ExpenditureReport/ByYearMonth/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("OrdersReport/BySupplier/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> OrdersReportBySupplier([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }


            var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
                                filters.ExcludeCanceledOrders.Count == 1 &&
                                filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingPorder>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS, excludeCancOrders: exclcancOrdFlag);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Supplierid, row.Supname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         supplierid = groupedRow.Key.Supplierid,
         suppliername = groupedRow.Key.Supname,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("OrdersReport/ByCategory/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> OrdersReportByCategory([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
                                filters.ExcludeCanceledOrders.Count == 1 &&
                                filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingPorder>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS, excludeCancOrders: exclcancOrdFlag);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Pcatid, row.Pcatname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         catid = groupedRow.Key.Pcatid,
         catname = groupedRow.Key.Pcatname,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);

            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "OrdersReport/ByCategory/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }




        [HttpPut("OrdersReport/ByTender/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> OrdersReportByTender([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
                                filters.ExcludeCanceledOrders.Count == 1 &&
                                filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingPorder>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS, excludeCancOrders: exclcancOrdFlag);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Tenderid, row.Tendercode })
     .Select(groupedRow => new ReportForOrdersModel
     {
         tenderid = groupedRow.Key.Tenderid,
         tendername = groupedRow.Key.Tendercode,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "OrdersReport/ByTender/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }


        [HttpPut("OrdersReport/ByTenderByProduct/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> OrdersReportByTenderByProduct([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");

            }
            // var exclcancOrdFlag = false;
            var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
                               filters.ExcludeCanceledOrders.Count == 1 &&
                          filters.ExcludeCanceledOrders[0] == 0;



            //if (filters.ExcludeCanceledOrders is not null && filters.ExcludeCanceledOrders.Count == 1 &&
            //                    filters.ExcludeCanceledOrders[0] == 0)
            //{
            //    exclcancOrdFlag = true;
            //}


            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingPorder>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS, excludeCancOrders: exclcancOrdFlag);

            }

            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Tenderid, row.Tendercode, row.Pid, row.Pcode, row.Pname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         tenderid = groupedRow.Key.Tenderid,
         tendername = groupedRow.Key.Tendercode,
         pid = groupedRow.Key.Pid,
         pcode = groupedRow.Key.Pcode,
         pname = groupedRow.Key.Pname,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.tenderid)
     .ThenBy(row => row.pid)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "OrdersReport/ByTenderByProduct/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("OrdersReport/ByBrand/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> OrdersReportByBrand([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }


            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
                                filters.ExcludeCanceledOrders.Count == 1 &&
                                filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingPorder>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS, excludeCancOrders: exclcancOrdFlag);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Pbrandid, row.Pbrandmame })
     .Select(groupedRow => new ReportForOrdersModel
     {
         brandid = groupedRow.Key.Pbrandid,
         brandname = groupedRow.Key.Pbrandmame,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);

            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "OrdersReport/ByBrand/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("OrdersReport/ByRequester/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> OrdersReportByRequester([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
                                filters.ExcludeCanceledOrders.Count == 1 &&
                                filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingPorder>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS, excludeCancOrders: exclcancOrdFlag);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.UserReqId, row.UserReqFullname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         requserid = groupedRow.Key.UserReqId,
         requserfullname = groupedRow.Key.UserReqFullname,
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();

                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }



            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "OrdersReport/ByRequester/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("OrdersReport/ByProduct/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> OrdersReportByProduct([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
                                filters.ExcludeCanceledOrders.Count == 1 &&
                                filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingPorder>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS, excludeCancOrders: exclcancOrdFlag);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
     .GroupBy(row => new { row.Pid, row.Pcode, row.Pname })
     .Select(groupedRow => new ReportForOrdersModel
     {
         pid = groupedRow.Key.Pid,
         pcode = groupedRow.Key.Pcode,
         pname = groupedRow.Key.Pname,
         totalqty = groupedRow.Sum(row => row.Qty ?? 0),
         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.totalamountVatIncluded)
    .ToList();
                retValue.totalsline.totalqty = retValue.rows.Sum(x => x.totalqty);
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "OrdersReport/ByProduct/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }

        [HttpPut("OrdersReport/ByYearMonth/Totals")]
        public async Task<ActionResult<ReportForOrdersModelHead>> OrdersReportByYearMonth([FromBody] ReportFilters filters)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            if (filters?.DatePeriod != null)
            {
                DateTime? startDateUtc = _superHeroService.ConvertToUtc(filters.DatePeriod.StartDate);
                DateTime? endDateUtc = _superHeroService.ConvertToUtc(filters.DatePeriod.EndDate);
                filters.DatePeriod.EndDate = endDateUtc;
                filters.DatePeriod.StartDate = startDateUtc;

            }

            var exclcancOrdFlag = filters.ExcludeCanceledOrders != null &&
                                filters.ExcludeCanceledOrders.Count == 1 &&
                                filters.ExcludeCanceledOrders[0] == 0;



            var retValue = new ReportForOrdersModelHead();
            retValue.filters = filters;

            var getFilteredOrdersRows = new List<ReportingPorder>();


            if (filters == null)
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders();
                //   await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/OrdersReport/BySupplier", oldEntity: "", newEntity: "", extranotes: allrows.Count.ToString() + " Rows Returned", actionbyip: "");

            }
            else
            {

                getFilteredOrdersRows = await _superHeroService.GetReportDataForOrders(pids: filters.ProductIDS, catids: filters.CategoryIDS, startdate: filters.DatePeriod?.StartDate, enddate: filters.DatePeriod?.EndDate, supplierIDS: filters.SupplierIDS, tenderIDS: filters.TenderIDS, orderedByUserIDS: filters.OrderedByUserIDS, requestedByUserIDS: filters.RequestedByUserIDS, excludeCancOrders: exclcancOrdFlag);

            }




            if (getFilteredOrdersRows.Count > 0)
            {
                retValue.rows = getFilteredOrdersRows
  .GroupBy(row => new { Month = row.Ordercreateddate.Month, Year = row.Ordercreateddate.Year })
     .Select(groupedRow => new ReportForOrdersModel
     {
         month = groupedRow.Key.Month,
         year = groupedRow.Key.Year,

         totalamountVatExcluded = groupedRow.Sum(row => row.LineAmountVatExcluded ?? 0),
         totalamountVatIncluded = groupedRow.Sum(row => row.LineAmountVatIncluded ?? 0),
         totalVatAmount = groupedRow.Sum(row => row.LineVatAmount ?? 0),
     })
     .OrderByDescending(row => row.year)
    .ThenBy(row => row.month)
    .ToList();
                retValue.totalsline.totalamountVatExcluded = retValue.rows.Sum(x => x.totalamountVatExcluded);
                retValue.totalsline.totalamountVatIncluded = retValue.rows.Sum(x => x.totalamountVatIncluded);
                retValue.totalsline.totalVatAmount = retValue.rows.Sum(x => x.totalVatAmount);
            }


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "OrdersReport/ByYearMonth/Totals", oldEntity: "", newEntity: "", extranotes: retValue.rows.Count.ToString() + " Rows Returned", actionbyip: "");



            return retValue;


        }



        [HttpPut("ExpiredStockreportv1")]
        public async Task<ActionResult<List<CustomProduct>>> ExpiredStockreportv1()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            var distinctProductIds = _context.Stocks
                    .Include(x => x.Lot)
                    .Where(x => x.Lot.Expdate.HasValue && x.Lot.Expdate <= DateOnly.FromDateTime(DateTime.Now))
                    .GroupBy(x => x.Productid)
                    .Where(g => g.Sum(x => x.Qty) > 0)
                    .Select(g => g.Key)
                    .ToList();


            var allproducts = await _superHeroService.GetAllProducts(null, distinctProductIds, null, null, true);

            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/ExpiredStockreportv1", oldEntity: "", newEntity: "", extranotes: allproducts.Count.ToString() + " Products Returned", actionbyip: "");

            return allproducts;


        }



        [HttpPut("StockReport")]
        public async Task<ActionResult<List<CustomProduct>>> StockReport([FromBody] List<InventoryAdjustmentItemModel>? list, [FromQuery] string usernotes, [FromQuery] Int64 reasonId)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            // the user will be allowed access if they either have the ClaimCanViewReports permission or if they are in one of the administrative roles.

            if (!await _superHeroService.IsUserAuthorizedToViewReports(userId))
            {
                return Unauthorized("Unauthorized");
            }

            return await _superHeroService.GetAllProducts(null, null);

            //try
            //    {
            //        // Perform your database operations here
            //        if (list == null || list.Count == 0 || reasonId <= 0)
            //        {
            //            string errormsg = "";
            //            if (list != null && list.Count > 0)
            //            {
            //                errormsg = "Empty Reason!";
            //            }
            //            else if (reasonId > 0) { errormsg = "Empty List!"; }
            //            else
            //            {
            //                errormsg = "Empty List and Empty Reason!";
            //            }
            //            result = NotFound(errormsg);
            //            //  return NotFound("Empty List");
            //        }
            //        else
            //        {
            //        }
            //    }
            //    catch (Exception)
            //    {

            //    return NotFound("Sorry, An error occurred!");
            //}

        }


        //[HttpPost]
        //public IActionResult GenerateReport([FromForm] string data)

        //{

        //    // Perform necessary data processing and generate the PDF content based on the provided report parameters
        //    byte[] pdfBytes = GeneratePdf(data);

        //    // Return the PDF file as the response
        //    return File(pdfBytes, "application/pdf", "report.pdf");
        //}

        //private byte[] GeneratePdf(string report)
        //{
        //    using (MemoryStream memoryStream = new MemoryStream())
        //    {
        //        // Create a new PDF document
        //        PdfDocument pdfDocument = new PdfDocument(new PdfWriter(memoryStream));
        //        Document document = new Document(pdfDocument);

        //        // Set up the document
        //        document.Add(new Paragraph($"Filter Name: Test"));

        //        // Generate the PDF content based on the report parameters
        //        //foreach (ReportsFiltersAssigned filter in report.ReportsFiltersAssigneds)
        //        //{
        //        //    // Add the filter information to the PDF
        //        //    document.Add(new Paragraph($"Filter Name: {filter.Filter.Name}"));
        //        //    document.Add(new Paragraph($"Filter Type: {filter.Filter.Type}"));
        //        ////    document.Add(new Paragraph($"Filter Value: {GetValueAsString(filter.value)}"));

        //        //    // Add additional logic to handle different filter types and options
        //        //}

        //        // Close the document
        //        document.Close();

        //        // Get the generated PDF content as bytes
        //        byte[] pdfBytes = memoryStream.ToArray();

        //        return pdfBytes;
        //    }
        //}

        //private string GetValueAsString(object value)
        //{
        //    // Convert the value to a string representation
        //    // Add any additional logic based on the value type

        //    if (value is null)
        //    {
        //        return "N/A";
        //    }
        //    else if (value is DateTime dateTime)
        //    {
        //        return dateTime.ToString("yyyy-MM-dd");
        //    }
        //    else
        //    {
        //        return value.ToString();
        //    }
        //}






        //[HttpPut("OrdersReport/BySupplier")]
        //public async Task<ActionResult<List<CustomProduct>>> OrdersReportBySupplier([FromBody] ReportFilters filters)
        //{
        //    var userId = _superHeroService.LoggedInUserID(User);
        //    if (userId <= 0)
        //    {
        //        return Unauthorized("Unauthorized!");
        //    }


        //    if (filters == null)
        //    {
        //        var allproducts = await _superHeroService.GetAllProducts(null, null);
        //        await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/Stockreportv1", oldEntity: "", newEntity: "", extranotes: allproducts.Count.ToString() + " Products Returned", actionbyip: "");
        //        return allproducts;
        //    }
        //    else
        //    {

        //        var allproducts = await _superHeroService.GetAllProducts(null, filters.ProductIDS, filters.CategoryIDS, filters.LocationIDS);
        //        await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Report", primarykey: 0, tablename: "Reporting/Stockreportv1", oldEntity: "", newEntity: "", extranotes: allproducts.Count.ToString() + " Products Returned", actionbyip: "");
        //        return allproducts;
        //    }


        //}




    }
}