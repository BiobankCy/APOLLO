using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Project
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string GeneralNotes { get; set; } = null!;

    public decimal Presystemamountspent { get; set; }

    public decimal Totalamount { get; set; }

    public bool Activestatusflag { get; set; }

    public int Createdbyempid { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual User Createdbyemp { get; set; } = null!;

    public virtual ICollection<Requestline> Requestlines { get; set; } = new List<Requestline>();

    public virtual ICollection<Userprojectsassigned> Userprojectsassigneds { get; set; } = new List<Userprojectsassigned>();
}
