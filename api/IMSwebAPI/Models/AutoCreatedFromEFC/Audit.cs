using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Audit
{
    public int Id { get; set; }

    public DateTime ActionDatetime { get; set; }

    public int ActionByUserId { get; set; }

    public string ActionByIpaddress { get; set; } = null!;

    public string ActivityType { get; set; } = null!;

    public string TableName { get; set; } = null!;

    public string OldEntity { get; set; } = null!;

    public string NewEntity { get; set; } = null!;

    public int ModifiedPk { get; set; }

    public string ExtraNotes { get; set; } = null!;
}
