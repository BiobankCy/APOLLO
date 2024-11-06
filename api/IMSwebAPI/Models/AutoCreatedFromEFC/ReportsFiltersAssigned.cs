using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class ReportsFiltersAssigned
{
    public int Id { get; set; }

    public int ReportId { get; set; }

    public int FilterId { get; set; }

    public virtual ReportFilter Filter { get; set; } = null!;

    public virtual Report Report { get; set; } = null!;
}
