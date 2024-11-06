using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Productdepartment
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Productdepartmentsassigned> Productdepartmentsassigneds { get; set; } = new List<Productdepartmentsassigned>();
}
