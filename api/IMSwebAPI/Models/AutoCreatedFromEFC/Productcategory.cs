using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Productcategory
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Descr { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<Productsubcategory> Productsubcategories { get; set; } = new List<Productsubcategory>();
}
