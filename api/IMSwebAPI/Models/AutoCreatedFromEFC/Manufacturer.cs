using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Manufacturer
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Worknumber { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string Website { get; set; } = null!;

    public bool? ActivestatusFlag { get; set; }

    public DateTime CreatedDate { get; set; }

    public string GeneralNotes { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
