using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class ReportFilter
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public virtual ICollection<ReportsFiltersAssigned> ReportsFiltersAssigneds { get; set; } = new List<ReportsFiltersAssigned>();
}
