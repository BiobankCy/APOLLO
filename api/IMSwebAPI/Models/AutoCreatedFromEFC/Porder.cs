using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Porder
{
    public int Id { get; set; }

    public DateTime Ordercreateddate { get; set; }

    public DateOnly Podate { get; set; }

    public DateOnly Duedate { get; set; }

    public int Supplierid { get; set; }

    public int Createdbyempid { get; set; }

    public int? Sentbyempid { get; set; }

    public DateTime? Sentdate { get; set; }

    public int Statusid { get; set; }

    public string? Notes { get; set; }

    public int? Tenderid { get; set; }

    public virtual User Createdbyemp { get; set; } = null!;

    public virtual ICollection<Porderline> Porderlines { get; set; } = new List<Porderline>();

    public virtual ICollection<Receiving> Receivings { get; set; } = new List<Receiving>();

    public virtual User? Sentbyemp { get; set; }

    public virtual PordersStatus Status { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;

    public virtual Tender? Tender { get; set; }
}
