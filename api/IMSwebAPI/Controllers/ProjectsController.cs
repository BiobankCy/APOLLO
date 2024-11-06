using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProjectsController> _logger;
        private readonly IGlobalService _superHeroService;


        public ProjectsController(ILogger<ProjectsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }


        [HttpGet("")]
        public async Task<ActionResult<List<CustomProject>>> GetAllProjects()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            return await _superHeroService.GetAllProjects();
        }

        [HttpGet("Calcs")]

        public async Task<ActionResult<List<CustomProject>>> GetAllProjectsWithCalcs()
        {
            // Validate the logged-in user
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");
            //}
            return await _superHeroService.GetAllProjects(calcs: true);
        }




        [HttpGet("{id}")]

        public async Task<ActionResult<Project>> GetSingleProject(int id)
        {

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            var retList = await _superHeroService.GetAllProjects(projectid: id);
            if (retList.Count == 1)
            {
                var row = retList.SingleOrDefault();
                return row;
            }
            else
            {
                return NotFound("Sorry but this project doesn't exist!");

            }


        }
        [HttpGet("FilterByReqLineId/{reqid}")]

        public async Task<ActionResult<Project>> GetSingleProjectByReqLineId(int reqid)
        {

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            var findprojectid = await _context.Requestlines.Where(x => x.Id == reqid).FirstOrDefaultAsync();


            if (findprojectid == null)
            {
                return NotFound("This request line does not exist!");
            }
            else
            {
                if (findprojectid.Projectid == null || findprojectid.Projectid <= 0)
                {

                    return NotFound("This request line has not been assigned to a project!");
                }
            }


            var retList = await _superHeroService.GetAllProjects(projectid: findprojectid.Projectid);

            if (retList.Count == 1)
            {
                var row = retList.SingleOrDefault();
                row.Requestlines = new List<Requestline>();
                return row;
            }
            else
            {
                return NotFound("This project doesn't exist!");

            }


        }



        [HttpGet("{pid}/Users")]
        public async Task<ActionResult<List<MyCustomUser>>> GetProjectUsers(int pid)
        {


            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            if (pid <= 0) { return NotFound("Sorry but project id is not given!"); }


            var distinctUsers = await _context.Userprojectsassigneds
       .Include(x => x.UidNavigation)
       .Where(x => x.Pid == pid)
       .Select(x => new MyCustomUser
       {

           Id = x.UidNavigation.Id,
           FirstName = x.UidNavigation.FirstName,
           LastName = x.UidNavigation.LastName,
           Email = x.UidNavigation.Email,
           JobRole = x.UidNavigation.JobRole,
       })
       //.Distinct()
       .ToListAsync();

            if (distinctUsers != null && distinctUsers.Count > 0)
            {
                return distinctUsers;
            }
            else
            {

                return NotFound("Sorry, but no users were found for this project.");
            }


        }


        [HttpGet("AssignedToMeOnlyActiveProjects")]
        public async Task<ActionResult<List<CustomProject>>> GetMyActiveProjects()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            return await _superHeroService.GetAllProjects(userid: userId, projectstatusFilter: "active");
        }

        [HttpGet("AssignedToMeOnlyNotActiveProjects")]
        public async Task<ActionResult<List<CustomProject>>> GetMyNotActiveProjects()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            return await _superHeroService.GetAllProjects(userid: userId, projectstatusFilter: "notactive");
        }
        [HttpGet("AssignedToMeAllProjects")]
        public async Task<ActionResult<List<CustomProject>>> GetMyAllProjects()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            return await _superHeroService.GetAllProjects(userid: userId);
        }
        [HttpPut("Add")]
        public async Task<ActionResult<CustomProject>> AddSingleProjectAsync([FromBody] Project newTender)
        {


            // Validate the logged-in user
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");
            //}

            // Validate the supplier assignments
            if (newTender.Userprojectsassigneds == null || !newTender.Userprojectsassigneds.Any())
            {
                return NotFound("Validation: At least one user must be assigned!");
            }

            // Nullify Supplier navigation properties to avoid conflict
            foreach (var tsa in newTender.Userprojectsassigneds)
            {
                tsa.UidNavigation = null;
                tsa.PidNavigation = null;
            }

            // Set the tender's metadata
            newTender.Createdbyempid = userId;
            newTender.Id = 0; // Ensure a new ID is generated
            newTender.CreatedDate = DateTime.Now;
            newTender.Activestatusflag = true;

            // Add the tender
            var result = await _superHeroService.AddSingleProjectAsync(newTender);

            if (result is not null)
            {
                return Ok(result);
            }

            return NotFound("Sorry, an error occurred while adding!");
        }


        [HttpPut("Edit")]
        public async Task<ActionResult<CustomProject>> EditProject([FromBody] Project updatedTender)
        {


            // Validate the logged-in user
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");
            //}


            // Validate the supplier assignments
            if (updatedTender.Userprojectsassigneds == null || !updatedTender.Userprojectsassigneds.Any())
            {
                return NotFound("Validation: At least one user must be assigned!");
            }

            // Nullify Supplier to avoid conflict
            foreach (var tsa in updatedTender.Userprojectsassigneds)
            {
                tsa.UidNavigation = null;
                tsa.PidNavigation = null;
            }

            // Perform the update
            var result = await _superHeroService.EditSingleProjectAsync(updatedTender);

            if (result == null)
            {
                return NotFound("Sorry, an error occurred while editing!");
            }

            // Retrieve the updated tender
            var taskResult = await _superHeroService.GetAllProjects(projectid: result.Id, calcs: true);

            if (taskResult != null && taskResult.Any())
            {
                return Ok(taskResult.First());
            }

            return NotFound("The updated project could not be found.");
        }





        [HttpPut("AddUserToProject")]
        public async Task<ActionResult<CustomProject>> AddSingleUserToProjectAsync([FromBody] ProjectUserAssignmentModel model)
        {
            var userIdToAdd = model.UserId;
            var projectIdToAddUser = model.ProjectId;

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }


            //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");
            //}

            if (userId > 0)
            {
                // Check if the logged-in user has permission to perform this action

                // Fetch the user and project from the database
                var user = _context.Users.FirstOrDefault(pro => pro.Id == userIdToAdd);
                var project = _context.Projects.FirstOrDefault(pro => pro.Id == projectIdToAddUser);

                if (user != null && project != null)
                {
                    // Check if the user is already assigned to the project
                    var existingAssignment = _context.Userprojectsassigneds
                        .FirstOrDefault(up => up.Uid == userIdToAdd && up.Pid == projectIdToAddUser);

                    if (existingAssignment != null)
                    {
                        return BadRequest("User is already assigned to this project.");
                    }

                    // If the user is not already assigned, create a new assignment
                    var userProjectAssignment = new Userprojectsassigned
                    {
                        Id = 0,
                        Pid = project.Id,
                        Uid = user.Id
                    };

                    _context.Userprojectsassigneds.Add(userProjectAssignment);
                    await _context.SaveChangesAsync(); // Save changes to the database

                    return Ok(project);
                }
                else if (user == null)
                {
                    return NotFound("Sorry, an error occurred while adding! User not found.");
                }
                else // project == null
                {
                    return NotFound("Sorry, an error occurred while adding! Project not found.");
                }
            }
            return NotFound("Sorry, an error occurred while adding!");
        }


        [HttpPut("AddMultipleUsersToProject")]
        public async Task<ActionResult<CustomProject>> AddUsersToProjectAsync([FromBody] ProjectMultipleUserAssignmentModel model)
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



            if (userId > 0)
            {

                // Check if the logged-in user has permission to perform this action

                //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
                //if (loggedInUser == null)
                //{
                //    return Unauthorized("Unauthorized!");
                //}

                var project = _context.Projects.FirstOrDefault(pro => pro.Id == model.ProjectId);

                if (project == null)
                {
                    return NotFound("Project not found.");
                }

                // Remove existing user assignments that are not included in the list of user IDs
                var existingAssignments = _context.Userprojectsassigneds
                    .Where(up => up.Pid == model.ProjectId && !model.UserId.Contains(up.Uid));
                _context.Userprojectsassigneds.RemoveRange(existingAssignments);

                foreach (var userIdToAdd in model.UserId)
                {
                    // Check if the user is already assigned to the project
                    var existingAssignment = _context.Userprojectsassigneds
                        .FirstOrDefault(up => up.Uid == userIdToAdd && up.Pid == model.ProjectId);

                    if (existingAssignment != null)
                    {
                        // Skip adding this user if already assigned
                        continue;
                    }

                    // If the user is not already assigned, create a new assignment
                    var userProjectAssignment = new Userprojectsassigned
                    {
                        Id = 0,
                        Pid = model.ProjectId,
                        Uid = userIdToAdd
                    };

                    _context.Userprojectsassigneds.Add(userProjectAssignment);
                }

                await _context.SaveChangesAsync();

                return Ok();
            }

            return NotFound("Sorry, an error occurred while adding users!");
        }


        [HttpDelete("RemoveUserFromProject")]
        public async Task<ActionResult> RemoveUserFromProjectAsync([FromBody] ProjectUserAssignmentModel model)
        {
            var userIdToRemove = model.UserId;
            var projectIdToRemoveUser = model.ProjectId;

            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }


            if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }


            //var loggedInUser = await _context.Users.Include(c => c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower() == "Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");
            //}


            if (userId > 0)
            {
                // Check if the logged-in user has permission to perform this action

                // Fetch the user and project from the database
                var user = _context.Users.FirstOrDefault(pro => pro.Id == userIdToRemove);
                var project = _context.Projects.FirstOrDefault(pro => pro.Id == projectIdToRemoveUser);

                if (user != null && project != null)
                {
                    // Find the user-project assignment in the database
                    var userProjectAssignment = _context.Userprojectsassigneds
                        .FirstOrDefault(up => up.Uid == userIdToRemove && up.Pid == projectIdToRemoveUser);

                    if (userProjectAssignment != null)
                    {
                        // Remove the user-project assignment from the database
                        _context.Userprojectsassigneds.Remove(userProjectAssignment);
                        await _context.SaveChangesAsync();

                        return Ok("User removed from project successfully.");
                    }
                    else
                    {
                        return NotFound("User is not assigned to the specified project.");
                    }
                }
                else if (user == null)
                {
                    return NotFound("User not found.");
                }
                else // project == null
                {
                    return NotFound("Project not found.");
                }
            }
            return NotFound("An error occurred while removing user from project.");
        }


    }
}