using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<LocationsController> _logger;
        private readonly IGlobalService _superHeroService;
        public LocationsController(ILogger<LocationsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Location>>> GetLocations()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            return await _superHeroService.GetLocations();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Location>> GetSingleLocation(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            var retList = await _superHeroService.GetLocations(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this location doesn't exist!");

            }

        }

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Location>> EditLocation(int id, [FromBody] Location editedLocation)
        {

            try
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

                _context.Entry(editedLocation).State = EntityState.Modified;
                _context.SaveChanges();

                var retList = await _superHeroService.GetLocations(id);
                var singlevalue = retList.SingleOrDefault();
                return Ok(singlevalue);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }

        [HttpPut("Add")]
        public async Task<ActionResult<Location>> AddNewLocation([FromBody] Location newlocation)
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

            var x = new Location();
            newlocation.Id = 0;


            x = newlocation;

            _context.Locations.Add(newlocation);



            try
            {
                await _context.SaveChangesAsync();

                var retList = await _superHeroService.GetLocations(newlocation.Id);
                var singlevalue = retList.SingleOrDefault();
                return Ok(singlevalue);

            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteLocation(int id, [FromBody] Location deleteLocation)
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

            var rowfound = await _context.Locations.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this location doesn't exist!");

            }

            _context.Locations.Remove(rowfound);

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
