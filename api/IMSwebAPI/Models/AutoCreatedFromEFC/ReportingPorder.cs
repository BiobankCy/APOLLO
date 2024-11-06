using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class ReportingPorder
{
    public int Supplierid { get; set; }

    public string? Supname { get; set; }

    public DateTime Ordercreateddate { get; set; }

    public int OrderId { get; set; }

    public int? OrderStatusId { get; set; }

    public string? OrderStatus { get; set; }

    public int? OrderLineId { get; set; }

    public bool? ClosedFlag { get; set; }

    public int? Pid { get; set; }

    public string? Pcode { get; set; }

    public string? Pname { get; set; }

    public int? Qty { get; set; }

    public decimal? Lineunitcp { get; set; }

    public decimal? Linevatrate { get; set; }

    public int? Linevatid { get; set; }

    public decimal? LineAmountVatExcluded { get; set; }

    public decimal? LineAmountVatIncluded { get; set; }

    public decimal? LineVatAmount { get; set; }

    public int? Pcatid { get; set; }

    public string? Pcatname { get; set; }

    public int? Tenderid { get; set; }

    public string? Tendercode { get; set; }

    public int? Pbrandid { get; set; }

    public string? Pbrandmame { get; set; }

    public int? ReqId { get; set; }

    public int? ReqlineId { get; set; }

    public int? ReqQty { get; set; }

    public DateTime? ReqDate { get; set; }

    public int? UserReqId { get; set; }

    public string? UserReqFullname { get; set; }

    public int? UserOrdId { get; set; }

    public string? UserOrdFullname { get; set; }
}
