using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class SuppliersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SuppliersController> _logger;
        private readonly IGlobalService _superHeroService;
        public SuppliersController(ILogger<SuppliersController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Supplier>>> GetSuppliers()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            return await _superHeroService.GetSuppliers();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Supplier>> GetSingleSupplier(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            var retList = await _superHeroService.GetSuppliers(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this Supplier doesn't exist!");

            }

        }


        [HttpPut("Edit")]
        public async Task<ActionResult<Supplier>> EditSingleSupplier([FromBody] Supplier updatedSupplier)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {

                return Unauthorized("Sorry, An error occurred while editing!");
            }



            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            var rowToUpdate = await _context.Suppliers.FindAsync(updatedSupplier.Id);
            if (rowToUpdate is null)
            {
                return NotFound("Sorry, but this Supplier doesn't exist!");
            }

            var existingSupplierWithName = await _context.Suppliers.FirstOrDefaultAsync(s => s.Name.ToLower() == updatedSupplier.Name.ToLower() && s.Id != updatedSupplier.Id);
            if (existingSupplierWithName != null)
            {
                return NotFound("Sorry, but this Supplier Name already exists for another supplier!");

            }

            // Check if the updated supplier code already exists for another supplier
            var existingSupplierWithCode = await _context.Suppliers.FirstOrDefaultAsync(s => s.Code == updatedSupplier.Code && s.Id != updatedSupplier.Id);
            if (existingSupplierWithCode != null)
            {
                return NotFound("Sorry, but this Supplier code already exists for another supplier!");
            }


            var result = await _superHeroService.EditSingleSupplierAsync(updatedSupplier);

            if (result == null)
            {
                return NotFound("Sorry, An error occurred while editing!");
            }

            return Ok(result);

        }

        [HttpPut("Contacts/Edit/{id}")]
        public async Task<ActionResult<Contactsofsupplier>> EditContact(int id, [FromBody] Contactsofsupplier editedRow)
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return Unauthorized("Sorry, An error occurred while editing!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            try
            {
                _context.Entry(editedRow).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedRow);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }
        }
        [HttpPut("Contacts/Add")]
        public async Task<ActionResult<Contactsofsupplier>> AddNewSupplierContact([FromBody] Contactsofsupplier newRow)
        {
            var userId = _superHeroService.LoggedInUserID(User);



            if (userId <= 0)
            {
                return Unauthorized("Sorry, An error occurred while editing!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }


            var x = new Contactsofsupplier();
            newRow.Id = 0;
            newRow.CreatedDate = DateTime.Now;

            x = newRow;

            _context.Contactsofsuppliers.Add(newRow);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newRow);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding: " + ex.InnerException?.Message.ToString() + ".");
            }
        }
        [HttpPut("Add")]
        public async Task<ActionResult<Supplier>> AddNewSupplier([FromBody] Supplier newSupplier)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }


            var existingSupplierWithName = await _context.Suppliers.FirstOrDefaultAsync(s => s.Name.ToLower() == newSupplier.Name.ToLower());
            if (existingSupplierWithName != null)
            {
                return NotFound("Sorry, supplier with the name '" + newSupplier.Name + "' already exists. Please choose a different name.");

            }
            // Check if the updated supplier code already exists for another supplier
            var existingSupplierWithCode = await _context.Suppliers.FirstOrDefaultAsync(s => s.Code == newSupplier.Code);
            if (existingSupplierWithCode != null)
            {
                return NotFound("Sorry, supplier with the code '" + newSupplier.Code + "' already exists. Please choose a different code.");
            }



            var x = new Supplier();
            newSupplier.Id = 0;
            newSupplier.CreatedDate = DateTime.Now;

            x = newSupplier;

            _context.Suppliers.Add(newSupplier);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newSupplier);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding: " + ex.InnerException?.Message.ToString() + ".");
            }
        }
        [HttpDelete("Contacts/Delete/{id}")]
        public async Task<ActionResult> DeleteSupplierContact(int id, [FromBody] Contactsofsupplier deleteSupplier)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            var rowfound = await _context.Contactsofsuppliers.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this Supplier Contact doesn't exist!");

            }

            _context.Contactsofsuppliers.Remove(rowfound);

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
        [HttpPut("SwitchEmailAttachmentFlag")]
        public async Task<ActionResult<List<Supplier>>> SwitchEmailAttachmentFlag([FromBody] Supplier data)
        {
            if (data.Id <= 0) { return NotFound("Sorry, supplier Not Found!"); }

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            try
            {
                var foundSupplier = await _context.Suppliers.Where(xx => xx.Id == data.Id).SingleAsync();

                if (foundSupplier is not null)
                {
                    //     var POStatusIdForNEW = _context.PordersStatuses.Where(x => x.Name.ToLower() == "new".ToLower()).Single().Id;
                    //   var POStatusIdForSent = _context.PordersStatuses.Where(x => x.Name.ToLower() == "sent".ToLower()).Single().Id;

                    foundSupplier.ExcelattachmentinemailorderFlag = !data.ExcelattachmentinemailorderFlag;
                    _context.Entry(foundSupplier).State = EntityState.Modified;
                    _context.SaveChanges();

                    //  var retList = await _superHeroService.GetAllCustomPurchaseOrderLines(foundSupplier);
                    return await _superHeroService.GetSuppliers(foundSupplier.Id);
                    //  return Ok(retList);

                }
                else
                {
                    return NotFound("Sorry, Supplier Not Found!");
                }
                //return NotFound("Sorry, An error occurred while saving!");


            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteSupplier(int id, [FromBody] Supplier deleteSupplier)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            var rowfound = await _context.Suppliers.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this Supplier doesn't exist!");

            }

            _context.Suppliers.Remove(rowfound);

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
