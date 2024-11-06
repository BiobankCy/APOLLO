using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Receiving
{
    public int Id { get; set; }

    public DateTime Receivedatetime { get; set; }

    public int PorderId { get; set; }

    public int ByuserId { get; set; }

    public int? InvoiceId { get; set; }

    public string Notes { get; set; } = null!;

    public virtual User Byuser { get; set; } = null!;

    public virtual SupplierInvoice? Invoice { get; set; }

    public virtual Porder Porder { get; set; } = null!;

    public virtual ICollection<Receivingline> Receivinglines { get; set; } = new List<Receivingline>();
}
