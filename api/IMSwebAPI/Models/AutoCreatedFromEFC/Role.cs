using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Role
{
    public int Id { get; set; }

    public string RoleName { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
