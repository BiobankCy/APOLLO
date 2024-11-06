using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Report
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Categoryid { get; set; }

    public virtual ReportCategory Category { get; set; } = null!;

    public virtual ICollection<ReportsFiltersAssigned> ReportsFiltersAssigneds { get; set; } = new List<ReportsFiltersAssigned>();

    public virtual ICollection<ReportsUsersaccess> ReportsUsersaccesses { get; set; } = new List<ReportsUsersaccess>();
}
