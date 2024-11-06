using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Appsetting
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = null!;

    public string CompanyEmail { get; set; } = null!;

    public string CompanyWebsiteLink { get; set; } = null!;

    public bool SendEmailByApp { get; set; }

    public bool? SendEmailForNewRequest { get; set; }

    public bool? SendEmailAfterRequestDecision { get; set; }

    public string SmtpServer { get; set; } = null!;

    public int SmtpPort { get; set; }

    public string SmtpSecuresocketoptions { get; set; } = null!;

    public string SmtpUsername { get; set; } = null!;

    public string SmtpPasswordEncr { get; set; } = null!;

    public string SmtpFromaddress { get; set; } = null!;

    public int SmtpTimeout { get; set; }

    public int UserPassMinlength { get; set; }

    public int AutorefreshMainmenuSecs { get; set; }

    public string WmsReceivinglocMethod { get; set; } = null!;

    public bool WmsAllowreceivingmoreqtythanpo { get; set; }

    public string OrderEmailSubject { get; set; } = null!;
}
