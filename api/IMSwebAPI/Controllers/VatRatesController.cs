using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class VatRatesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<VatRatesController> _logger;
        private readonly IGlobalService _superHeroService;
        public VatRatesController(ILogger<VatRatesController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Vatrate>>> GetVatRates()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            return await _superHeroService.GetVatRates();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Vatrate>> GetSingleVatrate(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            var retList = await _superHeroService.GetVatRates(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this vatrate doesn't exist!");

            }

        }

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Vatrate>> EditVatrate(int id, [FromBody] Vatrate editedVatrate)
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

            try
            {
                _context.Entry(editedVatrate).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedVatrate);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }

        [HttpPut("Add")]
        public async Task<ActionResult<Vatrate>> AddNewVatrate([FromBody] Vatrate newcategory)
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

            var x = new Vatrate();
            newcategory.Id = 0;


            x = newcategory;

            _context.Vatrates.Add(newcategory);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newcategory);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteVatrate(int id, [FromBody] Vatrate deleteVatrate)
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

            var rowfound = await _context.Vatrates.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this vatrate doesn't exist!");

            }

            _context.Vatrates.Remove(rowfound);

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
