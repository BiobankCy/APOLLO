using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BrandsController> _logger;
        private readonly IGlobalService _superHeroService;

        public BrandsController(ILogger<BrandsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]
        public async Task<ActionResult<List<Productbrand>>> GetBrands()
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            return await _superHeroService.GetBrands();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Productbrand>> GetSingleBrand(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            var retList = await _superHeroService.GetBrands(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this brand doesn't exist!");

            }

        }

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Productbrand>> EditBrand(int id, [FromBody] Productbrand editedBrand)
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

            try
            {
                _context.Entry(editedBrand).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedBrand);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");
            }



        }

        [HttpPut("Add")]
        public async Task<ActionResult<Productbrand>> AddNewBrand([FromBody] Productbrand newBrand)
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

            var x = new Productbrand();
            newBrand.Id = 0;


            x = newBrand;

            _context.Productbrands.Add(newBrand);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newBrand);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }

        [HttpPut("AddBulk")]
        public async Task<ActionResult<string>> AddBulk([FromBody] List<Productbrand> list)
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

            try
            {
                _context.Productbrands.AddRange(list);
                await _context.SaveChangesAsync();
                return Ok("Added");
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while bulk adding!");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteBrand(int id, [FromBody] Productbrand deleteBrand)
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

            var rowfound = await _context.Productbrands.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this Brand doesn't exist!");

            }

            _context.Productbrands.Remove(rowfound);

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
