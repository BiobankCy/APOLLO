using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ApplicationSettingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ApplicationSettingsController> _logger;

        public ApplicationSettingsController(ILogger<ApplicationSettingsController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }


        [HttpGet("")]
        public async Task<ActionResult<List<Appsetting>>> GetAllRows()
        {

            var allrows = await _context.Appsettings.ToListAsync();
            return allrows;
        }

        [HttpGet("View/{id}")]
        public async Task<ActionResult<Appsetting>> GetSingleRow(int id)
        {
            var row = await _context.Appsettings.FindAsync(id);
            if (row is null)
            {
                return null;
           
            }
            return row;

        }

        [HttpPut("Edit")]
        public async Task<ActionResult<Appsetting>> EditRow([FromBody] Appsetting editedRow)
        {
           
            try
            {
                _context.Entry(editedRow).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(editedRow);

            }
            catch
            {
                return NotFound("Sorry, An error occurred while saving!");
                // throw;
            }

        }

        [HttpPost("Add")]
        public async Task<ActionResult<Appsetting>> AddNewRow(Appsetting newRow)
        {
            var x = new Appsetting();
            newRow.Id = 0;
            x = newRow;

            _context.Appsettings.Add(x);
            await _context.SaveChangesAsync();
            return (newRow);

        }


        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteRow(int id)
        {
            var row = await _context.Appsettings.FindAsync(id);
            if (row is null)
            {
                return NotFound("Sorry but this row doesn't exist!");

            }
            else
            {

            }

            _context.Appsettings.Remove(row);

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
