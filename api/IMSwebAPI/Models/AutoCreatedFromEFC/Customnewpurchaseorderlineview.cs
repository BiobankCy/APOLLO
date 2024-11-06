using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Customnewpurchaseorderlineview
{
    public int Orderid { get; set; }

    public int? Statusid { get; set; }

    public string? Orderstatus { get; set; }

    public int? Lineid { get; set; }

    public int? Productid { get; set; }

    public string? Pcode { get; set; }

    public string? Pname { get; set; }

    public bool? Activestatusflag { get; set; }

    public int? OrderQty { get; set; }

    public int? Pcatid { get; set; }

    public string? Pcatname { get; set; }

    public int? Psubcatid { get; set; }

    public string? Psubname { get; set; }

    public int? Pbrandid { get; set; }

    public string? Pbrname { get; set; }

    public int? Reqlineid { get; set; }

    public int? Reqqty { get; set; }

    public DateTime? Reqdate { get; set; }

    public int? ReqId { get; set; }

    public int? Reqbyuid { get; set; }

    public string? Reqfn { get; set; }

    public string? Reqln { get; set; }

    public int? Orderbyuid { get; set; }

    public string? Ordfn { get; set; }

    public string? Ordln { get; set; }

    public int? Tenderid { get; set; }

    public string? Tendercode { get; set; }

    public decimal? Orderunitcp { get; set; }

    public int? Ordvatindex { get; set; }

    public decimal? Ordvrate { get; set; }

    public bool? ClosedFlag { get; set; }

    public DateTime Ordercreateddate { get; set; }

    public int? Posentbyempid { get; set; }

    public DateTime? Posentdate { get; set; }

    public DateOnly Duedate { get; set; }

    public string? Ponotes { get; set; }

    public int Supplierid { get; set; }

    public string? SupplierName { get; set; }

    public string? SupplierEmail { get; set; }

    public string? Supworknumber { get; set; }

    public string? PrimersData { get; set; }

    public string? LastReceivedatetime { get; set; }

    public decimal? TotalrecQty { get; set; }

    public decimal? Difference { get; set; }

    public string? Dynamicstatus { get; set; }

    public long Invcounter { get; set; }

    public long? Reccounter { get; set; }
}
