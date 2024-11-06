using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class Tenders : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<Tenders> _logger;
        private readonly IGlobalService _superHeroService;
        public Tenders(ILogger<Tenders> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<CustomTender>>> GetTenders()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            return await _superHeroService.GetAllTenders();
        }

        [HttpGet("Calcs")]

        public async Task<ActionResult<List<CustomTender>>> GetAllTendersWithCalcs()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            return await _superHeroService.GetAllTenders(calcs: true);
        }

        [HttpGet("{id:int}")]

        public async Task<ActionResult<Tender>> GetSingleById(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            var retList = await _superHeroService.GetAllTenders(id);
            if (retList.Count == 1)
            {
                return retList.SingleOrDefault();
            }
            else
            {
                return NotFound("Sorry but this request doesn't exist!");

            }

        }


        [HttpGet("Supplier/{supid:int}")]

        public async Task<ActionResult<List<CustomTender>>> GetActiveTendersBySupplierId(int supid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            return await _superHeroService.GetAllTenders(supid: supid);
        }


        [HttpPut("Add")]
        public async Task<ActionResult<CustomTender>> AddSingleTenderAsync([FromBody] Tender newTender)
        {
            // Validate the logged-in user
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }
            // Validate the supplier assignments
            if (newTender.Tendersuppliersassigneds == null || !newTender.Tendersuppliersassigneds.Any())
            {
                return NotFound("Validation: At least one supplier must be assigned!");
            }

            // Nullify Supplier navigation properties to avoid conflict
            foreach (var tsa in newTender.Tendersuppliersassigneds)
            {
                tsa.SidNavigation = null;
                tsa.TidNavigation = null;
            }

            // Set the tender's metadata
            newTender.Createdbyempid = userId;
            newTender.Id = 0;
            newTender.Createddate = DateTime.Now;
            newTender.Activestatusflag = true;

            // Add the tender
            var result = await _superHeroService.AddSingleTenderAsync(newTender);

            if (result is not null)
            {
                return Ok(result);
            }

            return NotFound("Sorry, an error occurred while adding!");
        }


        [HttpPut("Edit")]
        public async Task<ActionResult<CustomTender>> EditTender([FromBody] Tender updatedTender)
        {
            // Validate the logged-in user
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            // Validate the supplier assignments
            if (updatedTender.Tendersuppliersassigneds == null || !updatedTender.Tendersuppliersassigneds.Any())
            {
                return NotFound("Validation: At least one supplier must be assigned!");
            }

            // Nullify Supplier to avoid conflict
            foreach (var tsa in updatedTender.Tendersuppliersassigneds)
            {
                tsa.SidNavigation = null;
                tsa.TidNavigation = null;
            }

            // Perform the update
            var result = await _superHeroService.EditSingleTenderAsync(updatedTender);

            if (result == null)
            {
                return NotFound("Sorry, an error occurred while editing!");
            }

            // Retrieve the updated tender
            var taskResult = await _superHeroService.GetAllTenders(result.Id, null, true);

            if (taskResult != null && taskResult.Any())
            {
                return Ok(taskResult.First());
            }

            return NotFound("The updated tender could not be found.");
        }

    }
}