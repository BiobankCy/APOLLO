using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Vatrate
{
    public int Id { get; set; }

    public decimal Rate { get; set; }

    public virtual ICollection<Porderline> Porderlines { get; set; } = new List<Porderline>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<Receivingline> Receivinglines { get; set; } = new List<Receivingline>();

    public virtual ICollection<SupplierInvoice> SupplierInvoices { get; set; } = new List<SupplierInvoice>();
}
