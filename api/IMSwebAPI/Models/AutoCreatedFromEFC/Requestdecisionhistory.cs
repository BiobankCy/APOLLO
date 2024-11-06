using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Requestdecisionhistory
{
    public int Id { get; set; }

    public int Reqlineid { get; set; }

    public int Decisionid { get; set; }

    public int Madebyuserid { get; set; }

    public DateTime Decisiondatetime { get; set; }

    public string Comments { get; set; } = null!;

    public virtual RequestDecision Decision { get; set; } = null!;

    public virtual User Madebyuser { get; set; } = null!;

    public virtual Requestline Reqline { get; set; } = null!;
}
