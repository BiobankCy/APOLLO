using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class DecisionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DecisionsController> _logger;
        private readonly IGlobalService _superHeroService;
        public DecisionsController(ILogger<DecisionsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<RequestDecision>>> GetDecisions()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }



            return await _superHeroService.GetDecisions();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<RequestDecision>> GetSingleDecision(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }



            var retList = await _superHeroService.GetDecisions(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this category doesn't exist!");

            }

        }


    }
}
