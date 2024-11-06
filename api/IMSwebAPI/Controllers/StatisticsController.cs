using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<StatisticsController> _logger;
        private readonly IGlobalService _superHeroService;
        public StatisticsController(ILogger<StatisticsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        //private decimal CalculatePUnitWAVG(int productId)
        //{
        //    var relevantTransactions = _context.StockTrans
        //        .Where(xa => xa.Status == 8)
        //        .SelectMany(xa => xa.StockTransDetails
        //            .Where(detail => detail.Pid == productId && detail.UnitcostRecalculationFlag)
        //            .Select(detail => new
        //            {
        //                Qty = detail.Qty,
        //                UnitCostPrice = detail.Unitcostprice
        //            })
        //        );

        //    decimal totalCost = relevantTransactions.Sum(t => t.Qty * t.UnitCostPrice);
        //    decimal totalQty = relevantTransactions.Sum(t => t.Qty);

        //    if (totalQty > 0)
        //    {
        //        return totalCost / totalQty;
        //    }
        //    else
        //    {
        //        // Handle the case where totalQty is 0, for example, by returning a default value.
        //        return 0;
        //    }
        //}


        [HttpGet("")]

        public async Task<ActionResult<StatisticsDTO>> GetStatistics()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            var x = new StatisticsDTO();

            x.total_pendingreqlinescount = 0;
            x.total_today_pendingreqlinescount = 0;
            x.lowstockproducts = new List<CustomProduct>();
            x.stockList = new List<ProductStockModel>();
            x.inventory_stock_qty = 0;
            x.inventory_stock_value = 0;


            var stockListWithPUnitWAVG = _context.StockTransDetails
                .Where(detail => detail.UnitcostRecalculationFlag)
                .GroupBy(detail => detail.Pid)
                .Select(detailGroup => new
                {
                    ProductId = detailGroup.Key,
                    PUnitWAVG = Math.Round(detailGroup.Sum(detail => Math.Round(Math.Abs(detail.Qty) * Math.Abs(detail.Unitcostprice), 2)) /
                        detailGroup.Sum(detail => Math.Abs(detail.Qty)), 2)
                })
                .ToList();

            // Create a dictionary to store PUnitWAVG values for each product
            var pUnitWAVGDict = stockListWithPUnitWAVG
                .ToDictionary(p => p.ProductId, p => p.PUnitWAVG);

            var stockListData = _context.Products
                .Select(product => new ProductStockModel
                {
                    Pid = product.Id,
                    Pcode = product.Code,
                    Pname = product.Name,
                    PdefaultSupplier = product.DefaultSupplier.Name,
                    Pcategory = product.Category.Name,
                    Building = "",
                    Room = "",
                    PUnitWAVG = pUnitWAVGDict.ContainsKey(product.Id) ? pUnitWAVGDict[product.Id] : 0,
                    TotalQty = product.Stocks.Sum(stock => stock.Qty),
                    TotalValue = 0, // Initialize to 0
                })
                .ToList();

            // Calculate TotalValue
            foreach (var product in stockListData)
            {
                product.TotalValue = Math.Round(product.PUnitWAVG * product.TotalQty, 2);
            }

            x.stockList = stockListData.Where(c => c.TotalQty > 0).ToList();





            //  x.pordersanalysisforpiechart = new List<PorderAnalysisByCategoryForChart>();

            //x.total_pendingreqlinescount = _context.Requestlines.Include(x => x.CurrentDecision).Where(x => x.CurrentDecision.Name.ToLower() == "pending".ToLower()).Count();
            //x.total_today_pendingreqlinescount = _context.Requestlines.Include(xx => xx.CurrentDecision).Include(xx => xx.Req).Where(xx => xx.CurrentDecision.Name.ToLower() == "pending".ToLower() && xx.Req.ReqDate.Date == DateTime.Now.Date).Count();
            //x.total_ytd_reqlinescount = _context.Requestlines.Include(xx => xx.CurrentDecision).Include(xx => xx.Req).Where(xx=> xx.Req.ReqDate.Date.Year == DateTime.Now.Date.Year).Count();

            //   x.total_pendingreqlinescount = _context.Requestlines
            //.Include(r => r.Requestdecisionhistories)
            //.Count(r => r.Requestdecisionhistories
            //    .OrderByDescending(h => h.Decisiondatetime)
            //    .FirstOrDefault() != null
            //    && r.Requestdecisionhistories.OrderByDescending(h => h.Decisiondatetime).FirstOrDefault().Decision.Name.ToLower() == "pending".ToLower());
            //        var transList = _context.StockTrans
            //  .Where(xa => xa.Status == 8) // Filter by Status = 8
            //  .SelectMany(xa => xa.StockTransDetails) // Flatten the details
            //  .Select(detail => new
            //  {
            //      detail.Id,
            //      detail.Pid,
            //      detail.Qty,
            //      detail.Unitcostprice,
            //      detail.UnitcostRecalculationFlag,
            //      detail.DocumentLineid,
            //      PidNavigation = new
            //      {
            //          detail.PidNavigation.Code,
            //          detail.PidNavigation.Name,
            //          supplier = detail.PidNavigation.DefaultSupplier.Name,
            //          category = detail.PidNavigation.Category.Name,
            //          // Include other properties you need from PidNavigation
            //      },
            //      Header = new
            //      {
            //          detail.Trans.Id,
            //          detail.Trans.StockTransTypeId,
            //          detail.Trans.StockTransReasonId,
            //          detail.Trans.Userid,
            //          detail.Trans.Transdate,
            //          detail.Trans.Status,
            //          detail.Trans.Updatedat,
            //          detail.Trans.Description,
            //          detail.Trans.StockTransReason.ReasonName,
            //          detail.Trans.StockTransType.TypeName
            //      }
            //  })
            //  .OrderBy(detail => detail.Header.Transdate) // Order by Transdate
            //  .ThenBy(detail => detail.Header.Id) // Then order by Id
            //  .ToList();

            //        // Group by Pid and UnitcostRecalculationFlag
            //        var groupedTransList = transList
            //            .GroupBy(detail => new { detail.Pid, detail.PidNavigation.Code, detail.PidNavigation.Name, detail.PidNavigation.supplier, detail.PidNavigation.category, detail.UnitcostRecalculationFlag })
            //            .ToList();

            //        // Create a list of ProductInfo objects
            //        var productInfoList = groupedTransList
            //.Select(group => new ProductStockModel
            //{
            //    Pid = group.Key.Pid,
            //    Pcode = group.Key.Code,
            //    Pname = group.Key.Name,
            //    PdefaultSupplier = group.Key.supplier,
            //    Pcategory = group.Key.category,
            //    TotalQty = group.Sum(detail => detail.Qty),
            //    PUnitWAVG = group.Key.UnitcostRecalculationFlag ?
            //        Math.Round(group.Sum(detail => Math.Abs(detail.Qty) * Math.Abs(detail.Unitcostprice)) / group.Sum(detail => Math.Abs(detail.Qty)), 2) :
            //        0, // Set PUnitWAVG to 0 if UnitcostRecalculationFlag is false
            //    TotalValue = group.Sum(detail => detail.Qty) * (group.Key.UnitcostRecalculationFlag ?
            //        Math.Round(group.Sum(detail => Math.Abs(detail.Qty) * Math.Abs(detail.Unitcostprice)) / group.Sum(detail => Math.Abs(detail.Qty)), 2) :
            //        0) // Calculate TotalValue as TotalQty * PUnitWAVG
            //})
            //.ToList();

            //        x.stockList = productInfoList;

            double inventoryStockValue = (double)x.stockList.Sum(product => product.TotalValue);
            x.inventory_stock_value = inventoryStockValue;

            x.inventory_stock_qty = (double)x.stockList.Sum(product => product.TotalQty);

            //        var productInfoList = groupedTransList
            //            .Select(group => new ProductStockModel
            //            {
            //                Pid = group.Key.Pid,
            //                Pcode = group.Key.Code,
            //                Pname = group.Key.Name,
            //                PdefaultSupplier = group.Key.supplier,
            //                Pcategory = group.Key.category,
            //                TotalQty = group.Sum(detail => detail.Qty),
            //                PUnitWAVG = group.Key.UnitcostRecalculationFlag ?
            //Math.Round(group.Sum(detail => Math.Abs( detail.Qty) * Math.Abs(detail.Unitcostprice) )/ group.Sum(detail => Math.Abs(detail.Qty)), 2) :
            //0 // Set PUnitWAVG to 0 if UnitcostRecalculationFlag is false

            //            })
            //            .ToList();

            // Now productInfoList contains the desired product information including PUnitWAVG


            x.total_pendingreqlinescount = _context.Requestlines
    .Where(rl => !_context.Requestdecisionhistories.Any(rdh => rdh.Reqlineid == rl.Id))
    .Count();

            x.total_today_pendingreqlinescount = _context.Requestlines
                .Include(r => r.Req)
    .Where(rl => rl.Req.ReqDate.Date == DateTime.Now.Date && !_context.Requestdecisionhistories.Any(rdh => rdh.Reqlineid == rl.Id))
    .Count();

            //        x.total_today_pendingreqlinescount = _context.Requestlines
            //.Include(r => r.Requestdecisionhistories)
            //.Include(r => r.Req)
            //.Count(r => r.Requestdecisionhistories
            //    .OrderByDescending(h => h.Decisiondatetime)
            //    .FirstOrDefault() != null
            //    && r.Requestdecisionhistories.OrderByDescending(h => h.Decisiondatetime).FirstOrDefault().Decision.Name.ToLower() == "pending".ToLower()
            //    && r.Req.ReqDate.Date == DateTime.Now.Date);


            x.total_ytd_reqlinescount = _context.Requestlines
    .Include(r => r.Requestdecisionhistories)
    .Include(r => r.Req)
    .Count(r => r.Requestdecisionhistories
        .OrderByDescending(h => h.Decisiondatetime)
        .FirstOrDefault() != null
        && r.Requestdecisionhistories.OrderByDescending(h => h.Decisiondatetime).FirstOrDefault().Decision.Name != null
        && r.Req.ReqDate.Date.Year == DateTime.Now.Date.Year);


            var xxx = _context.Requestlines
    .Include(r => r.Requestdecisionhistories)
    .Include(r => r.Req)
    .Where(r => r.Requestdecisionhistories
        .OrderByDescending(h => h.Decisiondatetime)
        .FirstOrDefault() != null
        && r.Requestdecisionhistories.OrderByDescending(h => h.Decisiondatetime).FirstOrDefault().Decision.Name != null
        && r.Req.ReqDate.Date.Year == DateTime.Now.Date.Year)
    .GroupBy(r => r.Requestdecisionhistories
        .OrderByDescending(h => h.Decisiondatetime)
        .FirstOrDefault().Decision.Name)
    .Select(g => new
    {
        Decision = g.Key,
        Count = g.Count()
    })
    .OrderBy(x => x.Decision)
    .ToList();


            //        var xxx = _context.Requestlines
            //.Include(xx => xx.CurrentDecision)
            //.Include(xx => xx.Req)
            //.Where(xx => xx.Req.ReqDate.Date.Year == DateTime.Now.Date.Year)
            //.GroupBy(xx => xx.CurrentDecision.Name)

            //.Select(g => new {
            //    Decision = g.Key,
            //    Count = g.Count()
            //}).OrderBy(xx => xx.Decision)
            //.ToList();

            x.reqanalysisytdbydecision = new List<ReqanalysisytdbydecisionModel>();

            xxx.ForEach(xx =>
            {
                var xnew = new ReqanalysisytdbydecisionModel();
                xnew.decision = xx.Decision;
                xnew.count = xx.Count;
                x.reqanalysisytdbydecision.Add(xnew);
            });



            var productList = await _superHeroService.GetAllProducts(null, null);
            x.lowstockproducts = productList.Where(c => c.Availabletotalstockqty < c.Minstockqty && c.ActivestatusFlag == true).ToList();




            //            var xxxc = _context.Porderlines.Include(xx=> xx.Pord)
            //.Include(xx => xx.Product).Include(xx => xx.Product.Category).Include(xx => xx.Product.Subcategory)
            // .Where(xx => xx.Pord.Ordercreateddate.Month == DateTime.Now.Date.Month).ToList();
            DateTime currentDate = DateTime.Now;
            DateTime currentMonthStart = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime previousMonthStart = currentMonthStart.AddMonths(-1);

            var query = from p in _context.Products
                        join pl in _context.Porderlines on p.Id equals pl.Productid
                        join po in _context.Porders on pl.Pordid equals po.Id
                        where po.Ordercreateddate >= currentMonthStart && po.Ordercreateddate < currentMonthStart.AddMonths(1)
                              && pl.Qty > 0 && (p.SubcategoryId > 0 || p.SubcategoryId != null)
                        group new { p, pl } by new { p.CategoryId, CategoryName = p.Category.Name, p.SubcategoryId, SubcategoryName = p.Subcategory.Name } into g
                        select new
                        {
                            g.Key.CategoryId,
                            g.Key.CategoryName,
                            g.Key.SubcategoryId,
                            g.Key.SubcategoryName,
                            CurrentMonthOrderQty = g.Sum(x => x.pl.Qty),
                            PreviousMonthOrderQty = _context.Porderlines
                                .Where(x => x.Product.CategoryId == g.Key.CategoryId &&
                                            x.Product.SubcategoryId == g.Key.SubcategoryId &&
                                            x.Pord.Ordercreateddate >= previousMonthStart &&
                                            x.Pord.Ordercreateddate < previousMonthStart.AddMonths(1) &&
                                            x.Qty > 0)
                                .Sum(x => x.Qty)
                        };


            // Create a list to store the query results
            List<PorderAnalysisByCategoryForChart> analysisResults = new List<PorderAnalysisByCategoryForChart>();

            // Iterate over the query results and populate the PorderAnalysisByCategoryForChart objects
            foreach (var result in query)
            {
                if (result.SubcategoryId is not null) { }
                PorderAnalysisByCategoryForChart analysisItem = new PorderAnalysisByCategoryForChart
                {
                    categoryid = result.CategoryId,
                    subcategoryid = (int)result.SubcategoryId,
                    categoryname = result.CategoryName,
                    subcategoryname = result.SubcategoryName,
                    subcategorytotalqty_thismonth = result.CurrentMonthOrderQty,
                    subcategorytotalqty_previousmonth = result.PreviousMonthOrderQty
                };

                analysisResults.Add(analysisItem);
            }



            // Assign the analysisResults to x.pordersanalysisforpiechart
            x.pordersanalysisforpiechart = analysisResults;


            return x;











        }




    }
}
