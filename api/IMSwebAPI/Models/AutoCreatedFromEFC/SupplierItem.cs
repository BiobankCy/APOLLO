using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class SupplierItem
{
    public int Id { get; set; }

    public int Supplierid { get; set; }

    public int Productid { get; set; }

    public decimal Unitpurcostprice { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;
}
