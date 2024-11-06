using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class RequestDecision
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Sorting { get; set; }

    public virtual ICollection<Requestdecisionhistory> Requestdecisionhistories { get; set; } = new List<Requestdecisionhistory>();
}
