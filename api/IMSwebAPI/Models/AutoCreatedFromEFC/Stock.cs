using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Stock
{
    public int Id { get; set; }

    public int Productid { get; set; }

    public int Qty { get; set; }

    public int Locid { get; set; }

    public int Lotid { get; set; }

    public DateTime Lastupdate { get; set; }

    public int Conditionstatus { get; set; }

    public string Si { get; set; } = null!;

    public string Ns { get; set; } = null!;

    public virtual Itemconditionstatus ConditionstatusNavigation { get; set; } = null!;

    public virtual Location Loc { get; set; } = null!;

    public virtual Lot Lot { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
