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
    public class AppSettingsController: ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AppSettingsController> _logger;
        private readonly IGlobalService _superHeroService;
        private readonly IConfiguration _configuration;
        private readonly MyCustomLogger _mylogger;

        public AppSettingsController(ILogger<AppSettingsController> logger, AppDbContext context, IGlobalService superHeroService, IConfiguration configuration,MyCustomLogger mylogger)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
            _configuration = configuration;
            _mylogger = mylogger;
        }



       

        [HttpGet("GetSMTPSettings")]
        public async Task<ActionResult<SMTPSettings>> GetSMTPSettings()
        {
                     
            try
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
                var smtpSettings = new SMTPSettings();
                var appsettings = await _context.Appsettings.FirstOrDefaultAsync();
                if (appsettings != null)
                {
                    smtpSettings.smtpPort = appsettings.SmtpPort;
                    smtpSettings.smtpServer = appsettings.SmtpServer;
                    smtpSettings.smtpUsername = appsettings.SmtpUsername;
                    smtpSettings.smtpFromAddress = appsettings.SmtpFromaddress;
                    smtpSettings.smtpSecureSocketOption = appsettings.SmtpSecuresocketoptions;
                    smtpSettings.smtpTimeoutMs = appsettings.SmtpTimeout;
                    smtpSettings.sendEmailByApp = appsettings.SendEmailByApp;
                }
                else
                {
                    return NotFound("Error!");
                }


                return Ok(smtpSettings);
            }
            catch (Exception)
            {
                return NotFound("Error!");
            }
         
        }

        [HttpPost("SaveSMTPSettings")]
        public async Task<ActionResult> SaveSMTPSettings(SMTPSettings smtpSettings)
        {
            try
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

                var appsettings = await _context.Appsettings.FirstOrDefaultAsync();
                if (appsettings != null)
                {

                    appsettings.SmtpPort = smtpSettings.smtpPort;
                    appsettings.SmtpServer = smtpSettings.smtpServer;
                    appsettings.SmtpUsername = smtpSettings.smtpUsername;
                    appsettings.SmtpFromaddress = smtpSettings.smtpFromAddress;
                    appsettings.SmtpTimeout = smtpSettings.smtpTimeoutMs;
                    appsettings.SmtpSecuresocketoptions = smtpSettings.smtpSecureSocketOption;
                    appsettings.SendEmailByApp = smtpSettings.sendEmailByApp;
                }
                else
                {
                    //// Create a new Appsettings object if it doesn't exist
                    //appsettings = new Appsetting
                    //{
                    //    SmtpPort = smtpSettings.smtpPort,
                    //    SmtpServer = smtpSettings.smtpServer,
                    //    SmtpUsername = smtpSettings.smtpUsername,
                    //    SmtpFromaddress = smtpSettings.smtpFromAddress
                    //};
                    //_context.Appsettings.Add(appsettings);
                }

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500, "Error!");
            }
        }

        public static string Decrypt(byte[] cipherText, byte[] key, byte[] iv)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (var msDecrypt = new System.IO.MemoryStream(cipherText))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (var srDecrypt = new System.IO.StreamReader(csDecrypt))
                        {
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }

        [HttpPost("ChangeSMTPpassword")]
        public async Task<ActionResult<string>> ChangeSMTPpassword([FromBody] SMTPChangePasswordDTO data)
        {
            try
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

                //var loggedInUser = await _context.Users
                //    .Include(x => x.UserPassword)
                //    .FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false);

                //if (loggedInUser == null)
                //{
                //    return BadRequest("Unauthorized!");
                //}

                if (data.encryptedPassword == null || data.encryptedPassword.Length < 2)
                {
                    return BadRequest("Invalid New Password Length!");
                }

                // Decrypt the password
               

                var plaintextPassword = data.encryptedPassword;
               var configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .Build();

                var encryptionService = new PasswordEncryptionService(configuration);
                var encryptedPassword = encryptionService.EncryptString(plaintextPassword);

                var appsettings = await _context.Appsettings.FirstOrDefaultAsync();
                if (appsettings != null)
                {
                    appsettings.SmtpPasswordEncr = encryptedPassword;
                    await _context.SaveChangesAsync();
                    return Ok("Success");
                }
                else
                {
                    return NotFound("Error!");
                }

                 


            }
            catch (Exception ex)
            {
                return BadRequest("Change Password Failed!");
            }
        }

        [HttpGet("SendTestEmail")]
        public async Task<ActionResult<SMTPSettings>> SendTestEmail()
        {

            try
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

                var loggedInUser = await _context.Users.Include(x => x.UserPassword).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false);
                if (loggedInUser == null)
                {
                    return BadRequest("Unauthorized!");
                }


                var smtpSettings = new SMTPSettings();
                var appsettings = await _context.Appsettings.FirstOrDefaultAsync();
                if (appsettings != null)
                {
                    smtpSettings.smtpPort = appsettings.SmtpPort;
                    smtpSettings.smtpServer = appsettings.SmtpServer;
                    smtpSettings.smtpUsername = appsettings.SmtpUsername;
                    smtpSettings.smtpFromAddress = appsettings.SmtpFromaddress;
                    smtpSettings.smtpSecureSocketOption = appsettings.SmtpSecuresocketoptions;
                    smtpSettings.smtpTimeoutMs = appsettings.SmtpTimeout;
                    smtpSettings.sendEmailByApp = appsettings.SendEmailByApp;
                }
                else
                {
                    return NotFound("Error!");
                }

                var htmlemailtemplate3 =
                 "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n " +
                 " <title>Test Notification</title>\r\n  " +
                 "<style>\r\n    body {\r\n      font-family: Arial, sans-serif;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n   " +
                 " .container {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n      padding: 20px; \r\n    }\r\n    h1 {\r\n      color: #333;\r\n      margin-top: 0;\r\n    }\r\n  " +
                 "  p {\r\n      margin: 15;\r\n    }\r\n    table {\r\n      width: 100%;\r\n      border-collapse: collapse;\r\n    }\r\n    th, td {\r\n      padding: 10px;\r\n      border: 1px solid #ddd;\r\n    }\r\n  " +
                 "</style>\r\n</head>\r\n" +
                 "<body>\r\n " +
                 " <div class=\"container\">\r\n    <h3>Test Notification</h3>\r\n  " +

                 "  <p>" +
                 "Dear [User],<br><br>" +
                 "This is a test notification." +

                 "[footerream]<br><br>" + "</p>  " +


                 "</div>\r\n</body>\r\n</html>\r\n";


                var usersignature = "<br><br>Best regards,<br><br>IMS Application Support Team<br><br>" + "\n" +

                     "<a href='" + appsettings.CompanyWebsiteLink + "'>" + appsettings.CompanyName + "</a>" +
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

                htmlemailtemplate3 = htmlemailtemplate3.Replace("[footerream]", usersignature);
                htmlemailtemplate3 = htmlemailtemplate3.Replace("[User]", loggedInUser.FirstName + " " + loggedInUser.LastName);

                var sendemail = await _superHeroService.SendEmailCustom(loggedInUser.Email.ToLower(), "IMS - Test Notification", htmlemailtemplate3, false,true, false, "", null, null);

                if (sendemail != null)
                {
                    if (sendemail.result)
                    {
                        await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "User Sent Test Email", primarykey: 0, tablename: "AppSettings/SendTestEmail", oldEntity: "", newEntity: "", extranotes: "Success", actionbyip: "");


                        return Ok(smtpSettings);
                    }
                }

                await _mylogger.LogRequest(actionbyuserId: userId, actiontype: "User Sent Test Email", primarykey: 0, tablename: "AppSettings/SendTestEmail", oldEntity: "", newEntity: "", extranotes: "Failed", actionbyip: "");
                return NotFound(sendemail.message ?? "Failed1");

            }
            catch (Exception)
            {
                   return NotFound("Failed!2");
            }

        }
     

        public class ReturnObject
        {
            public string accessToken { get; set; }
            public string message { get; set; }
            public string email { get; set; }
            public string id { get; set; }
           // public string[] roles { get; set; }
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

            var usrfound = _context.Users.Include(x => x.UserPassword).Where(e => e.Id==loggedInUser.Id && e.LockoutFlag == false).Include(r => r.Role).Include(r => r.JobRole).FirstOrDefault();

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


    
}
}