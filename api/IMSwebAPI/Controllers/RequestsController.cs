using IMSwebAPI.Services.MyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMSwebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        private readonly ILogger<RequestsController> _logger;
        private readonly IGlobalService _superHeroService;
        public RequestsController(ILogger<RequestsController> logger, AppDbContext context, IGlobalService superHeroService)
        {
            _superHeroService = superHeroService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]

        public async Task<ActionResult<List<Request>>> GetRequests()
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            return await _superHeroService.GetRequests();
        }


        [HttpGet("readall/{reqheaderid}")]
        public async Task<ActionResult<List<CustomRequestLines>>> GetCustomRequstLines(int reqheaderid)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");

            }

            try
            {
                var retList = await _superHeroService.GetCustomRequstLines(reqheaderid);
                return Ok(retList);
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

        //public async Task<ActionResult<List<object>>> GetCustomRequstLines(int reqheaderid)
        //{
        //    return await _superHeroService.GetCustomRequstLines(reqheaderid);
        //}

        [HttpGet("{id}")]

        public async Task<ActionResult<Request>> GetSingleRequest(int id)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");

            }

            var retList = await _superHeroService.GetRequests(id);
            if (retList.Count == 1)
            {
                var singlevalue = retList.SingleOrDefault();
                return singlevalue;
            }
            else
            {
                return NotFound("Sorry but this request doesn't exist!");

            }

        }

        [HttpGet("FilterByManyIds")]

        public async Task<ActionResult<List<CustomRequestLines>>> GetSomeRequests([FromQuery] List<int> ids)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");

            }


            if (ids.Count == 0) { return NotFound("Sorry but id(s) not given!"); }

            var theList = await _superHeroService.GetCustomRequstLines(0);
            return theList.Where(c => ids.Contains(c.linereqid)).ToList();


        }


        [HttpPut("Add")]
        public async Task<ActionResult<Request>> AddRequest([FromBody] Request newRequest)
        {
            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");

            }

            if (!await _superHeroService.IsUserAuthorizedToMakeRequests(userId))
            {
                return Unauthorized("You don't have the necessary permissions to make this request. If you believe this is an error, please contact the administrator.");
            }

            var loggedInUser = null as User;

            if (userId > 0)
            {

                loggedInUser = await _context.Users.Include(x => x.Role).Include(x => x.ApproverU).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false);

                if (loggedInUser == null)
                {
                    return Unauthorized("Unauthorized!");
                }


                newRequest.ReqDate = DateTime.Now;
                newRequest.Id = 0;
                newRequest.ReqByUsrId = userId;
                //  newRequest.ReqStatusId = 5;

                if (newRequest.Requestlines.Count <= 0) { return NotFound("Validation Error: Request without lines."); }

                foreach (var item in newRequest.Requestlines)
                {
                    if (item != null)
                    {

                        if (item.Qty <= 0)
                        {
                            return NotFound("Validation Error: One or More Lines with invalid qty (<= 0) .");
                        }
                        //item.CurrentDecisionId = null;
                    }


                }



                var loggedInUserProjectsAssigned = await _context.Userprojectsassigneds
      .Include(x => x.PidNavigation)
      .Where(u => u.Uid == userId)
      .ToListAsync();


                foreach (var item in newRequest.Requestlines)
                {
                    if (item != null)
                    {

                        if (item.Projectid.HasValue && item.Projectid.Value > 0)
                        {
                            // Check if the project ID in the request line is among the projects assigned to the user
                            bool isProjectValid = loggedInUserProjectsAssigned.Any(p => p.Pid == item.Projectid);

                            if (!isProjectValid)
                            {
                                return NotFound("Validation Error: You are not assigned to the project with ID " + item.Projectid);
                            }
                            else
                            {
                                // Check if the project  in the request line is among the Active projects assigned to the user
                                bool isProjectActive = loggedInUserProjectsAssigned.Any(p => p.Pid == item.Projectid && p.PidNavigation.Activestatusflag);

                                if (!isProjectActive)
                                {
                                    return NotFound("Validation Error: The project with ID " + item.Projectid + " is not active.");
                                }
                            }



                        }


                        if (item.Primers.Count > 0)
                        {
                            foreach (var primer in item.Primers)
                            {
                                if (primer.NucleotideSequence.Length < 1 || primer.SequenceIdentifier.Length < 1)
                                {
                                    return NotFound("Validation Error: One or More Primers are empty.");
                                }
                            }

                        }

                    }


                }


                var countInactiveCodes = newRequest.Requestlines.Count(item =>
                    item != null && _context.Products.Any(xx => xx.Id == item.Productid && xx.ActivestatusFlag == false)
                );

                if (countInactiveCodes > 0)
                {
                    return NotFound("Validation Error: One or More Products are currently inactive. Please review your product selection and ensure all chosen products are active.");
                }


                var result = await _superHeroService.AddSingleRequestAsync(newRequest);

                if (result is not null)
                {
                    if (loggedInUser.ApproverU is null)
                    {
                        return Ok(result);
                    }
                    //send email to approver 
                    var htmlemailtemplate3 =
    "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n " +
    " <title>Request Received</title>\r\n  " +
    "<style>\r\n    body {\r\n      font-family: Arial, sans-serif;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n   " +
    " .container {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n      padding: 20px; \r\n    }\r\n    h1 {\r\n      color: #333;\r\n      margin-top: 0;\r\n    }\r\n  " +
    "  p {\r\n      margin: 15;\r\n    }\r\n    table {\r\n      width: 100%;\r\n      border-collapse: collapse;\r\n    }\r\n    th, td {\r\n      padding: 10px;\r\n      border: 1px solid #ddd;\r\n    }\r\n  " +
    "</style>\r\n</head>\r\n" +
    "<body>\r\n " +
    " <div class=\"container\">\r\n    <h3>Request Received</h3>\r\n  " +
    "  <p>" +
    "Dear [Approver],<br><br>" +
    "[User] has submitted an order request. <a href=\"[RequestLink]\">Click here</a> to review and take appropriate action.<br>" +
    "<br>" +
    "Thank you.<br><br>" +
   "[footerream] <br><br>" +
    "</p>  " +
    "</div>\r\n</body>\r\n</html>\r\n";




                    // Send email to the approver and CC the requester
                    //  await SendEmail(approverEmail, "User Request Received", emailTemplate, cc: loggedInUser.Email);



                    var htmlemailtemplateChoosed = htmlemailtemplate3;
                    var getAppSettings = _context.Appsettings.AsNoTracking().Single();

                    //  htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[User]", loggedInUser.FirstName + " " + loggedInUser.LastName);
                    //   htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[UserEmail]", newUser.Email);
                    //   htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[UserPassword]", generatedPassword);

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
                    var approverEmail = loggedInUser.ApproverU.Email ?? string.Empty;
                    var requestLink = "https://stock.ucy.ac.cy/management/requests?status=Pending%20Approval"; // Replace with the link to track the request status

                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[Approver]", loggedInUser.ApproverU.FirstName + " " + loggedInUser.ApproverU.LastName);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[User]", loggedInUser.FirstName + " " + loggedInUser.LastName);
                    htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[RequestLink]", requestLink);


                    var ccRecs = (loggedInUser.Email ?? string.Empty).ToLower();
                    ccRecs = "";
                    var sendemail = await _superHeroService.SendEmailCustom(approverEmail, "IMS - User Request Received", htmlemailtemplateChoosed, false, false, false, ccRecs, null, null);

                    if (sendemail != null)
                    {
                        if (sendemail.result)
                        {
                            //  poorderfound.Sentdate = DateTime.Now;
                            //   poorderfound.Sentbyempid = userId;

                            sendemail.message = "Email Sent to Approver!";

                            // _context.Entry(poorderfound).State = EntityState.Modified;
                            //  _context.SaveChanges();
                        }
                    }



                    return Ok(result);
                }

            }
            return NotFound("Sorry, An error occurred while adding!");
        }


        public struct UpdateDecisionStatusModel
        {
            public int reqlineid { get; set; }
            public int newdecisionid { get; set; }

        }

        public struct UpdateBulkDecisionStatusModel
        {
            public int[] reqlineids { get; set; }
            public string newdecisiontext { get; set; }

        }



        [HttpPut("UpdateBulkDecisionStatus")]
        public ActionResult<List<CustomRequestLines>> UpdateBulkDecisionStatus([FromBody] UpdateBulkDecisionStatusModel data)
        {

            var resultList = new List<CustomRequestLines>();
            var errors = new List<string>();
            var userId = _superHeroService.LoggedInUserID(User);

            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");
            }

            // Check if the input parameters are valid
            if (data.reqlineids.Length <= 0 || string.IsNullOrEmpty(data.newdecisiontext))
            {
                return BadRequest("Wrong Parameters!");
            }

            var newdecisiontextlowered = data.newdecisiontext.ToLower().Trim();

            // Check if newdecisiontext is one of the valid values
            if (newdecisiontextlowered != "approve" && newdecisiontextlowered != "reject" && newdecisiontextlowered != "cancel")
            {
                return BadRequest("Invalid Decision Given!");
            }

            switch (newdecisiontextlowered)
            {
                case "approve":
                    newdecisiontextlowered = "approved";
                    break;
                case "reject":
                    newdecisiontextlowered = "rejected";
                    break;
                case "cancel":
                    newdecisiontextlowered = "cancelled";
                    break;
                default:

                    break;
            }

            var loggedInUser = _context.Users
                                  .Include(x => x.Role)
                                  .Include(x => x.ApproverU)
                                  .FirstOrDefault(xx => xx.Id == userId && xx.LockoutFlag == false);

            if (loggedInUser == null)
            {

                return BadRequest("Unauthorized!");
                //  errors.Add("Unauthorized!");

            }


            // Create an execution strategy
            var executionStrategy = _context.Database.CreateExecutionStrategy();



            executionStrategy.Execute(async () =>
            {
                // Execute logic within a transaction
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        foreach (var reqlineid in data.reqlineids)
                        {
                            try
                            {
                                // Find the request line based on reqlineid
                                var reqLineThatFound = _context.Requestlines
                                    .Include(x => x.Req.ReqByUsr.ApproverU)
                                    .FirstOrDefault(x => x.Id == reqlineid);

                                if (reqLineThatFound is null)
                                {
                                    errors.Add($"ReqLineID: {reqlineid} --> Request Not Found!");
                                    continue; // Skip to the next iteration

                                }




                                if (!loggedInUser.ClaimCanApproveRequest)
                                {
                                    var approver = reqLineThatFound?.Req?.ReqByUsr?.ApproverU ?? null;

                                    if (approver is not null && approver.Id != loggedInUser.Id)
                                    {

                                        errors.Add(($"ReqLineID: {reqlineid} --> You are not authorized to decide for this request.!"));
                                        continue; // Skip to the next iteration
                                    }
                                }


                                var newdecisionid = _context.RequestDecisions.FirstOrDefault(x => x.Name.ToLower() == newdecisiontextlowered)?.Id ?? 0;

                                if (newdecisionid <= 0)
                                {

                                    errors.Add(("Invalid New Decision"));
                                    continue; // Skip to the next iteration
                                }



                                var currentDecisionTask = _superHeroService.LatestRequestDecision(reqLineThatFound.Id);
                                var currentdecision = currentDecisionTask.GetAwaiter().GetResult();

                                if (currentdecision != null)
                                {


                                    if ((currentdecision.linelastDecision?.Decisionid ?? 0) == newdecisionid)
                                    {
                                        errors.Add(($"ReqLineID: {reqlineid} --> It's Already {currentdecision.linelastDecision.Decision.Name}. You can't update the decision."));
                                        continue; // Skip to the next iteration
                                    }


                                    switch (currentdecision.linedynamicstatus.ToLower())
                                    {
                                        case "ordered":

                                            errors.Add(($"ReqLineID: {reqlineid} --> It's Already Ordered. You can't change the decision."));
                                            continue;
                                        case "received":

                                            errors.Add(($"ReqLineID: {reqlineid} --> It's Already Received. You can't change the decision."));
                                            continue;
                                        default:
                                            // Handle other cases or provide a default behavior
                                            break;
                                    }
                                }



                                // Perform the update request decision logic

                                //var currentDecisionTask = _superHeroService.LatestRequestDecision(reqLineThatFound.Id);
                                var resultTask = _superHeroService.UpdateRequestDecision(reqLineThatFound.Id, newdecisionid, userId);
                                var result = resultTask.GetAwaiter().GetResult();

                                if (result != null)
                                {
                                    resultList.Add(result);
                                }
                                else
                                {
                                    errors.Add(($"ReqLineID: {reqlineid} --> Decision cannot be updated"));
                                    continue;
                                }




                            }
                            catch (Exception exx)
                            {


                                errors.Add(($"ReqLineID: {reqlineid} --> Unknown error catched!" + exx.Message));
                                continue;
                            }
                        }

                        // Check if there were any errors
                        if (errors.Count == 0)
                        {
                            // Commit the main transaction only if there are no errors
                            transaction.Commit();
                        }
                        else
                        {
                            // If there are errors, roll back the transaction
                            transaction.Rollback();

                        }

                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        errors.Add(("General error catched!" + ex.Message));

                    }
                }
            });

            // Check if there were any errors and return the appropriate response
            if (errors.Count > 0)
            {
                return BadRequest(errors);
            }

            // Create a dictionary to group request lines by requester's email
            var requestLinesByRequester = new Dictionary<string, List<CustomRequestLines>>();

            foreach (var reqLineFound in resultList)
            {
                if (reqLineFound != null)
                {
                    // Determine the requester's email 
                    // var requesterEmail = reqLineFound.headerreqbyuser.Email;  
                    var requesterEmail = _context.Users.AsNoTracking().Where(x => x.Id == reqLineFound.headerreqbyuserid).Single().Email ?? string.Empty;

                    // Check if the requester's email is already in the dictionary
                    if (!requestLinesByRequester.ContainsKey(requesterEmail))
                    {
                        // If not, add a new entry with an empty list
                        requestLinesByRequester[requesterEmail] = new List<CustomRequestLines>();
                    }

                    // Add the request line to the appropriate group
                    requestLinesByRequester[requesterEmail].Add(reqLineFound);
                }
            }

            // Iterate through the grouped request lines and send emails
            foreach (var kvp in requestLinesByRequester)
            {
                var requesterEmail = kvp.Key;
                var requestLines = kvp.Value;

                // Now we can send an email to requesterEmail with the list of requestLines

                var htmlemailtemplate3 =
   "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n " +
   " <title>Request Decision Made</title>\r\n  " +
   "<style>\r\n    body {\r\n      font-family: Arial, sans-serif;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n   " +
   " .container {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n      padding: 20px; \r\n    }\r\n    h1 {\r\n      color: #333;\r\n      margin-top: 0;\r\n    }\r\n  " +
   "  p {\r\n      margin: 15;\r\n    }\r\n    table {\r\n      width: 100%;\r\n      border-collapse: collapse;\r\n    }\r\n    th, td {\r\n      padding: 10px;\r\n      border: 1px solid #ddd;\r\n    }\r\n  " +
   "</style>\r\n</head>\r\n" +
   "<body>\r\n " +
   " <div class=\"container\">\r\n    <h3>Request Decision Made</h3>\r\n  " +
   "  <p>" +
   "Dear [Requester],<br><br>" +
   $"[DecisionBy] has made a decision ('[DecisionName]') on your following {requestLines.Count.ToString()} requests:<br><br>" +
   "[reqtable]<br><br>" +
   "Thank you.<br><br>" +
   "[footerream] <br><br>" +
   "</p>  " +
   "</div>\r\n</body>\r\n</html>\r\n";
                var htmlemailtemplateChoosed = htmlemailtemplate3;
                var getAppSettings = _context.Appsettings.AsNoTracking().Single();

                //  htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[User]", loggedInUser.FirstName + " " + loggedInUser.LastName);
                //   htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[UserEmail]", newUser.Email);
                //   htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[UserPassword]", generatedPassword);

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
                // var requesterEmail = reqLineFound.headerreqbyuserid.ReqByUsr.Email.ToLower() ?? string.Empty;
                //      var requesterEmail = _context.Users.AsNoTracking().Where(x => x.Id == reqLineFound.headerreqbyuserid).Single().Email ?? string.Empty;
                var requestLink = "https://stock.ucy.ac.cy/management/requests?status=Pending%20Approval"; // Replace with the link to track the request status
                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[Requester]", requestLines[0].headerreqbyuserfirstn + " " + requestLines[0].headerreqbyuserlastn);
                //   htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[Approver]", loggedInUser.ApproverU.FirstName + " " + loggedInUser.ApproverU.LastName);
                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[DecisionBy]", loggedInUser.FirstName + " " + loggedInUser.LastName);
                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[DecisionName]", requestLines[0].linelastDecision?.Decision.Name ?? "");
                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[RequestLink]", requestLink);
                //     htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[ReqLineID]", reqLineFound.linereqid.ToString());
                //  htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[RequestProductInfo]", reqLineFound.linepname);
                // htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[RequestQty]", reqLineFound.lineqty.ToString());

                var ccRecs = (loggedInUser.Email ?? string.Empty).ToLower();
                ccRecs = "";


                var emailContent = "<table style='border-collapse: collapse; width: 100%;'>";
                emailContent += "<thead><tr>";
                emailContent += "<th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Product</th>";
                emailContent += "<th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Quantity</th>";
                emailContent += "<th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Request Line #</th>";
                emailContent += "</tr></thead>";
                emailContent += "<tbody>";

                foreach (var requestLine in requestLines)
                {
                    emailContent += "<tr>";
                    emailContent += $"<td style='border: 1px solid #ddd; padding: 8px;'>{requestLine.linepname}</td>";
                    emailContent += $"<td style='border: 1px solid #ddd; padding: 8px;'>{requestLine.lineqty}</td>";
                    emailContent += $"<td style='border: 1px solid #ddd; padding: 8px;'>{requestLine.linereqid}</td>";
                    emailContent += "</tr>";
                }

                emailContent += "</tbody></table>";
                htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[reqtable]", emailContent);

                //var emailContent = "";
                //foreach (var requestLine in requestLines)
                //{

                //    emailContent += $"Product: {requestLine.linepname}, Quantity: {requestLine.lineqty}, (Request Line #: {requestLine.linereqid})<br>\n";
                //}
                //htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[reqtable]", emailContent);


                var sendemailTask = _superHeroService.SendEmailCustom(requesterEmail, "IMS - Request Decision Made", htmlemailtemplateChoosed, false, false, false, ccRecs, null, null);
                var sendemail = sendemailTask.GetAwaiter().GetResult();
                //if (sendemail != null)
                //{
                //    if (sendemail.result)
                //    {
                //        //  poorderfound.Sentdate = DateTime.Now;
                //        //   poorderfound.Sentbyempid = userId;

                //        sendemail.message = "Email Sent to Requester!";

                //        // _context.Entry(poorderfound).State = EntityState.Modified;
                //        //  _context.SaveChanges();
                //    }
                //}






                // Handle the sendEmailResult as needed
                if (sendemail != null && sendemail.result)
                {
                    // Email sent successfully
                }
                else
                {
                    // Handle the case where email sending failed
                }
            }



            return Ok(resultList);

            //if (errors.Count > 0)
            //{
            //    return BadRequest(errors);
            //} else if  (resultList is not null && resultList.Count > 0 )
            //{
            //    return Ok(resultList);
            //}else
            //{
            //    return  BadRequest( "Unknown Error! Failed");
            //}

        }


        [HttpPut("UpdateDecisionStatus")]
        public async Task<ActionResult<CustomRequestLines>> UpdateRequestDecision([FromBody] UpdateDecisionStatusModel data)
        {

            if (data.reqlineid <= 0 || data.newdecisionid <= 0) { return NotFound(false); }


            var userId = _superHeroService.LoggedInUserID(User);
            if (userId <= 0)
            {
                return BadRequest("Unauthorized!");

            }


            var loggedInUser = null as User;


            if (userId > 0)
            {
                loggedInUser = await _context.Users.Include(x => x.Role).Include(x => x.ApproverU).FirstOrDefaultAsync(xx => xx.Id == userId && xx.LockoutFlag == false);

                if (loggedInUser == null)
                {
                    return Unauthorized("Unauthorized!");
                }

                //  var reqLineFound = _context.Requestlines.Include(x => x.Req).FirstOrDefault(x => x.Id == data.reqlineid);
                var reqLineFound = _context.Requestlines
               .Include(x => x.Req.ReqByUsr.ApproverU)
               .FirstOrDefault(x => x.Id == data.reqlineid);

                if (reqLineFound is null)
                {
                    return NotFound("Request Not Found!");
                }

                if (!loggedInUser.ClaimCanApproveRequest)
                {
                    var approver = reqLineFound?.Req?.ReqByUsr?.ApproverU ?? null;
                    if (approver is not null)
                    {
                        if (approver.Id == loggedInUser.Id)
                        {

                        }
                        else
                        {
                            return Unauthorized("You are not authorized to decide for this request.");
                        }
                        //
                    }
                    else
                    {
                        return Unauthorized("You are not authorized to decide for this request.");
                    }
                }

                var currentdecision = await _superHeroService.LatestRequestDecision(reqLineFound.Id);

                if (currentdecision != null)
                {
                    switch (currentdecision.linedynamicstatus.ToLower())
                    {
                        case "ordered":
                            return NotFound("Its Already Ordered. You can't change the decision.");
                        case "received":
                            return NotFound("Its Already Received. You can't change the decision.");

                        default:
                            // Handle other cases or provide a default behavior
                            break;
                    }
                }



                try
                {
                    var result = await _superHeroService.UpdateRequestDecision(data.reqlineid, data.newdecisionid, userId);


                    if (result is not null)
                    {

                        var htmlemailtemplate3 =
        "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n " +
        " <title>Request Decision Made</title>\r\n  " +
        "<style>\r\n    body {\r\n      font-family: Arial, sans-serif;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n   " +
        " .container {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n      padding: 20px; \r\n    }\r\n    h1 {\r\n      color: #333;\r\n      margin-top: 0;\r\n    }\r\n  " +
        "  p {\r\n      margin: 15;\r\n    }\r\n    table {\r\n      width: 100%;\r\n      border-collapse: collapse;\r\n    }\r\n    th, td {\r\n      padding: 10px;\r\n      border: 1px solid #ddd;\r\n    }\r\n  " +
        "</style>\r\n</head>\r\n" +
        "<body>\r\n " +
        " <div class=\"container\">\r\n    <h3>Request Decision Made</h3>\r\n  " +
        "  <p>" +
        "Dear [Requester],<br><br>" +
        "[DecisionBy] has made a decision ('[DecisionName]') on your request #[ReqLineID].<br>Quantity: [RequestQty] <br>Product: [RequestProductInfo]<br><br>" +
        "<br>" +
        "Thank you.<br><br>" +
       "[footerream] <br><br>" +
        "</p>  " +
        "</div>\r\n</body>\r\n</html>\r\n";




                        // Send email to the approver and CC the requester
                        //  await SendEmail(approverEmail, "User Request Received", emailTemplate, cc: loggedInUser.Email);



                        var htmlemailtemplateChoosed = htmlemailtemplate3;
                        var getAppSettings = _context.Appsettings.AsNoTracking().Single();



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
                        var requesterEmail = reqLineFound.Req.ReqByUsr.Email.ToLower() ?? string.Empty;

                        var requestLink = "https://stock.ucy.ac.cy/management/requests?status=Pending%20Approval"; // Replace with the link to track the request status
                        htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[Requester]", reqLineFound.Req.ReqByUsr.FirstName + " " + reqLineFound.Req.ReqByUsr.LastName);
                        //   htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[Approver]", loggedInUser.ApproverU.FirstName + " " + loggedInUser.ApproverU.LastName);
                        htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[DecisionBy]", loggedInUser.FirstName + " " + loggedInUser.LastName);
                        htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[DecisionName]", result.linelastDecision.Decision.Name ?? "");
                        htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[RequestLink]", requestLink);
                        htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[ReqLineID]", reqLineFound.Id.ToString());
                        htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[RequestProductInfo]", result.linepname);
                        htmlemailtemplateChoosed = htmlemailtemplateChoosed.Replace("[RequestQty]", reqLineFound.Qty.ToString());

                        var ccRecs = (loggedInUser.Email ?? string.Empty).ToLower();
                        ccRecs = "";
                        var sendemail = await _superHeroService.SendEmailCustom(requesterEmail, "IMS - Request Decision Made", htmlemailtemplateChoosed, false, false, false, ccRecs, null, null);

                        if (sendemail != null)
                        {
                            if (sendemail.result)
                            {


                                sendemail.message = "Email Sent to Requester!";


                            }
                        }



                        return Ok(result);
                    }


                }
                catch
                {
                    return NotFound(false);
                    // return NotFound("Sorry, An error occurred while saving!");

                }
            }


            return NotFound(false);
        }


    }
}