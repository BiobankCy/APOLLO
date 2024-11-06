using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Userprojectsassigned
{
    public int Id { get; set; }

    public int Pid { get; set; }

    public int Uid { get; set; }

    public virtual Project PidNavigation { get; set; } = null!;

    public virtual User UidNavigation { get; set; } = null!;
}
