using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using MimeKit.Text;
using MySqlConnector;
using System.Data;
using System.Data.Common;
using System.Security.Claims;
//using iTextSharp.text.pdf.parser;
//using MySqlConnector;
using Location = IMSwebAPI.Models.AutoCreatedFromEFC.Location;
//using System.Net.Mail;

namespace IMSwebAPI.Services.MyService
{
    public class IMSService : IGlobalService
    {
        private readonly AppDbContext _context;
        private readonly MyCustomLogger _logger;


        public IMSService(AppDbContext context, MyCustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public DataTable FillDataTable(string sqlQuery, params DbParameter[] parameters)
        {
            DataTable dataTable = new DataTable();


            DbConnection connection = _context.Database.GetDbConnection();
            DbProviderFactory dbFactory = DbProviderFactories.GetFactory(connection);

            using (var cmd = dbFactory.CreateCommand())
            {
                cmd.Connection = connection;
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = sqlQuery;
                if (parameters != null)
                {
                    foreach (var item in parameters)
                    {
                        cmd.Parameters.Add(item);
                    }
                }
                using (DbDataAdapter adapter = dbFactory.CreateDataAdapter())
                {
                    adapter.SelectCommand = cmd;
                    adapter.Fill(dataTable);
                }
            }


            return dataTable;
        }


        public Dictionary<int, List<AvailableStockLine>> GetProductAvailableStockAnalysis(List<int> productIds)
        {
            var stockAnalysis = new Dictionary<int, List<AvailableStockLine>>();

            var query = from s in _context.Stocks
                        join l in _context.Locations on s.Locid equals l.Id
                        join ll in _context.Lots on s.Lotid equals ll.Id into lotJoin
                        from lot in lotJoin.DefaultIfEmpty()
                        join lr in _context.Locrooms on l.Roomid equals lr.Id
                        join a in _context.Locbuildings on lr.Buildingid equals a.Id
                        join lt in _context.Locationtypes on l.Loctypeid equals lt.Id
                        join cs in _context.Itemconditionstatuses on s.Conditionstatus equals cs.Id
                        where productIds.Contains(s.Productid)
                        group new { s, l, lot, lr, a, lt, cs } by s.Productid into g
                        where g.Sum(x => x.s.Qty) > 0
                        select new
                        {
                            ProductId = g.Key,
                            Rows = g.Select(x => new AvailableStockLine
                            {
                                expdate = x.lot.Expdate != null ? new DateTime(x.lot.Expdate.Value.Year, x.lot.Expdate.Value.Month, x.lot.Expdate.Value.Day) : (DateTime?)null,
                                si = x.s.Si,
                                ns = x.s.Ns,
                                locid = x.l.Id,
                                locname = x.l.Locname,
                                lotid = x.lot.Id,
                                lotnumber = x.lot.Lotnumber,
                                qty = x.s.Qty,
                                buldingname = x.a.Building,
                                buildid = x.a.Id,
                                roomname = x.lr.Room,
                                roomid = x.lr.Id,
                                conname = x.cs.Name,
                                conid = x.cs.Id,
                                loctypename = x.lt.Loctype,
                                loctypeid = x.lt.Id
                            }).ToList()
                        };

            foreach (var result in query)
            {
                stockAnalysis[result.ProductId] = result.Rows;
            }

            return stockAnalysis;
        }





        public int getAvailableStockQty(int pid)
        {
            throw new NotImplementedException();
        }

        public Product GetSingleProduct(int id)
        {
            throw new NotImplementedException();
        }
        public Productcategory GetSingleCategory(int id)
        {
            throw new NotImplementedException();
        }

        public Product UpdateSingleProduct(Product product)
        {
            throw new NotImplementedException();
        }
        async Task<List<Productcategory>> IGlobalService.GetCategories(int? cid)
        {

            var getList = from m1 in _context.Productcategories.Include(m => m.Productsubcategories)
                          select m1;
            if (cid > 0)
            {
                getList = getList.Where(x => x.Id == cid);
            }

            return await getList.ToListAsync();
        }
        async Task<List<SupplierInvoice>> IGlobalService.GetInvoices(int? id)
        {

            var getList = from m1 in _context.SupplierInvoices
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.ToListAsync();
        }
        async Task<List<Lot>> IGlobalService.GetLots(int? id)
        {

            var getList = from m1 in _context.Lots
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.ToListAsync();
        }

        async Task<List<Locationtype>> IGlobalService.GetLocTypes(int? id)
        {

            var getList = from m1 in _context.Locationtypes
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.OrderBy(x => x.Loctype).ToListAsync();
        }
        async Task<List<Locroom>> IGlobalService.GetLocRooms(int? id)
        {

            var getList = from m1 in _context.Locrooms.Include(x => x.Building)
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.OrderBy(x => x.Building.Building).ThenBy(x => x.Room).ToListAsync();
        }

        async Task<List<RequestDecision>> IGlobalService.GetDecisions(int? id)
        {

            var getList = from m1 in _context.RequestDecisions
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.OrderBy(x => x.Sorting).ToListAsync();
        }

        async Task<List<StockTransReason>> IGlobalService.GetReasons(int? id)
        {

            var getList = from m1 in _context.StockTransReasons
                          where !m1.ReasonName.ToLower().Trim().Equals("System".ToLower().Trim())
                          select m1;

            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.OrderBy(x => x.Id).ToListAsync();
        }


        async Task<List<Productbrand>> IGlobalService.GetBrands(int? id)
        {

            var getList = from m1 in _context.Productbrands
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.OrderBy(x => x.Name).ToListAsync();
        }
        async Task<List<Productsubcategory>> IGlobalService.GetSubCategories(int? id)
        {

            var getList = from m1 in _context.Productsubcategories
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.OrderBy(x => x.Name).ToListAsync();
        }


        async Task<List<Vatrate>> IGlobalService.GetVatRates(int? vrid)
        {

            var getList = from m1 in _context.Vatrates
                          select m1;
            if (vrid > 0)
            {
                getList = getList.Where(x => x.Id == vrid);
            }

            return await getList.ToListAsync();
        }



        async Task<List<StorageCondition>> IGlobalService.GetStorageConditions(int? id)
        {

            var getList = from m1 in _context.StorageConditions
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }
            return await getList.ToListAsync();
        }



        async Task<List<Supplier>> IGlobalService.GetSuppliers(int? id)
        {
            var getList = _context.Suppliers
                                  .Include(s => s.Tendersuppliersassigneds)
                                      .ThenInclude(tsa => tsa.TidNavigation)
                                  .Include(s => s.Contactsofsuppliers)
                                  .AsQueryable();

            if (id > 0)
            {
                getList = getList.Where(s => s.Id == id);
            }

            var supplierList = await getList.ToListAsync();

            // Nullify unnecessary properties for the response
            foreach (var supplier in supplierList)
            {
                foreach (var tsa in supplier.Tendersuppliersassigneds)
                {
                    tsa.TidNavigation.Createdbyemp = null;
                    tsa.TidNavigation.Porders = null;
                    tsa.TidNavigation.Products = null;
                    tsa.TidNavigation.Tendersuppliersassigneds = null;
                }

                supplier.Porders = null;
                supplier.Products = null;
                supplier.SupplierInvoices = null;
                supplier.SupplierItems = null;
            }

            return supplierList;
        }





        async Task<List<Manufacturer>> IGlobalService.GetManufacturers(int? id)
        {
            var getList = _context.Manufacturers
                                  //.Include(s => s.Tendersuppliersassigneds)
                                  //    .ThenInclude(tsa => tsa.TidNavigation)
                                  //.Include(s => s.Contactsofsuppliers)
                                  .AsQueryable();

            if (id > 0)
            {
                getList = getList.Where(s => s.Id == id);
            }

            var theList = await getList.ToListAsync();

            // Nullify unnecessary properties for the response
            foreach (var listItem in theList)
            {
                listItem.Products = null;
            }

            return theList;
        }

        async Task<List<Location>> IGlobalService.GetLocations(int? id)
        {

            var getList = from m1 in _context.Locations.AsNoTracking().Include(x => x.Room.Building).Include(x => x.Room).Include(x => x.Loctype)
                          select m1;

            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.ToListAsync();
        }
        async Task<List<Locbuilding>> IGlobalService.GetLocbuildings(int? id)
        {

            var getList = from m1 in _context.Locbuildings
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.ToListAsync();
        }
        public DateTime? ConvertToUtc(DateTime? dateTime)
        {
            if (dateTime.HasValue)
            {
                // Convert to UTC if it's not already in UTC
                return dateTime.Value.Kind == DateTimeKind.Utc ? dateTime : dateTime.Value.ToUniversalTime();
            }

            return null;
        }

        async Task<MyCustomReturnType> IGlobalService.SendEmailCustom(string toemail, string subject, string htmltext, bool to_Also_includeALL_admins, bool CCIncludeALLadminsalso, bool CCIncludeALLOrderRecs, string customCC, byte[]? attachmentData, string? attachmentFileName)

        {

            var returnthis = new MyCustomReturnType();
            returnthis.result = false;


            try
            {
                var getAppSettings = await _context.Appsettings.AsNoTracking().SingleAsync();



                if (getAppSettings.SendEmailByApp == false)
                {
                    return returnthis;
                }


                // create email message
                var email = new MimeMessage();
                // Create an attachment for the Excel file
                // Add the attachment to the email


                string biobanksenderemail = "";

                // To Rec.
                if (toemail != biobanksenderemail)
                {
                    email.To.Add(MailboxAddress.Parse(toemail));
                }


                if (to_Also_includeALL_admins)
                {

                    var adminsemails = await _context.Users.AsNoTracking()
                      .Where(b => b.LockoutFlag == false && b.RoleId == 1).ToListAsync();

                    if (adminsemails != null)
                    {
                        foreach (User u in adminsemails)
                        {
                            email.To.Add(MailboxAddress.Parse(u.Email));
                        }
                    }

                }

                if (CCIncludeALLadminsalso)
                {
                    var adminEmails = await _context.Users.Include(x => x.Role)
                        .AsNoTracking()
                        .Where(b => b.LockoutFlag == false && (b.Role.RoleName.ToLower() == "Super Admin".ToLower() || b.Role.RoleName.ToLower() == "Administrator".ToLower()))
                        .ToListAsync();

                    if (adminEmails != null)
                    {
                        foreach (User user in adminEmails)
                        {
                            email.Cc.Add(MailboxAddress.Parse(user.Email));
                        }
                    }
                }



                if (CCIncludeALLOrderRecs)
                {

                    var orderccemails = await _context.Users.AsNoTracking()
                      .Where(b => b.LockoutFlag == false && b.CconpurchaseOrder == true).ToListAsync();

                    if (orderccemails != null)
                    {
                        foreach (User u in orderccemails)
                        {
                            email.Cc.Add(MailboxAddress.Parse(u.Email));
                        }
                    }

                }

                if (!string.IsNullOrEmpty(customCC))
                {
                    // Split the comma-separated email addresses into an array
                    var ccEmails = customCC.Split(',');

                    foreach (var ccEmail in ccEmails)
                    {
                        if (EmailValidator.IsValidEmail(ccEmail))
                        {
                            email.Cc.Add(MailboxAddress.Parse(ccEmail.Trim()));
                        }
                    }
                }




                if (email.To.Count <= 0)
                {
                    email.To.Add(MailboxAddress.Parse(getAppSettings.CompanyEmail));
                }

                email.Subject = subject;
                email.Body = new TextPart(TextFormat.Html) { Text = htmltext };



                // Attach the provided attachment if it's provided
                if (attachmentData != null && !string.IsNullOrEmpty(attachmentFileName))
                {
                    var multipart = new Multipart("mixed");
                    multipart.Add(new TextPart(TextFormat.Html) { Text = htmltext });



                    var attachment1 = new MimePart()
                    {
                        Content = new MimeContent(new MemoryStream(attachmentData), ContentEncoding.Default),
                        ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                        ContentTransferEncoding = ContentEncoding.Default,
                        FileName = attachmentFileName

                    };


                    multipart.Add(attachment1);


                    email.Body = multipart;

                }

                try
                {
                    // send email
                    // smtp.Connect(EmailSettings.SMTP, 587, SecureSocketOptions.StartTls);

                    string smtpFromAddress1 = getAppSettings.SmtpFromaddress;

                    if (!string.IsNullOrEmpty(smtpFromAddress1))
                    {
                        email.From.Add(MailboxAddress.Parse(smtpFromAddress1));
                    }

                    // email.From.Add(MailboxAddress.Parse(getAppSettings.SmtpFromaddress));


                    using var smtp = new SmtpClient();
                    smtp.Timeout = getAppSettings.SmtpTimeout;
                    // Set SMTP server, port, and secure socket options
                    if (Enum.TryParse(getAppSettings.SmtpSecuresocketoptions, out SecureSocketOptions secureSocketOption))
                    {
                        smtp.Connect(getAppSettings.SmtpServer, getAppSettings.SmtpPort, secureSocketOption);
                    }
                    else
                    {
                        // Handle invalid or unsupported secure socket option value
                        // You might want to set a default option or throw an exception

                        smtp.Connect(getAppSettings.SmtpServer, getAppSettings.SmtpPort, SecureSocketOptions.Auto);
                    }



                    // Set timeout
                    // smtp.Connect(getAppSettings.SmtpServer, getAppSettings.SmtpPort, SecureSocketOptions.StartTls);
                    smtp.Authenticate(getAppSettings.SmtpUsername, DecryptPassword(getAppSettings.SmtpPasswordEncr));
                    smtp.Send(email);
                    smtp.Disconnect(true);
                    returnthis.result = true;


                }
                catch (Exception ex)
                {
                    returnthis.result = false;
                    returnthis.message = "Error Sending Email: " + ex.Message.ToString();

                }



            }
            catch (Exception aa)
            {

                returnthis.result = false;
                returnthis.message = "General Error Sending Email " + aa.Message.ToString();
            }



            return returnthis;

        }

        // Method to decrypt the password
        private string DecryptPassword(string encryptedPassword)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            PasswordEncryptionService encryptionService = new PasswordEncryptionService(configuration);

            string decryptedPassword = encryptionService.DecryptString(encryptedPassword);
            return decryptedPassword;
        }



        async Task<List<CustomPorderline>> IGlobalService.GetPorderLines(int? pid)
        {
            //pid: purchase order id
            var getList = _context.Porderlines
        .Include(x => x.Product)
        .Include(x => x.VatindexNavigation)
        .Include(x => x.Receivinglines) // Include Receivinglines
        .OrderByDescending(x => x.Id)
        .AsQueryable();

            if (pid.HasValue && pid > 0)
            {
                getList = getList.Where(x => x.Pordid == pid.Value).OrderBy(x => x.Product.Name);
            }

            var porderLines = await getList.ToListAsync();

            var customPorderLines = new List<CustomPorderline>();

            foreach (var porderLine in porderLines)
            {
                var receivedQty = porderLine.Receivinglines.Sum(receivingLine => receivingLine.Qty);
                var customPorderLine = new CustomPorderline
                {
                    Id = porderLine.Id,
                    Pordid = porderLine.Pordid,
                    Productid = porderLine.Productid,
                    Qty = porderLine.Qty,
                    Unitpurcostprice = porderLine.Unitpurcostprice,
                    Vatindex = porderLine.Vatindex,
                    Requestlineid = porderLine.Requestlineid,
                    ClosedFlag = porderLine.ClosedFlag,
                    Pord = porderLine.Pord,
                    Product = porderLine.Product,
                    Requestline = porderLine.Requestline,
                    VatindexNavigation = porderLine.VatindexNavigation,
                    alreadyreceivedqty = receivedQty
                };

                customPorderLines.Add(customPorderLine);
            }

            return customPorderLines;
        }



        public async Task<List<CustomTransactionLineDTO>> GetAllTransactions(int? pid)
        {
            var query = _context.StockTrans
                .Include(st => st.StatusNavigation)
                .Include(st => st.User)
                .Include(st => st.StockTransType)
                .Include(st => st.StockTransReason)
                .Include(st => st.StockTransDetails)
                    .ThenInclude(detail => detail.Lot) // Include the Lot navigation property
                    .Include(st => st.StockTransDetails)
                    .ThenInclude(detail => detail.Loc) // Include the Loc navigation property
                .Where(st => st.StockTransDetails.Any(d => d.Pid == pid) && st.StatusNavigation.Name.ToLower() == "Completed".ToLower())
                .OrderBy(st => st.Transdate) // Order by Transdate in ascending order
                .SelectMany(st => st.StockTransDetails.Where(d => d.Pid == pid), (st, detail) => new CustomTransactionLineDTO
                {
                    transid = st.Id,
                    translineid = detail.Id,
                    transdate = st.Transdate,
                    transtype = st.StockTransType.TypeName,
                    transreason = st.StockTransReason.ReasonName,
                    qty = detail.Qty,
                    lotnumber = detail.Lot.Lotnumber,
                    expdate = detail.Lot.Expdate,
                    user = st.User.FirstName + ' ' + st.User.LastName,
                    unitcostprice = detail.Unitcostprice,
                    unitcostrecalflag = detail.UnitcostRecalculationFlag,
                    pid = detail.Pid,
                    doclineid = detail.DocumentLineid,
                    locid = detail.Locid,
                    lotid = detail.Lotid,
                    locname = detail.Loc.Locname
                });

            return await query.ToListAsync();
        }


        async Task<List<Receiving>> IGlobalService.GetAllReceivings(int? pid)
        {


            var getList = from m1 in _context.Receivings
                          select m1;
            if (pid > 0)
            {
                getList = getList.Where(x => x.Id == pid);
            }

            return await getList.ToListAsync();



        }

        async Task<List<Receivingline>?> IGlobalService.GetReceivingLines(int pid)
        {


            if (pid > 0)
            {
                var getList = from m1 in _context.Receivinglines.Where(x => x.ReceivingId == pid).Include(x => x.Product)
                              select m1;
                getList = getList.Where(x => x.ReceivingId == pid).OrderBy(x => x.Product.Name);
                if (getList.Count() > 0) { return await getList.ToListAsync(); }
                else { return null; }

            }
            else
            {
                return null;
            }


        }



        public async Task<List<CustomPurchaseOrderLine>> GetAllCustomPurchaseOrderLines(int? pid)
        {
            IGlobalService imsservice = new IMSService(_context, _logger); // Instantiate the IMSService class with the required context

            //  var porderidTofilter = 0;

            //try
            //{
            //    if (pid.HasValue && pid > 0)
            //    {
            //        porderidTofilter = _context.Porders.Where(c => c.Id == pid).Single().Id;
            //        if (porderidTofilter <= 0) { return null; }

            //    }
            //}
            //catch (Exception ex)
            //{
            //    porderidTofilter = -1;
            //    return null;

            //}


            try
            {

                var ordersResult = new List<CustomPurchaseOrderLine>();
                var orderLines = await imsservice.GetPorderLines(pid);

                var i = 0;

                foreach (var row in orderLines)
                {
                    i++;
                    if (i > 9)
                    {
                        break;
                    }

                    var newporderLine = new CustomPurchaseOrderLine();
                    newporderLine.Id = row.Id;
                    newporderLine.Productid = row.Productid;
                    newporderLine.Vatindex = row.Vatindex;
                    newporderLine.Vatrate = (row.VatindexNavigation?.Rate) ?? 0m;
                    newporderLine.Closedflag = row.ClosedFlag;
                    newporderLine.Unitpurcostprice = row.Unitpurcostprice;
                    newporderLine.Qty = row.Qty;
                    newporderLine.Requestlineid = row.Requestlineid;
                    newporderLine.Pordid = row.Pordid;


                    //get custom porder
                    var customPorder = await imsservice.GetAllPurchaseOrders(row.Pordid);

                    if (customPorder.Count == 1)
                    {
                        newporderLine.Pord = customPorder.SingleOrDefault();


                    }//else porder null

                    //get custom product
                    var productList = await imsservice.GetAllProducts(row.Productid, null);

                    if (productList.Count == 1)
                    {
                        newporderLine.Product = productList.SingleOrDefault();

                    }//else customproduct null

                    //get custom reqline
                    if (row.Requestlineid != null)
                    {
                        var founsreqline = await imsservice.GetCustomRequstLine(row.Requestlineid ?? 0);
                        if (founsreqline is not null)
                        {
                            if (founsreqline.linelastDecision.Madebyuser is not null)
                            {
                                var newuser = new User();
                                newuser.Id = founsreqline.linelastDecision.Madebyuser.Id;
                                newuser.FirstName = founsreqline.linelastDecision.Madebyuser.FirstName;
                                newuser.LastName = founsreqline.linelastDecision.Madebyuser.LastName;
                                founsreqline.linelastDecision.Madebyuser = newuser;

                            }
                            //founsreqline.linelastDecision.Reqline=null;
                            //founsreqline.linelastDecision.Madebyuser.ApproverU = null;
                            //founsreqline.linelastDecision.Madebyuser.InverseApproverU = null;

                            //founsreqline.linelastDecision.Madebyuser = null;
                            //  founsreqline.linelastDecision = null;
                            newporderLine.Requestline = founsreqline;

                        }//else customproduct null
                    }

                    //var getList = from m1 in _context.Receivings.Include(x=>x.Receivinglines)
                    //                   where m1.PorderId == item.Pordid && m1.Receivinglines.Any(rl => rl.PolineId == item.Id)

                    //              select m1;
                    var getList = from m1 in _context.Receivings.Include(x => x.Receivinglines).Include(x => x.Invoice)
                                  where m1.PorderId == row.Pordid
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
                                      Receivinglines = m1.Receivinglines.Where(rl => rl.PolineId == row.Id && rl.Productid == row.Productid).ToList(),
                                      // include other properties from Receivings entity if needed

                                  };

                    newporderLine.Receivings = new List<CustomReceiving>();

                    var xxx = new Vatrate();
                    xxx.Id = 0;
                    xxx.Rate = 0;


                    foreach (var receiveingheader in await getList.ToListAsync())
                    {
                        var customReceivingHeader = new CustomReceiving
                        {
                            ByuserId = receiveingheader.ByuserId,

                            Id = receiveingheader.Id,
                            PorderId = receiveingheader.PorderId,
                            Receivedatetime = receiveingheader.Receivedatetime,
                            Invoice = receiveingheader.Invoice,
                            InvoiceId = receiveingheader.InvoiceId ?? 0,
                            //Supinvno = receiveingheader.Supinvno,
                            //SupInvShippingAndHandlingCost = receiveingheader.SupInvShippingAndHandlingCost,
                            //SupInvShippingAndHandlingCostVatID = receiveingheader.VatId,
                            //SupInvShippingAndHandlingCostVat =  receiveingheader.Vat,
                            // Map properties from ReceivingLinesModel to CustomReceivingline
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
                            if (customReceivingHeader.Invoice is not null)
                            {
                                if (customReceivingHeader.Invoice.SupInvShippingAndHandlingCost > 0)
                                {
                                    var findvatrate = await _context.Vatrates.FindAsync(customReceivingHeader.Invoice?.VatId);
                                    //var newvat = new Vatrate();
                                    //newvat.Id = findvatrate.Id;
                                    //newvat.Rate = findvatrate.Rate;
                                    if (customReceivingHeader.Invoice is not null)
                                    {
                                        customReceivingHeader.Invoice.Vat = findvatrate;
                                    }



                                }
                            }

                            newporderLine.Receivings.Add(customReceivingHeader);
                        }



                    }



                    var totallineorderedQty = newporderLine.Qty;
                    var totallinereceivedQty = 0;




                    if (newporderLine.Receivings.Count <= 0) { newporderLine.Receivings = null; }
                    else
                    {
                        totallinereceivedQty = newporderLine.Receivings.Sum(r => r.Receivinglines.Sum(rl => rl.Qty));
                    }


                    newporderLine.Dynamiclinestatus = "";

                    int difference = totallineorderedQty - totallinereceivedQty;

                    //if ((newlistitem.Pord?.StatusName ?? "").ToLower() == "Cancelled".ToLower())
                    //{
                    //    newlistitem.Dynamiclinestatus = "Cancelled";
                    //}
                    if (newporderLine.Closedflag)
                    {
                        newporderLine.Dynamiclinestatus = "Closed";
                    }

                    else if ((newporderLine.Pord?.StatusName ?? "").ToLower() == "Cancelled".ToLower())
                    {
                        newporderLine.Dynamiclinestatus = "Cancelled";
                    }
                    else
                    {
                        if (totallinereceivedQty == 0)
                        {
                            newporderLine.Dynamiclinestatus = "Pending";
                        }
                        else if (difference > 0)
                        {
                            newporderLine.Dynamiclinestatus = "Partially Received";
                        }
                        else if (difference == 0)
                        {
                            newporderLine.Dynamiclinestatus = "Received";
                        }
                        else if (difference < 0)
                        {
                            newporderLine.Dynamiclinestatus = "Received (Exceeded Quantity)";
                        }
                        else
                        {
                            newporderLine.Dynamiclinestatus = "Unknown Status";
                        }
                    }

                    foreach (var receiving in newporderLine.Receivings ?? Enumerable.Empty<CustomReceiving>())
                    {
                        receiving.Receivinglines?.Clear();
                        if (receiving.Invoice is not null)
                        {
                            var sup = receiving.Invoice.Sup;
                            if (sup is not null)
                            {
                                sup.Porders = null;
                                sup = null;
                            }

                            receiving.Invoice.Vat = null;

                            // Clear additional references that may cause cycles
                            foreach (var receivingLine in receiving.Invoice.Receivings.SelectMany(r => r.Receivinglines))
                            {

                                receivingLine.Poline.Receivinglines = null;
                                receivingLine.Poline.VatindexNavigation.Porderlines = null;
                                // Add more properties to clear if needed
                            }
                        }
                    }






                    ordersResult.Add(newporderLine);

                }


                //result.porderdetails = new List<Porderline>();
                //result.products = new List<CustomProduct>();
                //result.porderheader = new List<CustomPurchaseOrder>();

                //  var pd = await _superHeroService.GetPorderLines(null);
                // result.porderdetails = pd;
                // var p = await _superHeroService.GetAllProducts(null);
                // result.products = p;
                //  var ph = await _superHeroService.GetAllPurchaseOrders(null);
                // result.porderheader = ph;


                return (ordersResult);

            }
            catch (Exception ex)
            {
                return null;
                // Log the exception for debugging purposes

                //   return BadRequest(ex.Message);
            }

        }
        async Task<List<CustomPurchaseOrder>> IGlobalService.GetAllPurchaseOrders(int? pid)
        {
            var retlist = new List<CustomPurchaseOrder>();

            var getPordersList = from m1 in _context.Porders
                                 select m1;

            if (pid > 0)
            {
                getPordersList = getPordersList.Where(x => x.Id == pid);
            }

            var query = await getPordersList
                  // .Include(x => x.StorageCondition)
                  // .Include(x => x.Category)
                  // .Include(x => x.Subcategory)
                  // .Include(x => x.Brand)
                  .Include(x => x.Supplier)
                   .Include(x => x.Status)
                     .Include(x => x.Sentbyemp)
                     .Include(x => x.Createdbyemp)
                         .Include(x => x.Tender)
                              .Include(x => x.Porderlines)
                    // .Include(x => x.DefaultLoc).Include(x => x.DefaultLoc.Room).Include(x => x.DefaultLoc.Room.Building)
                    //.Include(x => x.StorageCondition)
                    .OrderByDescending(x => x.Id)
                    .ToListAsync();

            foreach (var porder in query)
            {
                // var rows = getProductAvailableStockAnalysis(porder.Id);
                retlist.Add(new CustomPurchaseOrder
                {
                    Id = porder.Id,
                    Ordercreateddate = porder.Ordercreateddate,
                    Sentdate = porder.Sentdate,
                    Duedate = porder.Duedate,
                    Podate = porder.Podate,
                    Notes = porder.Notes,
                    Statusid = porder.Statusid,
                    StatusName = porder.Status.Name,
                    Tenderid = porder.Tenderid,
                    Supplierid = porder.Supplierid,
                    Sentbyempid = porder.Sentbyempid,
                    SupName = porder.Supplier.Name,
                    PorderlinesCount = porder.Porderlines.Count,
                    Tendercode = porder.Tender?.Tendercode ?? null,
                    createdbyuserfullname = !string.IsNullOrEmpty(porder.Createdbyemp.FirstName) ? (porder.Createdbyemp.FirstName + ' ' + porder.Createdbyemp.LastName) : null,
                    sentbyuserfullname = !string.IsNullOrEmpty(porder.Sentbyemp?.FirstName) ? (porder.Sentbyemp.FirstName + ' ' + porder.Sentbyemp.LastName) : null,

                    //   Sentbyemp = porder.Sentbyemp
                    //  Supplier=porder.Supplier,
                    // Status=porder.Status



                });
            }
            return retlist;
        }


        public async Task<List<ReportingExpenditure>> GetReportDataForExpenditure(
   List<int>? pids, List<int>? catids, DateTime? startdate, DateTime? enddate,
   List<int>? supplierIDS, List<int>? tenderIDS, List<int>? orderedByUserIDS,
   List<int>? requestedByUserIDS)
        {
            try
            {
                var whereClauses = new List<string>();

                if (startdate.HasValue)
                {
                    whereClauses.Add("Date(ADDTIME(supinvdate, TIMEDIFF(UTC_TIMESTAMP(), NOW()))) >= Date(@startdate)");
                }

                if (enddate.HasValue)
                {
                    whereClauses.Add("Date(ADDTIME(supinvdate, TIMEDIFF(UTC_TIMESTAMP(), NOW()))) <= Date(@enddate)");
                }

                // Additional filters
                if (supplierIDS?.Any() == true)
                {
                    whereClauses.Add("supplierid IN (" + string.Join(",", supplierIDS) + ")");
                }

                //if (excludeCancOrders == true)
                //{
                //    whereClauses.Add("LOWER(OrderStatus)  <>  LOWER('cancelled')");
                //}

                if (catids?.Any() == true)
                {
                    whereClauses.Add("Pcatid IN (" + string.Join(",", catids) + ")");
                }

                if (pids?.Any() == true)
                {
                    whereClauses.Add("Pid IN (" + string.Join(",", pids) + ")");
                }

                if (tenderIDS?.Any() == true)
                {
                    whereClauses.Add("tenderid IN (" + string.Join(",", tenderIDS) + ")");
                }

                if (orderedByUserIDS?.Any() == true)
                {
                    whereClauses.Add("UserOrdId IN (" + string.Join(",", orderedByUserIDS) + ")");
                }

                if (requestedByUserIDS?.Any() == true)
                {
                    whereClauses.Add("UserReqId IN (" + string.Join(",", requestedByUserIDS) + ")");
                }

                var whereClause = whereClauses.Any() ? "WHERE " + string.Join(" AND ", whereClauses) : "";

                var ordersResult = await _context.ReportingExpenditures
                    .FromSqlRaw($@"
                -- raw SQL query
                SELECT 
                    *
                FROM 
                    reporting_expenditure {whereClause}
                ORDER BY 
                    orderid DESC
            ", new MySqlParameter("startdate", startdate),
                    new MySqlParameter("enddate", enddate))
                    .ToListAsync();

                return ordersResult;
            }
            catch (Exception ex)
            {
                // Handle exception
                return null;
            }
        }



        public async Task<List<ReportingPorder>> GetReportDataForOrders(
         List<int>? pids, List<int>? catids, DateTime? startdate, DateTime? enddate,
         List<int>? supplierIDS, List<int>? tenderIDS, List<int>? orderedByUserIDS,
         List<int>? requestedByUserIDS, bool? excludeCancOrders)
        {
            try
            {
                var whereClauses = new List<string>();

                if (startdate.HasValue)
                {
                    whereClauses.Add("ADDTIME(ordercreateddate, TIMEDIFF(UTC_TIMESTAMP(), NOW())) >= @startdate");
                }

                if (enddate.HasValue)
                {
                    whereClauses.Add("ADDTIME(ordercreateddate, TIMEDIFF(UTC_TIMESTAMP(), NOW())) <= @enddate");
                }

                // Additional filters
                if (supplierIDS?.Any() == true)
                {
                    whereClauses.Add("supplierid IN (" + string.Join(",", supplierIDS) + ")");
                }

                if (excludeCancOrders == true)
                {
                    whereClauses.Add("LOWER(OrderStatus)  <>  LOWER('cancelled')");
                }

                if (catids?.Any() == true)
                {
                    whereClauses.Add("Pcatid IN (" + string.Join(",", catids) + ")");
                }

                if (pids?.Any() == true)
                {
                    whereClauses.Add("Pid IN (" + string.Join(",", pids) + ")");
                }

                if (tenderIDS?.Any() == true)
                {
                    whereClauses.Add("tenderid IN (" + string.Join(",", tenderIDS) + ")");
                }

                if (orderedByUserIDS?.Any() == true)
                {
                    whereClauses.Add("UserOrdId IN (" + string.Join(",", orderedByUserIDS) + ")");
                }

                if (requestedByUserIDS?.Any() == true)
                {
                    whereClauses.Add("UserReqId IN (" + string.Join(",", requestedByUserIDS) + ")");
                }

                var whereClause = whereClauses.Any() ? "WHERE " + string.Join(" AND ", whereClauses) : "";

                var ordersResult = await _context.ReportingPorders
                    .FromSqlRaw($@"
                -- raw SQL query
                SELECT 
                    *
                FROM 
                    reporting_porders {whereClause}
                ORDER BY 
                    orderid DESC
            ", new MySqlParameter("startdate", startdate),
                    new MySqlParameter("enddate", enddate))
                    .ToListAsync();

                return ordersResult;
            }
            catch (Exception ex)
            {
                // Handle exception
                return null;
            }
        }


        async Task<List<CustomProduct>> IGlobalService.GetAllProducts(int? pid, List<int>? pids, List<int>? catids, List<int>? locids, bool? expiredonly)
        {
            var retlist = new List<CustomProduct>();

            var getProductsList = from m1 in _context.Products
                                  select m1;

            if (pid.HasValue && pid > 0)
            {
                getProductsList = getProductsList.Where(x => x.Id == pid.Value);
            }

            if (pids != null && pids.Count > 0)
            {
                getProductsList = getProductsList.Where(x => pids.Contains(x.Id));
            }

            if (catids != null && catids.Count > 0)
            {
                getProductsList = getProductsList.Where(x => catids.Contains(x.CategoryId));
            }



            var query = await getProductsList.AsNoTracking().Include(x => x.StorageCondition)

                    .Include(x => x.Productdepartmentsassigneds)
                    .ThenInclude(pd => pd.DidNavigation)
                    .Include(x => x.Category)
                    .Include(x => x.Tender)
                    .Include(x => x.Subcategory)
                    .Include(x => x.Brand)
                    .Include(x => x.Vat)
                    .Include(x => x.DefaultSupplier)
                     .Include(x => x.Manufacturer)
                    .Include(x => x.DefaultLoc).
                    Include(x => x.DefaultLoc.Room).
                    Include(x => x.DefaultLoc.Room.Building)
                    .Include(x => x.StorageCondition)
                    .OrderBy(x => x.Name)
                    .ToListAsync();


            var productIds = query.Select(x => x.Id).ToList();



            var stockAnalysis = GetProductAvailableStockAnalysis(productIds);



            foreach (var product in query)
            {
                //await _context.Entry(product).Collection(p => p.Productdepartmentsassigneds).LoadAsync();
                //foreach (var assignment in product.Productdepartmentsassigneds)
                //{
                //    await _context.Entry(assignment).Reference(pa => pa.DidNavigation).LoadAsync();
                //}
                // var rows = getProductAvailableStockAnalysisVerySlow(product.Id);
                //  var rows = stockAnalysis[product.Id];
                //  var departments = product.Productdepartmentsassigneds.Select(pd => pd.DidNavigation).ToList();
                var departments = new List<Productdepartment>();

                departments = product.Productdepartmentsassigneds
        .Select(pd => pd.DidNavigation)
        .ToList();

                if (departments != null)
                {
                    foreach (var department in departments)
                    {
                        department.Productdepartmentsassigneds = null;
                    }
                }

                //  departments = new List<Productdepartment>();
                //var departmentIds = product.Productdepartmentsassigneds.Select(pd => pd.Did).ToList();
                //var departments = _context.Productdepartmentsassigneds
                //    .Where(d => departmentIds.Contains(d.Id))
                //    .Include(d => d.Productdepartmentsassigneds)
                //    .ToList();
                List<AvailableStockLine> xx = new List<AvailableStockLine>();

                if (stockAnalysis.ContainsKey(product.Id))
                {
                    xx = stockAnalysis[product.Id];

                    var groupedXX = xx.GroupBy(item => new { item.locid, item.lotid, item.conid, item.si, item.ns })
                                     .Select(group => new AvailableStockLine
                                     {
                                         locid = group.Key.locid,
                                         lotid = group.Key.lotid,
                                         conid = group.Key.conid,
                                         qty = group.Sum(item => item.qty),



                                         locname = group.First().locname,
                                         lotnumber = group.First().lotnumber,
                                         buildid = group.First().buildid,
                                         buldingname = group.First().buldingname,
                                         conname = group.First().conname,
                                         expdate = group.First().expdate,
                                         loctypeid = group.First().loctypeid,
                                         loctypename = group.First().loctypename,
                                         roomid = group.First().roomid,
                                         roomname = group.First().roomname,
                                         ns = group.Key.ns,
                                         si = group.Key.si,
                                     })
                                     .Where(item => item.qty != 0)
                                     .ToList();


                    // Now, groupedXX contains the rows grouped by locid, lotid, and conid.

                    xx = groupedXX;
                    // Filter xx based on locids
                    if (locids != null && locids.Count > 0)
                    {
                        xx = xx.Where(x => locids.Contains(x.locid)).ToList();
                    }
                    // Filter xx based on expdate
                    if (expiredonly != null && expiredonly == true)
                    {
                        xx = xx.Where(x => x.expdate.HasValue && DateOnly.FromDateTime(x.expdate.Value) <= DateOnly.FromDateTime(DateTime.Now))
          .ToList();


                    }


                }
                else
                {
                    // Handle the case when the key is not found in the dictionary


                }

                retlist.Add(new CustomProduct
                {
                    Id = product.Id,
                    Code = product.Code,
                    Name = product.Name,

                    Barcode = product.Barcode,
                    CreatedDate = product.CreatedDate,
                    DefaultLocId = product.DefaultLocId,
                    DefaultLocName = product.DefaultLoc.Locname + " [" + product.DefaultLoc.Room.Building.Building + ']' + '[' + product.DefaultLoc.Room.Room + ']',
                    DefaultSupplierId = product.DefaultSupplierId,

                    DefaultSupplierName = product.DefaultSupplier.Name,
                    ManufacturerId = product.ManufacturerId,
                    ManufacturerName = product.Manufacturer.Name,
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category.Name,
                    SubcategoryId = product.SubcategoryId,
                    TenderId = product.TenderId,
                    TenderName = product.Tender?.Tendercode ?? "",
                    SubCategoryName = product.Subcategory?.Name,
                    BrandId = product.BrandId,
                    BrandName = product.Brand.Name,
                    ExpdateFlag = product.ExpdateFlag,
                    LabMadeFlag = product.LabMadeFlag,
                    MultipleLocationsFlag = product.MultipleLocationsFlag,
                    Punits = product.Punits,
                    Concentration = product.Concentration,
                    Minstockqty = product.Minstockqty,
                    Costprice = product.Costprice,
                    VatId = product.VatId,
                    VatRate = product.Vat.Rate,
                    GeneralNotes = product.GeneralNotes,
                    ActivestatusFlag = product.ActivestatusFlag,
                    //FordiagnosticsFlag = product.FordiagnosticsFlag,
                    ForsequencingFlag = product.ForsequencingFlag,
                    StorageConditionId = product.StorageConditionId,
                    StorageCondsName = product.StorageCondition.Name,
                    Departments = departments,
                    // Productdepartmentsassigneds=product.Productdepartmentsassigneds,
                    // AvailableStockAnalysis = getAvailableStockAnalysis(product.Id)

                    AvailableStockAnalysis = xx,
                    Availabletotalstockqty = xx.Sum(x => x.qty)


                });
            }


            if (locids != null && locids.Count > 0)
            {
                //  retlist = retlist.Where(x => x.Availabletotalstockqty>0).ToList();
                retlist = retlist.OrderByDescending(x => x.Availabletotalstockqty).ToList();
            }



            return retlist;
        }


        public List<CustomRequestLines> CustomRequestLinesNow(int? reqheaderid, int? reqlineid)
        {


            var selectQuery = (
      from std in _context.Requestlines
        .Include(x => x.Req)
        .Include(x => x.Req.ReqByUsr)
        .Include(x => x.Product)
          .Include(x => x.Project)
         .Include(x => x.Primers)
        .Include(x => x.Porderlines)
        .Include(x => x.Requestdecisionhistories)
            .ThenInclude(history => history.Decision) // Include Decision inside Requestdecisionhistories
        .Include(x => x.Requestdecisionhistories)
            .ThenInclude(history => history.Madebyuser) // Include Madebyuser inside Requestdecisionhistories
      where reqlineid == null || std.Id == reqlineid
      select new CustomRequestLines // Use the serialization model here
      {
          headerreqid = std.Req.Id,
          headerreqdate = std.Req.ReqDate,
          headerreqbyuserid = std.Req.ReqByUsr.Id,
          headerreqbyuserfirstn = std.Req.ReqByUsr.FirstName,
          headerreqbyuserlastn = std.Req.ReqByUsr.LastName,
          headerreqstatusid = 5, // Set a default value here for headerreqstatusid
          headerreqstatusname = "Unknown", // Set a default value here for headerreqstatusname
          headerreqnotes = std.Req.Notes,
          linereqid = std.Id,
          linepid = std.Productid,
          linepcode = std.Product.Code,
          linepbarcode = std.Product.Barcode ?? "",
          linepname = std.Product.Name,
          lineqty = std.Qty,
          linepunitcost = std.Product.Costprice,
          linerequrgentflag = std.UrgentFlag,
          linePrimers = std.Primers,
          //linenucleotideSequence = std.NucleotideSequence,
          //linesequenceidentifier = std.SequenceIdentifier,
          linereqcomment = std.Comment,
          linedefsupplierid = std.Product.DefaultSupplier.Id,
          linedefsuppliername = std.Product.DefaultSupplier.Name,
          lineprojectid = std.Projectid,
          lineprojectname = std.Project.Name ?? "",
          linepActivestatusFlag = std.Product.ActivestatusFlag,
          lineorderedqty = std.Porderlines.Where(p => p.Requestlineid == std.Id).Sum(p => p.Qty),
          //linelastreceivedDate = std.Porderlines
          //              .Where(p => p.Requestlineid == std.Id && p.Pord.Receivings.Any())
          //              .OrderByDescending(p => p.Pord.Receivings.Max(r => (DateTime?)r.Receivedatetime))
          //              .Select(p => p.Pord.Receivings.Max(r => (DateTime?)r.Receivedatetime))
          //              .FirstOrDefault(),
          linelastreceivedDate = std.Porderlines
                        .Where(p => p.Requestlineid == std.Id && p.Receivinglines.Any())
                        .OrderByDescending(p => p.Pord.Receivings.Max(r => (DateTime?)r.Receivedatetime))
                        .Select(p => p.Pord.Receivings.Max(r => (DateTime?)r.Receivedatetime))
                        .FirstOrDefault(),
          linereceivedqty = std.Porderlines
                        .Where(p => p.Requestlineid == std.Id && p.Pord.Receivings.Any())

                        .Select(p => p.Receivinglines.Sum(r => r.Qty))
                        .FirstOrDefault(),
          linelastDecision = std.Requestdecisionhistories
            .OrderByDescending(d => d.Decisiondatetime)
            .FirstOrDefault(),

      });

            var result = selectQuery.OrderByDescending(x => x.headerreqid).ToList();


            foreach (var reqLine in result)
            {
                // Modify properties of each item here

                if (reqLine.linelastDecision is not null)
                {
                    reqLine.linedynamicstatus = reqLine.linelastDecision?.Decision.Name ?? "";

                    if (reqLine.lineorderedqty > 0)
                    {
                        reqLine.linedynamicstatus = "Ordered";

                        if (_context.Porderlines.Where(p => p.Requestlineid == reqLine.linereqid && p.ClosedFlag == true).Count() > 0 && reqLine.linelastreceivedDate is null)
                        {
                            reqLine.linedynamicstatus = "Order closed (will not be received)";
                        }

                    }



                    //if (reqLine.linelastreceivedDate is not null)
                    //{
                    //    var xxxxxxxx = reqLine.linereqid;
                    //    if (reqLine.linereceivedqty >= reqLine.lineorderedqty) { reqLine.linedynamicstatus = "Received"; }
                    //   else {   reqLine.linedynamicstatus = "Partially Received";  }
                    //}
                    if (reqLine.linelastreceivedDate is not null)
                    {
                        if (reqLine.linereceivedqty >= reqLine.lineorderedqty) { reqLine.linedynamicstatus = "Received"; }
                        else if (reqLine.linereceivedqty > 0) { reqLine.linedynamicstatus = "Partially Received"; }
                    }


                }
                else
                {
                    reqLine.linedynamicstatus = "Pending Approval";
                }





                if (reqLine.linelastDecision is not null)
                {
                    reqLine.linelastDecision.Madebyuser.InverseApproverU = null;
                    reqLine.linelastDecision.Madebyuser.ApproverU = null;
                    reqLine.linelastDecision.Madebyuser.Requests = null;
                    reqLine.linelastDecision.Madebyuser.Pickings = null;
                    reqLine.linelastDecision.Madebyuser.Requestdecisionhistories = null;
                    reqLine.linelastDecision.Reqline = null;
                    //  item.linelastDecision.Decision = null;
                    //   item.linelastDecision.Decision.Requestlines = null;
                    reqLine.linelastDecision.Decision.Requestdecisionhistories = null;
                }
            }

            return result;

            //return result;
        }



        async Task<List<CustomRequestLines>> IGlobalService.GetCustomRequstLines(int? reqheaderid)
        {

            return CustomRequestLinesNow(reqheaderid, null);
        }

        async Task<CustomRequestLines> IGlobalService.GetCustomRequstLine(int reqlineid)
        {

            return CustomRequestLinesNow(null, reqlineid).FirstOrDefault();
        }

        async Task<List<PordersStatus>> IGlobalService.GetPorderStatuses(int? id)
        {


            var getList = from m1 in _context.PordersStatuses
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.ToListAsync();
        }

        async Task<List<Itemconditionstatus>> IGlobalService.GetItemConditionStatuses(int? id)
        {


            var getList = from m1 in _context.Itemconditionstatuses
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.ToListAsync();
        }
        async Task<List<Request>> IGlobalService.GetRequests(int? id)
        {


            var getList = from m1 in _context.Requests.Include(x => x.Requestlines)
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.ToListAsync();
        }


        async Task<List<CustomProject>> IGlobalService.GetAllProjects(int? projectid = 0, int? userid = 0, string? projectstatusFilter = "", bool? calcs = false)
        {
            var query = _context.Projects.Include(x => x.Userprojectsassigneds).ThenInclude(x => x.UidNavigation).AsQueryable();

            if (userid > 0 && projectid > 0)
            {
                query = query.Where(p => p.Userprojectsassigneds.Any(upa => upa.Uid == userid && upa.Pid == projectid));
            }
            else if (userid > 0)
            {
                query = query.Where(p => p.Userprojectsassigneds.Any(upa => upa.Uid == userid));
            }
            else if (projectid > 0)
            {
                query = query.Where(p => p.Id == projectid);
            }

            // Apply status filter
            if (!string.IsNullOrWhiteSpace(projectstatusFilter))
            {
                projectstatusFilter = projectstatusFilter.ToLower();
                switch (projectstatusFilter.ToLower())
                {
                    case "active":
                        query = query.Where(p => p.Activestatusflag == true);
                        break;
                    case "notactive":
                        query = query.Where(p => p.Activestatusflag == false);
                        break;
                        // If filter value is neither "active" nor "notactive", do not apply any status filter
                }
            }




            var projects = await query.ToListAsync();

            // Map Project entities to CustomProject objects
            var customProjects = projects.Select(p => new CustomProject(p)).ToList();

            // Loop through each CustomProject and update additional fields

            if (calcs == true)
            {
                foreach (var customProject in customProjects)
                {
                    //  Fetch the values from the database
                    customProject.thissystemamountspent = await GetThisSystemAmountSpentAsync(customProject.Id);

                    customProject.remainingamount = customProject.Totalamount - customProject.Presystemamountspent - (customProject.thissystemamountspent ?? 0);


                }
            }
            return customProjects;

            // return await query.ToListAsync();
        }



        private async Task<decimal?> GetThisSystemAmountSpentAsync(int projectId)
        {
            // Get the POStatusIdForCancelled value once
            var cancelledStatus = await _context.PordersStatuses
                                                .Where(x => x.Name.ToLower() == "cancelled")
                                                .SingleOrDefaultAsync();


            if (cancelledStatus == null)
            {
                throw new InvalidOperationException("Cancelled status not found");
            }

            var POStatusIdForCancelled = cancelledStatus.Id;

            // Query to get the sum of (qty * unitpurcostprice) for each porderline in the specified project
            var thisSystemAmountSpent = await (from p in _context.Porderlines
                                               where p.Requestline.Projectid == projectId &&
                                                     p.Pord.Statusid != POStatusIdForCancelled
                                               select new
                                               {
                                                   AmountSpent = p.ClosedFlag
                                                       ? p.Receivinglines.Sum(rl => rl.Qty * rl.Unitpurcostprice) / p.Unitpurcostprice
                                                       : p.Qty * p.Unitpurcostprice
                                               }).SumAsync(p => (decimal?)p.AmountSpent);

            return Math.Round(thisSystemAmountSpent ?? 0, 2);
        }





        async Task<List<Productdepartment>> IGlobalService.GetAllDepartments(int? id)
        {


            var getList = from m1 in _context.Productdepartments
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            return await getList.ToListAsync();
        }

        public Request GetSingleRequest(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<Request> AddSingleRequestAsync(Request newRequest)
        {
            try
            {

                // Add the newRequest to the database
                _context.Requests.Add(newRequest);

                // Save changes to the database
                await _context.SaveChangesAsync();

                return newRequest;
            }
            catch (Exception ex)
            {
                // Handle exception
                return null;
            }
        }

        public async Task<bool> IsUserAuthorizedToViewReports(int userId)
        {
            var loggedInUser = await _context.Users
                .Include(c => c.Role)
                .Where(xx => xx.Id == userId && !xx.LockoutFlag &&
                             (xx.ClaimCanViewReports ||
                              xx.Role.RoleName.ToLower() == "administrator" ||
                              xx.Role.RoleName.ToLower() == "super admin"))
                .SingleOrDefaultAsync();

            return loggedInUser != null;
        }

        public async Task<bool> IsUserAuthorizedToMakeRequests(int userId)
        {
            var loggedInUser = await _context.Users
                .Include(c => c.Role)
                .Where(xx => xx.Id == userId && !xx.LockoutFlag &&
                             (xx.ClaimCanMakeRequest ||
                              xx.Role.RoleName.ToLower() == "administrator" ||
                              xx.Role.RoleName.ToLower() == "super admin"))
                .SingleOrDefaultAsync();

            return loggedInUser != null;
        }

        public async Task<bool> IsUserAuthorizedToTransferStock(int userId)
        {
            var loggedInUser = await _context.Users
                .Include(c => c.Role)
                .Where(xx => xx.Id == userId && !xx.LockoutFlag &&
                             (xx.ClaimCanTransferStock ||
                              xx.Role.RoleName.ToLower() == "administrator" ||
                              xx.Role.RoleName.ToLower() == "super admin"))
                .SingleOrDefaultAsync();

            return loggedInUser != null;
        }

        public async Task<bool> IsUserAuthorizedToMakeInventoryAdjustment(int userId)
        {
            var loggedInUser = await _context.Users
                .Include(c => c.Role)
                .Where(xx => xx.Id == userId && !xx.LockoutFlag &&
                             (xx.ClaimCanMakeInventoryAdjustment ||
                              xx.Role.RoleName.ToLower() == "administrator" ||
                              xx.Role.RoleName.ToLower() == "super admin"))
                .SingleOrDefaultAsync();

            return loggedInUser != null;
        }

        public async Task<bool> IsUserAuthorizedToReceiveItems(int userId)
        {
            var loggedInUser = await _context.Users
                .Include(c => c.Role)
                .Where(xx => xx.Id == userId && !xx.LockoutFlag &&
                             (xx.ClaimCanReceiveItems ||
                              xx.Role.RoleName.ToLower() == "administrator" ||
                              xx.Role.RoleName.ToLower() == "super admin"))
                .SingleOrDefaultAsync();

            return loggedInUser != null;
        }

        public async Task<bool> IsUserAuthorizedToMakePO(int userId)
        {
            var loggedInUser = await _context.Users
                .Include(c => c.Role)
                .Where(xx => xx.Id == userId && !xx.LockoutFlag &&
                             (xx.ClaimCanMakePo ||
                              xx.Role.RoleName.ToLower() == "administrator" ||
                              xx.Role.RoleName.ToLower() == "super admin"))
                .SingleOrDefaultAsync();

            return loggedInUser != null;
        }

        public async Task<bool> IsUserAdminOrSuperAdmin(int userId)
        {
            var loggedInUser = await _context.Users
                .Include(c => c.Role)
                .Where(xx => xx.Id == userId && !xx.LockoutFlag &&
                             (
                              xx.Role.RoleName.ToLower() == "administrator" ||
                              xx.Role.RoleName.ToLower() == "super admin"))
                .SingleOrDefaultAsync();

            return loggedInUser != null;
        }


        int IGlobalService.LoggedInUserID(ClaimsPrincipal principal)
        {
            int id = 0;

            var loggedInUserId = principal?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(loggedInUserId))
            {
                bool result = int.TryParse(loggedInUserId, out id);
            }

            return id;
        }

        private class RequestCheckResult
        {
            public int ReqID { get; set; } = 0;
            public int ProductID { get; set; } = 0;
            public string ReqCurrentStatusName { get; set; } = "";
            public int TotalOrderQty { get; set; } = 0;
            public int AllocatedQty { get; set; } = 0;
        }

        private class TotalReceivedItemsForThatOrder
        {

            public int ProductID { get; set; } = 0;
            public int TotalReceivedQtyForSpecificOrderItem { get; set; } = 0;
            public int TempRemainingQtyAfterAllocation { get; set; } = 0;
        }

        Product IGlobalService.UpdateSingleProduct(Product product)
        {
            throw new NotImplementedException();
        }

        List<AvailableStockLine> IGlobalService.getProductAvailableStockAnalysis(int pid)
        {
            throw new NotImplementedException();
        }

        DataTable IGlobalService.FillDataTable(string sqlQuery, params DbParameter[] parameters)
        {
            throw new NotImplementedException();
        }
        async Task<Receiving> IGlobalService.AddSingleReceivingAsync(Receiving newreceiving, int userID)
        {
            var x = new Receiving();

            using (var db = _context) // Create a new DbContext instance
            {
                var strategy = db.Database.CreateExecutionStrategy();

                await strategy.ExecuteAsync(async () =>
                {
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        x = newreceiving;

                        foreach (var line in x.Receivinglines)
                        {
                            if (line != null)
                            {
                                line.VatindexNavigation = null;
                                line.Product = null;
                                line.Id = 0;



                                if (line.Qty <= 0 || line.Lotid <= 0 || line.ReceivinglocId <= 0 || line.Vatindex <= 0 || line.Unitpurcostprice < 0 || line.LinediscountPerc < 0)
                                {
                                    transaction.Rollback();
                                    x = null;
                                    return;
                                }
                                else
                                {


                                }
                            }
                            else  //orderline is null
                            {
                                transaction.Rollback();
                                x = null;
                                return;
                            }
                            //end for each
                        }

                        db.Receivings.Add(x);
                        db.SaveChanges();


                        //update porder line vatindex if needed (because user is receiving with different vatrate than the one exists on porder line.

                        try
                        {
                            foreach (var line in x.Receivinglines)
                            {
                                if (line != null && line.PolineId != null)
                                {
                                    var porderlineToUpdate = db.Porderlines.FirstOrDefault(x => x.Id == line.PolineId);

                                    if (porderlineToUpdate != null)
                                    {
                                        if (porderlineToUpdate.Vatindex != line.Vatindex)
                                        {

                                            var oldent = _logger.SerializeItNow(porderlineToUpdate);
                                            porderlineToUpdate.Vatindex = line.Vatindex;

                                            db.Entry(porderlineToUpdate).State = EntityState.Modified;

                                            // Log the request


                                            await _logger.LogRequest(
                                                   actionbyuserId: userID, // Example user ID
                                                   actiontype: "Edit Vat Index", // Example action type
                                                   tablename: "PorderLines", // Example table name
                                                   oldEntity: oldent, // Example old entity data
                                                   newEntity: _logger.SerializeItNow(porderlineToUpdate), // Serialize the new entity
                                                   primarykey: line.PolineId ?? 0, // Example primary key
                                                   actionbyip: "127.0.0.1", // Example IP address
                                                   extranotes: "Vat Rate Updated because of receiving vat rate (receiving header id: " + x.Id.ToString() + ")" // Example extra notes
                                               );
                                        }


                                    }




                                }
                            }

                        }
                        catch
                        {
                            // error while updating stock
                            transaction.Rollback();
                            x = null;
                            return;
                        }

                         
                        //update stock after receiving

                        try
                        {
                            foreach (var line in x.Receivinglines)
                            {
                                if (line != null)
                                {
                                    // Add logging
                                    Console.WriteLine($"Processing line with Id: {line.Id}");

                                    var poline1 = line.Poline;

                                    if (line.PolineId > 0 && poline1 is not null)
                                    {

                                        //start
                                        if (poline1.Requestlineid > 0)
                                        {
                                            // Fetch Requestline using a context query
                                            var requestline = _context.Requestlines.Include(x => x.Primers).FirstOrDefault(rl => rl.Id == poline1.Requestlineid);

                                            if (requestline != null && requestline.Primers != null && requestline.Primers.Count > 0)
                                            {
                                                foreach (var primer in requestline.Primers)
                                                {
                                                    var newstockline = new Stock
                                                    {
                                                        Productid = line.Productid,
                                                        Lotid = line.Lotid,
                                                        Qty = 1,
                                                        Conditionstatus = line.Conditionstatus,
                                                        Locid = line.ReceivinglocId,
                                                        Si = primer.SequenceIdentifier,
                                                        Ns = primer.NucleotideSequence
                                                    };

                                                    db.Stocks.Add(newstockline);
                                                }
                                            }
                                            else
                                            {
                                                // Handle the case where requestline.Primers is null or empty

                                                //its a request without primers
                                                var newstockline = new Stock();
                                                newstockline.Productid = line.Productid;
                                                newstockline.Lotid = line.Lotid;
                                                newstockline.Qty = line.Qty;
                                                newstockline.Conditionstatus = line.Conditionstatus;
                                                newstockline.Locid = line.ReceivinglocId;
                                                db.Stocks.Add(newstockline);
                                            }
                                        }
                                        else  // receiving something ordered without request
                                        {

                                            var newstockline = new Stock();
                                            newstockline.Productid = line.Productid;
                                            newstockline.Lotid = line.Lotid;
                                            newstockline.Qty = line.Qty;
                                            newstockline.Conditionstatus = line.Conditionstatus;
                                            newstockline.Locid = line.ReceivinglocId;
                                            db.Stocks.Add(newstockline);
                                        }
                                        //end


                                    }
                                    else
                                    {
                                        //cannot receive witout referrencing order
                                        transaction.Rollback();
                                        x = null;
                                        return;
                                    }



                                }
                                else
                                {
                                    //cannot receive if line is empty
                                    transaction.Rollback();
                                    x = null;
                                    return;
                                }
                            }
                        }
                        catch
                        {
                            // Error while updating stock
                            transaction.Rollback();
                            x = null;
                            return;
                        }

                         
                        //insert stock transanction after receiving

                        try
                        {
                            var findstocktransreason = 0;
                            try
                            {
                                findstocktransreason = db.StockTransReasons.Where(x => x.ReasonName.Trim().ToLower().Equals("System".ToLower().Trim())).SingleOrDefault().Id;

                            }
                            catch (Exception)
                            {

                                findstocktransreason = -1;
                            }

                            if (findstocktransreason <= 0)
                            {
                                // result = NotFound("Transaction Reason not found: " + reasonId.ToString());
                                // error while updating stock
                                transaction.Rollback();
                                x = null;
                                return;

                            }



                            var findstocktranstypeforAdjustment = 0;
                            try
                            {
                                findstocktranstypeforAdjustment = db.StockTransTypes.Where(x => x.TypeName.Trim().ToLower().Equals("Receiving".ToLower().Trim())).SingleOrDefault().Id;

                            }
                            catch (Exception)
                            {

                                findstocktranstypeforAdjustment = -1;
                            }
                            if (findstocktranstypeforAdjustment <= 0)
                            {
                                // result = NotFound("Sorry, An error occurred because stock trans type Adjustment is not found.. !");
                                transaction.Rollback();
                                x = null;
                                return;
                            }


                            var findstocktranstypeStatusCompleted = 0;
                            try
                            {
                                findstocktranstypeStatusCompleted = db.StockTransStatuses.Where(x => x.Name.Trim().ToLower().Equals("Completed".ToLower().Trim())).SingleOrDefault().Id;

                            }
                            catch (Exception)
                            {

                                findstocktranstypeStatusCompleted = -1;
                            }
                            if (findstocktranstypeStatusCompleted <= 0)
                            {
                                //result = NotFound("Sorry, An error occurred because stock trans type Status is not found.. !");
                                transaction.Rollback();
                                x = null;
                                return;
                            }



                            var stocktrans_header = new StockTran();
                            stocktrans_header.Userid = x.ByuserId;
                            stocktrans_header.StockTransTypeId = findstocktranstypeforAdjustment;
                            stocktrans_header.StockTransReasonId = findstocktransreason;
                            stocktrans_header.Transdate = DateTime.Now;
                            stocktrans_header.Status = findstocktranstypeStatusCompleted;
                            stocktrans_header.Description = "Receiving";


                            foreach (var line in x.Receivinglines)
                            {
                                if (line != null)
                                {


                                    var StockTrans_Details = new StockTransDetail
                                    {
                                        Lotid = line.Lotid,
                                        Qty = line.Qty,
                                        Locid = line.ReceivinglocId,
                                        Pid = line.Productid,
                                        Conditionstatus = line.Conditionstatus,
                                        Unitcostprice = line.Unitpurcostprice,
                                        UnitcostRecalculationFlag = true,
                                        DocumentLineid = line.Id
                                    };
                                    stocktrans_header.StockTransDetails.Add(StockTrans_Details);

                                }
                            }



                            db.StockTrans.Add(stocktrans_header); // parent and its children gets added
                             

                        }
                        catch
                        {
                            // error while updating stock
                            transaction.Rollback();
                            x = null;
                            return;
                        }





                        //update purchase order status if needed
                        var pordertoUpdate = db.Porders.Include(x => x.Porderlines).FirstOrDefault(x => x.Id == newreceiving.PorderId);
                        // var allreceivingsForThatOrder = context.Receivings.Where(x => x.PorderId == newreceiving.PorderId).Include(x => x.Receivinglines);
                        var allreceivingsForThatOrder = db.Receivinglines.Include(x => x.Receiving).Where(x => x.ReceivingId == x.Receiving.Id && x.Receiving.PorderId == newreceiving.PorderId);

                        var compareorderwithreceivingquery = from t1 in pordertoUpdate.Porderlines
                                                             join t2 in allreceivingsForThatOrder
                                                             on t1.Productid equals t2.Productid into t2Group
                                                             from t2 in t2Group.DefaultIfEmpty()
                                                             group new { t1, t2 } by t1.Productid into g
                                                             select new
                                                             {
                                                                 pid = g.Key,

                                                                 qtyordered = g.Average(x => x.t1.Qty),
                                                                 qtyreceivedAlready = g.Sum(x => x.t2 == null ? 0 : x.t2.Qty),
                                                                 qtyreceivingNow = x.Receivinglines.Where(ee => ee.Productid == g.Key).Sum(ee => ee.Qty)
                                                             };





                        if (pordertoUpdate != null)
                        {
                            try
                            {
                                var allporderlinesreceivedCheck = true;

                                foreach (var item in compareorderwithreceivingquery) // if pline not fully received then set flag as false.
                                {
                                    //  Console.WriteLine($"Product id : {item.pid}, RecQTY : {item.qtyreceived} , OrdQTY : {item.qtyordered} ");
                                    //   if (item.qtyordered - (item.qtyreceivedAlready + item.qtyreceivingNow) > 0) { allporderlinesreceivedCheck = false; break; }
                                    if (item.qtyordered - (item.qtyreceivedAlready) > 0) { allporderlinesreceivedCheck = false; break; }
                                }


                                var POStatusIdForReceived = db.PordersStatuses.Where(x => x.Name.ToLower() == "Received".ToLower()).Single().Id;
                                var POStatusIdForPartiallyReceived = db.PordersStatuses.Where(x => x.Name.ToLower() == "Partially Received".ToLower()).Single().Id;

                                if (allporderlinesreceivedCheck)
                                { pordertoUpdate.Statusid = POStatusIdForReceived; }
                                else
                                { pordertoUpdate.Statusid = POStatusIdForPartiallyReceived; }



                                db.Entry(pordertoUpdate).State = EntityState.Modified;
                                //await _context.SaveChangesAsync();


                            }
                            catch
                            {
                                // error while updating porder status
                                transaction.Rollback();
                                x = null;
                                return;
                            }
                        }


                        //check globally and update requests status if needed after the receiving of that order
                        var requestIdsForReceivedORder = pordertoUpdate.Porderlines.Where(x => x.Requestlineid > 0).Select(x => x.Requestlineid).Distinct();



                        var ReqCheckList = new List<RequestCheckResult>();
                        var totalreceiveditemsforthatorder = new List<TotalReceivedItemsForThatOrder>();
                        // loop the req ids if found

                        foreach (var reqid in requestIdsForReceivedORder)
                        {
                            RequestCheckResult request = new RequestCheckResult();
                            request.ReqID = reqid ?? 0;
                            //  request.ReqCurrentStatusName = context.Requestlines.Include(c => c.CurrentDecision).Where(x => x.Id == request.ReqID).Single().Decision.Name;
                            request.ReqCurrentStatusName = "Unknown";
                            request.ProductID = db.Requestlines.Where(x => x.Id == request.ReqID).Single().Productid;


                            request.TotalOrderQty = db.Porderlines.Where(x => x.Productid == request.ProductID && x.Requestlineid == request.ReqID).Sum(xx => xx.Qty);
                            request.AllocatedQty = 0;
                            ReqCheckList.Add(request);
                            //kai itan panw se paraggelies pou paralava pou sxetizontan me auto to request

                            if (!totalreceiveditemsforthatorder.Where(xx => xx.ProductID == request.ProductID).Any())
                            {
                                TotalReceivedItemsForThatOrder itemrecqty = new TotalReceivedItemsForThatOrder();
                                itemrecqty.ProductID = request.ProductID;
                                itemrecqty.TotalReceivedQtyForSpecificOrderItem = db.Receivinglines.Include(c => c.Receiving).Where(c => c.Productid == request.ProductID && c.Receiving.PorderId == pordertoUpdate.Id).Sum(xx => xx.Qty);
                                itemrecqty.TempRemainingQtyAfterAllocation = itemrecqty.TotalReceivedQtyForSpecificOrderItem;
                                totalreceiveditemsforthatorder.Add(itemrecqty);
                            }
                        }


                        var sortedReqCheckList = ReqCheckList.OrderBy(x => x.ReqID);

                        foreach (var requestresultline in sortedReqCheckList)
                        {
                            var qtyorderedForrequest = requestresultline.TotalOrderQty;
                            var qtyreceivedandremaingforallocation = totalreceiveditemsforthatorder.Where(v => v.ProductID == requestresultline.ProductID).Single().TempRemainingQtyAfterAllocation;

                            if (qtyorderedForrequest <= qtyreceivedandremaingforallocation)
                            {
                                requestresultline.AllocatedQty = qtyorderedForrequest;

                            }
                            else
                            {
                                requestresultline.AllocatedQty = qtyreceivedandremaingforallocation;
                            }
                            foreach (var recstockline in totalreceiveditemsforthatorder.Where(v => v.ProductID == requestresultline.ProductID).ToList())
                            {
                                recstockline.TempRemainingQtyAfterAllocation = qtyreceivedandremaingforallocation - requestresultline.AllocatedQty;
                            }

                            //all checks and allocations were done. now lets do some updates in database based on checks.
                          

                        }


                        db.SaveChanges();
                        transaction.Commit();

                    }
                });
            } // Dispose of the DbContext

           

            return x;
        }

       

        public async Task<Porder> AddSinglePOrderAsync(Porder newporder)
        {
            var executionStrategy = _context.Database.CreateExecutionStrategy();

            var result = await executionStrategy.ExecuteAsync(async () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        var x = new Porder
                        {
                            Supplierid = newporder.Supplierid,
                            Tenderid = newporder.Tenderid,
                            Porderlines = newporder.Porderlines,
                            Ordercreateddate = newporder.Ordercreateddate,
                            Podate = newporder.Podate,
                            Duedate = newporder.Duedate,
                            Createdbyempid = newporder.Createdbyempid,
                            Notes = newporder.Notes,
                            Statusid = _context.PordersStatuses.FirstOrDefault(s => s.Name.ToLower() == "sent")?.Id ?? 0
                        };


 
                        try
                        {
                            _context.Porders.Add(x);
                            _context.ChangeTracker.AutoDetectChangesEnabled = false;
                            await _context.SaveChangesAsync();

                         
                            

                            foreach (var orderLine in x.Porderlines)
                            {
                                if (orderLine != null)
                                {
                                    if (orderLine.Qty <= 0)
                                    {
                                        transaction.Rollback();
                                        return null;
                                    }

                                    if (orderLine.Requestlineid > 0)
                                    {

                                        var reqLine = _context.Requestlines
       .Include(x => x.Requestdecisionhistories)
       .FirstOrDefault(x => x.Id == orderLine.Requestlineid);

                                        // If the Requestline is null or it doesn't have any decision history, perform a rollback.
                                        if (reqLine == null || reqLine.Requestdecisionhistories.Count == 0)
                                        {
                                            transaction.Rollback();
                                            return null;
                                        }

                                        // Get the latest decision history by datetime.
                                        var latestDecisionHistory = reqLine.Requestdecisionhistories
                                            .OrderByDescending(history => history.Decisiondatetime)
                                            .FirstOrDefault();

                                        // If there is no decision history or the latest decision is not "approved", perform a rollback.
                                        if (latestDecisionHistory == null || latestDecisionHistory.Decision.Name.ToLower() != "approved")
                                        {
                                            transaction.Rollback();
                                            return null;
                                        }



                                        
                                    }
                                }
                                else
                                {
                                    transaction.Rollback();
                                    return null;
                                }
                            }

                            await _context.SaveChangesAsync();

                            //    transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            // Handle the exception 
                        }
                        finally
                        {
                            _context.ChangeTracker.AutoDetectChangesEnabled = true;
                        }

                        transaction.Commit();


                        var updatedOrder = await _context.Porders.Where(xx => xx.Id == x.Id).SingleAsync();
                        return updatedOrder;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw ex;
                    }
                }
            });

            return result;
        }
        async public Task<Supplier> EditSingleSupplierAsync(Supplier updatedSupplier)
        {
            try
            {
                var existingTender = await _context.Suppliers.FindAsync(updatedSupplier.Id);

                if (existingTender != null)
                {
                 
                    updatedSupplier.CreatedDate = existingTender.CreatedDate;


                    // Update the remaining fields
                    _context.Entry(existingTender).CurrentValues.SetValues(updatedSupplier);
                    await _context.SaveChangesAsync();


                    return existingTender;
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the update process
                

                return null;
            }

            return null;  
        }


        async public Task<Manufacturer> EditSingleManufacturerAsync(Manufacturer updatedSupplier)
        {
            try
            {
                var existingTender = await _context.Manufacturers.FindAsync(updatedSupplier.Id);

                if (existingTender != null)
                {
                   
                    updatedSupplier.CreatedDate = existingTender.CreatedDate;


                    // Update the remaining fields
                    _context.Entry(existingTender).CurrentValues.SetValues(updatedSupplier);
                    await _context.SaveChangesAsync();


                    return existingTender;
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the update process
                

                return null;
            }

            return null;  
        }


        public async Task<Project> EditSingleProjectAsync(Project updatedTender)
        {
            try
            {
               
                var existingTenderInDB = await _context.Projects
                    .Include(t => t.Userprojectsassigneds)
                    .SingleOrDefaultAsync(t => t.Id == updatedTender.Id);

                if (existingTenderInDB != null)
                {
                    
                    updatedTender.CreatedDate = existingTenderInDB.CreatedDate;
                    updatedTender.Createdbyempid = existingTenderInDB.Createdbyempid;

                  
                    _context.Entry(existingTenderInDB).CurrentValues.SetValues(updatedTender);
 
                    foreach (var existingSupplierAssigned in existingTenderInDB.Userprojectsassigneds.ToList())
                    {
                        if (!updatedTender.Userprojectsassigneds.Any(u => u.Uid == existingSupplierAssigned.Uid))
                        {
                            _context.Userprojectsassigneds.Remove(existingSupplierAssigned);
                        }
                    }

                   
                    foreach (var updatedSupplier in updatedTender.Userprojectsassigneds)
                    {
                        if (!existingTenderInDB.Userprojectsassigneds.Any(e => e.Uid == updatedSupplier.Uid))
                        {
                            existingTenderInDB.Userprojectsassigneds.Add(updatedSupplier);
                        }
                    }

                    

                    await _context.SaveChangesAsync();

                    return existingTenderInDB;
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the update process
               

                return null;
            }

            return null; // If is not found, return null
        }


      

        public async Task<Tender> EditSingleTenderAsync(Tender updatedTender)
        {
            try
            {
                // Load existing tender including the related Tendersuppliersassigneds
                var existingTenderInDB = await _context.Tenders
                    .Include(t => t.Tendersuppliersassigneds)
                    .SingleOrDefaultAsync(t => t.Id == updatedTender.Id);

                if (existingTenderInDB != null)
                {
             
                    updatedTender.Createddate = existingTenderInDB.Createddate;
                    updatedTender.Createdbyempid = existingTenderInDB.Createdbyempid;

                    // Update the remaining fields
                    _context.Entry(existingTenderInDB).CurrentValues.SetValues(updatedTender);

                    // Update Tendersuppliersassigneds
                    // Remove existing entries that are not in the updatedTender
                    foreach (var existingSupplierAssigned in existingTenderInDB.Tendersuppliersassigneds.ToList())
                    {
                        if (!updatedTender.Tendersuppliersassigneds.Any(u => u.Sid == existingSupplierAssigned.Sid))
                        {
                            _context.Tendersuppliersassigneds.Remove(existingSupplierAssigned);
                        }
                    }

                    // Add new entries that are not in the existingTender
                    foreach (var updatedSupplier in updatedTender.Tendersuppliersassigneds)
                    {
                        if (!existingTenderInDB.Tendersuppliersassigneds.Any(e => e.Sid == updatedSupplier.Sid))
                        {
                            existingTenderInDB.Tendersuppliersassigneds.Add(updatedSupplier);
                        }
                    }

                    

                    await _context.SaveChangesAsync();

                    return existingTenderInDB;
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the update process
               

                return null;
            }

            return null; // If the existing is not found, return null
        }


        

        async public Task<CustomProject> AddSingleProjectAsync(Project newproject)
        {
            var x = new Project();
            x = newproject;

            try
            {
                _context.Projects.Add(x);
                await _context.SaveChangesAsync();
                //  var result = await GetAllProjects( projectid: x.Id, calcs: null);

                IGlobalService imsservice = new IMSService(_context, _logger);
                var result = await imsservice.GetAllProjects(projectid: x.Id, calcs: true);

                if (result != null)
                {
                    return result.First();
                }
                return null;


            }
            catch (Exception ex)
            {
                return null;
            }
        }




        async public Task<Product> AddSingleProductAsync(Product newProduct)
        {
            try
            {
                // Initialize a new product entity
                var productEntity = new Product
                {
                   
                    //  Barcode = string.IsNullOrEmpty(newProduct.Barcode?.Trim()) ? null : newProduct.Barcode.Trim()
                };

                productEntity = newProduct;
                productEntity.Barcode = string.IsNullOrEmpty(newProduct.Barcode?.Trim()) ? null : newProduct.Barcode.Trim();


                // Add the new product to the context
                await _context.Products.AddAsync(productEntity);
                await _context.SaveChangesAsync(); // Save to get the product ID

                // Create department assignments
                var departmentAssignments = new List<Productdepartmentsassigned>();
                foreach (var department in newProduct.Productdepartmentsassigneds)
                {
                    departmentAssignments.Add(new Productdepartmentsassigned
                    {
                        Pid = productEntity.Id, // Assign the saved product ID
                        Did = department.Did
                    });
                }

                // Add the department assignments to the context
                await _context.Productdepartmentsassigneds.AddRangeAsync(departmentAssignments);
                await _context.SaveChangesAsync(); // Save all changes

                // Reload the entire productEntity from the database

                await _context.Entry(productEntity).ReloadAsync();
             



                return productEntity;
            }
            catch (Exception ex)
            {
                // Log the exception if necessary
                
                return null;
            }
        }

        async public Task<CustomTender> AddSingleTenderAsync(Tender newtender)
        {
            var x = new Tender();
            x = newtender;

            try
            {
                _context.Tenders.Add(x);
                await _context.SaveChangesAsync();
                var result = await GetAllTenders(x.Id, null, null);
                if (result != null)
                {
                    return result.First();
                }
                return null;


            }
            catch (Exception ex)
            {
                return null;
            }
        }
        async public Task<Jobrole> AddSingleJobRoleAsync(Jobrole newjobRole)
        {
            var x = new Jobrole();
            x = newjobRole;

            try
            {
                _context.Jobroles.Add(x);
                await _context.SaveChangesAsync();
                var result = await GetAllTenders(x.Id, null, null);
                if (result != null)
                {
                    return x;
                }
                return null;


            }
            catch (Exception ex)
            {
                return null;
            }
        }

        async public Task<Jobrole> EditSingleJobRoleAsync(Jobrole updateJobRole)
        {
            try
            {
                var existingJobRole = await _context.Jobroles.FindAsync(updateJobRole.Id);

                if (existingJobRole != null)
                {
                  

                    // Update the remaining fields
                    _context.Entry(existingJobRole).CurrentValues.SetValues(updateJobRole);
                    await _context.SaveChangesAsync();


                    return existingJobRole;
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the update process
                 

                return null;
            }

            return null; // If the existing  is not found, return null
        }

        async public Task<CustomPurchaserderWithSupplierInvoices?> GetAllCustomPorderRelatedSupplierInvoices(int orderid)
        {
            if (orderid <= 0)
            {
                return null;
            }

            var porderInvoices = new CustomPurchaserderWithSupplierInvoices();
            var invoices = new List<CustomSupplierInvoiceModel>();
            var getPurchOrder = await _context.Porders
    .Where(x => x.Id == orderid)
    .Include(x => x.Porderlines)
        .ThenInclude(porderline => porderline.VatindexNavigation)
    .Include(x => x.Receivings)
        .ThenInclude(receiving => receiving.Invoice)
        .ThenInclude(invoice => invoice.Receivings)  // Include Receivinglines here
    .FirstOrDefaultAsync();

           

            if (getPurchOrder is not null)
            {
                porderInvoices.orderid = getPurchOrder.Id;

                decimal totalPorderAmountExcludingVat = 0m;
                decimal totalPorderVATAmount = 0m;

                foreach (var porderline in getPurchOrder.Porderlines)
                {
                    decimal qtyToAdd;

                    if (!porderline.ClosedFlag)
                    {
                        qtyToAdd = porderline.Qty;
                    }
                    else
                    {
                        var receivedQty = porderline.Receivinglines.Sum(receivingline => receivingline.Qty);
                        qtyToAdd = receivedQty;
                    }

                    totalPorderAmountExcludingVat += Math.Round(qtyToAdd * porderline.Unitpurcostprice, 2);
                    totalPorderVATAmount += Math.Round((qtyToAdd * porderline.Unitpurcostprice) * (porderline.VatindexNavigation.Rate / 100), 2);
                }

                porderInvoices.ordertotalamountexcludingvat = totalPorderAmountExcludingVat;
                porderInvoices.ordertotalvatamount = totalPorderVATAmount;
                porderInvoices.ordertotalamountincludingvat = totalPorderAmountExcludingVat + totalPorderVATAmount;

                

                var groupedInvoices = getPurchOrder.Receivings
    .SelectMany(r => r.Receivinglines, (receiving, receivingLine) => new { Receiving = receiving, ReceivingLine = receivingLine })
    .Where(x => x.Receiving.Invoice?.Supinvno != null)  // Exclude items where the invoice is null
    .GroupBy(x => new { x.Receiving.Invoice?.Supinvno });


                foreach (var group in groupedInvoices)
                {
                    var invoice = new CustomSupplierInvoiceModel();

                    invoice.docno = group.Key.Supinvno;

                    decimal invoiceTotalAmountIncludingVat = 0m;

                    foreach (var item in group)
                    {
                        var receivingLine = item.ReceivingLine;

                        decimal lineAmountIncludingVat = Math.Round((receivingLine.Qty * receivingLine.Unitpurcostprice) * (1 + (receivingLine.VatindexNavigation.Rate / 100)), 2);
                        invoiceTotalAmountIncludingVat += lineAmountIncludingVat;
                    }

                    invoice.totalamountoflinestincludingVat = invoiceTotalAmountIncludingVat;

                    invoice.shippingandhandlingcostexcludingvat = group.Max(x => x.Receiving.Invoice?.SupInvShippingAndHandlingCost);
                    invoice.shippingandhandlingcostexcludingvat = Math.Round(invoice.shippingandhandlingcostexcludingvat ?? 0, 2);

                    invoice.shippingandhandlingcostvatindex = group.FirstOrDefault(x => (x.Receiving.Invoice?.VatId.HasValue ?? false))?.Receiving.Invoice?.VatId;

                    if (invoice.shippingandhandlingcostvatindex.HasValue && invoice.shippingandhandlingcostvatindex > 0)
                    {
                        invoice.shippingandhandlingcostvatrate = group.FirstOrDefault(x => (x.Receiving.Invoice?.VatId.HasValue ?? false) && x.Receiving.Invoice.Vat != null)?.Receiving.Invoice?.Vat?.Rate;

                        decimal shippingandhandlingcostincludingvat = Math.Round((invoice.shippingandhandlingcostexcludingvat ?? 0) * (1 + ((invoice.shippingandhandlingcostvatrate ?? 0) / 100)), 2);
                        invoice.shippingandhandlingcostincludingvat = shippingandhandlingcostincludingvat;
                    }

                    

                    invoices.Add(invoice);
                }
            }

            

            porderInvoices.invoices = invoices;



            return porderInvoices;
        }
        


        async public Task<CustomPurchaserderWithSupplierInvoices>? GetRelatedInvoicesNEW(int orderid)
        {
            if (orderid <= 0)
            {
                return null;
            }

            var x = new CustomPurchaserderWithSupplierInvoices();


            var invoices = new List<CustomSupplierInvoiceModel>();

            try
            {
                var getPurchOrder = await _context.Porders
        .Where(x => x.Id == orderid)
        .Include(x => x.Porderlines)
            .ThenInclude(porderline => porderline.VatindexNavigation)
        .Include(x => x.Receivings)
            .ThenInclude(receiving => receiving.Invoice)

            .ThenInclude(invoice => invoice.Receivings)
                .ThenInclude(receiving => receiving.Receivinglines)
        .FirstOrDefaultAsync();


                if (getPurchOrder != null)
                {


                    x.orderid = getPurchOrder.Id;



                    decimal totalPorderAmountExcludingVat = 0m;
                    decimal totalPorderVATAmount = 0m;

                    foreach (var porderline in getPurchOrder.Porderlines)
                    {
                        decimal qtyToAdd;

                        if (!porderline.ClosedFlag)
                        {
                            qtyToAdd = porderline.Qty;
                        }
                        else
                        {
                            var receivedQty = porderline.Receivinglines.Sum(receivingline => receivingline.Qty);
                            qtyToAdd = receivedQty;
                        }

                        totalPorderAmountExcludingVat += Math.Round(qtyToAdd * porderline.Unitpurcostprice, 2);
                        totalPorderVATAmount += Math.Round((qtyToAdd * porderline.Unitpurcostprice) * (porderline.VatindexNavigation.Rate / 100), 2);
                    }

                    x.ordertotalamountexcludingvat = totalPorderAmountExcludingVat;
                    x.ordertotalvatamount = totalPorderVATAmount;
                    x.ordertotalamountincludingvat = totalPorderAmountExcludingVat + totalPorderVATAmount;

 

                    var invoiceIds = getPurchOrder.Receivings
       .Where(receiving => receiving.Invoice != null)
       .Select(receiving => receiving.Invoice.Id)
       .Distinct();


                    foreach (var invoiceId in invoiceIds)
                    {


                        if (invoiceId > 0)
                        {
                          


                            Task<CustomSupplierInvoiceModel>? customInvoiceTask = GetSupplierInvoiceNew(invoiceId);

                            if (customInvoiceTask is not null)
                            {
                                CustomSupplierInvoiceModel customInvoice = await customInvoiceTask;
                                invoices.Add(customInvoice);
                            }
                        }
                    }


                  


                }
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                return null;
            }
            x.invoices = invoices;
            return x;
        }


        private decimal CalculateTotalAmountForReceivings(Receiving receiving)
        {

            return receiving.Receivinglines.Sum(receivingLine => (receivingLine.Qty * receivingLine.Unitpurcostprice) * (1 + (receivingLine.VatindexNavigation.Rate / 100)));

        }

        private decimal CalculateTotalAmountExcludingVatForReceivings(Receiving receiving)
        {
            // return receiving.Receivinglines.Sum(receivingLine => (receivingLine.Qty * receivingLine.Unitpurcostprice) * (1 - receivingLine.VatindexNavigation.Rate / 100));
            return receiving.Receivinglines.Sum(receivingLine => receivingLine.Qty * receivingLine.Unitpurcostprice);
        }



        private decimal CalculateTotalAmountofLinesDiscountForReceivings(Receiving receiving)
        {
            return receiving.Receivinglines.Sum(receivingLine => (receivingLine.Qty * (receivingLine.Originalpurcostpricebeforedisc - receivingLine.Unitpurcostprice)));
        }


        async public Task<CustomSupplierInvoiceModel>? GetSupplierInvoiceNew(int invoiceid)
        {
            if (invoiceid <= 0)
            {
                return null;
            }

            var x = new CustomSupplierInvoiceModel();

            try
            {
                var invoice = await _context.SupplierInvoices
                    .Where(i => i.Id == invoiceid)
                    .Include(i => i.Receivings)
                        .ThenInclude(r => r.Receivinglines)
                         .ThenInclude(a => a.VatindexNavigation)
                    .FirstOrDefaultAsync();

                if (invoice != null)
                {
                    if (invoice.Vat == null)
                    {
                        _context.Entry(invoice).Reference(i => i.Vat).Load();
                    }


                    x.invoiceid = invoice.Id;
                    x.invdate = invoice.Supinvdate;
                    x.docno = invoice.Supinvno;
                    x.totalamountoflinestincludingVat = CalculateTotalAmountForReceivingsList(invoice.Receivings);
                    x.totalamountoflinesexcludingVat = CalculateTotalAmountExcludingVatForReceivingsList(invoice.Receivings);
                    x.totalamountoflinesdiscount = CalculateTotalAmountofLinesDiscountForReceivingsList(invoice.Receivings);
                    x.shippingandhandlingcostexcludingvat = Math.Round(invoice.SupInvShippingAndHandlingCost, 2);
                    x.shippingandhandlingcostvatindex = invoice.VatId;
                    x.shippingandhandlingcostvatrate = invoice.Vat?.Rate;
                    x.shippingandhandlingcostincludingvat = Math.Round((Math.Round(invoice.SupInvShippingAndHandlingCost, 2)) * (1 + ((invoice.Vat?.Rate ?? 0) / 100)), 2);
                    x.invoiceGrandTotalAmountexclVAT = x.totalamountoflinesexcludingVat + Math.Round(invoice.SupInvShippingAndHandlingCost, 2);
                    x.invoiceGrandTotalAmountinclVAT = x.totalamountoflinestincludingVat + Math.Round((Math.Round(invoice.SupInvShippingAndHandlingCost, 2)) * (1 + ((invoice.Vat?.Rate ?? 0) / 100)), 2);
                    x.invoiceGrandTotalVATAmount = x.totalamountoflinestincludingVat - x.totalamountoflinesexcludingVat + Math.Round((Math.Round(invoice.SupInvShippingAndHandlingCost, 2)) * (1 + ((invoice.Vat?.Rate ?? 0) / 100)), 2) - Math.Round(invoice.SupInvShippingAndHandlingCost, 2);

                    x.invoiceimage = null; // invoice.Invoiceimage
                    x.invdocexist = invoice.Attachmentid != null ? true : false;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                return null;
            }

            return x;
        }
        private decimal CalculateTotalAmountForReceivingsList(IEnumerable<Receiving> receivings)
        {
            return receivings.Sum(receiving => CalculateTotalAmountForReceivings(receiving));
        }

        private decimal CalculateTotalAmountExcludingVatForReceivingsList(IEnumerable<Receiving> receivings)
        {
            return receivings.Sum(receiving => CalculateTotalAmountExcludingVatForReceivings(receiving));
        }

        private decimal CalculateTotalAmountofLinesDiscountForReceivingsList(IEnumerable<Receiving> receivings)
        {
            return receivings.Sum(receiving => CalculateTotalAmountofLinesDiscountForReceivings(receiving));
        }

        async public Task<MyCustomUser> AddSingleUserAsync(User newuser)
        {
            var x = new User();
            x = newuser;

            try
            {
                _context.Users.Add(x);
                await _context.SaveChangesAsync();
                var result = await GetAllUsers(x.Id);
                if (result != null)
                {
                    return result.First();
                }
                return null;


            }
            catch (Exception ex)
            {
                return null;
            }
        }
        async public Task<User> EditSingleUserAsync(User updatedUser)
        {
            try
            {
                var existingUser = await _context.Users.FindAsync(updatedUser.Id);

                if (existingUser != null)
                {
                    //    var userId =  IIMSService.LoggedInUserID(ClaimsPrincipal.Current.Identity.Name);

                  
                    updatedUser.CreatedDate = existingUser.CreatedDate;
                  
                    // Update the remaining fields
                    _context.Entry(existingUser).CurrentValues.SetValues(updatedUser);
                    await _context.SaveChangesAsync();


                    return existingUser;
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the update process
                
                return null;
            }

            return null; // If the existing   is not found, return null
        }


        async public Task<List<CustomTender>> GetAllTenders(int? id, int? supid, bool? calcs)
        {
            var POStatusIdForCancelled = _context.PordersStatuses.Where(x => x.Name.ToLower() == "cancelled".ToLower()).Single().Id;

            // Base query to include necessary navigation properties
            var getList = _context.Tenders
                                  .Include(x => x.Createdbyemp)
                                  .Include(x => x.Porders)
                                  .Include(x => x.Products)
                                  .Include(x => x.Tendersuppliersassigneds)
                                      .ThenInclude(t => t.SidNavigation)
                                  .AsQueryable();

            // Filter by Tender ID if provided
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }

            // Filter by Supplier ID if provided
            if (supid > 0)
            {
                getList = getList.Where(x => x.Tendersuppliersassigneds.Any(tsa => tsa.Sid == supid) && x.Activestatusflag == true);
            }

            // Project into CustomTender
            var newcustomtenderlist = await getList.Select(tender => new CustomTender
            {
                Id = tender.Id,
                Tendercode = tender.Tendercode,
                Createdbyempid = tender.Createdbyempid,
                Createddate = tender.Createddate,
                GeneralNotes = tender.GeneralNotes,
                Activestatusflag = tender.Activestatusflag,
                Createdbyemp = tender.Createdbyemp,
                Porders = tender.Porders,
                Products = tender.Products,
                Totalamount = tender.Totalamount,
                Presystemamountspent = tender.Presystemamountspent,
                thissystemamountspent = 0,
                remainingamount = 0,
                // Include suppliers associated with the tender
                Tendersuppliersassigneds = tender.Tendersuppliersassigneds.Select(tsa => new Tendersuppliersassigned
                {
                    Id = tsa.Id,
                    Sid = tsa.Sid,
                    Tid = tsa.Tid,
                    SidNavigation = tsa.SidNavigation
                }).ToList()
            })
            .ToListAsync();

            // Perform calculations if calcs is true
            if (calcs == true)
            {
                foreach (var tender in newcustomtenderlist)
                {
                    // Get Purchase Orders excluding cancelled ones
                    var getPurchOrders = _context.Porders
                        .Where(x => x.Tenderid == tender.Id && x.Statusid != POStatusIdForCancelled)
                        .Include(x => x.Porderlines)
                            .ThenInclude(porderline => porderline.Receivinglines);

                    decimal totalPorderAmount = 0m;

                    foreach (var porder in getPurchOrders)
                    {
                        foreach (var porderline in porder.Porderlines)
                        {
                            decimal qtyToAdd = !porderline.ClosedFlag
                                ? porderline.Qty
                                : porderline.Receivinglines.Sum(receivingline => receivingline.Qty);

                            totalPorderAmount += qtyToAdd * porderline.Unitpurcostprice;
                        }
                    }

                    totalPorderAmount = Math.Round(totalPorderAmount, 2);
                    tender.thissystemamountspent = totalPorderAmount;
                    tender.remainingamount = tender.Totalamount - (totalPorderAmount + tender.Presystemamountspent);
                }
            }

            // Nullify unnecessary properties for the response
            foreach (var tender in newcustomtenderlist)
            {
                tender.Createdbyemp = null;
                tender.Porders = null;
                foreach (var tsa in tender.Tendersuppliersassigneds)
                {
                    tsa.SidNavigation.Products = null;
                    tsa.SidNavigation.Porders = null;
                    tsa.SidNavigation.SupplierItems = null;
                    tsa.SidNavigation.SupplierInvoices = null;
                    tsa.SidNavigation.Tendersuppliersassigneds = null;
                    tsa.SidNavigation.Contactsofsuppliers = null;
                }
                tender.Products = null;
            }

            return newcustomtenderlist;
        }

       
        async public Task<List<CustomProject>> GetAllProjects1(int? projectid, bool? calcs)
        {
            var POStatusIdForCancelled = _context.PordersStatuses.Where(x => x.Name.ToLower() == "cancelled".ToLower()).Single().Id;
            var getList = _context.Projects.AsQueryable();

            if (projectid > 0)
            {
                getList = getList.Where(x => x.Id == projectid);
            }

             
            var newcustomprojectList = await getList.Select(p => new CustomProject(p)).ToListAsync();

 

            if (calcs == true)
            {
                foreach (var customProject in newcustomprojectList)
                {
                     
                     
                    var getPurchOrders = _context.Porders
                        .Where(x => x.Statusid != POStatusIdForCancelled)
                        .Include(x => x.Porderlines)
                            .ThenInclude(porderline => porderline.Receivinglines);

 

                    decimal totalPorderAmount = 0m;

                    foreach (var porder in getPurchOrders)
                    {
                        foreach (var porderline in porder.Porderlines)
                        {
                            decimal qtyToAdd;
                            if (!porderline.ClosedFlag)
                            {
                                qtyToAdd = porderline.Qty;
                            }
                            else
                            {
                                var receivedQty = porderline.Receivinglines.Sum(receivingline => receivingline.Qty);
                                qtyToAdd = receivedQty;
                            }

                            totalPorderAmount += qtyToAdd * porderline.Unitpurcostprice;
                        }
                    }

                    totalPorderAmount = Math.Round(totalPorderAmount, 2);
                    customProject.thissystemamountspent = totalPorderAmount;
                    customProject.remainingamount = customProject.Totalamount - (totalPorderAmount + customProject.Presystemamountspent);
                }
            }



            foreach (var cusproj in newcustomprojectList)
            {
                cusproj.Createdbyemp = null;
                 

            }
            return newcustomprojectList;
        }
       
        public async Task<List<MyCustomUser>> GetAllUsers(int? id)
        {
            IQueryable<User> query = _context.Users
                .Include(x => x.Role)
                .Include(x => x.JobRole)
                .Include(x => x.ApproverU)
                    .ThenInclude(approver => approver != null ? approver.ApproverU : null);

            if (id.HasValue && id.Value > 0)
            {
                query = query.Where(x => x.Id == id);
            }

            var result = await query
                .Select(x => new MyCustomUser
                {
                    Id = x.Id,
                    Email = x.Email,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    LockoutFlag = x.LockoutFlag,
                    RoleId = x.RoleId,
                    JobRoleId = x.JobRoleId,
                    ClaimCanMakePo = x.ClaimCanMakePo,
                    ClaimCanApproveRequest = x.ClaimCanApproveRequest,
                    ClaimCanMakeRequest = x.ClaimCanMakeRequest,
                    ClaimCanTransferStock = x.ClaimCanTransferStock,
                    ClaimCanMakeInventoryAdjustment = x.ClaimCanMakeInventoryAdjustment,
                    ClaimCanViewReports = x.ClaimCanViewReports,
                    ClaimCanReceiveItems = x.ClaimCanReceiveItems,
                    CconpurchaseOrder = x.CconpurchaseOrder,
                    CreatedDate = x.CreatedDate,
                    LastUpdatedDate = x.LastUpdatedDate,
                    ApproverUid = x.ApproverUid,
                    JobRole = x.JobRole,
                    Pickings = null,
                    PorderCreatedbyemps = null,
                    PorderSentbyemps = null,
                    Receivings = null,
                    ReportsUsersaccesses = x.ReportsUsersaccesses,
                    //Requestlines = null,
                    Requests = null,
                    Role = x.Role,
                    StockTrans = null,
                    Tenders = null,
                    UserPassword = null
                })
                .ToListAsync();

            return result;
        }

        async public Task<List<Role>> GetAllSystemRoles()
        {
            var getList = _context.Roles.AsQueryable();
            return await getList.ToListAsync();

        }

        async public Task<List<Jobrole>> GetAllJobRoles()
        {
            var getList = _context.Jobroles.AsQueryable();
            return await getList.ToListAsync();

        }

        private decimal CalculateThisSystemAmountSpent(CustomTender tender)
        {
        
            return 0; 
        }

        private decimal CalculateRemainingAmount(CustomTender tender)
        {
             
            return 0;  
        }

        async Task<List<Porder>> IGlobalService.GetAllPorders(int? id)
        {
            var getList = from m1 in _context.Porders.Include(cx => cx.Supplier)
                          select m1;
            if (id > 0)
            {
                getList = getList.Where(x => x.Id == id);
            }
            return await getList.OrderByDescending(x => x.Id).ToListAsync();

        }
        async Task<CustomRequestLines?> IGlobalService.LatestRequestDecision(int reqlineid)
        {
            IGlobalService imsservice = new IMSService(_context, _logger);
           
            return await imsservice.GetCustomRequstLine(reqlineid);

        }

        async Task<CustomRequestLines> IGlobalService.UpdateRequestDecision(int reqlineid, int newdecisionid, int userId)
        {
            IGlobalService imsservice = new IMSService(_context, _logger);

            try
            {

                // Find the Requestline entity with the specified Id
                var requestLine = await _context.Requestlines
                    .Include(x => x.Requestdecisionhistories)
                    .FirstOrDefaultAsync(x => x.Id == reqlineid);

                if (requestLine != null)
                {
                    // Create a new Requestdecisionhistory object
                    var newDecisionHistoryLog = new Requestdecisionhistory
                    {
                        Decisionid = newdecisionid,
                        Decisiondatetime = DateTime.Now,
                        Madebyuserid = userId,
                        Comments = "",
                        Reqlineid = reqlineid,
                    };


                    // Add the new decision history record to the Requestline's collection

                    _context.Requestdecisionhistories.Add(newDecisionHistoryLog);
                    _context.ChangeTracker.AutoDetectChangesEnabled = false;
                    await _context.SaveChangesAsync();
                    _context.ChangeTracker.AutoDetectChangesEnabled = true;
                    //send email to requestor
                    return await imsservice.GetCustomRequstLine(reqlineid);
                }
                else
                {
                    // Handle the case when the Requestline with the specified Id is not found
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }

 

    }
}
