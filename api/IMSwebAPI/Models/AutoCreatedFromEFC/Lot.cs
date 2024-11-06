using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Lot
{
    public int Id { get; set; }

    public string Lotnumber { get; set; } = null!;

    public DateOnly? Expdate { get; set; }

    public virtual ICollection<Picking> Pickings { get; set; } = new List<Picking>();

    public virtual ICollection<Receivingline> Receivinglines { get; set; } = new List<Receivingline>();

    public virtual ICollection<StockTransDetail> StockTransDetails { get; set; } = new List<StockTransDetail>();

    public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();
}
