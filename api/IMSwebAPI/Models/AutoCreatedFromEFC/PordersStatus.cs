using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class PordersStatus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Sorting { get; set; }

    public virtual ICollection<Porder> Porders { get; set; } = new List<Porder>();
}
