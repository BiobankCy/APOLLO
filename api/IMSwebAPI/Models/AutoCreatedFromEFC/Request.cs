using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Request
{
    public int Id { get; set; }

    public DateTime ReqDate { get; set; }

    public int ReqByUsrId { get; set; }

    public string Notes { get; set; } = null!;

    public virtual User ReqByUsr { get; set; } = null!;

    public virtual ICollection<Requestline> Requestlines { get; set; } = new List<Requestline>();
}
