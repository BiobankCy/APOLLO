using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Receivingline
{
    public int Id { get; set; }

    public int ReceivingId { get; set; }

    public int Productid { get; set; }

    public int Qty { get; set; }

    public int Lotid { get; set; }

    public int ReceivinglocId { get; set; }

    public decimal Unitpurcostprice { get; set; }

    public int Vatindex { get; set; }

    public int Conditionstatus { get; set; }

    public int? PolineId { get; set; }

    public string Notesaboutconditionstatus { get; set; } = null!;

    public decimal LinediscountPerc { get; set; }

    public decimal Originalpurcostpricebeforedisc { get; set; }

    public virtual Itemconditionstatus ConditionstatusNavigation { get; set; } = null!;

    public virtual Lot Lot { get; set; } = null!;

    public virtual Porderline? Poline { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Receiving Receiving { get; set; } = null!;

    public virtual Location Receivingloc { get; set; } = null!;

    public virtual Vatrate VatindexNavigation { get; set; } = null!;
}
