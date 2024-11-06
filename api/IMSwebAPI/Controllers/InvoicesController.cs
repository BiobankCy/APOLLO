using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<InvoicesController> _logger;
        private readonly IGlobalService _superHeroService;
        public InvoicesController(ILogger<InvoicesController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<SupplierInvoice>>> GetInvoices()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            return await _superHeroService.GetInvoices();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<SupplierInvoice>> GetSingleInvoice(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            var retList = await _superHeroService.GetInvoices(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this invoice doesn't exist!");

            }

        }

        [HttpPut("UpdateInvoice")]
        public async Task<ActionResult<CustomSupplierInvoiceModel>> UpdateInvoice([FromBody] EditSupplierInvoiceModel data)
        {



            try
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


                //var loggedinuser = await _context.Users.Where(xx => xx.Id == userId && xx.ClaimCanMakePo && !xx.LockoutFlag).SingleOrDefaultAsync();
                //if (loggedinuser is null) { return Unauthorized("Unauthorized"); }

                if (data.invoiceid <= 0) { return NotFound("Sorry, Invoice Not Found!"); }
                if (data.shippingandhandlingcostvatindex <= 0) { return NotFound("Sorry, Vat Not Given!"); }
                if (data.shippingandhandlingcostexcludingvat < 0) { return NotFound("Sorry, Shipping cost Not Given!"); }

                var dbinvoice = await _context.SupplierInvoices.FindAsync(data.invoiceid);

                if (dbinvoice == null)
                {
                    return NotFound("Sorry but this invoice doesn't exist!");
                }

                var vatidfound = await _context.Vatrates.Where(xx => xx.Id == data.shippingandhandlingcostvatindex).SingleOrDefaultAsync();

                if (vatidfound is null) { return NotFound("Sorry but this vat rate doesn't exist!"); }

                dbinvoice.SupInvShippingAndHandlingCost = data.shippingandhandlingcostexcludingvat;
                dbinvoice.VatId = data.shippingandhandlingcostvatindex;


                await _context.SaveChangesAsync();

                //Relatedinvoices for orderid

                var returnInvoice = await _superHeroService.GetSupplierInvoiceNew(data.invoiceid);

                if (returnInvoice is null)
                {
                    return Ok(new CustomSupplierInvoiceModel());
                }
                else
                {
                    return Ok(returnInvoice);
                }



            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }



        }

        //[HttpGet("ForASupplierInvoicesWithAmounts/{supplierid}")]
        //public async Task<ActionResult<List<CustomSupplierInvoiceModel>>> ForASupplierInvoicesWithAmounts(int supplierid)
        //{

        //    var  result = new List<CustomSupplierInvoiceModel>();   

        //    try
        //    {
        //        var userId = _superHeroService.LoggedInUserID(User);

        //        if (userId <= 0)
        //        {
        //            return Unauthorized("Unauthorized!");
        //        }
        //        var loggedinuser = await _context.Users.Where(xx => xx.Id == userId && xx.ClaimCanMakePo && !xx.LockoutFlag).SingleOrDefaultAsync();
        //        if (loggedinuser is null) { return Unauthorized("Unauthorized"); }

        //        if (supplierid <= 0) { return NotFound("Sorry, Supplier Not Given!"); }


        //        var dbinvoices = await _context.SupplierInvoices.Where(x => x.Supid == supplierid).ToListAsync();

        //        if (dbinvoices == null)
        //        {
        //            return NotFound("Sorry, invoices not found!");
        //        }


        //        var invoiceIds = dbinvoices.Select(inv => inv.Id).Distinct();

        //        foreach (var invoiceId in invoiceIds)
        //        {

        //            if (invoiceId > 0)
        //            {
        //                var returnInvoice = await _superHeroService.GetSupplierInvoiceNew(invoiceId);

        //                if (returnInvoice is not null)
        //                {
        //                    result.Add(returnInvoice);  
        //                }


        //            }


        //        }
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
        //    }



        //}

        [HttpGet("ForASupplierInvoicesWithoutAmounts/{supplierid}")]
        public async Task<ActionResult<List<SupplierInvoice>>> ForASupplierInvoicesWithoutAmounts(int supplierid)
        {

            try
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

                if (supplierid <= 0) { return NotFound("Sorry, Supplier Not Given!"); }


                var dbinvoices = await _context.SupplierInvoices.Where(x => x.Supid == supplierid).ToListAsync();

                if (dbinvoices == null)
                {
                    return NotFound("Sorry, invoices not found!");
                }
                else
                {
                    return dbinvoices;
                }

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }



        }


        [HttpPut("Add")] //formData with attachment!
        public async Task<ActionResult<SupplierInvoice>> AddNewInvoice()
        {
            try
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


                var x = new SupplierInvoice();

                var form = await Request.ReadFormAsync();

                // Populate newInvoice properties from form data

                int.TryParse(form["orderid"], out int orderid);


                if (orderid > 0)
                {
                    var findtheorder = await _context.Porders.FindAsync(orderid);
                    if (findtheorder is not null)
                    {
                        x.Supid = findtheorder.Supplierid;
                    }
                    else
                    {
                        return BadRequest("Invalid Order Id");
                    }

                }
                else
                {
                    int.TryParse(form["supid"], out int supid);
                    x.Supid = supid;

                }

                if (x.Supid <= 0) { return BadRequest("Invalid Supplier Id"); }

                x.Supinvno = form["supinvno"];
                decimal.TryParse(form["supInvShippingAndHandlingCost"], out decimal supInvShippingAndHandlingCost);
                x.SupInvShippingAndHandlingCost = supInvShippingAndHandlingCost;

                int.TryParse(form["vatId"], out int vatId);
                if (vatId > 0)
                {
                    var findthevatindex = await _context.Vatrates.FindAsync(vatId);
                    if (findthevatindex is not null)
                    {
                        x.VatId = findthevatindex.Id;
                    }
                    else
                    {
                        return BadRequest("Invalid Vat Id");
                    }
                }
                else
                {
                    vatId = 0;
                }

                if (x.SupInvShippingAndHandlingCost > 0 && vatId <= 0)
                {
                    return BadRequest("Invalid Vat Id");
                }

                if (vatId > 0)
                {
                    x.VatId = vatId;
                }
                else
                {
                    x.VatId = null;
                }

                x.Attachment = null;
                x.Id = 0;


                DateTime.TryParse(form["supinvdate"], out DateTime supinvdate);
                //x.Supinvdate = supinvdate;

                x.Supinvdate = supinvdate.ToUniversalTime(); //3 hours earlier issue.

                int.TryParse(form["attachmentid"], out int attachmentid);
                if (attachmentid > 0)
                {
                    x.Attachmentid = attachmentid;
                    x.Attachment = null;
                }
                else
                {
                    var file = form.Files.GetFile("attachmentfile");
                    if (file != null && file.Length > 0)
                    {
                        // Set a maximum file size limit for image uploads (2 MB)
                        if (file.Length > 2 * 1024 * 1024)
                        {
                            return BadRequest("Attachment File size exceeds the allowed limit (2 MB)");
                        }

                        using (var memoryStream = new MemoryStream())
                        {
                            await file.CopyToAsync(memoryStream);

                            var newAttachmentToInsert = new AttachmentFile
                            {
                                File = memoryStream.ToArray(),
                                Lastuploadbyuid = userId,
                                Lastupdate = DateTime.Now
                            };

                            x.Attachmentid = null;
                            x.Attachment = newAttachmentToInsert;
                        }
                    }
                }

                _context.SupplierInvoices.Add(x);

                await _context.SaveChangesAsync();

                x.Attachment = null;
                if (x.VatId is null)
                {
                    x.VatId = 0;
                }
                return Ok(x);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }




        [HttpGet("Relatedinvoices/{porderid:int}")]
        public async Task<ActionResult<CustomPurchaserderWithSupplierInvoices>> GetRelatedInvoices(int porderid)
        {
            try
            {

                var userId = _superHeroService.LoggedInUserID(User);
                if (userId <= 0)
                {
                    return Unauthorized("Unauthorized!");

                }


                var invoices = await _superHeroService.GetRelatedInvoicesNEW(porderid);

                if (invoices is not null)
                {
                    return Ok(invoices);
                }
                else
                {
                    return NotFound("No related invoices found for this order.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
        [HttpDelete("Attachment/Delete")]
        public async Task<IActionResult> DeleteDocument([FromBody] int invoiceId)
        {



            try
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


                var dbinvoice = await _context.SupplierInvoices.FindAsync(invoiceId);

                if (dbinvoice == null)
                {
                    return NotFound("Invoice not found");
                }



                if (dbinvoice.Attachmentid != null)
                {
                    // invoices already have an attachment, so delete the existing attachment from the attachments table

                    var existingAttachment = await _context.AttachmentFiles.FindAsync(dbinvoice.Attachmentid);
                    dbinvoice.Attachmentid = null;
                    if (existingAttachment is not null)
                    {
                        _context.AttachmentFiles.Remove(existingAttachment);
                    }
                }

                //  dbinvoice.Attachmentid = null;
                //  dbinvoice.Attachment = newAttachmentToInsert;



                await _context.SaveChangesAsync();

                return Ok("Invoice document deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpPost("Attachment/Upload/{invoiceId:int}")]
        public async Task<IActionResult> UploadDocument(int invoiceId, IFormFile file)
        {
            try
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

                var dbinvoice = await _context.SupplierInvoices.FindAsync(invoiceId);

                if (dbinvoice == null)
                {
                    return NotFound("Invoice not found");
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest("Invalid file");
                }

                // Set a maximum file size limit for image uploads (2 MB)
                if (file.Length > 2 * 1024 * 1024)
                {
                    return BadRequest("File size exceeds the allowed limit (2 MB)");
                }

                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);

                    if (dbinvoice.Attachmentid != null)
                    {
                        // invoices already have an attachment, so delete the existing attachment from the attachments table and then assign the new one
                        var existingAttachment = await _context.AttachmentFiles.FindAsync(dbinvoice.Attachmentid);
                        if (existingAttachment is not null)
                        {
                            _context.AttachmentFiles.Remove(existingAttachment);
                        }
                    }

                    var newAttachmentToInsert = new AttachmentFile
                    {
                        File = memoryStream.ToArray(),
                        Lastuploadbyuid = userId,
                        Lastupdate = DateTime.Now
                    };

                    dbinvoice.Attachmentid = null;
                    dbinvoice.Attachment = newAttachmentToInsert;
                }


                await _context.SaveChangesAsync();

                return Ok("File uploaded successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpGet("Attachment/Get/{invoiceId:int}")]
        public async Task<ActionResult> GetInvoiceImage(int invoiceId)
        {
            try
            {
                var userId = _superHeroService.LoggedInUserID(User);
                if (userId <= 0)
                {
                    return Unauthorized("Unauthorized!");

                }

                if (invoiceId <= 0)
                {
                    return NotFound("Sorry, invoice not found!");
                }

                //   var invoice = await _context.SupplierInvoices.FindAsync(invoiceId);

                var invoice = await _context.SupplierInvoices.Include(i => i.Attachment).FirstOrDefaultAsync(i => i.Id == invoiceId);

                if (invoice == null)
                {
                    return NotFound("Invoice not found");
                }


                if (invoice.Attachmentid == null || invoice.Attachment == null)
                {
                    return NotFound("Sorry, attachment not found!");
                }

                byte[] attachmentData = invoice.Attachment.File;

                // Check if the content represents a PDF file
                if (IsPdfContent(attachmentData))
                {
                    // Set appropriate response headers for PDF
                    Response.Headers.Add("Content-Type", "application/pdf");
                    Response.Headers.Add("Content-Length", attachmentData.Length.ToString());

                    // Send the PDF data in the response
                    return File(attachmentData, "application/pdf");
                }
                else
                {
                    // Assume it's an image
                    // Determine the requested format from the Accept header
                    var contentType = Request.Headers["Accept"].ToString().Contains("image/png") ? "image/png" : "image/jpeg";

                    // Set appropriate response headers for images
                    Response.Headers.Add("Content-Type", contentType);
                    Response.Headers.Add("Content-Length", attachmentData.Length.ToString());

                    // Send the image data in the response
                    return File(attachmentData, contentType);
                }
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                // Log.LogError(ex, "An error occurred while retrieving the image.");
                return StatusCode(500, "Internal Server Error");
            }
        }

        private bool IsPdfContent(byte[] data)
        {
            // Check if the content starts with the PDF header
            return data.Length >= 5 && data[0] == 0x25 && data[1] == 0x50 && data[2] == 0x44 && data[3] == 0x46 && data[4] == 0x2D;
        }


    }
}
