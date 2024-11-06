using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Tender
{
    public int Id { get; set; }

    public string Tendercode { get; set; } = null!;

    public decimal Totalamount { get; set; }

    public int Createdbyempid { get; set; }

    public DateTime Createddate { get; set; }

    public string GeneralNotes { get; set; } = null!;

    public bool Activestatusflag { get; set; }

    public decimal Presystemamountspent { get; set; }

    public virtual User Createdbyemp { get; set; } = null!;

    public virtual ICollection<Porder> Porders { get; set; } = new List<Porder>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<Tendersuppliersassigned> Tendersuppliersassigneds { get; set; } = new List<Tendersuppliersassigned>();
}
