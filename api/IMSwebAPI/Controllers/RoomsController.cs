using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<RoomsController> _logger;
        private readonly IGlobalService _superHeroService;
        public RoomsController(ILogger<RoomsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Locroom>>> GetLocRooms()
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");

            }

            return await _superHeroService.GetLocRooms();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Locroom>> GetSingleRoom(int id)
        {

            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");

            }

            var retList = await _superHeroService.GetLocRooms(id);

            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this Locroom doesn't exist!");
            }

        }

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Locroom>> EditRoom(int id, [FromBody] Locroom editedRoom)
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
                _context.Entry(editedRoom).State = EntityState.Modified;
                _context.SaveChanges();
                var retList = await _superHeroService.GetLocRooms(id);
                var singlevalue = retList.SingleOrDefault();
                return Ok(singlevalue);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");
                // throw;
            }

            var rowtoupdate = await _context.Locrooms.FindAsync(editedRoom.Id);
            if (rowtoupdate is null)
            {

                return NotFound("Sorry but this Locroom doesn't exist!");

            }
            else
            {

                try
                {
                    var x = await _context.SaveChangesAsync();
                    return Ok(rowtoupdate);
                }
                catch (Exception ex)
                {
                    return NotFound("Sorry, An error occurred while saving!");
                }

            }
            return rowtoupdate;

        }

        [HttpPut("Add")]
        public async Task<ActionResult<Locroom>> AddNewRoom([FromBody] Locroom newRoom)
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

            var x = new Locroom();
            newRoom.Id = 0;
            x = newRoom;

            _context.Locrooms.Add(newRoom);


            try
            {
                await _context.SaveChangesAsync();
                //return Ok(newRoom);
                var retList = await _superHeroService.GetLocRooms(newRoom.Id);
                var singlevalue = retList.SingleOrDefault();
                return Ok(singlevalue);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteRoom(int id, [FromBody] Locroom deleteRoom)
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

            var rowfound = await _context.Locrooms.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this Locroom doesn't exist!");

            }

            _context.Locrooms.Remove(rowfound);

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
