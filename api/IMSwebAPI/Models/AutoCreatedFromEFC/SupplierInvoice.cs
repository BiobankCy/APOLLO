using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class SupplierInvoice
{
    public int Id { get; set; }

    public int Supid { get; set; }

    public string Supinvno { get; set; } = null!;

    public DateTime Supinvdate { get; set; }

    public decimal SupInvShippingAndHandlingCost { get; set; }

    public int? VatId { get; set; }

    public int? Attachmentid { get; set; }

    public virtual AttachmentFile? Attachment { get; set; }

    public virtual ICollection<Receiving> Receivings { get; set; } = new List<Receiving>();

    public virtual Supplier Sup { get; set; } = null!;

    public virtual Vatrate? Vat { get; set; }
}
