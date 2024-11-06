using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<InventoryController> _logger;
        private readonly IGlobalService _superHeroService;
        public InventoryController(ILogger<InventoryController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }



        [HttpPut("TransferInventory")]
        public async Task<ActionResult<string>> TransferInventory([FromBody] List<TransferInventoryItemModel>? list, [FromQuery] string usernotes)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

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
                    // Perform database operations
                    if (list == null || list.Count == 0)
                    {
                        result = NotFound("Empty List");

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
                                 .Where(e => e.Productid == findproduct.Id & e.Locid == findfromlocid.Id & e.Lotid == findlotid.Id & e.Conditionstatus == findcondstatusid.Id & e.Si.ToLower() == item.si.ToLower() & e.Ns.ToLower() == item.ns.ToLower())
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
                        if (findstocktranstypeforTransfer <= 0) { result = NotFound("Sorry, An error occurred because stock trans type Transfer is not found!"); }

                        var findstocktransreasonForSystem = 0;
                        try
                        {
                            findstocktransreasonForSystem = _context.StockTransReasons.Where(x => x.ReasonName.Trim().ToLower().Equals("System".ToLower().Trim())).SingleOrDefault().Id;

                        }
                        catch (Exception)
                        {

                            findstocktransreasonForSystem = -1;
                        }
                        if (findstocktransreasonForSystem <= 0) { result = NotFound("Sorry, An error occurred because stock trans reason System is not found!"); }



                        var findstocktranstypeStatusCompleted = 0;
                        try
                        {
                            findstocktranstypeStatusCompleted = _context.StockTransStatuses.Where(x => x.Name.Trim().ToLower().Equals("Completed".ToLower().Trim())).SingleOrDefault().Id;

                        }
                        catch (Exception)
                        {

                            findstocktranstypeStatusCompleted = -1;
                        }
                        if (findstocktranstypeStatusCompleted <= 0) { result = NotFound("Sorry, An error occurred because stock trans type Status is not found!"); }


                        if (result is null)
                        {
                            var stocktrans_header = new StockTran();

                            stocktrans_header.Userid = _superHeroService.LoggedInUserID(User);
                            stocktrans_header.StockTransTypeId = findstocktranstypeforTransfer;
                            stocktrans_header.StockTransReasonId = findstocktransreasonForSystem;
                            stocktrans_header.Transdate = DateTime.Now;
                            stocktrans_header.Status = findstocktranstypeStatusCompleted;
                            stocktrans_header.Description = usernotes ?? "";

                            foreach (var item in list)
                            {

                                _context.Stocks.Add(new Stock
                                {
                                    Productid = item.pid,
                                    Locid = item.tolocid,
                                    Qty = item.qty,
                                    Lotid = item.lotid,
                                    Conditionstatus = item.condstatusid,
                                    Si = item.si,
                                    Ns = item.ns


                                });
                                _context.Stocks.Add(new Stock
                                {
                                    Productid = item.pid,
                                    Locid = item.fromlocid,
                                    Qty = item.qty * -1,
                                    Lotid = item.lotid,
                                    Conditionstatus = item.condstatusid,
                                    Si = item.si,
                                    Ns = item.ns

                                });



                                //    newstocktrans.Userid = LoggedInUserID(User);
                                //  if (newstocktrans.Userid <= 0) { return NotFound("Sorry, An error occurred because user is not found!"); }






                                var StockTrans_Details = new StockTransDetail
                                {
                                    Lotid = item.lotid,
                                    Qty = item.qty * -1,
                                    Locid = item.fromlocid,
                                    Pid = item.pid,
                                    Conditionstatus = item.condstatusid,
                                    Unitcostprice = 0,
                                    UnitcostRecalculationFlag = false,
                                    Si = item.si,
                                    Ns = item.ns
                                };
                                stocktrans_header.StockTransDetails.Add(StockTrans_Details);

                                StockTrans_Details = new StockTransDetail
                                {
                                    Lotid = item.lotid,
                                    Qty = item.qty,
                                    Locid = item.tolocid,
                                    Pid = item.pid,
                                    Conditionstatus = item.condstatusid,
                                    Unitcostprice = 0,
                                    UnitcostRecalculationFlag = false,
                                    DocumentLineid = 0,
                                    Si = item.si,
                                    Ns = item.ns
                                };
                                stocktrans_header.StockTransDetails.Add(StockTrans_Details);





                            }

                            _context.StockTrans.Add(stocktrans_header); // parent and its children gets added
                            await _context.SaveChangesAsync();

                            await transaction.CommitAsync();

                            result = Ok("Transfer successful!");
                        }
                        else
                        {
                            await transaction.RollbackAsync();

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

        [HttpPut("InventoryAdjustment")]
        public async Task<ActionResult<string>> InventoryAdjustment([FromBody] List<InventoryAdjustmentItemModel>? list, [FromQuery] string usernotes, [FromQuery] Int64 reasonId)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            if (!await _superHeroService.IsUserAuthorizedToMakeInventoryAdjustment(userId))
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
                    // Perform database operations
                    if (list == null || list.Count == 0 || reasonId <= 0)
                    {
                        string errormsg = "";
                        if (list != null && list.Count > 0)
                        {
                            errormsg = "Empty Reason!";
                        }
                        else if (reasonId > 0) { errormsg = "Empty List!"; }
                        else
                        {
                            errormsg = "Empty List and Empty Reason!";
                        }
                        result = NotFound(errormsg);

                    }
                    else
                    {
                        foreach (var item in list)
                        {
                            // verify products
                            var findproduct = _context.Products.Where(x => x.Id == item.pid).SingleOrDefault();
                            if (findproduct is null) { result = NotFound("Product not found with code:" + item.pcode); }
                            // verify from locid
                            var findfromlocid = _context.Locations.Where(x => x.Id == item.locid).SingleOrDefault();
                            if (findfromlocid is null) { result = NotFound("Location not found with name:" + item.locname); }
                            // verify lotid
                            var findlotid = _context.Lots.Where(x => x.Id == item.lotid).SingleOrDefault();
                            if (findlotid is null) { result = NotFound("Lot not found with number:" + item.lotnumber); }
                            // verify condid
                            var findcondstatusid = _context.Itemconditionstatuses.Where(x => x.Id == item.condstatusid).SingleOrDefault();
                            if (findcondstatusid is null) { result = NotFound("Item condition status not found with name:" + item.condstatusname); }

                            // verify qty 
                            if (item.qty == 0) { result = NotFound("Qty 0 not allowed for product " + item.pname); }


                            if (item.qty < 0)
                            {
                                var stockAvailableLiveAtFromLocId = _context.Stocks.AsNoTracking()
                              .Where(e => e.Productid == findproduct.Id & e.Locid == findfromlocid.Id & e.Lotid == findlotid.Id & e.Conditionstatus == findcondstatusid.Id & e.Si.ToLower() == item.si.ToLower() & e.Ns.ToLower() == item.ns.ToLower())
                              .Sum(b => b.Qty);

                                if (stockAvailableLiveAtFromLocId < Math.Abs(item.qty))
                                {
                                    result = NotFound("The required quantity is not available for product " + item.pname);
                                }

                            }




                        }




                        var findstocktransreason = 0;
                        try
                        {
                            findstocktransreason = _context.StockTransReasons.Where(x => x.Id == reasonId && !x.ReasonName.Trim().ToLower().Equals("System".ToLower().Trim())).SingleOrDefault().Id;

                        }
                        catch (Exception)
                        {

                            findstocktransreason = -1;
                        }

                        if (findstocktransreason <= 0) { result = NotFound("Transaction Reason not found: " + reasonId.ToString()); }



                        var findstocktranstypeforAdjustment = 0;
                        try
                        {
                            findstocktranstypeforAdjustment = _context.StockTransTypes.Where(x => x.TypeName.Trim().ToLower().Equals("Adjustment".ToLower().Trim())).SingleOrDefault().Id;

                        }
                        catch (Exception)
                        {

                            findstocktranstypeforAdjustment = -1;
                        }
                        if (findstocktranstypeforAdjustment <= 0) { result = NotFound("Sorry, An error occurred because stock trans type Adjustment is not found.. !"); }


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
                            var stocktrans_header = new StockTran();
                            stocktrans_header.Userid = _superHeroService.LoggedInUserID(User);
                            stocktrans_header.StockTransTypeId = findstocktranstypeforAdjustment;
                            stocktrans_header.StockTransReasonId = findstocktransreason;
                            stocktrans_header.Transdate = DateTime.Now;
                            stocktrans_header.Status = findstocktranstypeStatusCompleted;
                            stocktrans_header.Description = usernotes ?? "";

                            foreach (var item in list)
                            {

                                _context.Stocks.Add(new Stock
                                {
                                    Productid = item.pid,
                                    Locid = item.locid,
                                    Qty = item.qty,
                                    Lotid = item.lotid,
                                    Conditionstatus = item.condstatusid,
                                    Si = item.si,
                                    Ns = item.ns


                                });
                                //_context.Stocks.Add(new Stock
                                //{
                                //    Productid = item.pid,
                                //    Locid = item.locid,
                                //    Qty = item.qty * -1,
                                //    Lotid = item.lotid,
                                //    Conditionstatus = item.condstatusid


                                //});



                                //    newstocktrans.Userid = LoggedInUserID(User);
                                //  if (newstocktrans.Userid <= 0) { return NotFound("Sorry, An error occurred because user is not found!"); }








                                var StockTrans_Details = new StockTransDetail
                                {
                                    Lotid = item.lotid,
                                    Qty = item.qty,
                                    Locid = item.locid,
                                    Pid = item.pid,
                                    Conditionstatus = item.condstatusid,
                                    Unitcostprice = 0,
                                    UnitcostRecalculationFlag = false,
                                    DocumentLineid = 0,
                                    Si = item.si,
                                    Ns = item.ns
                                };
                                stocktrans_header.StockTransDetails.Add(StockTrans_Details);






                            }

                            _context.StockTrans.Add(stocktrans_header); // parent and its children gets added

                            await _context.SaveChangesAsync();

                            await transaction.CommitAsync();

                            result = Ok("Quantity successfully updated!");// Inventory Count successful
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
