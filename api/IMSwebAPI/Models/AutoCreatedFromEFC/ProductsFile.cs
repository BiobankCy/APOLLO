using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class ProductsFile
{
    public int Id { get; set; }

    public int Pid { get; set; }

    public byte[]? Photo { get; set; }

    public byte[]? Documents { get; set; }

    public virtual Product PidNavigation { get; set; } = null!;
}
