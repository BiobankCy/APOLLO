using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Locationtype
{
    public int Id { get; set; }

    public string Loctype { get; set; } = null!;

    public bool? ActivestatusFlag { get; set; }

    public virtual ICollection<Location> Locations { get; set; } = new List<Location>();
}
