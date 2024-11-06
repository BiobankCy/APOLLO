using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<StockController> _logger;
        private readonly IGlobalService _superHeroService;


        public StockController(ILogger<StockController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }


        [HttpGet("")]
        public async Task<ActionResult<List<Stock>>> GetStockList()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            return await _context.Stocks.ToListAsync();

        }

        [HttpGet("View/{pid}")]
        public async Task<ActionResult<List<Stock>>> ForSingleProduct(int pid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            return await _context.Stocks.Where(a => a.Productid == pid).ToListAsync();
        }


        [HttpPut("TransferInventory")]
        public async Task<ActionResult<string>> TransferInventory([FromBody] List<TransferInventoryItemModel>? list, [FromQuery] string usernotes)
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");

            }

            if (!await _superHeroService.IsUserAuthorizedToTransferStock(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }


            var executionStrategy = _context.Database.CreateExecutionStrategy();
            ActionResult<string> result = null;


            await executionStrategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    // Perform your database operations here
                    if (list == null || list.Count == 0)
                    {
                        result = NotFound("Empty List");
                        //  return NotFound("Empty List");
                    }
                    else
                    {
                        foreach (var item in list)
                        {
                            // verify products
                            var findproduct = _context.Products.Where(x => x.Id == item.pid).SingleOrDefault();
                            if (findproduct is null) { result = NotFound("Product not found with code:" + item.pcode); }
                            // verify from locid
                            var findfromlocid = _context.Locations.Where(x => x.Id == item.fromlocid).SingleOrDefault();
                            if (findfromlocid is null) { result = NotFound("From Location not found with name:" + item.fromlocname); }
                            // verify to locid
                            var findtolocid = _context.Locations.Where(x => x.Id == item.tolocid).SingleOrDefault();
                            if (findtolocid is null) { result = NotFound("To Location not found with name:" + item.tolocname); }
                            // verify lotid
                            var findlotid = _context.Lots.Where(x => x.Id == item.lotid).SingleOrDefault();
                            if (findlotid is null) { result = NotFound("Lot not found with number:" + item.lotnumber); }
                            // verify condid
                            var findcondstatusid = _context.Itemconditionstatuses.Where(x => x.Id == item.condstatusid).SingleOrDefault();
                            if (findcondstatusid is null) { result = NotFound("Item condition status not found with name:" + item.condstatusname); }

                            // verify qty 
                            if (item.qty <= 0) { result = NotFound("Qty <=0 from product " + item.pname); }
                            // verify fromlocid is not the same as tolocid 
                            if (item.fromlocid == item.tolocid) { result = NotFound("Locations From/To are tha same, for product " + item.pname); }

                            var stockAvailableLiveAtFromLocId = _context.Stocks.AsNoTracking()
                                 .Where(e => e.Productid == findproduct.Id & e.Locid == findfromlocid.Id & e.Lotid == findlotid.Id & e.Conditionstatus == findcondstatusid.Id)
                                 .Sum(b => b.Qty);

                            if (stockAvailableLiveAtFromLocId < item.qty)
                            {
                                result = NotFound("The required quantity is not available for product " + item.pname);
                            }

                        }
                        var findstocktranstypeforTransfer = 0;
                        try
                        {
                            findstocktranstypeforTransfer = _context.StockTransTypes.Where(x => x.TypeName.Trim().ToLower().Equals("Transfer".ToLower().Trim())).SingleOrDefault().Id;

                        }
                        catch (Exception)
                        {

                            findstocktranstypeforTransfer = -1;
                        }
                        if (findstocktranstypeforTransfer <= 0) { result = NotFound("Sorry, An error occurred because stock trans type Transfer is not found.. !"); }


                        var findstocktranstypeStatusCompleted = 0;
                        try
                        {
                            findstocktranstypeStatusCompleted = _context.StockTransStatuses.Where(x => x.Name.Trim().ToLower().Equals("Completed".ToLower().Trim())).SingleOrDefault().Id;

                        }
                        catch (Exception)
                        {

                            findstocktranstypeStatusCompleted = -1;
                        }
                        if (findstocktranstypeStatusCompleted <= 0) { result = NotFound("Sorry, An error occurred because stock trans type Status is not found.. !"); }


                        if (result is null)
                        {
                            foreach (var item in list)
                            {

                                _context.Stocks.Add(new Stock
                                {
                                    Productid = item.pid,
                                    Locid = item.tolocid,
                                    Qty = item.qty,
                                    Lotid = item.lotid,
                                    Conditionstatus = item.condstatusid


                                });
                                _context.Stocks.Add(new Stock
                                {
                                    Productid = item.pid,
                                    Locid = item.fromlocid,
                                    Qty = item.qty * -1,
                                    Lotid = item.lotid,
                                    Conditionstatus = item.condstatusid


                                });



                                //    newstocktrans.Userid = LoggedInUserID(User);
                                //  if (newstocktrans.Userid <= 0) { return NotFound("Sorry, An error occurred because user is not found!"); }



                                var stocktrans_header = new StockTran();

                                stocktrans_header.Userid = 1; // DesktopAPPClass.UserLoggedINGLOBAL.User.Id;
                                stocktrans_header.StockTransTypeId = findstocktranstypeforTransfer;
                                stocktrans_header.Transdate = DateTime.Now;
                                stocktrans_header.Status = findstocktranstypeStatusCompleted;
                                stocktrans_header.Description = usernotes ?? "";


                                var StockTrans_Details = new StockTransDetail();
                                StockTrans_Details.Lotid = item.lotid;
                                StockTrans_Details.Qty = item.qty * -1;
                                StockTrans_Details.Locid = item.fromlocid;
                                StockTrans_Details.Pid = item.pid;
                                StockTrans_Details.Conditionstatus = item.condstatusid;
                                StockTrans_Details.Unitcostprice = 0;
                                StockTrans_Details.UnitcostRecalculationFlag = false;
                                StockTrans_Details.DocumentLineid = 0;
                                stocktrans_header.StockTransDetails.Add(StockTrans_Details);

                                StockTrans_Details = new StockTransDetail();
                                StockTrans_Details.Lotid = item.lotid;
                                StockTrans_Details.Qty = item.qty;
                                StockTrans_Details.Locid = item.tolocid;
                                StockTrans_Details.Pid = item.pid;
                                StockTrans_Details.Conditionstatus = item.condstatusid;
                                StockTrans_Details.Unitcostprice = 0;
                                StockTrans_Details.UnitcostRecalculationFlag = false;
                                StockTrans_Details.DocumentLineid = 0;
                                stocktrans_header.StockTransDetails.Add(StockTrans_Details);

                                _context.StockTrans.Add(stocktrans_header); // parent and its children gets added



                            }

                            await _context.SaveChangesAsync();

                            await transaction.CommitAsync();

                            result = Ok("Transfer successful");
                        }
                        else
                        {
                            await transaction.RollbackAsync();
                            // result = BadRequest($"An error occurred during the transfer. Rollback!");
                        }


                    }


                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    result = BadRequest($"An error occurred during the transfer: {ex.Message}");
                }
            });

            return result ?? BadRequest($"An general error occurred during the transfer.");
        }



    }
}
