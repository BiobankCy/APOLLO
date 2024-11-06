using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class StorageConditionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<StorageConditionsController> _logger;
        private readonly IGlobalService _superHeroService;
        public StorageConditionsController(ILogger<StorageConditionsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<StorageCondition>>> GetStorageConditions()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            return await _superHeroService.GetStorageConditions();
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Productcategory>> GetSingleCategory(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

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





        [HttpPut("Edit")]
        public async Task<ActionResult<Product>> EditProduct([FromBody] Product editedProduct)
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
                _context.Entry(editedProduct).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedProduct);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");

            }



        }

        [HttpPost("Add")]
        public async Task<ActionResult<Product>> AddNewProduct(Product newproduct)
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


            var x = new Product();
            newproduct.Id = 0;
            x = newproduct;

            _context.Products.Add(newproduct);
            await _context.SaveChangesAsync();
            return (newproduct);

        }

        [HttpPut("AddBulk")]
        public async Task<ActionResult<string>> AddBulk([FromBody] List<StorageCondition> list)
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


            _context.StorageConditions.AddRange(list);


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
        public async Task<ActionResult> DeleteProduct(int id)
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

            var product = await _context.Products.FindAsync(id);
            if (product is null)
            {
                return NotFound("Sorry but this product doesn't exist!");

            }
            else
            {

            }

            _context.Products.Remove(product);

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
