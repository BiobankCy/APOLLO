using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class Product
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Barcode { get; set; }

    public DateTime CreatedDate { get; set; }

    public int DefaultLocId { get; set; }

    public int DefaultSupplierId { get; set; }

    public int CategoryId { get; set; }

    public int? SubcategoryId { get; set; }

    public int BrandId { get; set; }

    public bool ExpdateFlag { get; set; }

    public bool LabMadeFlag { get; set; }

    public bool MultipleLocationsFlag { get; set; }

    public string Punits { get; set; } = null!;

    public string Concentration { get; set; } = null!;

    public int Minstockqty { get; set; }

    public decimal Costprice { get; set; }

    public int VatId { get; set; }

    public string GeneralNotes { get; set; } = null!;

    public bool ActivestatusFlag { get; set; }

    public bool ForsequencingFlag { get; set; }

    public int StorageConditionId { get; set; }

    public int? TenderId { get; set; }

    public int ManufacturerId { get; set; }

    public virtual Productbrand Brand { get; set; } = null!;

    public virtual Productcategory Category { get; set; } = null!;

    public virtual Location DefaultLoc { get; set; } = null!;

    public virtual Supplier DefaultSupplier { get; set; } = null!;

    public virtual Manufacturer Manufacturer { get; set; } = null!;

    public virtual ICollection<Porderline> Porderlines { get; set; } = new List<Porderline>();

    public virtual ICollection<Productdepartmentsassigned> Productdepartmentsassigneds { get; set; } = new List<Productdepartmentsassigned>();

    public virtual ProductsFile? ProductsFile { get; set; }

    public virtual ICollection<Receivingline> Receivinglines { get; set; } = new List<Receivingline>();

    public virtual ICollection<Requestline> Requestlines { get; set; } = new List<Requestline>();

    public virtual ICollection<StockTransDetail> StockTransDetails { get; set; } = new List<StockTransDetail>();

    public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();

    public virtual StorageCondition StorageCondition { get; set; } = null!;

    public virtual Productsubcategory? Subcategory { get; set; }

    public virtual ICollection<SupplierItem> SupplierItems { get; set; } = new List<SupplierItem>();

    public virtual Tender? Tender { get; set; }

    public virtual Vatrate Vat { get; set; } = null!;
}
