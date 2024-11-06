using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Supplier
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Worknumber { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string Website { get; set; } = null!;

    public bool? ActivestatusFlag { get; set; }

    public DateTime CreatedDate { get; set; }

    public string GeneralNotes { get; set; } = null!;

    public bool ExcelattachmentinemailorderFlag { get; set; }

    public virtual ICollection<Contactsofsupplier> Contactsofsuppliers { get; set; } = new List<Contactsofsupplier>();

    public virtual ICollection<Porder> Porders { get; set; } = new List<Porder>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<SupplierInvoice> SupplierInvoices { get; set; } = new List<SupplierInvoice>();

    public virtual ICollection<SupplierItem> SupplierItems { get; set; } = new List<SupplierItem>();

    public virtual ICollection<Tendersuppliersassigned> Tendersuppliersassigneds { get; set; } = new List<Tendersuppliersassigned>();
}
