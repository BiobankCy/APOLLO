using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TransactionsController> _logger;
        private readonly IGlobalService _superHeroService;
        public TransactionsController(ILogger<TransactionsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }






        [HttpGet("{pid}")]

        public async Task<ActionResult<List<CustomTransactionLineDTO>>> GetAllTransactionsForProductID(int pid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            return await _superHeroService.GetAllTransactions(pid);


        }




    }
}