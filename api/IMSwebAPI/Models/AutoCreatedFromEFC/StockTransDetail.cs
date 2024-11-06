using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class StockTransDetail
{
    public int Id { get; set; }

    public int Transid { get; set; }

    public int Pid { get; set; }

    public int Qty { get; set; }

    public int Locid { get; set; }

    public int Lotid { get; set; }

    public int Conditionstatus { get; set; }

    public bool UnitcostRecalculationFlag { get; set; }

    public decimal Unitcostprice { get; set; }

    public int DocumentLineid { get; set; }

    public string Si { get; set; } = null!;

    public string Ns { get; set; } = null!;

    public virtual Itemconditionstatus ConditionstatusNavigation { get; set; } = null!;

    public virtual Location Loc { get; set; } = null!;

    public virtual Lot Lot { get; set; } = null!;

    public virtual Product PidNavigation { get; set; } = null!;

    public virtual StockTran Trans { get; set; } = null!;
}
