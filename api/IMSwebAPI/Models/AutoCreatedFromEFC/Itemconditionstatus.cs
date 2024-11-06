using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Itemconditionstatus
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Receivingline> Receivinglines { get; set; } = new List<Receivingline>();

    public virtual ICollection<StockTransDetail> StockTransDetails { get; set; } = new List<StockTransDetail>();

    public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();
}
