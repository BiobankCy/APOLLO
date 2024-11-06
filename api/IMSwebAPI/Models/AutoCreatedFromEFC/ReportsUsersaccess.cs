using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class ReportsUsersaccess
{
    public int Id { get; set; }

    public int ReportId { get; set; }

    public int AccessGivenTouserId { get; set; }

    public int AccessGivenByuserId { get; set; }

    public DateTime AccessGivenDate { get; set; }

    public virtual User AccessGivenByuser { get; set; } = null!;

    public virtual Report Report { get; set; } = null!;
}
