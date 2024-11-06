using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AuthController> _logger;
        private readonly IGlobalService _superHeroService;
        private readonly IConfiguration _configuration;
        private readonly MyCustomLogger _mylogger;

        public AuthController(ILogger<AuthController> logger, AppDbContext context, IGlobalService superHeroService, IConfiguration configuration, MyCustomLogger mylogger)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
            _configuration = configuration;
            _mylogger = mylogger;
        }


        [HttpGet("GetUsers")]

        public async Task<ActionResult<List<MyCustomUser>>> GetUsers()
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            return await _superHeroService.GetAllUsers();
        }


        [HttpGet("GetSystemRoles")]

        public async Task<ActionResult<List<Role>>> GetAllSystemRoles()
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            return await _superHeroService.GetAllSystemRoles();
        }


        [HttpGet("GetJobRoles")]

        public async Task<ActionResult<List<Jobrole>>> GetAllJobRoles()
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }
            return await _superHeroService.GetAllJobRoles();
        }


        [HttpGet("{id:int}")]

        public async Task<ActionResult<MyCustomUser>> GetSingleUserById(int id)
        {

            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            var retList = await _superHeroService.GetAllUsers(id);
            if (retList.Count == 1)
            {
                return retList.SingleOrDefault();
            }
            else
            {
                return NotFound("Sorry but this user doesn't exist!");

            }

        }


        [HttpPut("Add")]
        public async Task<ActionResult<User>> AddSingleUserAsync([FromBody] User newUser)
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

            //var loggedInUser = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false);
            //if (loggedInUser == null)
            //{
            //    return Unauthorized("Unauthorized!");
            //}


            //if(loggedInUser.Role.RoleName.ToLower() == "Administrator".ToLower() || loggedInUser.Role.RoleName.ToLower() == "super admin".ToLower())
            //{

            //}
            //else
            //{
            //    return Unauthorized("Unauthorized!");

            //}

            var superAdminRoleID = _context.Roles.Where(x => x.RoleName.ToLower() == "super admin".ToLower()).SingleAsync().Result.Id;

            if (superAdminRoleID <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            if (superAdminRoleID == newUser.RoleId)
            {
                return Unauthorized("Unauthorized! You cant add Super Admin.");
            }


            if (userId > 0)
            {

                newUser.Id = 0;
                newUser.CreatedDate = DateTime.Now;
                newUser.Role = null;
                newUser.JobRole = null;

                if (newUser.JobRoleId != null && newUser.JobRoleId <= 0)
                {
                    return NotFound("Sorry, Job Role is Empty!");
                }

                if (newUser.RoleId != null && newUser.RoleId <= 0)
                {
                    return NotFound("Sorry, Role is Empty!");
                }


                string generatedPassword = GenerateRandomPassword(8);
                CreatePasswordHash(generatedPassword, out byte[] passwordHash, out byte[] passwordSalt);

                var userpass = new UserPassword();

                // x.UserName = request.Username;
                userpass.PasswordSalt = passwordSalt;
                userpass.PasswordHash = passwordHash;
                newUser.UserPassword = userpass;


                var result = await _superHeroService.AddSingleUserAsync(newUser);

                if (result is not null)
                {
                    //send welcome email to user and attach the password and tell him to change it at first login.

                    var htmlemailtemplate3 =
                 "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n " +
                 " <title>User Added</title>\r\n  " +
                 "<style>\r\n    body {\r\n      font-family: Arial, sans-serif;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n   " +
                 " .container {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n      padding: 20px; \r\n    }\r\n    h1 {\r\n      color: #333;\r\n      margin-top: 0;\r\n    }\r\n  " +
                 "  p {\r\n      margin: 15;\r\n    }\r\n    table {\r\n      width: 100%;\r\n      border-collapse: collapse;\r\n    }\r\n    th, td {\r\n      padding: 10px;\r\n      border: 1px solid #ddd;\r\n    }\r\n  " +
                 "</style>\r\n</head>\r\n" +
                 "<body>\r\n " +
                 " <div class=\"container\">\r\n    <h3>Welcome to IMS Application!</h3>\r\n  " +

                 "  <p>" +
                 "Dear [User],<br><br>" +
                 "We are delighted to have you as a new user of our application. Please find below your login credentials to access your account:<br><br>" +
                 "Email Address: [UserEmail]<br>" +
                 "Password: [UserPassword]<br><br>" +
                 "To get started, follow the steps below::<br><br>" +
                   "<ol>" +

                     "<li>Visit the IMS Application login page. (<a href=\"https://stock.ucy.ac.cy/\">https://stock.ucy.ac.cy/</a>)</li>" +
                         " <li>Enter your email address and the password provided above.</li> " +
                           " <li>Log in to your account using the provided credentials.</li> " +
                         " <li>We recommend changing your password after the initial login for security purposes. " +
                         "To change your password, navigate to your account settings and select the option to update your password. Remember to choose a strong and unique password to protect your account.</li> " +
                            "</ol>\r\n" +
                 "<br><br>" +
                 "If you encounter any issues or require any assistance, please don't hesitate to contact our support team. We are here to help!" +
                 "<br><br>Once again, welcome aboard!<br>" +

                 "[footerream]<br><br>" + "</p>  " +


                 "</div>\r\n</body>\r\n</html>\r\n";

                    var htmlemailtemplateChoosed = htmlemailtemplate3;
                    var getAppSettings = _context.Appsettings.AsNoTracking().Single();

                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[User]", newUser.FirstName + " " + newUser.LastName);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[UserEmail]", newUser.Email);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[UserPassword]", generatedPassword);


                    var usersignature = "<br><br>Best regards,<br><br>IMS Application Support Team<br><br>" + "\n" +

                           "<a href='" + getAppSettings.CompanyWebsiteLink + "'>" + getAppSettings.CompanyName + "</a>" +
                           " Center of Excellence in Biobanking and Biomedical Research<br>" +
                            "<a href='https://www.facebook.com/Biobank.cy'>Facebook</a>" +
                           " │ " +
                             "<a href='https://twitter.com/Biobank_cy'>Twitter</a>" +
                           " │ " +
                              "<a href='https://www.linkedin.com/company/cy-biobank'>LinkedIn</a>" +
                           " │ " +
                          "<a href='https://www.youtube.com/@biobankcy'>YouTube</a>" +
                           "<br>" +
                           "(+357) 22892819 │ (+357) 22892815 │ 7777 1838";

                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[footerream]", usersignature);

                    var useremail = newUser.Email;

                    var sendemail = await _superHeroService.SendEmailCustom(useremail.ToLower(), "Welcome to IMS Application", htmlemailtemplateChoosed, false, false, false, "", null, null);

                    if (sendemail != null)
                    {
                        if (sendemail.result)
                        {


                            sendemail.message = "Users Added Successful!\r\nAn email containing a new password has been sent to the user's email address.";


                        }
                    }



                    return Ok(result);
                }

            }
            return NotFound("Sorry, An error occurred while adding!");
        }



        [HttpPut("Edit")]
        //  [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<User>> EditUser([FromBody] User givenUserToEditAsParam)
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

            var loggedInUser = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false);
            if (loggedInUser == null)
            {
                return Unauthorized("Unauthorized!");
            }



            //if (loggedInUser.Role.RoleName.ToLower() != "admin".ToLower() && loggedInUser.Role.RoleName.ToLower() != "super admin".ToLower())
            //{
            //    return Unauthorized("Unauthorized!");
            //}


            var userToEdit = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(xx => xx.Id == givenUserToEditAsParam.Id);
            if (userToEdit == null)
            {
                return NotFound("Sorry, user to be edited is not found");
            }

            var superAdminRoleID = _context.Roles.Where(x => x.RoleName.ToLower() == "super admin".ToLower()).SingleAsync().Result.Id;

            if (userToEdit.Role.RoleName.ToLower() == "super admin".ToLower() && loggedInUser.Id != givenUserToEditAsParam.Id)
            {
                return Unauthorized("Unauthorized! You cannot change a user with role Super Admin.");
            }

            if (userToEdit.Role.RoleName.ToLower() == "super admin".ToLower() && loggedInUser.Id == givenUserToEditAsParam.Id && givenUserToEditAsParam.RoleId != loggedInUser.RoleId)
            {
                return Unauthorized("Unauthorized! You cannot demote your self. You are Super Admin!");
            }

            if (loggedInUser.Role.RoleName.ToLower() == "super admin".ToLower())
            {
                // Allow the Super Admin to edit any user
                if (givenUserToEditAsParam.Id != loggedInUser.Id)
                {
                    if (givenUserToEditAsParam.RoleId == superAdminRoleID)
                    {
                        return Unauthorized("Unauthorized! You are the only one Super Admin. You cant set this user also as Super Admin!");
                    }

                }
            }
            else if (loggedInUser.Role.RoleName.ToLower() == "administrator".ToLower())
            {
                if (givenUserToEditAsParam.Id == loggedInUser.Id)
                {
                    // Allow the Administrator to edit themselves except for the role field
                    givenUserToEditAsParam.Role = loggedInUser.Role;
                }
                else
                {
                    if (givenUserToEditAsParam.RoleId == superAdminRoleID)
                    {
                        return Unauthorized("Unauthorized! You cannot promote anyone as Super Admin!");
                    }

                }
                //else if (updatedUser.Role.RoleName.ToLower() == "administrator".ToLower())
                //{
                //    return Unauthorized("Unauthorized! You cannot set the role as Administrator.");
                //}
            }
            else
            {
                return Unauthorized("Unauthorized!");
            }


            if (userToEdit.Role.RoleName.ToLower() == "super admin".ToLower())
            {
                if (userToEdit.Id == loggedInUser.Id)
                {
                    // Allow the Administrator to edit themselves except for the role field
                    givenUserToEditAsParam.Id = loggedInUser.Id;
                    givenUserToEditAsParam.Role = loggedInUser.Role;
                    givenUserToEditAsParam.LockoutFlag = loggedInUser.LockoutFlag;
                }
                else
                {
                    return Unauthorized("Unauthorized! You cannot edit Super Admin users.");
                }

            }

            // Allow the edit since the validation checks passed
            // Update the user fields here
            // Save changes to the database
            // Return the updated user

            givenUserToEditAsParam.UserPassword = null;

            // JsonSerializerOptions options = new JsonSerializerOptions
            // {
            //    ReferenceHandler = ReferenceHandler.IgnoreCycles,
            ////     MaxDepth = 64, // Optional: You can adjust the maximum depth limit as needed
            //  //       IncludeFields = true,
            //   //  WriteIndented = true
            // };

            var oldent = _mylogger.SerializeItNow(userToEdit);


            var result = await _superHeroService.EditSingleUserAsync(givenUserToEditAsParam);

            if (result == null)
            {
                return NotFound("Sorry, An error occurred while editing!");
            }


            var netent = _mylogger.SerializeItNow(result);


            await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "User Edit", primarykey: userToEdit.Id, tablename: "Users", oldEntity: oldent, newEntity: netent ?? "", extranotes: "", actionbyip: "");

            var task = _superHeroService.GetAllUsers(result.Id);
            var taskresult = task.Result;

            if (taskresult != null)
            {
                return Ok(taskresult.First());
            }
            return null;


            //return Ok(result);
        }


        [HttpPut("AddSingleJobRoleAsync")]
        public async Task<ActionResult<Jobrole>> AddSingleJobRoleAsync([FromBody] Jobrole newJobRole)
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

            if (newJobRole.RoleName.Length <= 0)
            {
                return NotFound("Validation: Empty Job Role Name");
            }


            if (userId > 0)
            {

                newJobRole.Id = 0;



                var result = await _superHeroService.AddSingleJobRoleAsync(newJobRole);
                if (result is not null)
                {
                    return Ok(result);
                }

            }
            return NotFound("Sorry, An error occurred while adding!");
        }

        [HttpPut("EditJobRole")]
        public async Task<ActionResult<CustomTender>> EditJobRole([FromBody] Jobrole JobRole)
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


            if (JobRole.Id <= 0)
            {
                return NotFound("Validation: Unknown Job Role!");
            }


            if (userId > 0)
            {
                var result = await _superHeroService.EditSingleJobRoleAsync(JobRole);
                if (result is not null)
                {
                    return Ok(result);
                }


            }
            return NotFound("Sorry, An error occurred while editing!");


            //return Ok(result);
        }


        public class ReturnObject
        {
            public string accessToken { get; set; }
            public string message { get; set; }
            public string email { get; set; }
            public string id { get; set; }
            // public string[] roles { get; set; }
        }

        [HttpPost("signin")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> LoginUser([FromBody] UserLoginDTO request)
        {
            var j = new Dictionary<string, string>();
            var ret = new ReturnObject();

            var usrfound = _context.Users.Include(x => x.UserPassword).Where(e => e.Email.ToLower().Equals(request.Email.ToLower()) && e.LockoutFlag == false).Include(r => r.Role).Include(r => r.JobRole).FirstOrDefault();

            if (usrfound != null)
            {
                if (request.Email.ToLower() == usrfound.Email.ToLower())
                {
                    if (!VerifyPasswordHash(request.Password, usrfound.UserPassword.PasswordHash, usrfound.UserPassword.PasswordSalt))
                    {

                        await _mylogger.LogRequest(actionbyuserId: usrfound.Id, actiontype: "Login Failed", primarykey: 0, tablename: "", oldEntity: "", newEntity: "", extranotes: "", actionbyip: "");

                        ret.message = "Login Failed!";
                        //  j.Add("message", "Login Failed!");
                        return BadRequest(ret);

                    }

                    string token = CreateToken(usrfound);
                    //j.Add("accessToken", token);
                    //j.Add("message", "Success!");
                    //j.Add("email", usrfound.Email);
                    //j.Add("id", usrfound.Id.ToString());

                    ret.accessToken = token;
                    ret.message = "Success!";
                    ret.email = usrfound.Email;
                    ret.id = usrfound.Id.ToString();


                    //  var roleslist1 = new List<string>();
                    //   roleslist1.Add(usrfound.Role.RoleName ?? "");
                    //     roleslist1.Add("Admin2");
                    //    ret.roles = roleslist1.ToArray();


                    //   string rolesJson = JsonSerializer.Serialize(roleslist1.AsEnumerable());

                    //  j.Add("roles", rolesJson.Replace(@"\",""));

                    await _mylogger.LogRequest(actionbyuserId: usrfound.Id, actiontype: "Login Successful", primarykey: 0, tablename: "", oldEntity: "", newEntity: "", extranotes: "", actionbyip: "");


                    return Ok(ret);

                }
            }


            ret.message = "Login Failed!";
            // j.Add("message", "Login Failed!");
            return BadRequest(ret);

        }
        private string CreateToken(User user)
        {

            //claim is used to add identity to JWT token
            var claims = new[] {
                 new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                 new Claim(JwtRegisteredClaimNames.Name, user.FirstName + " " + user.LastName),

                 new Claim(JwtRegisteredClaimNames.Email, user.Email),
                // new Claim(ClaimTypes.Name,user.UserName),
                 new Claim("Systemrole", user.Role.RoleName),
                 new Claim("Approveruid", user.ApproverUid?.ToString() ?? "0"),
                 new Claim("Jobrole", user.JobRole.RoleName),
                 new Claim("Systemroleid", user.Role.Id.ToString()),
                 new Claim("Jobroleid", user.JobRole.Id.ToString()),
                 new Claim("ClaimCanTransferStock", user.ClaimCanTransferStock.ToString()),
                 new Claim("ClaimCanReceiveItems", user.ClaimCanReceiveItems.ToString()),
                 new Claim("ClaimCanMakePo", user.ClaimCanMakePo.ToString()),
                 new Claim("ClaimCanApproveRequest", user.ClaimCanApproveRequest.ToString()),
                 new Claim("ClaimCanMakeInventoryAdjustment", user.ClaimCanMakeInventoryAdjustment.ToString()),
                 new Claim("ClaimCanViewReports", user.ClaimCanViewReports.ToString()),
                 new Claim("ClaimCanMakeRequest", user.ClaimCanMakeRequest.ToString()),
                 new Claim("CConpurchaseOrder", user.CconpurchaseOrder.ToString()),
                 new Claim("FirstName", user.FirstName),
                 new Claim("LastName", user.LastName),
                 new Claim("Date", DateTime.Now.ToString()),
                 new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
             };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtAuth:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(_configuration["JwtAuth:Issuer"],
          _configuration["JwtAuth:Issuer"],
          claims,    //null original value
          expires: DateTime.Now.AddMinutes(60 * 9),
          signingCredentials: credentials);



            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
        private void CreatePasswordHash(string password, out byte[] passwordhash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordhash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        public static string GenerateRandomPassword(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

            Random random = new Random();
            StringBuilder password = new StringBuilder(length);

            for (int i = 0; i < length; i++)
            {
                password.Append(chars[random.Next(chars.Length)]);
            }

            return password.ToString();
        }


        [HttpGet("refresh")]

        public async Task<ActionResult<string>> RefreshUser()
        {
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return Unauthorized("Unauthorized!");
            }

            var loggedInUser = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false);
            if (loggedInUser == null)
            {
                return Unauthorized("Unauthorized!");
            }





            var j = new Dictionary<string, string>();
            var ret = new ReturnObject();

            var usrfound = _context.Users.Include(x => x.UserPassword).Where(e => e.Id == loggedInUser.Id && e.LockoutFlag == false).Include(r => r.Role).Include(r => r.JobRole).FirstOrDefault();

            if (usrfound != null)
            {

                string token = CreateToken(usrfound);

                ret.accessToken = token;
                ret.message = "Success!";
                ret.email = usrfound.Email;
                ret.id = usrfound.Id.ToString();

                await _mylogger.LogRequest(actionbyuserId: usrfound.Id, actiontype: "Refreshed Token", primarykey: 0, tablename: "Auth/refresh", oldEntity: "", newEntity: "", extranotes: "", actionbyip: "");

                return Ok(ret);

            }




            ret.message = "Refresh Failed!";
            // j.Add("message", "Login Failed!");
            return BadRequest(ret);

        }


        [HttpPost("changepassword")]

        public async Task<ActionResult<string>> ChangeUserPassword([FromBody] UserChangePasswordDTO request)
        {
            var ret = new ReturnObject();
            try
            {
                var userId = _superHeroService.LoggedInUserID(User);

                if (userId <= 0)
                {
                    return BadRequest("Unauthorized!");
                }

                var loggedInUser = await _context.Users.Include(x => x.UserPassword).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false);
                if (loggedInUser == null)
                {
                    return BadRequest("Unauthorized!");
                }


                if (request.NewPassword == null || request.NewPassword.Length < 6)
                {
                    return BadRequest("Invalid New Password Length!");
                }

                if (request.CurrentPassword == null || request.CurrentPassword.Length < 1)
                {
                    return BadRequest("Invalid Current Password Length!");
                }

                if (request.CurrentPassword == request.NewPassword)
                {
                    return BadRequest("Current and New password must not be the same!");
                }



                var j = new Dictionary<string, string>();


                var usrfound = loggedInUser;



                if (!VerifyPasswordHash(request.CurrentPassword, usrfound.UserPassword.PasswordHash, usrfound.UserPassword.PasswordSalt))
                {
                    ret.message = "Wrong Current Passwrd!";
                    return BadRequest(ret);

                }


                CreatePasswordHash(request.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);

                var userpass = new UserPassword();

                userpass.PasswordSalt = passwordSalt;
                userpass.PasswordHash = passwordHash;
                usrfound.UserPassword = userpass;

                var res = await _context.SaveChangesAsync();

                var usrfound1 = _context.Users.Include(x => x.UserPassword).Where(e => e.Id == loggedInUser.Id && e.LockoutFlag == false).Include(r => r.Role).Include(r => r.JobRole).FirstOrDefault();


                string token = CreateToken(usrfound1);

                ret.accessToken = token;
                ret.message = "Success!";
                ret.email = usrfound.Email;
                ret.id = usrfound.Id.ToString();

                //send email to user

                var htmlemailtemplate3 =
                   "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n " +
                   " <title>Password Change Notification</title>\r\n  " +
                   "<style>\r\n    body {\r\n      font-family: Arial, sans-serif;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n   " +
                   " .container {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n      padding: 20px; \r\n    }\r\n    h1 {\r\n      color: #333;\r\n      margin-top: 0;\r\n    }\r\n  " +
                   "  p {\r\n      margin: 15;\r\n    }\r\n    table {\r\n      width: 100%;\r\n      border-collapse: collapse;\r\n    }\r\n    th, td {\r\n      padding: 10px;\r\n      border: 1px solid #ddd;\r\n    }\r\n  " +
                   "</style>\r\n</head>\r\n" +
                   "<body>\r\n " +
                   " <div class=\"container\">\r\n    <h3>Password Change Notification</h3>\r\n  " +

                   "  <p>" +
                   "Dear [User],<br><br>" +
                   "This is to inform you that your password has been successfully changed. If you did not authorize this change, please contact our support team immediately.\r\n\r\n" +
                   "<br><br>If you have any questions or need further assistance, please feel free to reach out to us." +

                   "[footerream]<br><br>" + "</p>  " +


                   "</div>\r\n</body>\r\n</html>\r\n";

                var htmlemailtemplateChoosed = htmlemailtemplate3;
                var getAppSettings = _context.Appsettings.AsNoTracking().Single();

                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[User]", usrfound1.FirstName + " " + usrfound1.LastName);

                var usersignature = "<br><br>Best regards,<br><br>IMS Application Support Team<br><br>" + "\n" +

                       "<a href='" + getAppSettings.CompanyWebsiteLink + "'>" + getAppSettings.CompanyName + "</a>" +
                       " Center of Excellence in Biobanking and Biomedical Research<br>" +
                        "<a href='https://www.facebook.com/Biobank.cy'>Facebook</a>" +
                       " │ " +
                         "<a href='https://twitter.com/Biobank_cy'>Twitter</a>" +
                       " │ " +
                          "<a href='https://www.linkedin.com/company/cy-biobank'>LinkedIn</a>" +
                       " │ " +
                      "<a href='https://www.youtube.com/@biobankcy'>YouTube</a>" +
                       "<br>" +
                       "(+357) 22892819 │ (+357) 22892815 │ 7777 1838";

                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[footerream]", usersignature);

                var useremail = usrfound1.Email;



                var sendemail = await _superHeroService.SendEmailCustom(useremail.ToLower(), "IMS - Password Change Notification", htmlemailtemplateChoosed, false, false, false, "", null, null);


                await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "User Password Changed", primarykey: 0, tablename: "Auth/changepassword", oldEntity: "", newEntity: "", extranotes: "", actionbyip: "");


                return Ok(ret);

            }
            catch (Exception)
            {

                ret.message = "Change Password Failed!";

                return BadRequest(ret);
            }

        }


        [HttpGet("resetpassword/{useridforreset}")]

        public async Task<ActionResult<MyCustomReturnType>> ResetPassword(int useridforreset)
        {

            try
            {
                var userId = _superHeroService.LoggedInUserID(User);

                if (userId <= 0)
                {
                    return Unauthorized("Unauthorized!");
                }

                //var loggedInUser = await _context.Users.Include(c=>c.Role).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false && (xx.Role.RoleName.ToLower()=="Administrator".ToLower() || xx.Role.RoleName.ToLower() == "Super Admin".ToLower()));
                //if (loggedInUser == null)
                //{
                //    return Unauthorized("Unauthorized!");
                //}
                if (!await _superHeroService.IsUserAdminOrSuperAdmin(userId))
                {
                    return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
                }


                var resetpasswordForUser = await _context.Users.Include(x => x.UserPassword).FirstOrDefaultAsync(xx => xx.Id == useridforreset && xx.LockoutFlag == false);
                if (resetpasswordForUser == null)
                {
                    return Unauthorized("User Does not Exist!");
                }


                var j = new Dictionary<string, string>();

                var newpass = GenerateRandomPassword(8);

                CreatePasswordHash(newpass, out byte[] passwordHash, out byte[] passwordSalt);

                var userpass = new UserPassword();

                userpass.PasswordSalt = passwordSalt;
                userpass.PasswordHash = passwordHash;
                resetpasswordForUser.UserPassword = userpass;

                var res = await _context.SaveChangesAsync();

                await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "Password Reset By Admin", primarykey: resetpasswordForUser.Id, tablename: "Auth/changepassword", oldEntity: "", newEntity: "", extranotes: "", actionbyip: "");

                //send email to user with new password


                var htmlemailtemplate3 =
                     "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n " +
                     " <title>Password Reset</title>\r\n  " +
                     "<style>\r\n    body {\r\n      font-family: Arial, sans-serif;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n   " +
                     " .container {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n      padding: 20px; \r\n    }\r\n    h1 {\r\n      color: #333;\r\n      margin-top: 0;\r\n    }\r\n  " +
                     "  p {\r\n      margin: 15;\r\n    }\r\n    table {\r\n      width: 100%;\r\n      border-collapse: collapse;\r\n    }\r\n    th, td {\r\n      padding: 10px;\r\n      border: 1px solid #ddd;\r\n    }\r\n  " +
                     "</style>\r\n</head>\r\n" +
                     "<body>\r\n " +
                     " <div class=\"container\">\r\n    <h3>Password Reset Notification</h3>\r\n  " +

                     "  <p>" +
                     "Dear [User],<br><br>" +
                     "Your password for IMS Application has been successfully reset by our administrator. Please find below your new temporary password:<br><br>" +
                     "Temporary Password: [TemporaryPassword]" +
                     "<br><br>" +
                     "To access your account, please follow the steps below:<br><br>" +
                       "<ol>" +
                             " <li>Visit the IMS Application login page.</li> " +
                              " <li>Enter your email address and the temporary password provided above.</li> " +
                                     " <li>Log in to your account using the temporary password.</li> " +
                                          " <li>After logging in, we strongly recommend changing your password to a new one of your choice. You can do this by navigating to your account settings and selecting the option to change your password. Choose a strong and unique password to enhance the security of your account.</li> " +
                             "</ol>\r\n" +
                     "<br><br>" +
                     "If you did not request a password reset or have any concerns regarding your account, please contact our support team immediately.<br><br>" +

                     "[footerream]<br><br>" + "</p>  " +


                     "</div>\r\n</body>\r\n</html>\r\n";

                var htmlemailtemplateChoosed = htmlemailtemplate3;
                var getAppSettings = _context.Appsettings.AsNoTracking().Single();

                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[User]", resetpasswordForUser.FirstName + " " + resetpasswordForUser.LastName);
                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[TemporaryPassword]", newpass);
                var usersignature = "<br><br>Best regards,<br><br>IMS Application Support Team<br><br>" + "\n" +

                       "<a href='" + getAppSettings.CompanyWebsiteLink + "'>" + getAppSettings.CompanyName + "</a>" +
                       " Center of Excellence in Biobanking and Biomedical Research<br>" +
                        "<a href='https://www.facebook.com/Biobank.cy'>Facebook</a>" +
                       " │ " +
                         "<a href='https://twitter.com/Biobank_cy'>Twitter</a>" +
                       " │ " +
                          "<a href='https://www.linkedin.com/company/cy-biobank'>LinkedIn</a>" +
                       " │ " +
                      "<a href='https://www.youtube.com/@biobankcy'>YouTube</a>" +
                       "<br>" +
                       "(+357) 22892819 │ (+357) 22892815 │ 7777 1838";

                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[footerream]", usersignature);

                var useremail = resetpasswordForUser.Email;
                //  useremail = "avraam.georgios@ucy.ac.cy";


                var sendemail = await _superHeroService.SendEmailCustom(useremail.ToLower(), "IMS - Password Reset Notification", htmlemailtemplateChoosed, false, false, false, "", null, null);

                if (sendemail != null)
                {
                    if (sendemail.result)
                    {


                        sendemail.message = "Password Reset Successful!\r\nAn email containing a new password has been sent to the user's email address.";

                    }
                }


                return Ok(sendemail);




            }
            catch (Exception)
            {
                MyCustomReturnType retmessage = new MyCustomReturnType();
                retmessage.result = true;
                retmessage.message = "Password Reset Failed!";
                return BadRequest(retmessage);

            }



        }

    }
}