using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DepartmentsController> _logger;
        private readonly IGlobalService _superHeroService;
        public DepartmentsController(ILogger<DepartmentsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Productdepartment>>> GetDepartments()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            return await _superHeroService.GetAllDepartments();
        }


        public struct BulkAssignDepartmentsToProductsModel
        {
            public int[] productids { get; set; }
            public int[] departmentids { get; set; }


        }
        [HttpPut("Bulkassigntoproducts")]
        public async Task<ActionResult<List<CustomProduct>>> BulkassignDepartmentsAsync([FromBody] BulkAssignDepartmentsToProductsModel data)
        {

            var resultList = new List<Product>();
            var errors = new List<string>();
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");

            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            // Check if the input parameters are valid
            if (data.productids.Length <= 0)
            {
                return BadRequest("0 Products Selected!");
            }


            if (data.departmentids.Length <= 0)
            {
                return BadRequest("0 Departments Selected!");
            }

            var loggedInUser = _context.Users.FirstOrDefault(xx => xx.Id == userId && xx.LockoutFlag == false);
            if (loggedInUser == null)
            {
                return Unauthorized("Unauthorized!");
            }

            foreach (var productId in data.productids)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == productId);
                if (product != null)
                {
                    // Remove existing department assignments
                    var existingAssignments = _context.Productdepartmentsassigneds.Where(pd => pd.Pid == productId).ToList();
                    _context.Productdepartmentsassigneds.RemoveRange(existingAssignments);

                    // Add new department assignments
                    foreach (var departmentId in data.departmentids)
                    {
                        var productDepartment = new Productdepartmentsassigned
                        {
                            Pid = productId,
                            Did = departmentId
                        };
                        _context.Productdepartmentsassigneds.Add(productDepartment);
                    }

                    resultList.Add(product);
                }
            }

            _context.SaveChanges();


            var distinctIds = resultList.Select(x => x.Id).Distinct().ToList();

            if (distinctIds is not null)
            {
                if (distinctIds.Count > 0)
                {
                    List<CustomProduct> productList = await _superHeroService.GetAllProducts(pid: null, pids: distinctIds);
                    return Ok(productList.ToList());
                }
            }



            return Ok(new List<CustomProduct>());
        }



    }
}