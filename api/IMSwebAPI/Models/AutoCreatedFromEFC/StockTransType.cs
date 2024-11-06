using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class StockTransType
{
    public int Id { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<StockTran> StockTrans { get; set; } = new List<StockTran>();
}
