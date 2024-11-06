using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Productsubcategory
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Descr { get; set; } = null!;

    public int Catid { get; set; }

    public virtual Productcategory Cat { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
