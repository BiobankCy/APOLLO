using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using System.Text.Json;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PordersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PordersController> _logger;
        private readonly IGlobalService _superHeroService;
        public PordersController(ILogger<PordersController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }




        [HttpGet("")]

        public async Task<ActionResult<List<CustomPurchaseOrder>>> GetAllPurchaseOrders()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            return await _superHeroService.GetAllPurchaseOrders();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomPurchaseOrder>> GetSinglePOrder(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            var retList = await _superHeroService.GetAllPurchaseOrders(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this request doesn't exist!");

            }

        }

        //public async Task<ActionResult<Porder>> GetSinglePOrder(int id)
        //{
        //    //  var product = await  _context.Products.FindAsync(id);
        //    var retList = await _superHeroService.GetAllPorders(id);
        //    if (retList.Count == 1)
        //    {
        //        var singlevalue = retList.SingleOrDefault();
        //        return singlevalue;
        //    }
        //    else
        //    {
        //        return NotFound("Sorry but this request doesn't exist!");

        //    }

        //}


        [HttpGet("readallstatuses")]

        public async Task<ActionResult<List<PordersStatus>>> GetPorderStatuses()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            return await _superHeroService.GetPorderStatuses();

        }

        [HttpGet("readlines/{orderid}")]

        public async Task<ActionResult<List<CustomPorderline>>> GetPorderLines(int orderid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            if (orderid > 0)
            {
                var retList = await _superHeroService.GetPorderLines(orderid);

                if (retList is not null)
                {
                    return retList;

                }

            }
            return NotFound("Sorry but this order id doesn't exist!");


        }



        [HttpGet("readalllinesforform/{porderid:int?}")]
        public async Task<ActionResult<List<CustomPurchaseOrderLine>>> Readalllinesforform(int? porderid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }


            var porderidTofilter = 0;

            try
            {
                if (porderid.HasValue && porderid > 0)
                {
                    porderidTofilter = _context.Porders.Where(c => c.Id == porderid).Single().Id;
                    if (porderidTofilter <= 0) { return NotFound("Purchase Order Not Found!"); }

                }
            }
            catch (Exception ex)
            {
                porderidTofilter = -1;
                return BadRequest(ex.Message);

            }


            try
            {
                var retList = await _superHeroService.GetAllCustomPurchaseOrderLines(porderidTofilter);

                return Ok(retList);


            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes


                return BadRequest(ex.Message);
            }
        }




        [HttpPut("SwitchToCancelledStatus")]
        public async Task<ActionResult<List<Customnewpurchaseorderlineview2>>> SwitchToCancelledStatus([FromBody] int orderId)
        {

            //var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            //var userId = userIdClaim?.Value;

            //if (string.IsNullOrEmpty(userId))
            //{
            //    return BadRequest("UserId not found.");
            //}

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            if (!await _superHeroService.IsUserAuthorizedToMakePO(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");

            }

            if (orderId <= 0) { return NotFound("Sorry, Order ID Not Given!"); }


            try
            {
                var POStatusIdForCancelled = _context.PordersStatuses
                    .Where(x => x.Name.ToLower() == "cancelled".ToLower())
                    .Single().Id;

                var foundporderhead = await _context.Porders.FindAsync(orderId);

                if (foundporderhead is null)
                {
                    return NotFound("Sorry, Order Not Found!");
                }

                if (foundporderhead.Statusid == POStatusIdForCancelled)
                {
                    return NotFound($"Sorry, Order is already cancelled! (#{orderId})!");
                }

                var orderLines = await _superHeroService.GetAllCustomPurchaseOrderLines(foundporderhead.Id);

                if (orderLines.Count > 0 && orderLines.All(line => line.Dynamiclinestatus.ToLower() == "Pending".ToLower()))
                {
                    // All lines have "Dynamiclinestatus" equal to "Pending," proceed 

                    //foundporderhead.Statusid = POStatusIdForCancelled;

                    //   await _context.SaveChangesAsync();

                    await _context.Database.ExecuteSqlInterpolatedAsync($"UPDATE porders SET Statusid ={POStatusIdForCancelled}   WHERE Id = {orderId}");

                    // Reload the entity to reflect the changes made by the SQL query
                    //  _context.Entry(foundporderhead).Reload(); //removed 06022024
                    // var retList = await _superHeroService.GetAllCustomPurchaseOrderLines(foundporderhead.Id);
                    var retList = await ReadalllinesforformNEW(foundporderhead.Id);
                    // Reuse logic from ReadalllinesforformNEW
                    return retList;
                }
                else
                {
                    // Not all lines have "Dynamiclinestatus" equal to "Pending," return an error
                    return NotFound($"Sorry, we cannot proceed with the order cancellation (#{foundporderhead.Id}) because some order lines have not 'Pending' status.");
                }
            }
            catch (Exception ex)
            {
                return NotFound($"Sorry, An error occurred while cancelling the order (#{orderId})!" + ex.ToString());
            }
        }


        [HttpGet("readalllinesforformnew/{porderid:int?}")]
        public async Task<ActionResult<List<Customnewpurchaseorderlineview2>>> ReadalllinesforformNEW(int? porderid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            var porderidTofilter = 0;

            try
            {
                if (porderid.HasValue && porderid > 0)
                {
                    porderidTofilter = _context.Porders
                        .Where(c => c.Id == porderid)
                        .SingleOrDefault()?.Id ?? 0;

                    if (porderidTofilter <= 0)
                    {
                        return NotFound("Purchase Order Not Found!");
                    }
                }
            }
            catch (Exception ex)
            {
                porderidTofilter = -1;
                return BadRequest(ex.Message);
            }

            try
            {
                var whereClause = porderidTofilter > 0 ? "WHERE orderid = @porderid" : "";

                var ordersResult = await _context.Customnewpurchaseorderlineviews
      .FromSqlRaw($@"
        -- raw SQL query
        SELECT 
            *
        FROM 
            CustomNEWPurchaseOrderLineView  {whereClause} order by orderid desc
       ;
    ", new MySqlParameter("porderid", porderidTofilter))
      .ToListAsync();






                var requestLineIds = ordersResult.Select(item => item.Reqlineid).ToList();

                var decisionHistories = await _context.Requestdecisionhistories
                    .Include(d => d.Decision)
                    .Include(d => d.Madebyuser)
                    .Where(d => requestLineIds.Contains(d.Reqlineid))
                    .OrderByDescending(d => d.Decisiondatetime)
                    .ToListAsync();

                List<Customnewpurchaseorderlineview2> transfdata = ordersResult
                    .Select(item =>
                    {
                        var transfItem = new Customnewpurchaseorderlineview2();
                        var properties = typeof(Customnewpurchaseorderlineview).GetProperties();

                        foreach (var property in properties)
                        {
                            var value = property.GetValue(item);
                            property.SetValue(transfItem, value);
                        }
                        if (item.PrimersData is not null)
                        {
                            transfItem.Primers = JsonSerializer.Deserialize<List<Primer>>(item.PrimersData);
                        }


                        transfItem.LinelastDecision = decisionHistories
                            .FirstOrDefault(d => d.Reqlineid == item.Reqlineid);

                        if (transfItem.LinelastDecision is not null)
                        {
                            transfItem.LinelastDecision.Madebyuser.InverseApproverU = null;
                            transfItem.LinelastDecision.Madebyuser.ApproverU = null;
                            transfItem.LinelastDecision.Madebyuser.Requests = null;
                            transfItem.LinelastDecision.Madebyuser.Pickings = null;
                            transfItem.LinelastDecision.Madebyuser.Requestdecisionhistories = null;
                            transfItem.LinelastDecision.Reqline = null;
                            transfItem.LinelastDecision.Decision.Requestdecisionhistories = null;
                        }


                        //fill porder header for each poline
                        transfItem.Pord = new CustomPurchaseOrder();
                        transfItem.Pord.Id = transfItem.Orderid;
                        transfItem.Pord.Statusid = transfItem.Statusid ?? 0;
                        transfItem.Pord.Supplierid = transfItem.Supplierid;
                        transfItem.Pord.SupName = transfItem.SupplierName;
                        transfItem.Pord.StatusName = transfItem.Orderstatus ?? "Unknown";
                        transfItem.Pord.Createdbyempid = transfItem.Orderbyuid ?? 0;
                        transfItem.Pord.Ordercreateddate = transfItem.Ordercreateddate;
                        transfItem.Pord.Podate = DateOnly.FromDateTime(transfItem.Ordercreateddate);
                        transfItem.Pord.Duedate = transfItem.Duedate;
                        transfItem.Pord.Sentdate = transfItem.Posentdate;
                        transfItem.Pord.Sentbyempid = transfItem.Posentbyempid;
                        transfItem.Pord.Supplier = new Supplier();
                        transfItem.Pord.Supplier.Worknumber = transfItem.Supworknumber ?? "";
                        var usersentpo = _context.Users.FindAsync(transfItem.Posentbyempid).Result;
                        if (usersentpo != null)
                        {
                            transfItem.Pord.sentbyuserfullname = usersentpo.FirstName + ' ' + usersentpo.LastName;
                        }
                        //var supplier = _context.Suppliers.FindAsync(transfItem.Supplierid).Result;
                        // if (supplier != null)
                        // {
                        //     transfItem.Pord.Supplier.Worknumber = supplier.Worknumber;
                        // }

                        //fill related receivinglines for each poline/product

                        transfItem.Receivings = new List<CustomReceiving>();
                        var getList = from m1 in _context.Receivings.Include(x => x.Receivinglines).Include(x => x.Invoice)
                                      where m1.PorderId == transfItem.Orderid
                                      select new Receiving
                                      {
                                          Id = m1.Id,
                                          PorderId = m1.PorderId,

                                          Byuser = m1.Byuser,
                                          ByuserId = m1.ByuserId,
                                          //Supinvno = m1.Invoice.Supinvno,
                                          //SupInvShippingAndHandlingCost =m1.SupInvShippingAndHandlingCost,
                                          //VatId=m1.VatId,
                                          Invoice = m1.Invoice,

                                          InvoiceId = m1.InvoiceId,
                                          // Vat =m1.Vat,
                                          // include only the matching Receivinglines
                                          Receivedatetime = m1.Receivedatetime,
                                          Receivinglines = m1.Receivinglines.Where(rl => rl.PolineId == transfItem.Lineid && rl.Productid == transfItem.Productid).ToList(),


                                      };



                        var xxx = new Vatrate();
                        xxx.Id = 0;
                        xxx.Rate = 0;


                        foreach (var receiveingheader in getList.ToList())
                        {
                            //var a = receiveingheader.Invoice;
                            //if (a is not null) { a.Invoiceimage = null; receiveingheader.Invoice = a; }  

                            var customReceivingHeader = new CustomReceiving
                            {
                                ByuserId = receiveingheader.ByuserId,

                                Id = receiveingheader.Id,
                                PorderId = receiveingheader.PorderId,
                                Receivedatetime = receiveingheader.Receivedatetime,
                                Invoice = receiveingheader.Invoice,
                                InvoiceId = receiveingheader.InvoiceId ?? 0,

                                Receivinglines = receiveingheader.Receivinglines.Select(rl => new CustomReceivingline
                                {
                                    Id = rl.Id,
                                    ReceivingId = rl.ReceivingId,
                                    Productid = rl.Productid,
                                    Qty = rl.Qty,
                                    Unitpurcostprice = rl.Unitpurcostprice,
                                    ReceivinglocId = rl.ReceivinglocId,
                                    Lotid = rl.Lotid,
                                    Vatindex = rl.Vatindex,
                                    Conditionstatus = rl.Conditionstatus,
                                    notesaboutconditionstatus = rl.Notesaboutconditionstatus,
                                    PolineId = rl.PolineId,
                                    VatindexNavigation = xxx,
                                    Product = null,
                                }).ToList()
                            };

                            if (customReceivingHeader.Receivinglines is not null && customReceivingHeader.Receivinglines.Count > 0)
                            {

                                transfItem.Receivings.Add(customReceivingHeader);
                                //newporderLine.Receivings.Add(customReceivingHeader);
                            }



                        }
                        //end of filling receivings

                        return transfItem;
                    })
                    .ToList();

                return Ok(transfdata);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }





        [HttpPut("SwitchClosedStatus")]
        public async Task<ActionResult<List<Customnewpurchaseorderlineview2>>> SwitchClosedStatus([FromBody] int orderlineid)
        {

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            if (!await _superHeroService.IsUserAuthorizedToMakePO(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");

            }

            if (orderlineid <= 0) { return NotFound("Sorry, Order Line Not Found!"); }

            //var userId = _superHeroService.LoggedInUserID(User);

            try
            {
                var foundporderLine = await _context.Porderlines.Where(xx => xx.Id == orderlineid).SingleAsync();

                if (foundporderLine is not null)
                {
                    //     var POStatusIdForNEW = _context.PordersStatuses.Where(x => x.Name.ToLower() == "new".ToLower()).Single().Id;
                    //   var POStatusIdForSent = _context.PordersStatuses.Where(x => x.Name.ToLower() == "sent".ToLower()).Single().Id;

                    foundporderLine.ClosedFlag = !foundporderLine.ClosedFlag;
                    _context.Entry(foundporderLine).State = EntityState.Modified;
                    _context.SaveChanges();

                    // var retList = await _superHeroService.GetAllCustomPurchaseOrderLines(foundporderLine.Pordid);
                    // var retList = await ReadalllinesforformNEW(foundporderLine.Pordid);
                    //   var retList = new List<Customnewpurchaseorderlineview2>();
                    // Check if retList is not null and has any items


                    var retList = await ReadalllinesforformNEW(foundporderLine.Pordid);
                    return retList;



                }
                else
                {
                    return NotFound("Sorry, Order Line Not Found!");
                }



            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }


        [HttpGet("Relatedinvoices/{porderid:int}")]


        public async Task<ActionResult<CustomPurchaserderWithSupplierInvoices>> GetSinglePOById(int porderid)
        {

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            var returnOrder = await _superHeroService.GetAllCustomPorderRelatedSupplierInvoices(porderid);
            if (returnOrder is not null)
            {
                return returnOrder;
            }
            else
            {
                return NotFound("Sorry but this order doesn't exist!");

            }

        }

        [HttpPut("Add")]
        public async Task<ActionResult<Porder>> AddPorder([FromBody] Porder newPorder)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            if (!await _superHeroService.IsUserAuthorizedToMakePO(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }


            if (userId > 0)
            {
                newPorder.Createdbyempid = userId;
                newPorder.Id = 0;
                //     newPorder.Supplier = new Supplier();
                newPorder.Ordercreateddate = DateTime.Now;
                // newPorder.Podate = DateOnly.FromDateTime(DateTime.Now);
                // newPorder.Duedate = DateOnly.FromDateTime(DateTime.Now);
                // newPorder.Statusid = 1;



                if (newPorder.Porderlines.Count <= 0) { return NotFound("Validation Error: The purchase order does not contain any lines."); }
                if (newPorder.Supplierid <= 0) { return NotFound("Validation Error: The purchase order has no specified supplier."); }

                if (newPorder.Tenderid is not null)
                {


                    try
                    {
                        var task = _superHeroService.GetAllTenders(supid: newPorder.Supplierid);
                        var supplierActiveTenders = task.Result;

                        if (supplierActiveTenders.Count(p => p.Id == newPorder.Tenderid) <= 0)
                        {
                            return NotFound("Validation Error: The tender number provided for that purchase order (supplier) either does not exist or is inactive.");
                        }

                        //    newPorder.Tender = supplierActiveTenders.Where(x => x.Id == newPorder.Tenderid).FirstOrDefault();


                        //  newPorder.Tender = _context.Tenders.Where(x=>x.Id == newPorder.Tenderid).FirstOrDefault();
                    }
                    catch (Exception ex)
                    {
                        return NotFound("Validation Error: Tender Check");
                    }


                }




                foreach (var orderRow in newPorder.Porderlines)
                {
                    if (orderRow == null)
                    {
                        return NotFound("Validation Error: You cant place null order line!");
                    }
                    if (orderRow.Qty <= 0)
                    {
                        return NotFound("Validation Error: One or more lines have a quantity that is invalid (less than or equal to zero).");
                    }
                }

                var duplicateRequestLineIds = newPorder.Porderlines
    .Where(orderRow => orderRow != null && orderRow.Requestlineid != null) // Added condition to ignore null Requestlineids
    .GroupBy(orderRow => orderRow.Requestlineid)
    .Where(group => group.Count() > 1)
    .Select(group => group.Key)
    .ToList();

                if (duplicateRequestLineIds.Count > 0)
                {
                    // Handle the case where duplicate Requestlineids exist
                    return NotFound("Validation Error: You can't place the same request more than once in the order!");
                }

                //   var duplicateRequestLineIds = newPorder.Porderlines
                //.Where(orderRow => orderRow != null)
                //.GroupBy(orderRow => orderRow.Requestlineid)
                //.Where(group => group.Count() > 1)
                //.Select(group => group.Key)
                //.ToList();

                //   if (duplicateRequestLineIds.Count > 0)
                //   {
                //       // Handle the case where duplicate Requestlineids exist
                //       return NotFound("Validation Error: You cant place the same request more than once in the order!");
                //   }

                foreach (var orderRow in newPorder.Porderlines)
                {
                    // New check 16/11/2023 - order items belong only to the given supplier

                    var product = _context.Products.FirstOrDefault(x => x.Id == orderRow.Productid);

                    if (product != null)
                    {
                        var itemDefaultSupplierId = product.DefaultSupplierId;

                        if (itemDefaultSupplierId > 0)
                        {
                            if (itemDefaultSupplierId != newPorder.Supplierid)
                            {
                                return NotFound($"Validation Error: The supplier for the ordered item (Product Code: {product.Code}) does not match the order supplier.");
                            }
                        }
                        else
                        {
                            return NotFound($"Validation Error: The default supplier is not set for the ordered item (Product Code: {product.Code}). Please contact support.");
                        }
                    }
                    else
                    {
                        return NotFound($"Validation Error: The product with ID {orderRow.Productid} could not be found in the system. Please check the product details.");
                    }

                    //end of new check

                    if (orderRow.Requestlineid > 0)
                    {

                        var reqLine = _context.Requestlines
    .Include(x => x.Requestdecisionhistories) // Include the collection of decision histories
    .ThenInclude(x => x.Decision) // Include the Decision object in each history
    .Where(x => x.Id == orderRow.Requestlineid)
    .SingleOrDefault();

                        // Get the latest decision history (if any)
                        var latestDecisionHistory = reqLine.Requestdecisionhistories
                            .OrderByDescending(x => x.Decisiondatetime)
                            .FirstOrDefault();

                        if (latestDecisionHistory == null || latestDecisionHistory.Decision.Name.ToLower() != "approved".ToLower())
                        {
                            return NotFound("Validation Error: There are request lines that have not been approved or have already been processed.");
                        }

                        if (_context.Porderlines.Any(x => x.Requestlineid == orderRow.Requestlineid))
                        {
                            return NotFound("Validation Error: One or more request lines have been processed and ordered from the supplier.");
                        }

                        //var reqLine = _context.Requestlines.Include(x => x.CurrentDecision).Where(x => x.Id == orderRow.Requestlineid).Single();

                        //if (reqLine.CurrentDecision.Name.ToLower() != "approved".ToLower())
                        //{
                        //    return NotFound("Validation Error: There are request lines that have not been approved or have already been processed.");
                        //}

                        //if (_context.Porderlines.Where(x => x.Requestlineid == orderRow.Requestlineid).Any())
                        //{
                        //    return NotFound("Validation Error: One or more request lines have been processed and ordered from the supplier.");
                        //}

                        //var totalQtyOrderedForReqLineInHistory = await _context.Porderlines
                        //           .Where(pl => pl.Requestlineid == orderRow.Requestlineid)
                        //           .SumAsync(pl => pl.Qty);

                        if (orderRow.Qty > reqLine.Qty)
                        {
                            return NotFound("Validation Error: You cannot order a quantity greater than the approved request quantity.");
                        }


                    }
                }

                var countInactiveCodes = newPorder.Porderlines.Count(item =>
                   item != null && _context.Products.Any(xx => xx.Id == item.Productid && xx.ActivestatusFlag == false)
               );

                if (countInactiveCodes > 0)
                {
                    return NotFound("Validation Error: One or More Products are currently inactive. Please review your product selection and ensure all chosen products are active.");
                }


                var result = await _superHeroService.AddSinglePOrderAsync(newPorder);

                if (result is not null)
                {

                    return Ok(result);
                }


            }
            return NotFound("Sorry, An error occurred while adding!");
        }


        public struct IdModel
        {
            public int id { get; set; }
        }




        [HttpGet("sendordertosupplier/{orderid}")]

        public async Task<ActionResult<MyCustomReturnType>> SendOrderByEmail(int orderid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            if (!await _superHeroService.IsUserAuthorizedToMakePO(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }


            if (orderid > 0)
            {
                //var poorderfound = _context.Porders.Include(x => x.Supplier).Include(x => x.Tender).Include(x => x.Porderlines).Where(x => x.Id == orderid).Single();

                var poorderfound = _context.Porders
               .Include(x => x.Supplier)
               .ThenInclude(supplier => supplier.Contactsofsuppliers
               .Where(contact => contact.Cconpurchaseorder && contact.Activestatusflag))
               .Include(x => x.Tender)
               .Include(x => x.Porderlines)
               .Where(x => x.Id == orderid)
               .Single();


                if (poorderfound is not null)
                {

                    //supplier email is valid?
                    try
                    {
                        bool isValidEmail = EmailValidator.IsValidEmail(poorderfound.Supplier.Email);
                        if (!isValidEmail)
                        {

                            MyCustomReturnType errormessage = new MyCustomReturnType();
                            errormessage.result = false;
                            errormessage.message = "Invalid Supplier Email. Cannot send order via email.";
                            return errormessage;
                        }

                    }
                    catch (Exception ex)
                    {
                        MyCustomReturnType errormessage = new MyCustomReturnType();
                        errormessage.result = false;
                        errormessage.message = "Invalid Supplier Email. Cannot send order via email." + ex.Message.ToString();
                        return errormessage;
                    }


                    var htmlemailtemplate3 =
                        "<!DOCTYPE html>" +
                        "<html><head> " +
                        " <title>Purchase Order</title>  " +
                        "<style>   body {  font-family: Arial, sans-serif; margin: 0;  padding: 0;  }   " +
                        " .container {  max-width: 600px;  margin: 0 auto;   padding: 20px; }  h1 {   color: #333;  margin-top: 0; } " +
                        "  p {  margin: 15; }   table {   width: 100%; border-collapse: collapse; } th, td { padding: 10px;\r\n      border: 1px solid #ddd; }" +
                        "</style></head>" +
                        "<body>" +
                        " <div class=\"container\"> " +
                        "<h3>Order Number [ponumberid]</h3>" +

                        "  <p>Dear [supname],<br></p>  " +
                        "   <p>We would like to place an order for the following:</p> " +

                        "" +
                        "  <table> " +
                        "  <thead>    " +
                        "  <tr>    " +
                        "  <th>Item Code</th> " +
                          "<th>Item Description</th> " +
                        "  <th>Quantity</th> " +
                        "  <th>Unit Price</th>  " +
                         " <th>Total</th>    " +

                        "    </tr>     </thead>   <tbody> " +


                        "  [orderlines]" +
                        " </tbody> </table> " +
                        "   " +
                        " [tendernotes] <br>" +
                        "   <p>[AutomaticEmail]</p> " +

                        " <p>[footerream]</p> " +
                        "</div>" +
                        "</body></html>";





                    var htmlemailtemplateChoosed = htmlemailtemplate3;

                    string recipientName = poorderfound.Supplier.Name ?? "";
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[supname]", recipientName);

                    string orderlines = " ";


                    foreach (var line in poorderfound.Porderlines)
                    {
                        _context.Entry(line).Reference(x => x.Product).Load();
                        var productName = !string.IsNullOrEmpty(line.Product?.Name) ? line.Product.Name : "N/A";
                        var itemcode = !string.IsNullOrEmpty(line.Product?.Code) ? line.Product.Code : "N/A";

                        _context.Entry(line).Reference(x => x.Requestline).Load();

                        if (line.Requestline != null)
                        {
                            _context.Entry(line.Requestline).Collection(x => x.Primers).Load();

                        }


                        string primerInfo = "";
                        if (line.Requestline?.Primers != null && line.Requestline.Primers.Count > 0)
                        {
                            primerInfo = $"<br><br>Primer List:<br><br>";
                            foreach (var primer in line.Requestline.Primers)
                            {
                                primerInfo += $"SI: {primer.SequenceIdentifier}<br>NS: {primer.NucleotideSequence}<hr>";
                            }
                        }

                        orderlines += "<tr> " +
                            " <td> " + itemcode + "</td> " +
                            " <td> " +
                            productName + "" +
                            primerInfo +
                            "</td> " +
                            " <td style=\"text-align: center;\">" + line.Qty + "</td> " +
                            " <td style=\"text-align: right;\">" + Math.Round(line.Unitpurcostprice, 2) + "</td> " +
                            " <td style=\"text-align: right;\">" + Math.Round(Math.Round(line.Unitpurcostprice, 2) * line.Qty, 2).ToString() + "</td>" +
                            " </tr> ";
                    }



                    var tendernote = "<br><p>Notes:" +
    "<ol>" +
    "<li>Prices do not include VAT (Value Added Tax).</li> " +
    (poorderfound.Tender?.Tendercode is not null ? "<li> Please include " + poorderfound.Tender?.Tendercode.ToUpper() + " on the invoice.</li> " : "") +
    "<li> [Shipping]</li> " +
    "<li> [Billing]</li> " +
    "</ol>\r\n" +
    "</p>";

                    var shippingaddress = "Shipping address:<br>" +
                   "MMRC<br>" +
                   "Shacolas Educational Centre for Clinical Medicine<br>" +
                   "Palaios dromos Lefkosias Lemesou No.215 / 6<br>" +
                   "Aglantzia<br>" +
                   "Nicosia 2029<br>" +
                   "Cyprus<br>";

                    var billingaddress = " Billing address:<br>" +
                        "University of Cyprus<br>" +
                        "1 Panepistimiou Avenue<br>" +
                        "Nicosia 2109<br>" +
                        "Cyprus<br>";


                    var automaticemailwarning = "This is an automatically generated email from an unattended mailbox. Please do not reply to this email. If you need any further information," +
                        " please feel free to contact me at [useremailaddress].";


                    var getAppSettings = _context.Appsettings.AsNoTracking().Single();
                    var loggedinuser = _context.Users.Include(x => x.JobRole).Include(x => x.Role).Where(x => x.Id == userId).AsNoTracking().Single();

                    var usersignature = "<br><br>Thank you,<br><br>" + "\n"
                    + loggedinuser.FirstName + " " + loggedinuser.LastName + " <br>" + loggedinuser.JobRole.RoleName + " <br><br>" +
                     "<a href='" + getAppSettings.CompanyWebsiteLink + "'>" + getAppSettings.CompanyName + "</a>" +
                     " Center of Excellence in Biobanking and Biomedical Research<br>" +
                      "<a href='https://www.facebook.com/Biobank.cy'>Facebook</a>" +
                     " │ " +
                       "<a href='https://twitter.com/Biobank_cy'>Twitter</a>" +
                     " │ " +
                        "<a href='https://www.linkedin.com/company/cy-biobank'>LinkedIn</a>" +
                     " │ " +
                    "<a href='https://www.youtube.com/@biobankcy'>YouTube</a>" +
                     "<br>" +
                     "(+357) 22892819 │ (+357) 22892815 │ 7777 1838";


                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[orderlines]", orderlines);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[notes]", "Notes: " + poorderfound.Notes ?? "" + "");
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[ponumberid]", poorderfound.Id.ToString() ?? "");
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[tendernotes]", tendernote);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[datehore]", poorderfound.Ordercreateddate.ToShortDateString());
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[Shipping]", shippingaddress);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[Billing]", billingaddress);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[AutomaticEmail]", automaticemailwarning);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[useremailaddress]", loggedinuser.Email);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[footerream]", usersignature);




                    string? attachmentfilename = null;
                    byte[]? attachmentdata = null;

                    if (poorderfound.Supplier.ExcelattachmentinemailorderFlag)
                    {
                        var excelGenerator = new ExcelGenerator();
                        attachmentdata = excelGenerator.CreateExcelFileForOrder(poorderfound);
                        attachmentfilename = "order.xlsx";
                        // Create an attachment for the Excel file
                        //var attachment = new MimePart()
                        //{
                        //    Content = new MimeContent(new MemoryStream(excelData), ContentEncoding.Default),
                        //    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                        //    ContentTransferEncoding = ContentEncoding.Base64,
                        //    FileName = "attachment_filename.xlsx" // You can specify the desired file name here
                        //};

                    }

                    var supplieremail = poorderfound.Supplier.Email;

                    var customcccontanctsofsupplier = "";



                    try
                    {
                        if (poorderfound.Supplier.Contactsofsuppliers.Count > 0)
                        {
                            // Use LINQ to filter and concatenate the valid email addresses of contacts
                            var emails = poorderfound.Supplier.Contactsofsuppliers
                                .Where(contact => contact.Cconpurchaseorder && contact.Activestatusflag)
                                .Select(contact => contact.Email)
                                .Where(email => EmailValidator.IsValidEmail(email)) // Filter valid email addresses
                                .ToList();

                            // Join the email addresses with a comma 
                            customcccontanctsofsupplier = string.Join(",", emails);
                        }
                    }
                    catch (Exception ex)
                    {
                        // Handle exceptions as needed
                    }

                    customcccontanctsofsupplier = customcccontanctsofsupplier.ToLower();

                    var sendemail = await _superHeroService.SendEmailCustom(supplieremail.ToLower(), getAppSettings.OrderEmailSubject, htmlemailtemplateChoosed, false, false, true, customcccontanctsofsupplier, attachmentdata, attachmentfilename);

                    if (sendemail != null)
                    {
                        if (sendemail.result)
                        {
                            poorderfound.Sentdate = DateTime.Now;
                            poorderfound.Sentbyempid = userId;



                            _context.Entry(poorderfound).State = EntityState.Modified;
                            _context.SaveChanges();
                        }
                    }


                    return sendemail;


                }


            }


            return NotFound("Sorry but this order id doesn't exist!");


        }

        [HttpGet("markassent/{orderid}")]

        public async Task<ActionResult<MyCustomReturnType>> MarkOrderAsSent(int orderid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            var result = new MyCustomReturnType();
            result.result = false;
            result.message = "General Error";

            if (!await _superHeroService.IsUserAuthorizedToMakePO(userId))
            {
                result.message = "You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.";
                return Ok(result);
                //return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            try
            {
                //var userId = _superHeroService.LoggedInUserID(User);

                if (orderid > 0)
                {
                    var poorderfound = _context.Porders.Include(x => x.Supplier).Include(x => x.Tender).Include(x => x.Porderlines).Where(x => x.Id == orderid).Single();

                    if (poorderfound is not null)
                    {


                        var getAppSettings = _context.Appsettings.AsNoTracking().Single();
                        var loggedinuser = _context.Users.Include(x => x.JobRole).Include(x => x.Role).Where(x => x.Id == userId).AsNoTracking().Single();

                        poorderfound.Sentdate = DateTime.Now;
                        poorderfound.Sentbyempid = userId;



                        _context.Entry(poorderfound).State = EntityState.Modified;
                        _context.SaveChanges();
                        result.result = true;
                        result.message = "Success";

                    }
                }
                else
                {
                    result.message = "Sorry but this order id doesn't exist!";
                    //   return NotFound("Sorry but this order id doesn't exist!");
                }
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
            }



            return Ok(result);


        }



    }
}