using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using IMSwebAPI.Models.AutoCreatedFromEFC;


namespace IMSwebAPI.Models.CustomModels
{

    public class MyCustomUser : User
    {
        [JsonIgnore]
        public override ICollection<User>? InverseApproverU { get; set; } = null;
        [JsonIgnore]
        public override ICollection<Picking> Pickings { get; set; } = null;
        [JsonIgnore]

        public override ICollection<Porder> PorderCreatedbyemps { get; set; } = null;
        [JsonIgnore]

        public override ICollection<Porder> PorderSentbyemps { get; set; } = null;
        [JsonIgnore]

        public override ICollection<Receiving> Receivings { get; set; } = null;
        //[JsonIgnore]



        //public override ICollection<Requestline> Requestlines { get; set; } = null;
        [JsonIgnore]

        public override ICollection<Request> Requests { get; set; } = null;
        [JsonIgnore]


        public override ICollection<StockTran> StockTrans { get; set; } = null;
        [JsonIgnore]

        public override ICollection<Tender> Tenders { get; set; } = null;
        [JsonIgnore]

        public override UserPassword? UserPassword { get; set; } = null;

    }


    public class CustomPorderline : Porderline
    {
        public int alreadyreceivedqty { get; set; } = 0;
    }
    public class ProductStockModel
    {
        public int Pid { get; set; }
        public string Pcode { get; set; }
        public string Pname { get; set; }
        public string PdefaultSupplier { get; set; }
        public string Building { get; set; }
        public string Room { get; set; }
        public string Pcategory { get; set; }
        public int TotalQty { get; set; }
        public decimal PUnitWAVG { get; set; }
        public decimal TotalValue { get; set; }

    }

    public class CustomTransactionLineDTO
    {

        public int transid { get; set; }

        public int translineid { get; set; }
        public DateTime transdate { get; set; }
        public string transtype { get; set; }
        public string transreason { get; set; }
        public int qty { get; set; }
        public string? lotnumber { get; set; }
        public DateOnly? expdate { get; set; }
        public string user { get; set; }
        public int doclineid { get; set; }
        public decimal unitcostprice { get; set; }
        public bool unitcostrecalflag { get; set; }
        public int pid { get; set; }
        public int locid { get; set; }
        public int lotid { get; set; }
        public string locname { get; set; }

    }


    public class ReportForOrdersModelHead
    {
        public List<ReportForOrdersModel> rows { get; set; } = new List<ReportForOrdersModel>();
        public ReportFilters? filters { get; set; }
        public ReportForOrdersModel totalsline { get; set; } = new ReportForOrdersModel();
    }

    public class ReportForOrdersModel
    {
        public string? suppliername { get; set; }

        public int? supplierid { get; set; }
        public int? catid { get; set; }
        public string? catname { get; set; }
        public int? brandid { get; set; }
        public string? brandname { get; set; }
        public int? tenderid { get; set; }
        public string? tendername { get; set; }

        public int? requserid { get; set; }
        public string? requserfullname { get; set; }

        public int? pid { get; set; }
        public string? pcode { get; set; }
        public string? pname { get; set; }
        public int? month { get; set; }
        public int? year { get; set; }
        public string? invno { get; set; }
        public DateTime? invdate { get; set; }
        public int totalqty { get; set; }
        public decimal totalInvshippingamountVatIncluded { get; set; }
        public decimal totalInvshippingamountVatExcluded { get; set; }

        public decimal totalInvshippingVATamount { get; set; }

        public decimal totalamountVatExcluded { get; set; }
        public decimal totalamountVatIncluded { get; set; }
        public decimal totalVatAmount { get; set; }

    }

    public class CustomProduct : Product
    {
        public List<AvailableStockLine> AvailableStockAnalysis { get; set; }
        public List<Productdepartment> Departments { get; set; } = new List<Productdepartment>();
        public int Availabletotalstockqty { get; set; }
        public decimal VatRate { get; set; }
        public string? DefaultSupplierName { get; set; } = null;
        public string? ManufacturerName { get; set; } = null;
        public string? DefaultLocName { get; set; } = null;
        public string? CategoryName { get; set; } = null;
        public string? SubCategoryName { get; set; } = null;
        public string? BrandName { get; set; } = null;
        public string? StorageCondsName { get; set; } = null;
        public string? TenderName { get; set; } = null;
        //public CustomProduct()
        //{
        //    AvailableStockAnalysis = new List<AvailableStockLine>();
        //    availabletotalstockqty = 0;
        //}
        //protected CustomProduct(string avQty)
        //{
        //    AvailableStockAnalysis = new List<AvailableStockLine>();
        //    availabletotalstockqty = avQty;
        //    //   Category = new Productcategory();
        //    //    DefaultSupplier = new Supplier();
        //    //   StorageCondition = new StorageCondition();
        //    //   Vat = new Vatrate();   

        //}

        [JsonIgnore]
        public override Productcategory? Category { get; set; } = null;
        [JsonIgnore]
        public override Productbrand? Brand { get; set; } = null;

        [JsonIgnore]
        public override Productsubcategory? Subcategory { get; set; } = null;


        [JsonIgnore]

        public override Location? DefaultLoc { get; set; } = null;
        [JsonIgnore]
        public override Supplier? DefaultSupplier { get; set; } = null;
        [JsonIgnore]
        public override Manufacturer? Manufacturer { get; set; } = null;
        [JsonIgnore]
        public override StorageCondition? StorageCondition { get; set; } = null;
        [JsonIgnore]
        public override Vatrate? Vat { get; set; } = null;
        [JsonIgnore]
        public override ProductsFile? ProductsFile { get; set; } = null;
        [JsonIgnore]
        public override ICollection<Porderline>? Porderlines { get; set; } = null;
        [JsonIgnore]
        public override ICollection<Receivingline>? Receivinglines { get; set; } = null;
        [JsonIgnore]
        public override ICollection<Requestline>? Requestlines { get; set; } = null;
        [JsonIgnore]
        public override ICollection<StockTransDetail>? StockTransDetails { get; set; } = null;
        [JsonIgnore]
        public override ICollection<Stock>? Stocks { get; set; } = null;
        [JsonIgnore]
        public override ICollection<SupplierItem>? SupplierItems { get; set; } = null;
        [JsonIgnore]
        public override ICollection<Productdepartmentsassigned> Productdepartmentsassigneds { get; set; } = null;
        //public virtual void GetDescription()
        //{
        //    Console.WriteLine($"This smartphone is {Inches} inches big and its operating system is {OperatingSystem}");
        //}

        //public void ShowInstalledApps()
        //{
        //    Console.WriteLine($"There are {InstalledApps.Count} app installed");
        //}
    }

    public class AvailableStockLine
    {
        public int qty { get; set; }
        public int locid { get; set; } = 0;
        public string locname { get; set; } = "";
        public int lotid { get; set; } = 0;
        public string lotnumber { get; set; } = "";
        public int buildid { get; set; } = 0;
        public string buldingname { get; set; } = "";
        public int roomid { get; set; } = 0;
        public string roomname { get; set; } = "";
        public int conid { get; set; } = 0;
        public string conname { get; set; } = "";
        public int loctypeid { get; set; } = 0;
        public string loctypename { get; set; } = "";
        public string si { get; set; } = "";
        public string ns { get; set; } = "";
        public DateTime? expdate { get; set; }

    }

    public class Notification
    {
        public int id { get; set; }
        public string title { get; set; } = "";
        public string message { get; set; } = "";
        public DateTime? date { get; set; }

    }


    public class CustomRequestLines
    {
        public int headerreqid { get; set; }
        public DateTime headerreqdate { get; set; }
        public int headerreqbyuserid { get; set; }
        public string headerreqbyuserfirstn { get; set; } = "";
        public string headerreqbyuserlastn { get; set; } = "";
        public int headerreqstatusid { get; set; }
        public string headerreqstatusname { get; set; } = "";
        public string headerreqnotes { get; set; } = "";
        public int linereqid { get; set; }
        public int linepid { get; set; }
        public string linepcode { get; set; } = "";

        public string linepbarcode { get; set; } = "";
        public string linedynamicstatus { get; set; } = "";
        //public virtual Requestdecisionhistory linelastDecision { get; set; } = null;
        public virtual Requestdecisionhistory? linelastDecision { get; set; }

        //public List<Primer> linePrimers { get; set; } = new List<Primer>();
        public virtual ICollection<Primer>? linePrimers { get; set; }
        public string linepname { get; set; } = "";
        public int lineqty { get; set; }
        public bool linerequrgentflag { get; set; }
        public string linereqcomment { get; set; } = "";
        //public int? linedecbyuserid { get; set; }
        //public string? linedecbyuserfullname { get; set; } = null;
        //public int? linedecid { get; set; }
        //public string linedecname { get; set; } = "";
        //public DateTime? linedeclastupdate { get; set; }
        //public  DateOnly? linedueDate { get; set; }
        public int linedefsupplierid { get; set; }
        public string linedefsuppliername { get; set; } = "";
        public int? lineprojectid { get; set; }
        public string lineprojectname { get; set; } = "";
        public bool linepActivestatusFlag { get; set; }
        public int lineorderedqty { get; set; } = 0;
        public int linereceivedqty { get; set; } = 0;
        public DateTime? linelastreceivedDate { get; set; }
        //public string linesequenceidentifier { get; set; } = "";
        //public string linenucleotideSequence { get; set; } = "";
        public decimal linepunitcost { get; set; } = 0;
    }
}


public class CustomPurchaseOrderLinesForm
{
    public List<CustomProduct> products { get; set; } = new List<CustomProduct>();

    public List<CustomPurchaseOrder> porderheader { get; set; } = new List<CustomPurchaseOrder>();
    public List<Porderline> porderdetails { get; set; } = new List<Porderline>();

}
public class SMTPSettings
{
    public string smtpServer { get; set; } = "";
    public int smtpPort { get; set; } = 587;
    public string smtpUsername { get; set; } = "";
    public string smtpFromAddress { get; set; } = "";
    public int smtpTimeoutMs { get; set; } = 15000;
    public string smtpSecureSocketOption { get; set; } = "Auto";
    public bool sendEmailByApp { get; set; } = false;
}
public class SMTPChangePasswordDTO
{

    [Required]
    public string encryptedPassword { get; set; } = string.Empty;


}


public class SubmitSupplierInvoiceExtraCostsModel
{


    public int invoiceid { get; set; } = 0;


    public decimal shippingandhandlingcostexcludingvat { get; set; }
    public int shippingandhandlingcostvatindex { get; set; }


}
public class SubmitNewSupplierInvoiceModel
{


    public int supid { get; set; }
    public string supinvno { get; set; }
    public decimal supInvShippingAndHandlingCost { get; set; }
    public int vatId { get; set; }
    public int orderid { get; set; }

    public int? attachmentid { get; set; }
    public DateTime supinvdate { get; set; }
    public IFormFile? attachmentfile { get; set; }

}




//public class SubmitSupplierInvoiceExtraCostsModel
//{


//    public string supplierinvoice { get; set; }=string.Empty;
//    public int orderidrelatedtoinvoice { get; set; } 

//    public decimal shippingandhandlingcostexcludingvat { get; set; }
//    public int shippingandhandlingcostvatindex { get; set; }


//}

public class CustomNEWPurchaseOrderLine
{

    public int OrderId { get; set; }
    public int StatusId { get; set; }
    public string OrderStatus { get; set; } = "";
    public int LineId { get; set; }
    public int ProductId { get; set; }
    public string Pcode { get; set; } = "";
    public string Pname { get; set; } = "";
    public int OrderQty { get; set; }

    public int? ReqLineId { get; set; }
    public int ReqId { get; set; }
    public int ReqByUid { get; set; }
    public string ReqFn { get; set; } = "";
    public string ReqLn { get; set; } = "";
    public int OrderByUid { get; set; }
    public string Ordfn { get; set; } = "";
    public string Ordln { get; set; } = "";
    public int TenderId { get; set; }
    public string TenderCode { get; set; } = "";
    public decimal OrderUnitCp { get; set; }
    public int OrdVatIndex { get; set; }
    public decimal OrdVRate { get; set; }
    public bool ClosedFlag { get; set; }
    public DateTime OrderCreatedDate { get; set; }
    public DateTime DueDate { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = "";
    public string SupplierEmail { get; set; } = "";
    public DateTime? LastReceivedatetime { get; set; }
    public int TotalRecQty { get; set; }
    public int Difference { get; set; }
    public string? Dynamiclinestatus { get; set; }

}

public class Customnewpurchaseorderlineview2 : Customnewpurchaseorderlineview
{
    [JsonIgnore]
    public new string? PrimersData { get; set; } = null;
    public Requestdecisionhistory? LinelastDecision { get; set; }
    public List<Primer>? Primers { get; set; }
    public ICollection<CustomReceiving>? Receivings { get; set; } = null;
    public CustomPurchaseOrder? Pord { get; set; } = null!;
}


public class CustomPurchaseOrderLine
{


    public int Id { get; set; }
    public int Pordid { get; set; }
    public int Productid { get; set; }
    public int Qty { get; set; }
    public decimal Unitpurcostprice { get; set; }
    public int Vatindex { get; set; }
    public decimal Vatrate { get; set; }
    public int? Requestlineid { get; set; }
    public string? Dynamiclinestatus { get; set; }
    public bool Closedflag { get; set; }
    public virtual CustomPurchaseOrder? Pord { get; set; } = null!;
    public virtual CustomProduct? Product { get; set; } = null!;
    public virtual CustomRequestLines? Requestline { get; set; }

    public virtual ICollection<CustomReceiving>? Receivings { get; set; }
}



public class CustomReceiving
{

    public int Id { get; set; }
    public DateTime Receivedatetime { get; set; }
    public int PorderId { get; set; }
    public int ByuserId { get; set; }
    public int InvoiceId { get; set; }
    public virtual SupplierInvoice? Invoice { get; set; }
    //public string Supinvno { get; set; } = null!;
    //public decimal  SupInvShippingAndHandlingCost { get; set; } = 0;
    //public int? SupInvShippingAndHandlingCostVatID { get; set; } 

    // public virtual Vatrate? SupInvShippingAndHandlingCostVat { get; set; } 

    public ICollection<CustomReceivingline> Receivinglines { get; set; }
}

public class CustomReceivingline
{
    public int Id { get; set; }
    public int ReceivingId { get; set; }
    public int Productid { get; set; }
    public int Qty { get; set; }

    public decimal Unitpurcostprice { get; set; }



    public int Lotid { get; set; }
    public int ReceivinglocId { get; set; }

    public int Vatindex { get; set; }
    public int Conditionstatus { get; set; }
    public int? PolineId { get; set; }
    public string notesaboutconditionstatus { get; set; } = "";

    public CustomProduct? Product { get; set; } = null!;

    public Vatrate VatindexNavigation { get; set; } = null!;



}

public class DateRangeType
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class ReportFilters
{

    public List<int>? ProductIDS { get; set; }
    public List<int>? LocationIDS { get; set; }
    public List<int>? CategoryIDS { get; set; }
    public List<int>? SupplierIDS { get; set; }
    public List<int>? TenderIDS { get; set; }
    public List<int>? OrderedByUserIDS { get; set; }
    public List<int>? RequestedByUserIDS { get; set; }
    public List<int>? ExcludeCanceledOrders { get; set; }

    public DateRangeType? DatePeriod { get; set; }
}




public class CustomTender : Tender
{
    public decimal? thissystemamountspent { get; set; } = 0;
    public decimal? remainingamount { get; set; } = 0;


}

public class ProjectUserAssignmentModel
{
    public int UserId { get; set; }
    public int ProjectId { get; set; }
}

public class ProjectMultipleUserAssignmentModel
{
    public required int[] UserId { get; set; }
    public required int ProjectId { get; set; }
}


public class CustomProject : Project
{
    public CustomProject(Project project)
    {
        // Copy the properties from the Project instance to the CustomProject instance

        this.Id = project.Id;
        this.Name = project.Name;
        this.Userprojectsassigneds = project.Userprojectsassigneds;
        this.Createdbyempid = project.Createdbyempid;
        this.CreatedDate = project.CreatedDate;
        this.GeneralNotes = project.GeneralNotes;
        this.Activestatusflag = project.Activestatusflag;
        //  this.Createdbyemp = project.Createdbyemp;
        this.Createdbyemp = null;
        foreach (var upa in project.Userprojectsassigneds)
        {
            upa.PidNavigation = null;
            var newuser = new User();
            newuser.Id = upa.UidNavigation.Id;
            newuser.FirstName = upa.UidNavigation.FirstName;
            newuser.LastName = upa.UidNavigation.LastName;
            newuser.Email = upa.UidNavigation.Email;
            upa.UidNavigation = newuser;
            //upa.UidNavigation.AttachmentFiles = [];
            //upa.UidNavigation.ApproverU=null;
            //upa.UidNavigation.Projects = [];
        }
        this.Totalamount = project.Totalamount;
        this.Presystemamountspent = project.Presystemamountspent;
        this.thissystemamountspent = 0;
        this.remainingamount = 0;
        // Copy other properties as needed

        // Initialize additional properties
        this.thissystemamountspent = 0;
        this.remainingamount = 0;
    }

    public decimal? thissystemamountspent { get; set; }
    public decimal? remainingamount { get; set; }
}


//public class CustomProject : Project
//{
//    private Project p;

//    public CustomProject(Project p)
//    {
//        this.p = p;
//    }

//    public decimal? thissystemamountspent { get; set; } = 0;
//    public decimal? remainingamount { get; set; } = 0;


//}

//Id = project.Id,
//                Name = project.Name,

//                Createdbyempid = project.Createdbyempid,
//                CreatedDate = project.CreatedDate,
//                GeneralNotes = project.GeneralNotes,
//                Activestatusflag = project.Activestatusflag,
//                Createdbyemp = project.Createdbyemp,

//                Totalamount = project.Totalamount,
//                Presystemamountspent = project.Presystemamountspent,
//                thissystemamountspent = 0,
//                remainingamount = 0

//public class CustomPurchaserderWithSupplierInvoices 
//{
//    public int orderid { get; set; } = 0;
//    public decimal ordertotalamountexcludingvat { get; set; } = 0;
//    public decimal ordertotalvatamount { get; set; } = 0;
//    public decimal ordertotalamountincludingvat { get; set; } = 0;
//    public List<CustomSupplierInvoice>? invoices { get; set; } 

//}

public class CustomPurchaserderWithSupplierInvoices
{
    public int orderid { get; set; } = 0;
    public decimal ordertotalamountexcludingvat { get; set; } = 0;
    public decimal ordertotalvatamount { get; set; } = 0;
    public decimal ordertotalamountincludingvat { get; set; } = 0;
    public List<CustomSupplierInvoiceModel>? invoices { get; set; }

}

public class EditSupplierInvoiceModel
{
    public int invoiceid { get; set; } = 0;

    public decimal shippingandhandlingcostexcludingvat { get; set; } = 0;

    public int shippingandhandlingcostvatindex { get; set; } = 0;


}



public class CustomSupplierInvoiceModel
{

    public int? invoiceid { get; set; } = 0;
    public DateTime? invdate { get; set; }
    public string docno { get; set; } = "";
    public decimal totalamountoflinestincludingVat { get; set; } = 0;
    public decimal totalamountoflinesexcludingVat { get; set; } = 0;
    public decimal totalamountoflinesdiscount { get; set; } = 0;
    public decimal? shippingandhandlingcostexcludingvat { get; set; } = 0;
    public decimal? shippingandhandlingcostincludingvat { get; set; } = 0;
    public decimal? shippingandhandlingcostvatindex { get; set; } = 0;
    public decimal? shippingandhandlingcostvatrate { get; set; } = 0;
    public decimal invoiceGrandTotalAmountexclVAT { get; set; } = 0;
    public decimal invoiceGrandTotalAmountinclVAT { get; set; } = 0;
    public decimal invoiceGrandTotalVATAmount { get; set; } = 0;
    public byte[]? invoiceimage { get; set; }
    public bool invdocexist { get; set; } = false;

}

public class CustomPurchaseOrder : Porder
{

    //  public string? DefaultSupplierName { get; set; } = null;
    public string? StatusName { get; set; } = null;
    public string? SupName { get; set; } = null;
    // public string SupplierName { get; set; } = null;
    public string? createdbyuserfullname { get; set; } = null;
    public string? sentbyuserfullname { get; set; } = null;
    public string? Tendercode { get; set; } = null;
    public int PorderlinesCount { get; set; } = 0;

    //[JsonIgnore]
    //public override Location? DefaultLoc { get; set; } = null;


    [JsonIgnore]
    public override ICollection<Receiving>? Receivings { get; set; } = null;
    [JsonIgnore]
    public override ICollection<Porderline>? Porderlines { get; set; } = null;
    [JsonIgnore]
    public override User? Sentbyemp { get; set; } = null;

    [JsonIgnore]
    public override User? Createdbyemp { get; set; } = null;


    [JsonIgnore]
    public override PordersStatus? Status { get; set; } = null;

    [JsonIgnore]
    public override Tender? Tender { get; set; } = null;


}

public class StatisticsDTO
{
    public int total_pendingreqlinescount { get; set; } = 0;
    public int total_today_pendingreqlinescount { get; set; } = 0;
    public int total_ytd_reqlinescount { get; set; } = 0;
    public List<CustomProduct> lowstockproducts { get; set; } = new List<CustomProduct>();
    public List<ReqanalysisytdbydecisionModel> reqanalysisytdbydecision { get; set; } = new List<ReqanalysisytdbydecisionModel>();

    public List<PorderAnalysisByCategoryForChart> pordersanalysisforpiechart { get; set; } = new List<PorderAnalysisByCategoryForChart>();

    public List<ProductStockModel> stockList { get; set; } = new List<ProductStockModel>();

    public double inventory_stock_value { get; set; } = 0;
    public double inventory_stock_qty { get; set; } = 0;


}





public class PorderAnalysisByCategoryForChart
{
    public int categoryid { get; set; } = 0;
    public int subcategoryid { get; set; } = 0;
    public string categoryname { get; set; } = string.Empty;
    public string subcategoryname { get; set; } = string.Empty;

    public int subcategorytotalqty_thismonth { get; set; } = 0;
    public int subcategorytotalqty_previousmonth { get; set; } = 0;


}


public class ReqanalysisytdbydecisionModel
{
    public string decision { get; set; } = string.Empty;
    public int count { get; set; } = 0;

}



public class ExcelRowsDTO
{
    public string? Category { get; set; } = null;
    public string? Sub_category { get; set; } = null;
    public string? Tender { get; set; } = null;
    public string? Product { get; set; } = null;
    public string? Brand { get; set; } = null;
    public string? Product_Code { get; set; } = null;
    public string? Product_Units { get; set; } = null;
    public string? Price_exclVAT { get; set; } = null;
    public string? VAT_PERC { get; set; } = null;
    public string? Expiry_Date { get; set; } = null;
    public string? LOT { get; set; } = null;
    public string? Stock_Quantity { get; set; } = null;
    public string? Supplier { get; set; } = null;
    public string? Building { get; set; } = null;
    public string? Room { get; set; } = "";
    public string? Locname { get; set; } = null;
    public string? Storage_Conditions { get; set; } = null;
    public string? Minimum_Stock { get; set; } = null;
    public string? Lab_Made_Flag { get; set; } = null;
    public string? Active_Flag { get; set; } = null;
    public string? Diagnostics_Flag { get; set; } = null;
    public string? Sequencing_Flag { get; set; } = null;
    public string? locid { get; set; } = null;
    public string? Importresult { get; set; } = null;



}


public class InventoryAdjustmentItemModel
{

    public string? lineid { get; set; } = null;
    public int pid { get; set; } = 0;
    public int locid { get; set; } = 0;

    public int lotid { get; set; } = 0;
    public int qty { get; set; } = 0;
    public int condstatusid { get; set; } = 0;
    public string? pcode { get; set; } = null;
    public string? pname { get; set; } = null;
    public string? locname { get; set; } = null;
    public string? lotnumber { get; set; } = null;
    public string? condstatusname { get; set; } = null;
    public string si { get; set; } = "";
    public string ns { get; set; } = "";

}

public class TransferInventoryItemModel
{

    public string? lineid { get; set; } = null;
    public int pid { get; set; } = 0;
    public int fromlocid { get; set; } = 0;
    public int tolocid { get; set; } = 0;
    public int lotid { get; set; } = 0;
    public int qty { get; set; } = 0;
    public int condstatusid { get; set; } = 0;
    public string? pcode { get; set; } = null;
    public string? pname { get; set; } = null;
    public string? fromlocname { get; set; } = null;
    public string? tolocname { get; set; } = null;
    public string? lotnumber { get; set; } = null;
    public string? condstatusname { get; set; } = null;
    public string si { get; set; } = "";
    public string ns { get; set; } = "";

}