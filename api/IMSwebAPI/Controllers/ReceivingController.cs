using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ReceivingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ReceivingController> _logger;
        private readonly IGlobalService _superHeroService;
        public ReceivingController(ILogger<ReceivingController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }


        [HttpGet("")]

        public async Task<ActionResult<List<Receiving>>> GetAllReceivings()
        {



            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            return await _superHeroService.GetAllReceivings();

        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Receiving>> GetSingleReceiving(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            var retList = await _superHeroService.GetAllReceivings(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this receiving doesn't exist!");

            }

        }

        [HttpGet("readallitemconditionstatuses")]

        public async Task<ActionResult<List<Itemconditionstatus>>> GetItemConditionStatuses()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            return await _superHeroService.GetItemConditionStatuses();

        }

        [HttpGet("readlines/{id}")]

        public async Task<ActionResult<List<Receivingline>>> GetReceivingLines(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            if (id > 0)
            {
                var retList = await _superHeroService.GetReceivingLines(id);

                if (retList is not null)
                {
                    return retList;

                }

            }
            return NotFound("Sorry but this receiving id doesn't exist!");


        }


        [HttpPut("Add")]
        public async Task<ActionResult<Receiving>> AddReceiving([FromBody] Receiving newReceiving)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            if (!await _superHeroService.IsUserAuthorizedToReceiveItems(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            //var loggedinuser = await _context.Users.Where(xx => xx.Id == userId && xx.ClaimCanReceiveItems && !xx.LockoutFlag).SingleOrDefaultAsync();

            //if (loggedinuser is null) { return Unauthorized("Unauthorized"); }

            if (userId > 0)
            {
                newReceiving.ByuserId = userId;
                newReceiving.Id = 0;
                newReceiving.Receivedatetime = DateTime.Now;
                // newPorder.Podate = DateOnly.FromDateTime(DateTime.Now);
                // newPorder.Duedate = DateOnly.FromDateTime(DateTime.Now);
                // newPorder.Statusid = 1;



                if (newReceiving.Receivinglines.Count <= 0) { return NotFound("Validation Error: No receiving lines have been provided."); }
                if (newReceiving.PorderId <= 0) { return NotFound("Validation Error: Receiving transactions require a valid purchase order number to be provided."); }

                //if (newReceiving.Invoice is not null)
                //{
                //    if (newReceiving.Invoice.Supinvno.Length <= 0) { return NotFound("Validation Error: Receiving transactions require a valid invoice number to be provided."); }

                //}
                newReceiving.Invoice = null;





                var porder = _context.Porders.Include(x => x.Status).Where(x => x.Id == newReceiving.PorderId).SingleOrDefault();
                if (porder != null)
                {
                    if (porder.Status.Name.ToLower() == "Partially Received".ToLower() || porder.Status.Name.ToLower() == "sent".ToLower())
                    {

                    }
                    else
                    {
                        return NotFound("Validation Error: It is not possible to receive items for that particular purchase order. Current PO Status: " + porder.Status.Name + ".");

                    }
                }
                else
                {
                    return NotFound("Validation Error: Receiving transactions require a valid purchase order number to be provided.");
                }


                if (newReceiving.InvoiceId <= 0)
                {
                    return NotFound("Validation Error: Receiving transactions require invoice to be provided.");

                }
                else
                {
                    var findinvoice = await _context.SupplierInvoices.Where(x => x.Id == newReceiving.InvoiceId && x.Supid == porder.Supplierid).SingleOrDefaultAsync();
                    if (findinvoice is null)
                    {
                        return NotFound("Validation Error: Receiving transactions require a valid invoice to be provided.");
                    }
                }


                //       var existingInvoicesForSupplier = _context.Receivings
                //.Include(x => x.Porder)
                //.Where(x => x.Porder.Supplierid == porder.Supplierid &&
                //            x.Supinvno == newReceiving.Supinvno)
                //.ToList();



                //       if (existingInvoicesForSupplier != null)
                //       {
                //           if (existingInvoicesForSupplier.Count > 0) {
                //               var matchingInvoice = existingInvoicesForSupplier
                //            .FirstOrDefault(x => x.Supinvdate.Date == newReceiving.Supinvdate.Date);

                //               if (matchingInvoice != null)
                //               {

                //               }
                //               else //error - different dates supplied for the same invoice number
                //               {
                //                   // A receiving entry with the same supplier invoice number already exists for the given supplier

                //                   return NotFound("Validation Error: A receiving entry with the same supplier invoice number but with different date already exists. Invoice can only have one date.");

                //               }


                //           }


                //       }




                //if (newReceiving.Tenderid is not null)
                //{
                //    try
                //    {
                //        var task = _superHeroService.GetAllTenders(supid: newReceiving.Supplierid);
                //        var supplierActiveTenders = task.Result;

                //        if (supplierActiveTenders.Count(p => p.Id == newReceiving.Tenderid) <= 0)
                //        {
                //            return NotFound("Validation Error: Tender Given is not exist or is inactive, for given supplier in PO.");
                //        }
                //    }catch(Exception ex)
                //    {
                //        return NotFound("Validation Error: Tender Check");
                //    }

                //}


                foreach (var item in newReceiving.Receivinglines)
                {
                    if (item != null)
                    {
                        if (item.Unitpurcostprice < 0) { return NotFound("Validation Error: One or more lines have invoice unit cost that is invalid (negative)."); }
                        if (item.LinediscountPerc < 0) { return NotFound("Validation Error: One or more lines have discount that is invalid (negative)."); }
                        if (item.Qty <= 0) { return NotFound("Validation Error: One or more lines have a quantity that is invalid (less than or equal to zero)."); }
                        if (item.Lotid <= 0) { return NotFound("Validation Error: One or more lines have a lot that is invalid (less than or equal to zero)."); }
                        if (item.ReceivinglocId <= 0) { return NotFound("Validation Error: One or more lines have a receiving location that is invalid (less than or equal to zero)."); }

                        item.Originalpurcostpricebeforedisc = item.Unitpurcostprice;

                        if (item.Unitpurcostprice == 0)
                        {
                            item.LinediscountPerc = 0;
                        }



                        // Check if the discount percentage is greater than 0
                        if (item.LinediscountPerc > 0)
                        {
                            // Calculate the unit cost after applying the discount
                            item.Unitpurcostprice = item.Unitpurcostprice * (1 - (item.LinediscountPerc / 100));

                            // Ensure that the unit cost is not negative after discount
                            if (item.Unitpurcostprice < 0)
                            {
                                return NotFound("Validation Error: One or more lines have a negative unit cost after discount.");
                            }
                        }





                        if (!_context.Locations.Where(x => x.Id == item.ReceivinglocId).Any())
                        {
                            return NotFound("Validation Error: One or more lines have a receiving location that is invalid.");
                        }
                        if (!_context.Lots.Where(x => x.Id == item.Lotid).Any())
                        {
                            return NotFound("Validation Error: One or more lines have a lot that is invalid.");
                        }

                    }
                    else
                    {
                        return NotFound("Validation Error: One or more invalid lines have been provided.");
                    }
                }




                var result = await _superHeroService.AddSingleReceivingAsync(newReceiving, userId);


                if (result is not null)
                {
                    return Ok(result);
                }


            }
            return NotFound("Sorry, An error occurred while adding!");
        }


        public struct IdModel1
        {
            public int id { get; set; }
        }




    }
}