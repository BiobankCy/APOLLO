using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class LoctypesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<LoctypesController> _logger;
        private readonly IGlobalService _superHeroService;
        public LoctypesController(ILogger<LoctypesController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Locationtype>>> GetLocTypes()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");


            }
            return await _superHeroService.GetLocTypes();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Locationtype>> GetSingleLocType(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            var retList = await _superHeroService.GetLocTypes(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this Location Type doesn't exist!");

            }

        }

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Locationtype>> EditLocType(int id, [FromBody] Locationtype editedLocType)
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


                _context.Entry(editedLocType).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedLocType);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");
                // throw;
            }



        }

        [HttpPut("Add")]
        public async Task<ActionResult<Locationtype>> AddNewLocType([FromBody] Locationtype newLocType)
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


                var x = new Locationtype();
                newLocType.Id = 0;


                x = newLocType;

                _context.Locationtypes.Add(newLocType);

                await _context.SaveChangesAsync();
                return Ok(newLocType);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteLocType(int id, [FromBody] Locationtype deleteLocType)
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


            var rowfound = await _context.Locationtypes.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this Locationtype doesn't exist!");

            }

            _context.Locationtypes.Remove(rowfound);

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
