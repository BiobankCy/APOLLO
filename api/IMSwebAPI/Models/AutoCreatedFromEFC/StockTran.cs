using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class StockTran
{
    public int Id { get; set; }

    public int StockTransTypeId { get; set; }

    public int StockTransReasonId { get; set; }

    public int Userid { get; set; }

    public DateTime Transdate { get; set; }

    public int Status { get; set; }

    public DateTime Updatedat { get; set; }

    public string Description { get; set; } = null!;

    public virtual StockTransStatus StatusNavigation { get; set; } = null!;

    public virtual ICollection<StockTransDetail> StockTransDetails { get; set; } = new List<StockTransDetail>();

    public virtual StockTransReason StockTransReason { get; set; } = null!;

    public virtual StockTransType StockTransType { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
