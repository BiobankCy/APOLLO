using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Tendersuppliersassigned
{
    public int Id { get; set; }

    public int Tid { get; set; }

    public int Sid { get; set; }

    public virtual Supplier SidNavigation { get; set; } = null!;

    public virtual Tender TidNavigation { get; set; } = null!;
}
