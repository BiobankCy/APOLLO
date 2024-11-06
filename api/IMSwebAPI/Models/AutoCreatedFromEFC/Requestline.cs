using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Requestline
{
    public int Id { get; set; }

    public int ReqId { get; set; }

    public int Productid { get; set; }

    public int Qty { get; set; }

    public bool UrgentFlag { get; set; }

    public string Comment { get; set; } = null!;

    public int? Projectid { get; set; }

    public virtual ICollection<Picking> Pickings { get; set; } = new List<Picking>();

    public virtual ICollection<Porderline> Porderlines { get; set; } = new List<Porderline>();

    public virtual ICollection<Primer> Primers { get; set; } = new List<Primer>();

    public virtual Product Product { get; set; } = null!;

    public virtual Project? Project { get; set; }

    public virtual Request Req { get; set; } = null!;

    public virtual ICollection<Requestdecisionhistory> Requestdecisionhistories { get; set; } = new List<Requestdecisionhistory>();
}
