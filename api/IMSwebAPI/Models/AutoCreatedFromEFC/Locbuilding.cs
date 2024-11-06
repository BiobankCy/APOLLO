using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Locbuilding
{
    public int Id { get; set; }

    public string Building { get; set; } = null!;

    public string Descr { get; set; } = null!;

    public virtual ICollection<Locroom> Locrooms { get; set; } = new List<Locroom>();
}
