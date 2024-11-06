using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductsController> _logger;
        private readonly IGlobalService _superHeroService;
        private readonly MyCustomLogger _mylogger;

        public ProductsController(ILogger<ProductsController> logger, AppDbContext context, IGlobalService superHeroService, MyCustomLogger mylogger)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
            _mylogger = mylogger;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<CustomProduct>>> GetProducts()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            var products = await _superHeroService.GetAllProducts(null, null);
            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Products", primarykey: 0, tablename: "Products/", oldEntity: "", newEntity: "", extranotes: products.Count.ToString() + " Products Returned", actionbyip: "");

            return products;
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<CustomProduct>> GetSingleProduct(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            var productList = await _superHeroService.GetAllProducts(id, null);
            if (productList.Count == 1)
            {
                var product = productList.SingleOrDefault();
                return product;
            }
            else
            {
                return NotFound("Sorry but this product doesn't exist!");

            }



        }


        [HttpGet("FilterByManyIds")]

        public async Task<ActionResult<List<CustomProduct>>> GetSomeProducts([FromQuery] List<int> ids)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            if (ids.Count == 0) { return NotFound("Sorry but id(s) not given!"); }

            var productList = await _superHeroService.GetAllProducts(null, ids);
            return productList;

        }


        [HttpGet("FilterByTenderId/{tenderid}")]

        public async Task<ActionResult<List<CustomProduct>>> GetSomeProducts(int tenderid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            if (tenderid <= 0) { return NotFound("Sorry but tender id is not given!"); }

            var dinstinctids = _context.Products
    .Where(x => x.TenderId == tenderid)
    .Select(x => x.Id)
    .Distinct()
    .ToList();



            var productList = await _superHeroService.GetAllProducts(null, dinstinctids);
            return productList.Where(c => c.TenderId == tenderid).ToList();

        }

        [HttpGet("SearchByText/{text}")]

        public async Task<ActionResult<List<CustomProduct>>> GetSomeProductsByText(string text)
        {

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            if (string.IsNullOrWhiteSpace(text)) { return NotFound("Search text is required!"); }

            var distinctIds = _context.Products
           .Where(x => x.Barcode != null && x.Barcode.ToLower() == text.ToLower() && x.ActivestatusFlag)
           .Select(x => x.Id)
           .Distinct()
           .ToList();

            if (distinctIds is not null)
            {
                if (distinctIds.Count > 0)
                {
                    var productList = await _superHeroService.GetAllProducts(pid: null, pids: distinctIds);
                    return productList.ToList();
                }
            }


            return NotFound("Sorry, but products were not found!");


        }



        //private int getAvailableStockQty(int pid)
        //{
        //    var x = 0;
        //    x = _context.Stocks.Where(x => x.Productid == pid).Sum(x => x.Qty);
        //    return x;

        //}





        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<CustomProduct>> EditProduct(int id, [FromBody] CustomProduct editedProduct)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            var xx = editedProduct.Barcode;
            xx = !string.IsNullOrEmpty(xx) ? xx.Trim() : null;
            editedProduct.Barcode = string.IsNullOrEmpty(xx) ? null : editedProduct.Barcode.Trim();






            //https://www.c-sharpcorner.com/article/how-to-implement-jwt-authentication-in-web-api-using-net-6-0-asp-net-core/
            try
            {
                var productforedit = await _context.Products.AsNoTracking().FirstOrDefaultAsync(xx => xx.Id == editedProduct.Id);
                if (productforedit == null)
                {
                    return NotFound("Product Not Found");
                }

                var productbeforeserialized = _mylogger.SerializeItNow(productforedit);

                _context.Entry(editedProduct).State = EntityState.Modified;
                //  _context.Entry(editedProduct.Productdepartmentsassigneds).State = EntityState.Modified;

                _context.SaveChanges();



                productforedit = await _context.Products.AsNoTracking().FirstOrDefaultAsync(xx => xx.Id == editedProduct.Id);

                productforedit.Productdepartmentsassigneds = new List<Productdepartmentsassigned>();

                var ccc = new List<Productdepartmentsassigned>();

                var deparmentsreceived = editedProduct.Departments;

                foreach (var department in deparmentsreceived)
                {
                    var productDepartmentAssigned = new Productdepartmentsassigned();
                    productDepartmentAssigned.Pid = productforedit.Id;
                    productDepartmentAssigned.Did = department.Id;
                    ccc.Add(productDepartmentAssigned);
                    productforedit.Productdepartmentsassigneds.Add(productDepartmentAssigned);
                }
                //_context.Entry(ccc).State = EntityState.Modified;
                var currentproductsdepartments = await _context.Productdepartmentsassigneds.Where(xx => xx.Pid == productforedit.Id).ToListAsync();
                _context.Productdepartmentsassigneds.RemoveRange(currentproductsdepartments);
                //  _context.SaveChanges();
                _context.Productdepartmentsassigneds.AddRange(ccc);
                _context.SaveChanges();



                // Reload the product from the database to ensure all changes are reflected
                var productList = await _superHeroService.GetAllProducts(productforedit.Id, null);
                if (productList.Count == 1)
                {
                    var product = productList.First();
                    var productafterserialized = _mylogger.SerializeItNow(product);

                    await _mylogger.LogRequest(actionbyuserId: _superHeroService.LoggedInUserID(User), actiontype: "Product Edit Success", primarykey: editedProduct.Id, tablename: "Products/edit", oldEntity: productbeforeserialized, newEntity: productafterserialized, extranotes: "", actionbyip: "");

                    return Ok(product);
                }
                else
                {
                    return Ok(editedProduct);
                }




            }
            /* catch (Exception ex)
             {

                 return NotFound("Sorry, An error occurred while adding! " + ex.ToString());
                 // throw;
             }*/

            catch (DbUpdateException ex)
            {
                await _mylogger.LogRequest(actionbyuserId: _superHeroService.LoggedInUserID(User), actiontype: "Product Edit Failed", primarykey: editedProduct.Id, tablename: "Products/edit", oldEntity: "", newEntity: "", extranotes: $"Error Catch: {ex.Message.ToString()}", actionbyip: "");
                if (ex.InnerException is MySqlException mySqlException)
                {
                    // Check MySQL error codes and provide specific error messages
                    switch (mySqlException.Number)
                    {
                        case 1062: // Duplicate entry error
                            return NotFound("Duplicate entry: The provided data already exists. Please check your input and try again.");
                        case 1452: // Foreign key constraint violation
                            return NotFound("Foreign key constraint violation: Please check your references and try again.");
                        // Add more cases for specific MySQL error codes as needed
                        default:
                            return StatusCode(500, "Sorry, An error occurred while processing your request. Please try again later.");
                    }
                }
                else
                {
                    // Handle other types of database update errors
                    return NotFound("Sorry, An error occurred while adding! " + ex.ToString());
                }
            }
            catch (Exception ex)
            {
                // Handle other types of exceptions
                await _mylogger.LogRequest(actionbyuserId: _superHeroService.LoggedInUserID(User), actiontype: "Product Edit Failed", primarykey: editedProduct.Id, tablename: "Products/edit", oldEntity: "", newEntity: "", extranotes: $"Error Catch: {ex.Message.ToString()}", actionbyip: "");

                return NotFound("Sorry, An error occurred while adding! " + ex.ToString());
            }

            //var productToUpdate = await _context.Products.FindAsync(editedProduct.Id);
            //if (productToUpdate is null)
            //{

            //   return NotFound("Sorry but this product doesn't exist!"); 
            //    //return Ok(new Product());
            //    //return NotFound(new Product());
            //}
            //else
            //{
            //    //  _context.Update(updatedProduct);
            // //   updatedProduct.Id = productToUpdate.Id;
            //    //productToUpdate = updatedProduct;
            //    productToUpdate.Barcode = editedProduct.Barcode;
            //    productToUpdate.Costprice = editedProduct.Costprice;
            //    productToUpdate.Code = editedProduct.Code;
            //    productToUpdate.Name = editedProduct.Name;
            //    productToUpdate.Punits = editedProduct.Punits;
            //    productToUpdate.Concentration = editedProduct.Concentration;
            //    productToUpdate.ExpdateFlag = editedProduct.ExpdateFlag;
            //    //productToUpdate.FordiagnosticsFlag = editedProduct.FordiagnosticsFlag;
            //    productToUpdate.ForsequencingFlag = editedProduct.ForsequencingFlag;
            //    productToUpdate.DefaultSupplierId = editedProduct.DefaultSupplierId;
            //    productToUpdate.DefaultLocId = editedProduct.DefaultLocId;
            //    productToUpdate.CategoryId = editedProduct.CategoryId;
            //    productToUpdate.VatId = editedProduct.VatId;
            //    productToUpdate.ActivestatusFlag = editedProduct.ActivestatusFlag;
            //    productToUpdate.Minstockqty = editedProduct.Minstockqty;
            //    productToUpdate.StorageConditionId = editedProduct.StorageConditionId;
            //    productToUpdate.LabMadeFlag = editedProduct.LabMadeFlag;
            //    productToUpdate.MultipleLocationsFlag = editedProduct.MultipleLocationsFlag;
            //    productToUpdate.GeneralNotes = editedProduct.GeneralNotes;





            //    try
            //    {
            //      var x = await _context.SaveChangesAsync();
            //        return Ok(productToUpdate);
            //    }
            //    catch (Exception ex)
            //    {
            //        return NotFound("Sorry, An error occurred while saving!");
            //    }

            //}
            //return productToUpdate;

        }


        [HttpPut("Add")]
        public async Task<ActionResult<CustomProduct>> AddNewProductAsync([FromBody] CustomProduct newProduct)
        {
            // Validate the logged-in user
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            //var userId = _superHeroService.LoggedInUserID(User);
            //if (userId <= 0)
            //{
            //    return Unauthorized("Unauthorized!");
            //}

            //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");
            //}

            // Check for duplicate product code
            var existingProductWithCode = _context.Products
                .SingleOrDefault(x => x.Code.Trim().ToLower() == newProduct.Code.Trim().ToLower());

            if (existingProductWithCode is not null)
            {
                return NotFound("The product code you entered already exists in the database. Please use a unique product code.");
            }

            // Trim and set Barcode if it's not empty
            newProduct.Barcode = string.IsNullOrWhiteSpace(newProduct.Barcode) ? null : newProduct.Barcode.Trim();

            // Check for duplicate barcode only if it's not null
            if (newProduct.Barcode is not null)
            {
                var existingProductWithBarcode = _context.Products
                    .SingleOrDefault(x => x.Barcode.Trim().ToLower() == newProduct.Barcode.Trim().ToLower());

                if (existingProductWithBarcode is not null)
                {
                    return NotFound("The barcode you entered already exists in the database. Please use a unique barcode.");
                }
            }



            newProduct.Id = 0;

            newProduct.CreatedDate = DateTime.Now;

            newProduct.Productdepartmentsassigneds = new List<Productdepartmentsassigned>();

            foreach (var department in newProduct.Departments)
            {
                newProduct.Productdepartmentsassigneds.Add(new Productdepartmentsassigned
                {
                    Pid = newProduct.Id,
                    Did = department.Id,
                    DidNavigation = null,
                    PidNavigation = null,
                });
            }

            newProduct.Departments = new List<Productdepartment>();

            var addedProduct = await _superHeroService.AddSingleProductAsync(newProduct);

            if (addedProduct != null)
            {
                // Reload the product from the database to ensure all changes are reflected
                var productList = await _superHeroService.GetAllProducts(addedProduct.Id, null);
                if (productList.Count == 1)
                {
                    var product = productList.First();
                    return Ok(product);
                }
            }

            return NotFound("Sorry, an error occurred while adding!");
        }

        [HttpPut("Add1")]
        public async Task<ActionResult<Product>> AddNewProduct([FromBody] CustomProduct newproduct)
        {
            // Validate the logged-in user
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            //var userId = _superHeroService.LoggedInUserID(User);
            //if (userId <= 0)
            //{
            //    return Unauthorized("Unauthorized!");

            //}

            //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");
            //}



            try
            {
                // Ensure newproduct.Id is 0 or not set to avoid conflicts with auto-generated IDs
                newproduct.Id = 0;
                newproduct.Barcode = string.IsNullOrEmpty(newproduct.Barcode?.Trim()) ? null : newproduct.Barcode.Trim();

                // Initialize the list for product departments
                //newproduct.Productdepartmentsassigneds = new List<Productdepartmentsassigned>();

                //// Loop through received departments and create associations
                //foreach (var department in newproduct.Departments)
                //{
                //    var newproductDepartmentAssigned = new Productdepartmentsassigned
                //    {
                //        Id=-1,
                //        Pid = -1, // Assign the product id to the department
                //        Did = department.Id,
                //        //DidNavigation = null,
                //        //PidNavigation = null,
                //    };
                //    newproduct.Productdepartmentsassigneds.Add(newproductDepartmentAssigned);
                //}

                //var x = 111;
                // Attach departments to the product using navigation property
                newproduct.Productdepartmentsassigneds = new List<Productdepartmentsassigned>();
                foreach (var department in newproduct.Departments)
                {
                    newproduct.Productdepartmentsassigneds.Add(new Productdepartmentsassigned
                    {
                        Pid = newproduct.Id,
                        Did = department.Id
                    });
                }


                // Add the new product to the context
                _context.Products.Add(newproduct);

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Log the successful addition
                await _mylogger.LogRequest(
                    actionbyuserId: _superHeroService.LoggedInUserID(User),
                    actiontype: "Product Added",
                    primarykey: newproduct.Id,
                    tablename: "Products/Add",
                    oldEntity: "",
                    newEntity: _mylogger.SerializeItNow(newproduct),
                    extranotes: "",
                    actionbyip: ""
                );

                // Return the newly added product
                return Ok(newproduct);
            }
            catch (Exception ex)
            {
                // Log the error
                await _mylogger.LogRequest(
                    actionbyuserId: _superHeroService.LoggedInUserID(User),
                    actiontype: "Product Add Failed",
                    primarykey: 0,
                    tablename: "Products/add",
                    oldEntity: "",
                    newEntity: _mylogger.SerializeItNow(newproduct),
                    extranotes: $"Error Catch: {ex.Message.ToString()}",
                    actionbyip: ""
                );

                // Handle different types of exceptions and return appropriate responses
                if (ex is DbUpdateException dbUpdateException && dbUpdateException.InnerException is MySqlException mySqlException)
                {
                    switch (mySqlException.Number)
                    {
                        case 1062: // Duplicate entry error
                            return NotFound("Duplicate entry: The provided data already exists. Please check your input and try again.");
                        case 1452: // Foreign key constraint violation
                            return NotFound("Foreign key constraint violation: Please check your references and try again.");
                        default:
                            return StatusCode(500, "Sorry, An error occurred while processing your request. Please try again later.");
                    }
                }
                else
                {
                    // Handle other types of exceptions
                    return NotFound("Sorry, An error occurred while adding! " + ex.ToString());
                }
            }
        }

        //private decimal ConvertStringToDecimal(string? value)
        //{

        //    if (string.IsNullOrEmpty(value)) {  return 0; }
        //    decimal  price=0;
        //    if (decimal.TryParse(value , out price))
        //    {
        //                   // price = double  value;
        //    }

        //    return price;

        //}

        //private DateTime? ParseDateTimeFromUnknownString(string? input)
        //{
        //    if (string.IsNullOrEmpty(input)) { return null; }

        //    DateTime result;

        //    if (DateTime.TryParse(input, out result))
        //    {
        //        return result;
        //    }
        //    else
        //    {
        //        string[] parts = input.Split('/');
        //        if (parts.Length == 2 && int.TryParse(parts[0], out int month) && int.TryParse(parts[1], out int year))
        //        {
        //            // Find last day of the given month and year
        //            int daysInMonth = DateTime.DaysInMonth(year, month);
        //            return new DateTime(year, month, daysInMonth);
        //        }
        //        else
        //        {
        //            return null;
        //        }
        //    }
        //}


        //temp disabled
        //    [HttpPut("AddBulkFromExcel")]
        //    public async Task<ActionResult<string>> AddNewProducts([FromBody] List<ExcelRowsDTO> list)
        //    {
        //        //_context.Suppliers.RemoveRange(_context.Suppliers);
        //        //await _context.SaveChangesAsync();

        //        // Disable foreign key constraints
        //        try
        //        {

        //            // Delete records from stock_trans_details table


        //            // Truncate tables
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM stock_trans_details;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM stock_trans;");


        //            //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE stock_trans_details;");

        //            // await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE stock_trans;");

        //            await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE stock;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM lots;");
        //            //  await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE LOTS;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM requestlines;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM requests;");
        //            //  await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE requestlines;");
        //            //  await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE requests;");
        //            //    await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE PRODUCTS;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM products;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM productsubcategories;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM productcategories;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM tenders;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM suppliers;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM productbrands;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM locations;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM locrooms;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM locbuildings;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM storage_conditions;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM porderlines;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM porders;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM picking;");
        //            await _context.Database.ExecuteSqlRawAsync("DELETE FROM locationtypes;");


        //            await _context.Database.ExecuteSqlRawAsync("SET FOREIGN_KEY_CHECKS = 0;");

        //            // Reset auto-increment for each table
        //            await _context.Database.ExecuteSqlRawAsync("ALTER TABLE products AUTO_INCREMENT = 1;");
        //            await _context.Database.ExecuteSqlRawAsync("ALTER TABLE suppliers AUTO_INCREMENT = 1;");
        //            await _context.Database.ExecuteSqlRawAsync("ALTER TABLE stock AUTO_INCREMENT = 1;");

        //            await _context.Database.ExecuteSqlRawAsync("SET FOREIGN_KEY_CHECKS = 1;");

        //            //   await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE productsubcategories;");
        //            //   await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE productcategories;");
        //            //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE tenders;");
        //            //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE SUPPLIERS;");

        //            //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE productbrands;");
        //            //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE LOCATIONS;");
        //            //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE locrooms;");
        //            //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE locbuildings;");



        //        }
        //        catch (Exception ex)
        //        {

        //            return NotFound("Sorry, An error occurred while.. !" + ex.ToString());
        //        }




        //        var newlisttoadd = new List<Product>();

        //        try
        //        {
        //            foreach (var row in from ExcelRowsDTO row in list
        //                                where row != null
        //                                select row)
        //            {


        //                if (!string.IsNullOrEmpty(row.Product_Code)
        //               && !string.IsNullOrEmpty(row.Supplier)
        //               && !string.IsNullOrEmpty(row.Room)
        //               && !string.IsNullOrEmpty(row.Building)

        //                      && !string.IsNullOrEmpty(row.Locname)
        //                   && !string.IsNullOrEmpty(row.Brand)
        //                   && !string.IsNullOrEmpty(row.Category)
        //                   && !string.IsNullOrEmpty(row.Storage_Conditions)

        //                   && !string.IsNullOrEmpty(row.Product)
        //                     && !string.IsNullOrEmpty(row.VAT_PERC)
        //                   )
        //                {
        //                    if (row.Product.Length > 100) { row.Importresult = "Skipped: product length>100"; continue; }

        //                    var x = new Product();
        //                    x.Code = row.Product_Code.Trim().ToUpper();
        //                    x.Name = row.Product.Trim();
        //                    x.Costprice = ConvertStringToDecimal(row.Price_exclVAT);
        //                    // x.Boxpieces = (int)ConvertStringToDecimal(row.Product_Units);
        //                    x.Concentration = "";
        //                    if (!string.IsNullOrEmpty(row.Product_Units)) { x.Punits = row.Product_Units.Trim(); }
        //                    else { x.Punits = ""; }
        //                    x.Barcode = null;
        //                    x.ExpdateFlag = false;
        //                    x.MultipleLocationsFlag = false;
        //                    x.DefaultSupplierId = 0;

        //                    if (string.IsNullOrEmpty(row.Supplier))
        //                    { row.Importresult = "Skipped: Empty Supplier"; continue; }
        //                    else
        //                    {
        //                        var finddefault = _context.Suppliers.Where(x => x.Name.Trim().ToLower().Equals(row.Supplier.Trim().ToLower())).SingleOrDefault();

        //                        if (finddefault is not null) { x.DefaultSupplierId = finddefault.Id; }
        //                        else
        //                        {
        //                            //supplier not found
        //                            var newsupplier = new Supplier();
        //                            newsupplier.Name = row.Supplier.Trim();

        //                            int newSupplierId = 0;
        //                            if (_context.Suppliers.Any())
        //                            {
        //                                newSupplierId = _context.Suppliers.Max(x => x.Id) + 1;
        //                            }
        //                            else
        //                            {
        //                                newSupplierId = 1;
        //                            }

        //                            newsupplier.Code = newSupplierId.ToString();
        //                            _context.Suppliers.Add(newsupplier);

        //                            _context.SaveChanges();
        //                            x.DefaultSupplierId = newsupplier.Id;
        //                        }

        //                    }

        //                    x.CategoryId = 0;

        //                    if (string.IsNullOrEmpty(row.Category))
        //                    { row.Importresult = "Skipped: Empty Category"; continue; }
        //                    else
        //                    {
        //                        var finddefault = _context.Productcategories.Include(x => x.Productsubcategories).Where(x => x.Name.Trim().ToLower().Equals(row.Category.Trim().ToLower())).SingleOrDefault();
        //                        if (finddefault is not null) { x.CategoryId = finddefault.Id; }
        //                        else
        //                        {
        //                            //not found
        //                            var newitem = new Productcategory();
        //                            newitem.Name = row.Category.Trim();
        //                            //int newSupplierId = _context.Suppliers.Max(x => x.Id) + 1;
        //                            //   newitem. = newSupplierId.ToString();
        //                            _context.Productcategories.Add(newitem);

        //                            _context.SaveChanges();
        //                            x.CategoryId = newitem.Id;

        //                        }

        //                    }

        //                    if (x.CategoryId <= 0) { row.Importresult = "Skipped: Empty Category 1"; continue; }


        //                    x.TenderId = null;

        //                    if (string.IsNullOrEmpty(row.Tender))
        //                    {
        //                    }
        //                    else
        //                    {
        //                        var alreadyexist = _context.Tenders.Where(xx => xx.Tendercode.Trim().ToLower().Equals(row.Tender.Trim().ToLower()) && xx.Supplierid.Equals(x.DefaultSupplierId) ).SingleOrDefault();
        //                        if (alreadyexist is not null) { x.TenderId = alreadyexist.Id; }
        //                        else
        //                        {
        //                            //tender not found
        //                            var newtender = new Tender();
        //                            newtender.Tendercode = row.Tender.Trim();
        //                            newtender.Supplierid = x.DefaultSupplierId;
        //                            newtender.Totalamount = 0;
        //                            newtender.Createddate= DateTime.Now;
        //                            newtender.Activestatusflag = true;

        //                                 newtender.Createdbyempid = _superHeroService.LoggedInUserID(User);
        //                            if (newtender.Createdbyempid <= 0) { return NotFound("Sorry, An error occurred because user is not found!"); }

        //                            newtender.GeneralNotes = "";
        //                            //int newSupplierId = _context.Suppliers.Max(x => x.Id) + 1;
        //                            //   newitem. = newSupplierId.ToString();
        //                            _context.Tenders.Add(newtender);

        //                            _context.SaveChanges();
        //                            x.TenderId = newtender.Id;

        //                        }

        //                    }
        //                    // else { continue; }

        //                    x.SubcategoryId = null;

        //                    if (string.IsNullOrEmpty(row.Sub_category))
        //                    {
        //                    }
        //                    else
        //                    {
        //                        var finddefault = _context.Productsubcategories.Where(xx => xx.Catid.Equals(x.CategoryId) && xx.Name.Trim().ToLower().Equals(row.Sub_category.Trim().ToLower())).SingleOrDefault();
        //                        if (finddefault is not null) { x.SubcategoryId = finddefault.Id; }
        //                        else
        //                        {
        //                            //supplier not found
        //                            var newitem = new Productsubcategory();
        //                            newitem.Name = row.Sub_category.Trim();
        //                            newitem.Catid = x.CategoryId;

        //                            //int newSupplierId = _context.Suppliers.Max(x => x.Id) + 1;
        //                            //   newitem. = newSupplierId.ToString();
        //                            _context.Productsubcategories.Add(newitem);

        //                            _context.SaveChanges();
        //                            x.SubcategoryId = newitem.Id;

        //                        }

        //                    }









        //                    x.BrandId = 0;

        //                    if (string.IsNullOrEmpty(row.Brand))
        //                    { row.Importresult = "Skipped: Empty Brand"; continue; }
        //                    else
        //                    {
        //                        var finddefault = _context.Productbrands.Where(x => x.Name.Trim().ToLower().Equals(row.Brand.Trim().ToLower())).SingleOrDefault();
        //                        if (finddefault is not null) { x.BrandId = finddefault.Id; }
        //                        else
        //                        {
        //                            //supplier not found
        //                            var newitem = new Productbrand();
        //                            newitem.Name = row.Brand.Trim();
        //                            //int newSupplierId = _context.Suppliers.Max(x => x.Id) + 1;
        //                            //   newitem. = newSupplierId.ToString();
        //                            _context.Productbrands.Add(newitem);

        //                            _context.SaveChanges();
        //                            x.BrandId = newitem.Id;

        //                        }

        //                    }

        //                    if (x.BrandId <= 0) { row.Importresult = "Skipped: Empty Brand"; continue; }


        //                    x.DefaultLocId = 0;

        //                    if (row.Building == null || row.Room == null || row.Locname == null)
        //                    { row.Importresult = "Skipped: Empty Default Location"; continue; }
        //                    else
        //                    {
        //                        bool xxx = makelocsfun(row.Building.Trim(), row.Room.Trim(), row.Locname.Trim(), "");

        //                        var finddefaultloc = _context.Locations.Include(x => x.Room.Building).
        //                            Where(x => x.Room.Room.ToLower().Trim().Equals(row.Room.Trim().ToLower())
        //                            && x.Room.Building.Building.ToLower().Equals(row.Building.Trim().ToLower())
        //                               && x.Locname.Trim().ToLower().Equals(row.Locname.Trim().ToLower())
        //                            ).SingleOrDefault();
        //                        if (finddefaultloc is not null) { x.DefaultLocId = finddefaultloc.Id; } else { continue; }

        //                    }


        //                    x.VatId = 0;
        //                    if (string.IsNullOrEmpty(row.VAT_PERC))
        //                    { row.Importresult = "Skipped: Empty VatRate"; continue; }
        //                    else
        //                    {
        //                        var perc = ConvertStringToDecimal(row.VAT_PERC);

        //                        var finddefault = _context.Vatrates.Where(x => x.Rate.Equals(perc)).SingleOrDefault();
        //                        if (finddefault is not null) { x.VatId = finddefault.Id; }
        //                        else {
        //                            //vat  not found
        //                            var newitem = new Vatrate();
        //                            newitem.Rate = perc;
        //                            //int newSupplierId = _context.Suppliers.Max(x => x.Id) + 1;
        //                            //   newitem. = newSupplierId.ToString();
        //                            _context.Vatrates.Add(newitem);
        //                            _context.SaveChanges();
        //                            x.VatId = newitem.Id;

        //                        }


        //                    }

        //                    if (x.VatId <= 0) { row.Importresult = "Skipped: Empty Vat"; continue; }

        //                    x.StorageConditionId = 0;

        //                    try
        //                    {
        //                        if (string.IsNullOrEmpty(row.Storage_Conditions))
        //                        { row.Importresult = "Skipped: Empty StorageCondition"; continue; }
        //                        else
        //                        {
        //                            //var perc = ConvertStringToDecimal(row.VAT_PERC);

        //                            var finddefault = _context.StorageConditions.Where(x => x.Name.Trim().ToLower().Equals(row.Storage_Conditions.ToLower().Trim())).SingleOrDefault();

        //                            if (finddefault is not null) { x.StorageConditionId = finddefault.Id; }
        //                            else {
        //                                //vat  not found
        //                                var newitem = new StorageCondition();
        //                                newitem.Name = row.Storage_Conditions.Trim();
        //                                //int newSupplierId = _context.Suppliers.Max(x => x.Id) + 1;
        //                                //   newitem. = newSupplierId.ToString();
        //                                _context.StorageConditions.Add(newitem);
        //                                _context.SaveChanges();
        //                                x.StorageConditionId = newitem.Id;
        //                            }
        //                        }
        //                    }
        //                    catch (Exception ex)
        //                    {

        //                        { row.Importresult = "Skipped: Empty StorageCondition Ex:" + ex.ToString().Take(100); continue; }
        //                    }
        //                    if (x.StorageConditionId <= 0) { row.Importresult = "Skipped: Empty StorageCondition"; continue; }



        //                    x.Minstockqty = Convert.ToInt32(ConvertStringToDecimal(row.Minimum_Stock));

        //                    x.LabMadeFlag = false;
        //                    if (!string.IsNullOrEmpty(row.Lab_Made_Flag))
        //                    {
        //                        if (row.Lab_Made_Flag.Trim().ToLower() == "Y") { x.LabMadeFlag = true; }
        //                    }
        //                    // else { row.Importresult = "Skipped: Empty LabMadeFlag"; continue; }

        //                    x.ActivestatusFlag = true;
        //                    if (!string.IsNullOrEmpty(row.Active_Flag))
        //                    {
        //                        if (row.Lab_Made_Flag.Trim().ToLower() == "Y") { x.ActivestatusFlag = false; }
        //                    }
        //                    //  else { row.Importresult = "Skipped: Empty Product Status"; continue; }

        //                    x.ForsequencingFlag = false;
        //                    if (!string.IsNullOrEmpty(row.Sequencing_Flag))
        //                    {
        //                        if (row.Sequencing_Flag.Trim().ToLower() == "Y") { x.ForsequencingFlag = true; }
        //                    }
        //                    //x.FordiagnosticsFlag = false;

        //                    //if (!string.IsNullOrEmpty(row.Diagnostics_Flag))
        //                    //{
        //                    //    if (row.Diagnostics_Flag.Trim().ToLower() == "Y") { x.FordiagnosticsFlag = true; }
        //                    //}
        //                    ////   else { row.Importresult = "Skipped: Empty For Diagnostics Flag"; continue; }


        //                    try
        //                    {
        //                        newlisttoadd.Add(x);
        //                        row.Importresult = "OK Added";
        //                    }
        //                    catch (Exception ex)
        //                    {


        //                        row.Importresult = "Not Added in newlist!" + ex.ToString();
        //                    }

        //                }
        //                else
        //                {
        //                    row.Importresult = "Skipped - Empty Data:";
        //                    if (string.IsNullOrEmpty(row.Product_Code)) { row.Importresult += " Code,"; }
        //                    if (string.IsNullOrEmpty(row.Product)) { row.Importresult += " Product,"; }
        //                    if (string.IsNullOrEmpty(row.Brand)) { row.Importresult += " Brand,"; }
        //                    if (string.IsNullOrEmpty(row.Category)) { row.Importresult += " Category,"; }
        //                    if (string.IsNullOrEmpty(row.Storage_Conditions)) { row.Importresult += " Stor.Condition,"; }
        //                    if (string.IsNullOrEmpty(row.Supplier)) { row.Importresult += " Supplier,"; }
        //                    if (string.IsNullOrEmpty(row.Room)) { row.Importresult += " Room,"; }
        //                    if (string.IsNullOrEmpty(row.Building)) { row.Importresult += " Building,"; }
        //                    if (string.IsNullOrEmpty(row.Locname)) { row.Importresult += " LocName,"; }
        //                    if (string.IsNullOrEmpty(row.VAT_PERC)) { row.Importresult += " Vat,"; }
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            return NotFound("Sorry, An error occurred while.. !" + ex.ToString());
        //        }



        //        //  newproduct.Id = 0;
        //        // newproduct.Barcode=string.IsNullOrEmpty(newproduct.Barcode.Trim()) ? null : newproduct.Barcode.Trim();
        //        // var xx = newproduct.Barcode;
        //        //    xx = !string.IsNullOrEmpty(xx) ? xx.Trim() : null;
        //        //  newproduct.Barcode = string.IsNullOrEmpty(xx) ? null : newproduct.Barcode.Trim();
        //        //  x = newproduct;



        //        var distinctProducts = newlisttoadd
        //.GroupBy(p => p.Code)
        //.Select(g => g.First())
        //.ToList();

        //        var newstocktrans = new StockTran();

        //        var findtranstypeAdjustment = 0;
        //        try
        //        {
        //            findtranstypeAdjustment = _context.StockTransTypes.Where(x => x.TypeName.Trim().ToLower().Equals("Adjustment".ToLower().Trim())).SingleOrDefault().Id;
        //            newstocktrans.StockTransTypeId = findtranstypeAdjustment;


        //        }
        //        catch (Exception)
        //        {

        //            findtranstypeAdjustment = -1;
        //        }

        //        if (findtranstypeAdjustment <=0) { return NotFound("Sorry, An error occurred because Adjustment type is not found.. !"); }

        //        var findstocktransreasonInventoryCount = 0;
        //        try
        //        {
        //            findstocktransreasonInventoryCount = _context.StockTransReasons.Where(x => x.ReasonName.Trim().ToLower().Equals("Inventory Count".ToLower().Trim())).SingleOrDefault().Id;
        //            newstocktrans.StockTransReasonId = findstocktransreasonInventoryCount;
        //        }
        //        catch (Exception)
        //        {

        //            findstocktransreasonInventoryCount = -1;
        //        }
        //        if (findstocktransreasonInventoryCount <= 0) {   NotFound("Transaction Reason not found.. !"); }


        //        var findstatuscompleted = 0;
        //        try
        //        {
        //            findstatuscompleted = _context.StockTransStatuses.Where(x => x.Name.Trim().ToLower().Equals("completed".ToLower().Trim())).SingleOrDefault().Id;
        //            newstocktrans.Status = findstatuscompleted;


        //        }
        //        catch (Exception)
        //        {

        //            findstatuscompleted = -1;
        //        }
        //        if (findstatuscompleted <= 0) { return NotFound("Sorry, An error occurred because stock trans status completed is not found.. !" ); }


        //        newstocktrans.Transdate = DateTime.Now;
        //        newstocktrans.Description = "Automatic Import From Excel File";
        //        newstocktrans.Userid = _superHeroService.LoggedInUserID(User);
        //        if (newstocktrans.Userid <= 0) { return NotFound("Sorry, An error occurred because user is not found!"); }




        //        //add stock in product 
        //        try
        //        {
        //            foreach (var product in distinctProducts)
        //            {


        //                foreach (ExcelRowsDTO row in list)
        //                {
        //                    if (row != null && !string.IsNullOrEmpty(row.Product_Code) && Convert.ToInt32(ConvertStringToDecimal(row.Stock_Quantity)) > 0 && row.Importresult == "OK Added")
        //                    {
        //                        if (row.Product_Code.ToLower().Trim() == product.Code.ToLower().Trim())
        //                        {
        //                            var newstockline = new Stock();
        //                            var stocklot = "";
        //                            var stockqty = 0;

        //                            stockqty = Convert.ToInt32(ConvertStringToDecimal(row.Stock_Quantity));
        //                            stocklot = !string.IsNullOrEmpty(row.LOT) ? row.LOT.Trim() : "";


        //                            newstockline.Qty = stockqty;
        //                            newstockline.Lotid = 0;
        //                            DateTime? expdate = null;
        //                            expdate = ParseDateTimeFromUnknownString(row.Expiry_Date);


        //                            DateOnly? dateOnly = null;
        //                            if (expdate.HasValue)
        //                            {
        //                                dateOnly = DateOnly.FromDateTime(expdate.Value);
        //                            }
        //                            else
        //                            {
        //                                dateOnly = null;
        //                            }



        //                            var findlot = _context.Lots.Where(x => x.Lotnumber.Trim().ToLower().Equals(stocklot.ToLower().Trim()) && x.Expdate.Equals(dateOnly)).FirstOrDefault();

        //                            if (findlot is not null) { newstockline.Lotid = findlot.Id; }
        //                            else //lot not found so we must import a new one
        //                            {
        //                                var newlot = new Lot();

        //                                newlot.Expdate = dateOnly;



        //                                newlot.Lotnumber = stocklot;
        //                                _context.Lots.Add(newlot);

        //                                _context.SaveChanges();
        //                                newstockline.Lotid = newlot.Id;
        //                            }

        //                            var findGoodCondition = _context.Itemconditionstatuses.Where(x => x.Name.Trim().ToLower().Equals("good".ToLower().Trim())).Single();
        //                            newstockline.Locid = product.DefaultLocId;
        //                            newstockline.Conditionstatus = findGoodCondition.Id;

        //                            product.Stocks.Add(newstockline);


        //                        }
        //                    }
        //                }
        //            }

        //        }
        //        catch (Exception ex)
        //        {

        //            return NotFound("Sorry, An error occurred while adding records!" + ex.ToString());
        //        }



        //        //  await _context.SaveChangesAsync();
        //        //return  (newproduct);

        //        try
        //        {
        //            _context.Products.AddRange(distinctProducts);
        //            //await _context.SaveChangesAsync();
        //            _context.SaveChanges();
        //        }
        //        catch (Exception ex)
        //        {
        //            return NotFound("Sorry, An error occurred while adding products!" + ex.ToString());
        //        }


        //        try
        //        {
        //            foreach (var product in distinctProducts)
        //            {
        //                if (product != null)
        //                {
        //                    foreach (var sline in product.Stocks)
        //                    {
        //                        var newtransline = new StockTransDetail();
        //                        newtransline.Lotid = sline.Lotid;
        //                        newtransline.Locid = sline.Locid;
        //                        newtransline.Pid = sline.Productid;
        //                        newtransline.Qty = sline.Qty;
        //                        newtransline.Conditionstatus = sline.Conditionstatus;
        //                        newtransline.Unitcostprice = 0; // 4/11/2023 need to get value from excel
        //                        newtransline.UnitcostRecalculationFlag = true; // 4/11/2023  if true then that trans must be included for inventory valuation
        //                        newtransline.DocumentLineid = 0;
        //                        newstocktrans.StockTransDetails.Add(newtransline);
        //                    }

        //                }

        //            }
        //            _context.StockTrans.Add(newstocktrans);
        //            await _context.SaveChangesAsync();
        //            return Ok("added");
        //        }
        //        catch (Exception ex)
        //        {

        //            return NotFound("Sorry, An error occurred while adding trans details!" + ex.ToString());
        //        }






        //            }







        //private bool makelocsfun(string Building, string Room, string Locname, string Loctype)
        //{
        //    try
        //    {
        //        int globalBuildingId = 0;
        //        int globalLocTypeid = 0;

        //        int globalRoomId = 0;
        //        int globalLocId = 0;
        //        // Check if Loctype is not null
        //        if (!string.IsNullOrEmpty(Loctype))
        //        {
        //            Loctype = "";
        //        }


        //        var normalizedLoctype = Loctype.ToLower();
        //        var loctypefound = _context.Locationtypes.FirstOrDefault(x => x.Loctype.ToLower() == normalizedLoctype);

        //        if (loctypefound is null)
        //        {
        //            var newloctypetoAdd = new Locationtype { Loctype = Loctype };
        //            var insertitnow = _context.Locationtypes.Add(newloctypetoAdd);
        //            _context.SaveChanges();
        //            globalLocTypeid = newloctypetoAdd.Id;
        //        }
        //        else
        //        { globalLocTypeid = loctypefound.Id; }

        //        //building

        //        var buildingfound = _context.Locbuildings.FirstOrDefault(x => x.Building.ToLower() == Building.ToLower());

        //        if (buildingfound is null)
        //        {
        //            var newloctypetoAdd = new Locbuilding { Building = Building,Descr="" };
        //            var insertitnow = _context.Locbuildings.Add(newloctypetoAdd);
        //            _context.SaveChanges();
        //            globalBuildingId = newloctypetoAdd.Id;
        //        }
        //        else
        //        { globalBuildingId = buildingfound.Id; }


        //        //room


        //        var roomfound = _context.Locrooms.FirstOrDefault(x => x.Room.ToLower() == Room.ToLower() && x.Buildingid == globalBuildingId);


        //        if (roomfound is null)
        //        {
        //            var newloctypetoAdd = new Locroom { Room = Room, Buildingid = globalBuildingId, Descr = "" };
        //            var insertitnow = _context.Locrooms.Add(newloctypetoAdd);
        //            _context.SaveChanges();
        //            globalRoomId = newloctypetoAdd.Id;
        //        }
        //        else
        //        { globalRoomId = roomfound.Id; }


        //        //location

        //        var locationfound = _context.Locations.FirstOrDefault(x => x.Roomid == globalRoomId && x.Locname.ToLower() == Locname.ToLower());


        //        if (locationfound is null)
        //        {
        //            var newloctypetoAdd = new Location { Roomid = globalRoomId, Locname = Locname, Loctypeid = globalLocTypeid, Descr = "" };
        //            var insertitnow = _context.Locations.Add(newloctypetoAdd);
        //            _context.SaveChanges();
        //            globalLocId = newloctypetoAdd.Id;
        //        }
        //        else
        //        { globalLocId = locationfound.Id; }




        //        return true;
        //    }
        //    catch (Exception)
        //    {

        //        return false;
        //    }


        //    return false;
        //    }



        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {


            // Validate the logged-in user
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }


            //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");

            //}

            var product = await _context.Products.FindAsync(id);
            if (product is null)
            {
                return NotFound("Sorry but this product doesn't exist!");

            }
            else
            {

            }

            _context.Products.Remove(product);

            try
            {
                var x = await _context.SaveChangesAsync();
                return Ok("Deleted!");
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while deleting!");
            }


        }

    }
}
