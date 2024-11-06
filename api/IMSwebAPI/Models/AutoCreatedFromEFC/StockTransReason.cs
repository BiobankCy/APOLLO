using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class StockTransReason
{
    public int Id { get; set; }

    public string ReasonName { get; set; } = null!;

    public virtual ICollection<StockTran> StockTrans { get; set; } = new List<StockTran>();
}
