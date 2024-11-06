using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationsController> _logger;
        private readonly IGlobalService _superHeroService;
        private readonly MyCustomLogger _mylogger;

        public NotificationsController(ILogger<NotificationsController> logger, AppDbContext context, IGlobalService superHeroService, MyCustomLogger mylogger)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
            _mylogger = mylogger;
        }

        [HttpGet("")]
        public async Task<ActionResult<List<Notification>>> GetNotifications()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            var notifications = new List<Notification>();

            // Get all requests that the user must approve
            var requestsToApprove = await _context.Requestlines
                .Include(rl => rl.Req)
        .ThenInclude(req => req.ReqByUsr) // Eagerly load ReqByUsr
                .Where(rl => rl.Req.ReqByUsr.ApproverUid == userId && rl.Requestdecisionhistories.Count == 0)
                .ToListAsync();

            // Create a new notification for each request that needs approval
            foreach (var requestLine in requestsToApprove)
            {
                var newNotification = new Notification
                {
                    // Set the notification properties based on the request
                    id = requestLine.Id,
                    title = "New Approval Needed",
                    message = $"Request (line id: {requestLine.Id}) by {requestLine.Req.ReqByUsr.FirstName + ' ' + requestLine.Req.ReqByUsr.LastName} needs approval by you.",
                    date = requestLine.Req.ReqDate
                };

                notifications.Add(newNotification);
            }

            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Notifications", primarykey: 0, tablename: "Notifications/", oldEntity: "", newEntity: "", extranotes: notifications.Count.ToString() + " Notifications Returned", actionbyip: "");

            return notifications;
        }



    }
}
