using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ManufacturersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ManufacturersController> _logger;
        private readonly IGlobalService _superHeroService;
        public ManufacturersController(ILogger<ManufacturersController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Manufacturer>>> GetManufucturers()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            return await _superHeroService.GetManufacturers();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Manufacturer>> GetSingleManufacturer(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            var retList = await _superHeroService.GetManufacturers(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this manufacturer doesn't exist!");

            }

        }


        [HttpPut("Edit")]
        public async Task<ActionResult<Manufacturer>> EditSingleManufacturer([FromBody] Manufacturer updatedManufacturer)
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


            var rowToUpdate = await _context.Manufacturers.FindAsync(updatedManufacturer.Id);
            if (rowToUpdate is null)
            {
                return NotFound("Sorry, but this manufacturer doesn't exist!");
            }

            var existingSupplierWithName = await _context.Manufacturers.FirstOrDefaultAsync(s => s.Name.ToLower() == updatedManufacturer.Name.ToLower() && s.Id != updatedManufacturer.Id);
            if (existingSupplierWithName != null)
            {
                return NotFound("Sorry, but this Name already exists for another manufacturer!");

            }

            // Check if the updated manufacturer code already exists for another manufacturer
            var existingSupplierWithCode = await _context.Manufacturers.FirstOrDefaultAsync(s => s.Code == updatedManufacturer.Code && s.Id != updatedManufacturer.Id);
            if (existingSupplierWithCode != null)
            {
                return NotFound("Sorry, but this Code already exists for another manufacturer!");
            }




            var result = await _superHeroService.EditSingleManufacturerAsync(updatedManufacturer);

            if (result == null)
            {
                return NotFound("Sorry, An error occurred while editing!");
            }

            return Ok(result);

        }



        [HttpPut("Add")]
        public async Task<ActionResult<Manufacturer>> AddNew([FromBody] Manufacturer newItem)
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


            var existingSupplierWithName = await _context.Manufacturers.FirstOrDefaultAsync(s => s.Name.ToLower() == newItem.Name.ToLower());
            if (existingSupplierWithName != null)
            {
                return NotFound("Sorry, Manufacturer with the name '" + newItem.Name + "' already exists. Please choose a different name.");

            }
            // Check if the updated manufacturer code already exists for another manufacturer
            var existingSupplierWithCode = await _context.Manufacturers.FirstOrDefaultAsync(s => s.Code == newItem.Code);
            if (existingSupplierWithCode != null)
            {
                return NotFound("Sorry, Manufacturer with the code '" + newItem.Code + "' already exists. Please choose a different code.");
            }



            var x = new Manufacturer();
            newItem.Id = 0;
            newItem.CreatedDate = DateTime.Now;

            x = newItem;

            _context.Manufacturers.Add(newItem);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newItem);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding: " + ex.InnerException?.Message.ToString() + ".");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteSupplier(int id, [FromBody] Manufacturer deleteSupplier)
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

            var rowfound = await _context.Manufacturers.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this Manufacturer doesn't exist!");

            }

            _context.Manufacturers.Remove(rowfound);

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
