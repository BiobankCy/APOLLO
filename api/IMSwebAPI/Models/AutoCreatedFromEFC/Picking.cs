using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Picking
{
    public int Id { get; set; }

    public int UserIdpicker { get; set; }

    public int ReqLineId { get; set; }

    public int Locid { get; set; }

    public int Lotid { get; set; }

    public int PickedQty { get; set; }

    public DateTime Datetimepicked { get; set; }

    public virtual Location Loc { get; set; } = null!;

    public virtual Lot Lot { get; set; } = null!;

    public virtual Requestline ReqLine { get; set; } = null!;

    public virtual User UserIdpickerNavigation { get; set; } = null!;
}
