using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class SubcategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SubcategoriesController> _logger;
        private readonly IGlobalService _superHeroService;
        public SubcategoriesController(ILogger<SubcategoriesController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Productsubcategory>>> GetSubCategories()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            return await _superHeroService.GetSubCategories();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Productsubcategory>> GetSingleSubCategory(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }
            var retList = await _superHeroService.GetSubCategories(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this subcategory doesn't exist!");

            }

        }

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Productsubcategory>> EditSubCategory(int id, [FromBody] Productsubcategory editedSubCategory)
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
                _context.Entry(editedSubCategory).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedSubCategory);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }

        [HttpPut("Add")]
        public async Task<ActionResult<Productsubcategory>> AddNewCategory([FromBody] Productsubcategory newsubcategory)
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

            var x = new Productsubcategory();
            newsubcategory.Id = 0;


            x = newsubcategory;

            _context.Productsubcategories.Add(newsubcategory);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newsubcategory);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteSubCategory(int id, [FromBody] Productsubcategory deleteSubCategory)
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

            var rowfound = await _context.Productsubcategories.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this subcategory doesn't exist!");

            }

            _context.Productsubcategories.Remove(rowfound);

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
