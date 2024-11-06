using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Locroom
{
    public int Id { get; set; }

    public string Room { get; set; } = null!;

    public string Descr { get; set; } = null!;

    public int Buildingid { get; set; }

    public virtual Locbuilding Building { get; set; } = null!;

    public virtual ICollection<Location> Locations { get; set; } = new List<Location>();
}
