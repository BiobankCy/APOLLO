using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class AttachmentFile
{
    public int Id { get; set; }

    public byte[] File { get; set; } = null!;

    public DateTime Lastupdate { get; set; }

    public int Lastuploadbyuid { get; set; }

    public virtual User Lastuploadbyu { get; set; } = null!;

    public virtual ICollection<SupplierInvoice> SupplierInvoices { get; set; } = new List<SupplierInvoice>();
}
