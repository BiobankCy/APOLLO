using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class BuildingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BuildingsController> _logger;
        private readonly IGlobalService _superHeroService;
        public BuildingsController(ILogger<BuildingsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Locbuilding>>> GetLocbuildings()
        {
            return await _superHeroService.GetLocbuildings();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Locbuilding>> GetSingleLocBuilding(int id)
        {

            var retList = await _superHeroService.GetLocbuildings(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this  building doesn't exist!");

            }

        }

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Locbuilding>> EditBuilding(int id, [FromBody] Locbuilding editedBuilding)
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
                _context.Entry(editedBuilding).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedBuilding);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }
        [HttpPut("AddBulk")]
        public async Task<ActionResult<string>> AddBulkNewBuildings([FromBody] List<Locbuilding> newbuildings)
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

            foreach (var building in newbuildings)
            {
                foreach (var room in building.Locrooms)
                {
                    foreach (var loc in room.Locations)
                    {
                        if (loc.Loctype is not null)
                        {
                            var rowfound = _context.Locationtypes.Where(x => x.Loctype.ToLower() == loc.Loctype.Loctype.ToLower()).FirstOrDefault();
                            if (rowfound is null)
                            {
                                var newloctypetoAdd = loc.Loctype;

                                var insertitnow = _context.Locationtypes.Add(newloctypetoAdd);
                                _context.SaveChanges();
                                loc.Loctype = null;
                                loc.Loctypeid = newloctypetoAdd.Id;
                            }
                            else
                            {
                                loc.Loctype = null;
                                loc.Loctypeid = rowfound.Id;
                            }
                        }


                    }

                }

            }

            _context.Locbuildings.AddRange(newbuildings);


            try
            {
                await _context.SaveChangesAsync();
                return Ok("Added");
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while bulk adding!");
            }
        }

        [HttpPut("Add")]
        public async Task<ActionResult<Locbuilding>> AddNewBulding([FromBody] Locbuilding newlocbuilding)
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
            var x = new Locbuilding();
            newlocbuilding.Id = 0;


            x = newlocbuilding;

            _context.Locbuildings.Add(newlocbuilding);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newlocbuilding);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteBuilding(int id, [FromBody] Locbuilding deleteLocBuilding)
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
            var rowfound = await _context.Locbuildings.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this building doesn't exist!");

            }

            _context.Locbuildings.Remove(rowfound);

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
