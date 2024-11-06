using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class LotsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<LotsController> _logger;
        private readonly IGlobalService _superHeroService;
        public LotsController(ILogger<LotsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Lot>>> GetLots()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            return await _superHeroService.GetLots();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Lot>> GetSingleLot(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            var retList = await _superHeroService.GetLots(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this Lot doesn't exist!");

            }

        }

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Lot>> EditLot(int id, [FromBody] Lot editedLot)
        {

            try
            {
                var userId = _superHeroService.LoggedInUserID(User);
                if (userId <= 0)
                {
                    return Unauthorized("Unauthorized!");

                }
                if (!await _superHeroService.IsUserAuthorizedToReceiveItems(userId))
                {
                    return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
                }
                _context.Entry(editedLot).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedLot);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }

        [HttpPut("Add")]
        public async Task<ActionResult<Lot>> AddNewLot([FromBody] Lot newLot)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            if (!await _superHeroService.IsUserAuthorizedToReceiveItems(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            var x = new Lot();
            newLot.Id = 0;


            x = newLot;

            _context.Lots.Add(newLot);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newLot);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteLot(int id, [FromBody] Lot deleteLot)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }
            if (!await _superHeroService.IsUserAuthorizedToReceiveItems(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            var rowfound = await _context.Lots.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this Lot doesn't exist!");

            }

            _context.Lots.Remove(rowfound);

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
