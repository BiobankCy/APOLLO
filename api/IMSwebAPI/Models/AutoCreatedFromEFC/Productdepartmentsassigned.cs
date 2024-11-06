using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Productdepartmentsassigned
{
    public int Id { get; set; }

    public int Pid { get; set; }

    public int Did { get; set; }

    public virtual Productdepartment DidNavigation { get; set; } = null!;

    public virtual Product PidNavigation { get; set; } = null!;
}
