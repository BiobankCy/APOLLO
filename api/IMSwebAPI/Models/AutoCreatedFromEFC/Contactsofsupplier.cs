using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Contactsofsupplier
{
    public int Id { get; set; }

    public int Supplierid { get; set; }

    public string Department { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string Firstname { get; set; } = null!;

    public string Lastname { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Workphone { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Zipcode { get; set; } = null!;

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string Notes { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public bool Cconpurchaseorder { get; set; }

    public bool Activestatusflag { get; set; }

    public virtual Supplier Supplier { get; set; } = null!;
}
