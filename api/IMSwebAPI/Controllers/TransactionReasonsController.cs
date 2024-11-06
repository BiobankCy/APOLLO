using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class TransactionReasonsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TransactionReasonsController> _logger;
        private readonly IGlobalService _superHeroService;
        public TransactionReasonsController(ILogger<TransactionReasonsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]
        public async Task<ActionResult<List<StockTransReason>>> GetReasons()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            return await _superHeroService.GetReasons();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StockTransReason>> GetSingleReason(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            var retList = await _superHeroService.GetReasons(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this reason doesn't exist!");

            }

        }


    }
}
