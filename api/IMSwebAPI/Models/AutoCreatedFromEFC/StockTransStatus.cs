using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class StockTransStatus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Sorting { get; set; }

    public virtual ICollection<StockTran> StockTrans { get; set; } = new List<StockTran>();
}
