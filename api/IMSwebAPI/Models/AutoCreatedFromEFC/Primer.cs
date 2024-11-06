using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Primer
{
    public int Id { get; set; }

    public int Reqlineid { get; set; }

    public string SequenceIdentifier { get; set; } = null!;

    public string NucleotideSequence { get; set; } = null!;

    public virtual Requestline Reqline { get; set; } = null!;
}
