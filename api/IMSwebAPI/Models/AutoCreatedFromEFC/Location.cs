using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Location
{
    public int Id { get; set; }

    public string Locname { get; set; } = null!;

    public int Roomid { get; set; }

    public int Loctypeid { get; set; }

    public string Descr { get; set; } = null!;

    public bool? ActivestatusFlag { get; set; }

    public virtual Locationtype Loctype { get; set; } = null!;

    public virtual ICollection<Picking> Pickings { get; set; } = new List<Picking>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<Receivingline> Receivinglines { get; set; } = new List<Receivingline>();

    public virtual Locroom Room { get; set; } = null!;

    public virtual ICollection<StockTransDetail> StockTransDetails { get; set; } = new List<StockTransDetail>();

    public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();
}
