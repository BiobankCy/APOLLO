using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CategoriesController> _logger;
        private readonly IGlobalService _superHeroService;
        public CategoriesController(ILogger<CategoriesController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Productcategory>>> GetCategories()
        {
            return await _superHeroService.GetCategories();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Productcategory>> GetSingleCategory(int id)
        {
            //  var product = await  _context.Products.FindAsync(id);
            var retList = await _superHeroService.GetCategories(id);
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

        [HttpPut("Edit/{id}")]
        public async Task<ActionResult<Productcategory>> EditCategory(int id, [FromBody] Productcategory editedCategory)
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
                _context.Entry(editedCategory).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedCategory);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }

        [HttpPut("Add")]
        public async Task<ActionResult<Productcategory>> AddNewCategory([FromBody] Productcategory newcategory)
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

            var x = new Productcategory();
            newcategory.Id = 0;

            x = newcategory;

            _context.Productcategories.Add(newcategory);


            try
            {
                await _context.SaveChangesAsync();
                return Ok(newcategory);
            }
            catch (Exception ex)
            {
                return NotFound("Sorry, An error occurred while adding!");
            }
        }

        [HttpPut("AddBulk")]
        public async Task<ActionResult<string>> AddBulkNewCategories([FromBody] List<Productcategory> newcategories)
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

            _context.Productcategories.AddRange(newcategories);


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


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteCategory(int id, [FromBody] Productcategory deleteCategory)
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

            var rowfound = await _context.Productcategories.FindAsync(id);
            if (rowfound is null)
            {
                return NotFound("Sorry but this category doesn't exist!");

            }

            _context.Productcategories.Remove(rowfound);

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
