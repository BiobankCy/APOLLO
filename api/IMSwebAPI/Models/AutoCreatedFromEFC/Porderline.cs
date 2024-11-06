using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Porderline
{
    public int Id { get; set; }

    public int Pordid { get; set; }

    public int Productid { get; set; }

    public int Qty { get; set; }

    public decimal Unitpurcostprice { get; set; }

    public int Vatindex { get; set; }

    public int? Requestlineid { get; set; }

    public bool ClosedFlag { get; set; }

    public virtual Porder Pord { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual ICollection<Receivingline> Receivinglines { get; set; } = new List<Receivingline>();

    public virtual Requestline? Requestline { get; set; }

    public virtual Vatrate VatindexNavigation { get; set; } = null!;
}
