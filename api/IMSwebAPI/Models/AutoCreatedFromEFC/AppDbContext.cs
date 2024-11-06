using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appsetting> Appsettings { get; set; }

    public virtual DbSet<AttachmentFile> AttachmentFiles { get; set; }

    public virtual DbSet<Audit> Audits { get; set; }

    public virtual DbSet<Contactsofsupplier> Contactsofsuppliers { get; set; }

    public virtual DbSet<Customnewpurchaseorderlineview> Customnewpurchaseorderlineviews { get; set; }

    public virtual DbSet<Efmigrationshistory> Efmigrationshistories { get; set; }

    public virtual DbSet<Itemconditionstatus> Itemconditionstatuses { get; set; }

    public virtual DbSet<Jobrole> Jobroles { get; set; }

    public virtual DbSet<Location> Locations { get; set; }

    public virtual DbSet<Locationtype> Locationtypes { get; set; }

    public virtual DbSet<Locbuilding> Locbuildings { get; set; }

    public virtual DbSet<Locroom> Locrooms { get; set; }

    public virtual DbSet<Lot> Lots { get; set; }

    public virtual DbSet<Manufacturer> Manufacturers { get; set; }

    public virtual DbSet<Picking> Pickings { get; set; }

    public virtual DbSet<Porder> Porders { get; set; }

    public virtual DbSet<Porderline> Porderlines { get; set; }

    public virtual DbSet<PordersStatus> PordersStatuses { get; set; }

    public virtual DbSet<Primer> Primers { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Productbrand> Productbrands { get; set; }

    public virtual DbSet<Productcategory> Productcategories { get; set; }

    public virtual DbSet<Productdepartment> Productdepartments { get; set; }

    public virtual DbSet<Productdepartmentsassigned> Productdepartmentsassigneds { get; set; }

    public virtual DbSet<ProductsFile> ProductsFiles { get; set; }

    public virtual DbSet<Productsubcategory> Productsubcategories { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<Receiving> Receivings { get; set; }

    public virtual DbSet<Receivingline> Receivinglines { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<ReportCategory> ReportCategories { get; set; }

    public virtual DbSet<ReportFilter> ReportFilters { get; set; }

    public virtual DbSet<ReportingExpenditure> ReportingExpenditures { get; set; }

    public virtual DbSet<ReportingPorder> ReportingPorders { get; set; }

    public virtual DbSet<ReportsFiltersAssigned> ReportsFiltersAssigneds { get; set; }

    public virtual DbSet<ReportsUsersaccess> ReportsUsersaccesses { get; set; }

    public virtual DbSet<Request> Requests { get; set; }

    public virtual DbSet<RequestDecision> RequestDecisions { get; set; }

    public virtual DbSet<Requestdecisionhistory> Requestdecisionhistories { get; set; }

    public virtual DbSet<Requestline> Requestlines { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Stock> Stocks { get; set; }

    public virtual DbSet<StockTran> StockTrans { get; set; }

    public virtual DbSet<StockTransDetail> StockTransDetails { get; set; }

    public virtual DbSet<StockTransReason> StockTransReasons { get; set; }

    public virtual DbSet<StockTransStatus> StockTransStatuses { get; set; }

    public virtual DbSet<StockTransType> StockTransTypes { get; set; }

    public virtual DbSet<StorageCondition> StorageConditions { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<SupplierInvoice> SupplierInvoices { get; set; }

    public virtual DbSet<SupplierItem> SupplierItems { get; set; }

    public virtual DbSet<Tender> Tenders { get; set; }

    public virtual DbSet<Tendersuppliersassigned> Tendersuppliersassigneds { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserPassword> UserPasswords { get; set; }

    public virtual DbSet<Userprojectsassigned> Userprojectsassigneds { get; set; }

    public virtual DbSet<Vatrate> Vatrates { get; set; }

  
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_general_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Appsetting>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("appsettings")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.AutorefreshMainmenuSecs)
                .HasColumnType("int(4)")
                .HasColumnName("AUTOREFRESH_MAINMENU_SECS");
            entity.Property(e => e.CompanyEmail)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("COMPANY_EMAIL");
            entity.Property(e => e.CompanyName)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("COMPANY_NAME");
            entity.Property(e => e.CompanyWebsiteLink)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("COMPANY_WEBSITE_LINK");
            entity.Property(e => e.OrderEmailSubject)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("ORDER_EMAIL_SUBJECT");
            entity.Property(e => e.SendEmailAfterRequestDecision)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.SendEmailByApp).HasColumnName("SendEmailByAPP");
            entity.Property(e => e.SendEmailForNewRequest)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.SmtpFromaddress)
                .HasMaxLength(50)
                .HasColumnName("SMTP_FROMADDRESS");
            entity.Property(e => e.SmtpPasswordEncr)
                .HasColumnType("text")
                .HasColumnName("SMTP_PASSWORD_ENCR");
            entity.Property(e => e.SmtpPort)
                .HasColumnType("int(11)")
                .HasColumnName("SMTP_PORT");
            entity.Property(e => e.SmtpSecuresocketoptions)
                .HasDefaultValueSql("'Auto'")
                .HasColumnType("enum('None','SslOnConnect','StartTls','Auto')")
                .HasColumnName("SMTP_SECURESOCKETOPTIONS");
            entity.Property(e => e.SmtpServer)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("SMTP_SERVER");
            entity.Property(e => e.SmtpTimeout)
                .HasDefaultValueSql("'15000'")
                .HasColumnType("int(11)")
                .HasColumnName("SMTP_TIMEOUT");
            entity.Property(e => e.SmtpUsername)
                .HasMaxLength(50)
                .HasColumnName("SMTP_USERNAME");
            entity.Property(e => e.UserPassMinlength)
                .HasColumnType("int(1)")
                .HasColumnName("USER_PASS_MINLENGTH");
            entity.Property(e => e.WmsAllowreceivingmoreqtythanpo).HasColumnName("WMS_ALLOWRECEIVINGMOREQTYTHANPO");
            entity.Property(e => e.WmsReceivinglocMethod)
                .HasColumnName("WMS_RECEIVINGLOC_METHOD")
                .UseCollation("utf8mb4_bin")
                .HasCharSet("utf8mb4");
        });

        modelBuilder.Entity<AttachmentFile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("attachment_files")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Lastuploadbyuid, "FK_attachment_files_users");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.File).HasColumnName("file");
            entity.Property(e => e.Lastupdate)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("lastupdate");
            entity.Property(e => e.Lastuploadbyuid)
                .HasColumnType("int(11)")
                .HasColumnName("lastuploadbyuid");

            entity.HasOne(d => d.Lastuploadbyu).WithMany(p => p.AttachmentFiles)
                .HasForeignKey(d => d.Lastuploadbyuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_attachment_files_users");
        });

        modelBuilder.Entity<Audit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("audit")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.ActionByUserId, "FK__users");

            entity.HasIndex(e => e.ModifiedPk, "ModifiedPK");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.ActionByIpaddress)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("ActionByIPaddress");
            entity.Property(e => e.ActionByUserId).HasColumnType("int(11)");
            entity.Property(e => e.ActionDatetime)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime");
            entity.Property(e => e.ActivityType)
                .HasMaxLength(50)
                .HasDefaultValueSql("''");
            entity.Property(e => e.ExtraNotes).HasDefaultValueSql("''");
            entity.Property(e => e.ModifiedPk)
                .HasColumnType("int(11)")
                .HasColumnName("ModifiedPK");
            entity.Property(e => e.NewEntity).HasDefaultValueSql("''");
            entity.Property(e => e.OldEntity).HasDefaultValueSql("''");
            entity.Property(e => e.TableName)
                .HasMaxLength(50)
                .HasDefaultValueSql("''");
        });

        modelBuilder.Entity<Contactsofsupplier>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("contactsofsupplier")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Supplierid, "contactsofsupplier_ibfk_1");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Activestatusflag).HasColumnName("activestatusflag");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasDefaultValueSql("''")
                .HasColumnName("address");
            entity.Property(e => e.Cconpurchaseorder).HasColumnName("cconpurchaseorder");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("city");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("country");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Department)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("department");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("email");
            entity.Property(e => e.Firstname)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("firstname");
            entity.Property(e => e.Lastname)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("lastname");
            entity.Property(e => e.Notes)
                .HasDefaultValueSql("''")
                .HasColumnType("text")
                .HasColumnName("notes");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("role");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("state");
            entity.Property(e => e.Supplierid)
                .HasColumnType("int(11)")
                .HasColumnName("supplierid");
            entity.Property(e => e.Workphone)
                .HasMaxLength(20)
                .HasDefaultValueSql("''")
                .HasColumnName("workphone");
            entity.Property(e => e.Zipcode)
                .HasMaxLength(10)
                .HasDefaultValueSql("''")
                .HasColumnName("zipcode");

            entity.HasOne(d => d.Supplier).WithMany(p => p.Contactsofsuppliers)
                .HasForeignKey(d => d.Supplierid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("contactsofsupplier_ibfk_1");
        });

        modelBuilder.Entity<Customnewpurchaseorderlineview>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("customnewpurchaseorderlineview");

            entity.Property(e => e.Activestatusflag).HasColumnName("activestatusflag");
            entity.Property(e => e.ClosedFlag).HasColumnName("closed_flag");
            entity.Property(e => e.Difference)
                .HasPrecision(33)
                .HasColumnName("difference");
            entity.Property(e => e.Duedate).HasColumnName("duedate");
            entity.Property(e => e.Dynamicstatus)
                .HasMaxLength(28)
                .HasColumnName("dynamicstatus");
            entity.Property(e => e.Invcounter)
                .HasColumnType("bigint(21)")
                .HasColumnName("invcounter");
            entity.Property(e => e.LastReceivedatetime).HasMaxLength(19);
            entity.Property(e => e.Lineid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("lineid");
            entity.Property(e => e.OrderQty)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("orderQty");
            entity.Property(e => e.Orderbyuid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("orderbyuid");
            entity.Property(e => e.Ordercreateddate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ordercreateddate");
            entity.Property(e => e.Orderid)
                .HasColumnType("int(11)")
                .HasColumnName("orderid");
            entity.Property(e => e.Orderstatus)
                .HasMaxLength(50)
                .HasColumnName("orderstatus")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Orderunitcp)
                .HasPrecision(15, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("orderunitcp");
            entity.Property(e => e.Ordfn)
                .HasMaxLength(50)
                .HasColumnName("ordfn")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Ordln)
                .HasMaxLength(50)
                .HasColumnName("ordln")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Ordvatindex)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("ordvatindex");
            entity.Property(e => e.Ordvrate)
                .HasPrecision(4, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("ordvrate");
            entity.Property(e => e.Pbrandid)
                .HasColumnType("int(11)")
                .HasColumnName("pbrandid");
            entity.Property(e => e.Pbrname)
                .HasMaxLength(100)
                .HasColumnName("pbrname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pcatid)
                .HasColumnType("int(11)")
                .HasColumnName("pcatid");
            entity.Property(e => e.Pcatname)
                .HasMaxLength(100)
                .HasColumnName("pcatname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pcode)
                .HasMaxLength(50)
                .HasColumnName("pcode")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pname)
                .HasMaxLength(100)
                .HasColumnName("pname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Ponotes)
                .HasMaxLength(450)
                .HasColumnName("ponotes")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Posentbyempid)
                .HasColumnType("int(11)")
                .HasColumnName("posentbyempid");
            entity.Property(e => e.Posentdate)
                .HasColumnType("datetime")
                .HasColumnName("posentdate");
            entity.Property(e => e.PrimersData)
                .HasColumnType("mediumtext")
                .HasColumnName("primers_data")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Productid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("productid");
            entity.Property(e => e.Psubcatid)
                .HasColumnType("int(11)")
                .HasColumnName("psubcatid");
            entity.Property(e => e.Psubname)
                .HasMaxLength(100)
                .HasColumnName("psubname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Reccounter)
                .HasColumnType("bigint(21)")
                .HasColumnName("reccounter");
            entity.Property(e => e.ReqId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("reqID");
            entity.Property(e => e.Reqbyuid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("reqbyuid");
            entity.Property(e => e.Reqdate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("reqdate");
            entity.Property(e => e.Reqfn)
                .HasMaxLength(50)
                .HasColumnName("reqfn")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Reqlineid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("reqlineid");
            entity.Property(e => e.Reqln)
                .HasMaxLength(50)
                .HasColumnName("reqln")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Reqqty)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("reqqty");
            entity.Property(e => e.Statusid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("statusid");
            entity.Property(e => e.SupplierEmail)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("supplier_email")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.SupplierName)
                .HasMaxLength(100)
                .HasColumnName("supplier_name")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Supplierid)
                .HasColumnType("int(11)")
                .HasColumnName("supplierid");
            entity.Property(e => e.Supworknumber)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("supworknumber")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Tendercode)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("tendercode")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Tenderid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("tenderid");
            entity.Property(e => e.TotalrecQty).HasPrecision(32);
        });

        modelBuilder.Entity<Efmigrationshistory>(entity =>
        {
            entity.HasKey(e => e.MigrationId).HasName("PRIMARY");

            entity.ToTable("__efmigrationshistory");

            entity.Property(e => e.MigrationId).HasMaxLength(150);
            entity.Property(e => e.ProductVersion).HasMaxLength(32);
        });

        modelBuilder.Entity<Itemconditionstatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("itemconditionstatuses")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Jobrole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("jobroles")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.RoleName, "Role").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<Location>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("locations")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Loctypeid, "FK_locations_locationtypes");

            entity.HasIndex(e => e.Roomid, "FK_locations_locrooms");

            entity.HasIndex(e => new { e.Locname, e.Roomid }, "Unique_locname_roomid").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.ActivestatusFlag)
                .IsRequired()
                .HasDefaultValueSql("'1'")
                .HasColumnName("activestatus_flag");
            entity.Property(e => e.Descr)
                .HasMaxLength(150)
                .HasDefaultValueSql("''")
                .HasColumnName("descr");
            entity.Property(e => e.Locname)
                .HasMaxLength(100)
                .HasColumnName("locname");
            entity.Property(e => e.Loctypeid)
                .HasColumnType("int(11)")
                .HasColumnName("loctypeid");
            entity.Property(e => e.Roomid)
                .HasColumnType("int(11)")
                .HasColumnName("roomid");

            entity.HasOne(d => d.Loctype).WithMany(p => p.Locations)
                .HasForeignKey(d => d.Loctypeid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_locations_locationtypes");

            entity.HasOne(d => d.Room).WithMany(p => p.Locations)
                .HasForeignKey(d => d.Roomid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_locations_locrooms");
        });

        modelBuilder.Entity<Locationtype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("locationtypes")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Loctype, "loctype").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.ActivestatusFlag)
                .IsRequired()
                .HasDefaultValueSql("'1'")
                .HasColumnName("activestatus_flag");
            entity.Property(e => e.Loctype)
                .HasMaxLength(50)
                .HasColumnName("loctype");
        });

        modelBuilder.Entity<Locbuilding>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("locbuildings")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Building, "building").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Building)
                .HasMaxLength(100)
                .HasColumnName("building");
            entity.Property(e => e.Descr)
                .HasMaxLength(100)
                .HasDefaultValueSql("''")
                .HasColumnName("descr");
        });

        modelBuilder.Entity<Locroom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("locrooms")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Buildingid, "FK_locrooms_locbuildings");

            entity.HasIndex(e => new { e.Room, e.Buildingid }, "Unique_room_buildingd").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Buildingid)
                .HasColumnType("int(11)")
                .HasColumnName("buildingid");
            entity.Property(e => e.Descr)
                .HasMaxLength(100)
                .HasDefaultValueSql("''")
                .HasColumnName("descr");
            entity.Property(e => e.Room)
                .HasMaxLength(100)
                .HasColumnName("room");

            entity.HasOne(d => d.Building).WithMany(p => p.Locrooms)
                .HasForeignKey(d => d.Buildingid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_locrooms_locbuildings");
        });

        modelBuilder.Entity<Lot>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("lots")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Expdate, "expdate");

            entity.HasIndex(e => new { e.Lotnumber, e.Expdate }, "lotnumber").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Expdate).HasColumnName("expdate");
            entity.Property(e => e.Lotnumber)
                .HasMaxLength(50)
                .HasColumnName("lotnumber");
        });

        modelBuilder.Entity<Manufacturer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("manufacturers")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Code, "code").IsUnique();

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.ActivestatusFlag)
                .IsRequired()
                .HasDefaultValueSql("'1'")
                .HasColumnName("activestatus_flag");
            entity.Property(e => e.Address)
                .HasMaxLength(100)
                .HasDefaultValueSql("''")
                .HasColumnName("address");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .HasColumnName("code");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("country");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("email");
            entity.Property(e => e.GeneralNotes)
                .HasDefaultValueSql("''")
                .HasColumnName("general_notes");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Website)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("website");
            entity.Property(e => e.Worknumber)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("worknumber");
        });

        modelBuilder.Entity<Picking>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("picking")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Locid, "FK_picking_locations");

            entity.HasIndex(e => e.Lotid, "FK_picking_lots");

            entity.HasIndex(e => e.ReqLineId, "FK_picking_requestlines");

            entity.HasIndex(e => e.UserIdpicker, "FK_picking_users");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Datetimepicked)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("datetimepicked");
            entity.Property(e => e.Locid)
                .HasColumnType("int(11)")
                .HasColumnName("locid");
            entity.Property(e => e.Lotid)
                .HasColumnType("int(11)")
                .HasColumnName("lotid");
            entity.Property(e => e.PickedQty)
                .HasColumnType("int(11)")
                .HasColumnName("pickedQTY");
            entity.Property(e => e.ReqLineId)
                .HasColumnType("int(11)")
                .HasColumnName("reqLineID");
            entity.Property(e => e.UserIdpicker)
                .HasColumnType("int(11)")
                .HasColumnName("userIDpicker");

            entity.HasOne(d => d.Loc).WithMany(p => p.Pickings)
                .HasForeignKey(d => d.Locid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_picking_locations");

            entity.HasOne(d => d.Lot).WithMany(p => p.Pickings)
                .HasForeignKey(d => d.Lotid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_picking_lots");

            entity.HasOne(d => d.ReqLine).WithMany(p => p.Pickings)
                .HasForeignKey(d => d.ReqLineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_picking_requestlines");

            entity.HasOne(d => d.UserIdpickerNavigation).WithMany(p => p.Pickings)
                .HasForeignKey(d => d.UserIdpicker)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_picking_users");
        });

        modelBuilder.Entity<Porder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("porders")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Statusid, "FK_porders_porders_statuses");

            entity.HasIndex(e => e.Supplierid, "FK_porders_suppliers");

            entity.HasIndex(e => e.Tenderid, "FK_porders_tenders");

            entity.HasIndex(e => e.Createdbyempid, "FK_porders_users");

            entity.HasIndex(e => e.Sentbyempid, "FK_porders_users_2");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Createdbyempid)
                .HasColumnType("int(11)")
                .HasColumnName("createdbyempid");
            entity.Property(e => e.Duedate).HasColumnName("duedate");
            entity.Property(e => e.Notes)
                .HasMaxLength(450)
                .HasDefaultValueSql("''")
                .HasColumnName("notes");
            entity.Property(e => e.Ordercreateddate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ordercreateddate");
            entity.Property(e => e.Podate).HasColumnName("podate");
            entity.Property(e => e.Sentbyempid)
                .HasColumnType("int(11)")
                .HasColumnName("sentbyempid");
            entity.Property(e => e.Sentdate)
                .HasColumnType("datetime")
                .HasColumnName("sentdate");
            entity.Property(e => e.Statusid)
                .HasColumnType("int(11)")
                .HasColumnName("statusid");
            entity.Property(e => e.Supplierid)
                .HasColumnType("int(11)")
                .HasColumnName("supplierid");
            entity.Property(e => e.Tenderid)
                .HasColumnType("int(11)")
                .HasColumnName("tenderid");

            entity.HasOne(d => d.Createdbyemp).WithMany(p => p.PorderCreatedbyemps)
                .HasForeignKey(d => d.Createdbyempid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_porders_users_createdby");

            entity.HasOne(d => d.Sentbyemp).WithMany(p => p.PorderSentbyemps)
                .HasForeignKey(d => d.Sentbyempid)
                .HasConstraintName("FK_porders_users_sentby");

            entity.HasOne(d => d.Status).WithMany(p => p.Porders)
                .HasForeignKey(d => d.Statusid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_porders_porders_statuses");

            entity.HasOne(d => d.Supplier).WithMany(p => p.Porders)
                .HasForeignKey(d => d.Supplierid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_porders_suppliers");

            entity.HasOne(d => d.Tender).WithMany(p => p.Porders)
                .HasForeignKey(d => d.Tenderid)
                .HasConstraintName("FK_porders_tenders");
        });

        modelBuilder.Entity<Porderline>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("porderlines")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Pordid, "FK_porderlines_porders");

            entity.HasIndex(e => e.Productid, "FK_porderlines_products");

            entity.HasIndex(e => e.Requestlineid, "FK_porderlines_requestlines");

            entity.HasIndex(e => e.Vatindex, "FK_porderlines_vatrates");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.ClosedFlag).HasColumnName("closed_flag");
            entity.Property(e => e.Pordid)
                .HasColumnType("int(11)")
                .HasColumnName("pordid");
            entity.Property(e => e.Productid)
                .HasColumnType("int(11)")
                .HasColumnName("productid");
            entity.Property(e => e.Qty)
                .HasColumnType("int(11)")
                .HasColumnName("qty");
            entity.Property(e => e.Requestlineid)
                .HasColumnType("int(11)")
                .HasColumnName("requestlineid");
            entity.Property(e => e.Unitpurcostprice)
                .HasPrecision(15, 2)
                .HasColumnName("unitpurcostprice");
            entity.Property(e => e.Vatindex)
                .HasColumnType("int(11)")
                .HasColumnName("vatindex");

            entity.HasOne(d => d.Pord).WithMany(p => p.Porderlines)
                .HasForeignKey(d => d.Pordid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_porderlines_porders");

            entity.HasOne(d => d.Product).WithMany(p => p.Porderlines)
                .HasForeignKey(d => d.Productid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_porderlines_products");

            entity.HasOne(d => d.Requestline).WithMany(p => p.Porderlines)
                .HasForeignKey(d => d.Requestlineid)
                .HasConstraintName("FK_porderlines_requestlines");

            entity.HasOne(d => d.VatindexNavigation).WithMany(p => p.Porderlines)
                .HasForeignKey(d => d.Vatindex)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_porderlines_vatrates");
        });

        modelBuilder.Entity<PordersStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("porders_statuses")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.HasIndex(e => e.Sorting, "sorting").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Sorting)
                .HasColumnType("int(11)")
                .HasColumnName("sorting");
        });

        modelBuilder.Entity<Primer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("primers")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Reqlineid, "FK_primers_requestlines");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.NucleotideSequence)
                .HasMaxLength(200)
                .HasColumnName("nucleotideSequence");
            entity.Property(e => e.Reqlineid)
                .HasColumnType("int(11)")
                .HasColumnName("reqlineid");
            entity.Property(e => e.SequenceIdentifier)
                .HasMaxLength(200)
                .HasColumnName("sequenceIdentifier");

            entity.HasOne(d => d.Reqline).WithMany(p => p.Primers)
                .HasForeignKey(d => d.Reqlineid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_primers_requestlines");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("products")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.CategoryId, "FK_products_categories");

            entity.HasIndex(e => e.DefaultLocId, "FK_products_locations");

            entity.HasIndex(e => e.ManufacturerId, "FK_products_manufacturers");

            entity.HasIndex(e => e.BrandId, "FK_products_productbrands");

            entity.HasIndex(e => e.SubcategoryId, "FK_products_productsubcategories");

            entity.HasIndex(e => e.StorageConditionId, "FK_products_storage_conditions");

            entity.HasIndex(e => e.DefaultSupplierId, "FK_products_suppliers");

            entity.HasIndex(e => e.TenderId, "FK_products_tenders");

            entity.HasIndex(e => e.VatId, "FK_products_vatrates");

            entity.HasIndex(e => e.Code, "code_UNIQUE").IsUnique();

            entity.HasIndex(e => e.Id, "id_UNIQUE").IsUnique();

            entity.HasIndex(e => e.Barcode, "sku").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.ActivestatusFlag).HasColumnName("activestatus_flag");
            entity.Property(e => e.Barcode)
                .HasMaxLength(50)
                .HasColumnName("barcode");
            entity.Property(e => e.BrandId)
                .HasColumnType("int(11)")
                .HasColumnName("brand_id");
            entity.Property(e => e.CategoryId)
                .HasColumnType("int(11)")
                .HasColumnName("category_id");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .HasColumnName("code");
            entity.Property(e => e.Concentration)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("concentration");
            entity.Property(e => e.Costprice)
                .HasPrecision(15, 2)
                .HasColumnName("costprice");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DefaultLocId)
                .HasColumnType("int(11)")
                .HasColumnName("default_loc_id");
            entity.Property(e => e.DefaultSupplierId)
                .HasColumnType("int(11)")
                .HasColumnName("default_supplier_id");
            entity.Property(e => e.ExpdateFlag).HasColumnName("expdate_flag");
            entity.Property(e => e.ForsequencingFlag).HasColumnName("forsequencing_flag");
            entity.Property(e => e.GeneralNotes)
                .HasDefaultValueSql("''")
                .HasColumnName("general_notes");
            entity.Property(e => e.LabMadeFlag).HasColumnName("lab_made_flag");
            entity.Property(e => e.ManufacturerId)
                .HasColumnType("int(11)")
                .HasColumnName("manufacturer_id");
            entity.Property(e => e.Minstockqty)
                .HasDefaultValueSql("'1'")
                .HasColumnType("int(10)")
                .HasColumnName("minstockqty");
            entity.Property(e => e.MultipleLocationsFlag).HasColumnName("multiple_locations_flag");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Punits)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("punits");
            entity.Property(e => e.StorageConditionId)
                .HasColumnType("int(11)")
                .HasColumnName("storage_condition_id");
            entity.Property(e => e.SubcategoryId)
                .HasColumnType("int(11)")
                .HasColumnName("subcategory_id");
            entity.Property(e => e.TenderId)
                .HasColumnType("int(11)")
                .HasColumnName("tender_id");
            entity.Property(e => e.VatId)
                .HasColumnType("int(11)")
                .HasColumnName("vat_id");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_products_productbrands");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_products_productcategories");

            entity.HasOne(d => d.DefaultLoc).WithMany(p => p.Products)
                .HasForeignKey(d => d.DefaultLocId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_products_locations");

            entity.HasOne(d => d.DefaultSupplier).WithMany(p => p.Products)
                .HasForeignKey(d => d.DefaultSupplierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_products_suppliers");

            entity.HasOne(d => d.Manufacturer).WithMany(p => p.Products)
                .HasForeignKey(d => d.ManufacturerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_products_manufacturers");

            entity.HasOne(d => d.StorageCondition).WithMany(p => p.Products)
                .HasForeignKey(d => d.StorageConditionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_products_storage_conditions");

            entity.HasOne(d => d.Subcategory).WithMany(p => p.Products)
                .HasForeignKey(d => d.SubcategoryId)
                .HasConstraintName("FK_products_productsubcategories");

            entity.HasOne(d => d.Tender).WithMany(p => p.Products)
                .HasForeignKey(d => d.TenderId)
                .HasConstraintName("FK_products_tenders");

            entity.HasOne(d => d.Vat).WithMany(p => p.Products)
                .HasForeignKey(d => d.VatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_products_vatrates");
        });

        modelBuilder.Entity<Productbrand>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("productbrands")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id_UNIQUE").IsUnique();

            entity.HasIndex(e => e.Name, "name_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Descr)
                .HasMaxLength(150)
                .HasDefaultValueSql("''")
                .HasColumnName("descr");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Productcategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("productcategories")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id_UNIQUE").IsUnique();

            entity.HasIndex(e => e.Name, "name_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Descr)
                .HasMaxLength(150)
                .HasDefaultValueSql("''")
                .HasColumnName("descr");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Productdepartment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("productdepartments")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("name");
        });

        modelBuilder.Entity<Productdepartmentsassigned>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("productdepartmentsassigned")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Did, "FK_productdepartments_departments");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => new { e.Pid, e.Did }, "pid_did").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Did)
                .HasColumnType("int(11)")
                .HasColumnName("did");
            entity.Property(e => e.Pid)
                .HasColumnType("int(11)")
                .HasColumnName("pid");

            entity.HasOne(d => d.DidNavigation).WithMany(p => p.Productdepartmentsassigneds)
                .HasForeignKey(d => d.Did)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_productdepartments_departments");

            entity.HasOne(d => d.PidNavigation).WithMany(p => p.Productdepartmentsassigneds)
                .HasForeignKey(d => d.Pid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_productdepartments_products");
        });

        modelBuilder.Entity<ProductsFile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("products_files")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Pid, "pid").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Documents).HasColumnName("documents");
            entity.Property(e => e.Photo).HasColumnName("photo");
            entity.Property(e => e.Pid)
                .HasColumnType("int(11)")
                .HasColumnName("pid");

            entity.HasOne(d => d.PidNavigation).WithOne(p => p.ProductsFile)
                .HasForeignKey<ProductsFile>(d => d.Pid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__products");
        });

        modelBuilder.Entity<Productsubcategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("productsubcategories")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Catid, "catid");

            entity.HasIndex(e => new { e.Catid, e.Name }, "catid_name_unique").IsUnique();

            entity.HasIndex(e => e.Id, "id_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Catid)
                .HasColumnType("int(11)")
                .HasColumnName("catid");
            entity.Property(e => e.Descr)
                .HasMaxLength(150)
                .HasDefaultValueSql("''")
                .HasColumnName("descr");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.HasOne(d => d.Cat).WithMany(p => p.Productsubcategories)
                .HasForeignKey(d => d.Catid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_productsubcategories_productcategories");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("projects");

            entity.HasIndex(e => e.Createdbyempid, "FK_projects_users");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Activestatusflag).HasColumnName("activestatusflag");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Createdbyempid)
                .HasColumnType("int(11)")
                .HasColumnName("createdbyempid");
            entity.Property(e => e.GeneralNotes)
                .HasDefaultValueSql("''")
                .HasColumnName("general_notes")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasDefaultValueSql("''")
                .HasColumnName("name");
            entity.Property(e => e.Presystemamountspent)
                .HasPrecision(15, 2)
                .HasColumnName("presystemamountspent");
            entity.Property(e => e.Totalamount)
                .HasPrecision(15, 2)
                .HasColumnName("totalamount");

            entity.HasOne(d => d.Createdbyemp).WithMany(p => p.Projects)
                .HasForeignKey(d => d.Createdbyempid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_projects_users");
        });

        modelBuilder.Entity<Receiving>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("receiving")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.InvoiceId, "FK_receiving_supplier_invoices");

            entity.HasIndex(e => e.PorderId, "FK_receivinghead_porders");

            entity.HasIndex(e => e.ByuserId, "FK_receivinghead_users");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.ByuserId)
                .HasColumnType("int(11)")
                .HasColumnName("ByuserID");
            entity.Property(e => e.InvoiceId)
                .HasColumnType("int(11)")
                .HasColumnName("InvoiceID");
            entity.Property(e => e.Notes)
                .HasMaxLength(450)
                .HasDefaultValueSql("''");
            entity.Property(e => e.PorderId)
                .HasColumnType("int(11)")
                .HasColumnName("PorderID");
            entity.Property(e => e.Receivedatetime)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Byuser).WithMany(p => p.Receivings)
                .HasForeignKey(d => d.ByuserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_receivinghead_users");

            entity.HasOne(d => d.Invoice).WithMany(p => p.Receivings)
                .HasForeignKey(d => d.InvoiceId)
                .HasConstraintName("FK_receiving_supplier_invoices");

            entity.HasOne(d => d.Porder).WithMany(p => p.Receivings)
                .HasForeignKey(d => d.PorderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_receivinghead_porders");
        });

        modelBuilder.Entity<Receivingline>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("receivinglines")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.ReceivinglocId, "FK_receivinglines_locations");

            entity.HasIndex(e => e.Lotid, "FK_receivinglines_lots");

            entity.HasIndex(e => e.PolineId, "FK_receivinglines_porderlines");

            entity.HasIndex(e => e.Conditionstatus, "FK_receivinglines_receivingitemstatuses");

            entity.HasIndex(e => e.ReceivingId, "FK_receivinglines_receivinglines");

            entity.HasIndex(e => e.Productid, "productid");

            entity.HasIndex(e => e.Vatindex, "vatindex");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Conditionstatus)
                .HasColumnType("int(11)")
                .HasColumnName("conditionstatus");
            entity.Property(e => e.LinediscountPerc)
                .HasPrecision(15, 2)
                .HasColumnName("linediscountPerc");
            entity.Property(e => e.Lotid)
                .HasColumnType("int(11)")
                .HasColumnName("lotid");
            entity.Property(e => e.Notesaboutconditionstatus)
                .HasDefaultValueSql("''")
                .HasColumnName("notesaboutconditionstatus");
            entity.Property(e => e.Originalpurcostpricebeforedisc)
                .HasPrecision(15, 2)
                .HasColumnName("originalpurcostpricebeforedisc");
            entity.Property(e => e.PolineId)
                .HasColumnType("int(11)")
                .HasColumnName("polineID");
            entity.Property(e => e.Productid)
                .HasColumnType("int(11)")
                .HasColumnName("productid");
            entity.Property(e => e.Qty)
                .HasColumnType("int(11)")
                .HasColumnName("qty");
            entity.Property(e => e.ReceivingId)
                .HasColumnType("int(11)")
                .HasColumnName("receivingID");
            entity.Property(e => e.ReceivinglocId)
                .HasColumnType("int(11)")
                .HasColumnName("receivinglocID");
            entity.Property(e => e.Unitpurcostprice)
                .HasPrecision(15, 2)
                .HasColumnName("unitpurcostprice");
            entity.Property(e => e.Vatindex)
                .HasColumnType("int(11)")
                .HasColumnName("vatindex");

            entity.HasOne(d => d.ConditionstatusNavigation).WithMany(p => p.Receivinglines)
                .HasForeignKey(d => d.Conditionstatus)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_receivinglines_conditionstatus");

            entity.HasOne(d => d.Lot).WithMany(p => p.Receivinglines)
                .HasForeignKey(d => d.Lotid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_receivinglines_lots");

            entity.HasOne(d => d.Poline).WithMany(p => p.Receivinglines)
                .HasForeignKey(d => d.PolineId)
                .HasConstraintName("FK_receivinglines_porderlines");

            entity.HasOne(d => d.Product).WithMany(p => p.Receivinglines)
                .HasForeignKey(d => d.Productid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("receivinglines_ibfk_1");

            entity.HasOne(d => d.Receiving).WithMany(p => p.Receivinglines)
                .HasForeignKey(d => d.ReceivingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_receivinglines_receiving");

            entity.HasOne(d => d.Receivingloc).WithMany(p => p.Receivinglines)
                .HasForeignKey(d => d.ReceivinglocId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_receivinglines_locations");

            entity.HasOne(d => d.VatindexNavigation).WithMany(p => p.Receivinglines)
                .HasForeignKey(d => d.Vatindex)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("receivinglines_ibfk_2");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("reports")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Categoryid, "FK_reports_report_categories");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Categoryid)
                .HasColumnType("int(11)")
                .HasColumnName("categoryid");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");

            entity.HasOne(d => d.Category).WithMany(p => p.Reports)
                .HasForeignKey(d => d.Categoryid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_reports_report_categories");
        });

        modelBuilder.Entity<ReportCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("report_categories")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<ReportFilter>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("report_filters")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");
        });

        modelBuilder.Entity<ReportingExpenditure>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("reporting_expenditure");

            entity.Property(e => e.ClosedFlag).HasColumnName("closed_flag");
            entity.Property(e => e.Invid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("invid");
            entity.Property(e => e.Invno)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("invno")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.LineAmountVatExcluded).HasPrecision(25, 2);
            entity.Property(e => e.LineAmountVatIncluded).HasPrecision(31, 2);
            entity.Property(e => e.LineVatAmount).HasPrecision(32, 2);
            entity.Property(e => e.Lineunitcp)
                .HasPrecision(15, 2)
                .HasColumnName("lineunitcp");
            entity.Property(e => e.Linevatid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("linevatid");
            entity.Property(e => e.Linevatrate)
                .HasPrecision(4, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("linevatrate");
            entity.Property(e => e.OrderId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("orderID");
            entity.Property(e => e.OrderLineId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("orderLineID");
            entity.Property(e => e.OrderStatus)
                .HasMaxLength(50)
                .HasColumnName("orderStatus")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.OrderStatusId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("orderStatusID");
            entity.Property(e => e.Ordercreateddate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ordercreateddate");
            entity.Property(e => e.Pbrandid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("pbrandid");
            entity.Property(e => e.Pbrandmame)
                .HasMaxLength(100)
                .HasColumnName("pbrandmame")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pcatid)
                .HasColumnType("int(11)")
                .HasColumnName("pcatid");
            entity.Property(e => e.Pcatname)
                .HasMaxLength(100)
                .HasColumnName("pcatname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pcode)
                .HasMaxLength(50)
                .HasColumnName("pcode")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("pid");
            entity.Property(e => e.Pname)
                .HasMaxLength(100)
                .HasColumnName("pname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Qty)
                .HasColumnType("int(11)")
                .HasColumnName("qty");
            entity.Property(e => e.Recheadid)
                .HasColumnType("int(11)")
                .HasColumnName("recheadid");
            entity.Property(e => e.Reclineid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("reclineid");
            entity.Property(e => e.ShippingCostAmountVatExcluded).HasPrecision(15, 2);
            entity.Property(e => e.ShippingCostVatIncluded).HasPrecision(19, 2);
            entity.Property(e => e.Supinvdate)
                .HasColumnType("datetime")
                .HasColumnName("supinvdate");
            entity.Property(e => e.Supname)
                .HasMaxLength(100)
                .HasColumnName("supname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Supplierid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("supplierid");
            entity.Property(e => e.Tendercode)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("tendercode")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Tenderid)
                .HasColumnType("int(11)")
                .HasColumnName("tenderid");
            entity.Property(e => e.UserOrdFullname)
                .HasMaxLength(101)
                .HasColumnName("userOrdFullname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.UserOrdId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("userOrdID");
            entity.Property(e => e.UserReqFullname)
                .HasMaxLength(101)
                .HasColumnName("userReqFullname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.UserReqId)
                .HasColumnType("int(11)")
                .HasColumnName("userReqID");
        });

        modelBuilder.Entity<ReportingPorder>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("reporting_porders");

            entity.Property(e => e.ClosedFlag).HasColumnName("closed_flag");
            entity.Property(e => e.LineAmountVatExcluded).HasPrecision(25, 2);
            entity.Property(e => e.LineAmountVatIncluded).HasPrecision(31, 2);
            entity.Property(e => e.LineVatAmount).HasPrecision(32, 2);
            entity.Property(e => e.Lineunitcp)
                .HasPrecision(15, 2)
                .HasColumnName("lineunitcp");
            entity.Property(e => e.Linevatid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("linevatid");
            entity.Property(e => e.Linevatrate)
                .HasPrecision(4, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("linevatrate");
            entity.Property(e => e.OrderId)
                .HasColumnType("int(11)")
                .HasColumnName("orderID");
            entity.Property(e => e.OrderLineId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("orderLineID");
            entity.Property(e => e.OrderStatus)
                .HasMaxLength(50)
                .HasColumnName("orderStatus")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.OrderStatusId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("orderStatusID");
            entity.Property(e => e.Ordercreateddate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ordercreateddate");
            entity.Property(e => e.Pbrandid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("pbrandid");
            entity.Property(e => e.Pbrandmame)
                .HasMaxLength(100)
                .HasColumnName("pbrandmame")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pcatid)
                .HasColumnType("int(11)")
                .HasColumnName("pcatid");
            entity.Property(e => e.Pcatname)
                .HasMaxLength(100)
                .HasColumnName("pcatname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pcode)
                .HasMaxLength(50)
                .HasColumnName("pcode")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Pid)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("pid");
            entity.Property(e => e.Pname)
                .HasMaxLength(100)
                .HasColumnName("pname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Qty)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("qty");
            entity.Property(e => e.ReqDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime");
            entity.Property(e => e.ReqId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("reqID");
            entity.Property(e => e.ReqQty)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)");
            entity.Property(e => e.ReqlineId)
                .HasColumnType("int(11)")
                .HasColumnName("reqlineID");
            entity.Property(e => e.Supname)
                .HasMaxLength(100)
                .HasColumnName("supname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Supplierid)
                .HasColumnType("int(11)")
                .HasColumnName("supplierid");
            entity.Property(e => e.Tendercode)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("tendercode")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.Tenderid)
                .HasColumnType("int(11)")
                .HasColumnName("tenderid");
            entity.Property(e => e.UserOrdFullname)
                .HasMaxLength(101)
                .HasColumnName("userOrdFullname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.UserOrdId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("userOrdID");
            entity.Property(e => e.UserReqFullname)
                .HasMaxLength(101)
                .HasColumnName("userReqFullname")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.UserReqId)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("userReqID");
        });

        modelBuilder.Entity<ReportsFiltersAssigned>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("reports_filters_assigned")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.FilterId, "FK_reports_filters_assigned_report_filters");

            entity.HasIndex(e => e.ReportId, "FK_reports_usersaccess_reports");

            entity.HasIndex(e => e.Id, "Id").IsUnique();

            entity.HasIndex(e => new { e.ReportId, e.FilterId }, "notsamefilterforreport").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.FilterId)
                .HasColumnType("int(11)")
                .HasColumnName("filterID");
            entity.Property(e => e.ReportId)
                .HasColumnType("int(11)")
                .HasColumnName("reportID");

            entity.HasOne(d => d.Filter).WithMany(p => p.ReportsFiltersAssigneds)
                .HasForeignKey(d => d.FilterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_reports_filters_assigned_report_filters");

            entity.HasOne(d => d.Report).WithMany(p => p.ReportsFiltersAssigneds)
                .HasForeignKey(d => d.ReportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_reports_filters_assigned_reports");
        });

        modelBuilder.Entity<ReportsUsersaccess>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("reports_usersaccess")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.ReportId, "FK_reports_usersaccess_reports");

            entity.HasIndex(e => e.AccessGivenTouserId, "FK_reports_usersaccess_users");

            entity.HasIndex(e => e.AccessGivenByuserId, "FK_reports_usersaccess_users_2");

            entity.HasIndex(e => e.Id, "Id").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.AccessGivenByuserId)
                .HasColumnType("int(11)")
                .HasColumnName("accessGivenByuserID");
            entity.Property(e => e.AccessGivenDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("accessGivenDate");
            entity.Property(e => e.AccessGivenTouserId)
                .HasColumnType("int(11)")
                .HasColumnName("accessGivenTouserID");
            entity.Property(e => e.ReportId)
                .HasColumnType("int(11)")
                .HasColumnName("reportID");

            entity.HasOne(d => d.AccessGivenByuser).WithMany(p => p.ReportsUsersaccesses)
                .HasForeignKey(d => d.AccessGivenByuserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_reports_usersaccess_users_2");

            entity.HasOne(d => d.Report).WithMany(p => p.ReportsUsersaccesses)
                .HasForeignKey(d => d.ReportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_reports_usersaccess_reports");
        });

        modelBuilder.Entity<Request>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("requests")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.ReqByUsrId, "FK_requests_users");

            entity.HasIndex(e => e.Id, "Id").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Notes)
                .HasDefaultValueSql("''")
                .HasColumnType("text");
            entity.Property(e => e.ReqByUsrId)
                .HasColumnType("int(11)")
                .HasColumnName("ReqByUsrID");
            entity.Property(e => e.ReqDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime");

            entity.HasOne(d => d.ReqByUsr).WithMany(p => p.Requests)
                .HasForeignKey(d => d.ReqByUsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_requests_users");
        });

        modelBuilder.Entity<RequestDecision>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("request_decisions")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Name, "Name").IsUnique();

            entity.HasIndex(e => e.Sorting, "sorting").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Sorting).HasColumnType("int(11)");
        });

        modelBuilder.Entity<Requestdecisionhistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("requestdecisionhistory")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Decisionid, "FK__request_decisions");

            entity.HasIndex(e => e.Reqlineid, "FK__requestlines");

            entity.HasIndex(e => e.Madebyuserid, "FK__users");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Comments)
                .HasMaxLength(200)
                .HasDefaultValueSql("''")
                .HasColumnName("comments");
            entity.Property(e => e.Decisiondatetime)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("decisiondatetime");
            entity.Property(e => e.Decisionid)
                .HasColumnType("int(11)")
                .HasColumnName("decisionid");
            entity.Property(e => e.Madebyuserid)
                .HasColumnType("int(11)")
                .HasColumnName("madebyuserid");
            entity.Property(e => e.Reqlineid)
                .HasColumnType("int(11)")
                .HasColumnName("reqlineid");

            entity.HasOne(d => d.Decision).WithMany(p => p.Requestdecisionhistories)
                .HasForeignKey(d => d.Decisionid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__request_decisions");

            entity.HasOne(d => d.Madebyuser).WithMany(p => p.Requestdecisionhistories)
                .HasForeignKey(d => d.Madebyuserid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__users");

            entity.HasOne(d => d.Reqline).WithMany(p => p.Requestdecisionhistories)
                .HasForeignKey(d => d.Reqlineid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__requestlines");
        });

        modelBuilder.Entity<Requestline>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("requestlines")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Productid, "FK_porderlines_products");

            entity.HasIndex(e => e.Projectid, "FK_requestlines_projects");

            entity.HasIndex(e => e.ReqId, "FK_requestlines_requests");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Comment)
                .HasMaxLength(100)
                .HasDefaultValueSql("''")
                .HasColumnName("comment");
            entity.Property(e => e.Productid)
                .HasColumnType("int(11)")
                .HasColumnName("productid");
            entity.Property(e => e.Projectid)
                .HasColumnType("int(11)")
                .HasColumnName("projectid");
            entity.Property(e => e.Qty)
                .HasColumnType("int(11)")
                .HasColumnName("qty");
            entity.Property(e => e.ReqId)
                .HasColumnType("int(11)")
                .HasColumnName("reqID");

            entity.HasOne(d => d.Product).WithMany(p => p.Requestlines)
                .HasForeignKey(d => d.Productid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("requestlines_ibfk_1");

            entity.HasOne(d => d.Project).WithMany(p => p.Requestlines)
                .HasForeignKey(d => d.Projectid)
                .HasConstraintName("FK_requestlines_projects");

            entity.HasOne(d => d.Req).WithMany(p => p.Requestlines)
                .HasForeignKey(d => d.ReqId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_requestlines_requests");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("roles")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.RoleName, "Role").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<Stock>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("stock")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Conditionstatus, "FK_stock_itemconditionstatuses");

            entity.HasIndex(e => e.Locid, "FK_stock_locations");

            entity.HasIndex(e => e.Lotid, "FK_stock_lots");

            entity.HasIndex(e => e.Productid, "FK_stock_products");

            entity.HasIndex(e => e.Id, "id_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Conditionstatus)
                .HasColumnType("int(11)")
                .HasColumnName("conditionstatus");
            entity.Property(e => e.Lastupdate)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("lastupdate");
            entity.Property(e => e.Locid)
                .HasColumnType("int(11)")
                .HasColumnName("locid");
            entity.Property(e => e.Lotid)
                .HasColumnType("int(11)")
                .HasColumnName("lotid");
            entity.Property(e => e.Ns)
                .HasMaxLength(200)
                .HasDefaultValueSql("''")
                .HasColumnName("ns");
            entity.Property(e => e.Productid)
                .HasColumnType("int(11)")
                .HasColumnName("productid");
            entity.Property(e => e.Qty)
                .HasColumnType("int(11)")
                .HasColumnName("qty");
            entity.Property(e => e.Si)
                .HasMaxLength(200)
                .HasDefaultValueSql("''")
                .HasColumnName("si");

            entity.HasOne(d => d.ConditionstatusNavigation).WithMany(p => p.Stocks)
                .HasForeignKey(d => d.Conditionstatus)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_itemconditionstatuses");

            entity.HasOne(d => d.Loc).WithMany(p => p.Stocks)
                .HasForeignKey(d => d.Locid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_locations");

            entity.HasOne(d => d.Lot).WithMany(p => p.Stocks)
                .HasForeignKey(d => d.Lotid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_lots");

            entity.HasOne(d => d.Product).WithMany(p => p.Stocks)
                .HasForeignKey(d => d.Productid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_products");
        });

        modelBuilder.Entity<StockTran>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("stock_trans")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.StockTransReasonId, "FK_stock_trans_stock_trans_reasons");

            entity.HasIndex(e => e.Status, "FK_stock_trans_stock_trans_statuses");

            entity.HasIndex(e => e.StockTransTypeId, "FK_stock_trans_stock_trans_types");

            entity.HasIndex(e => e.Userid, "FK_stock_trans_users");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Description)
                .HasDefaultValueSql("''")
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Status)
                .HasColumnType("int(11)")
                .HasColumnName("status");
            entity.Property(e => e.StockTransReasonId)
                .HasColumnType("int(11)")
                .HasColumnName("stock_trans_reason_id");
            entity.Property(e => e.StockTransTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("stock_trans_type_id");
            entity.Property(e => e.Transdate)
                .HasColumnType("datetime")
                .HasColumnName("transdate");
            entity.Property(e => e.Updatedat)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("updatedat");
            entity.Property(e => e.Userid)
                .HasColumnType("int(11)")
                .HasColumnName("userid");

            entity.HasOne(d => d.StatusNavigation).WithMany(p => p.StockTrans)
                .HasForeignKey(d => d.Status)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_trans_stock_trans_statuses");

            entity.HasOne(d => d.StockTransReason).WithMany(p => p.StockTrans)
                .HasForeignKey(d => d.StockTransReasonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_trans_stock_trans_reasons");

            entity.HasOne(d => d.StockTransType).WithMany(p => p.StockTrans)
                .HasForeignKey(d => d.StockTransTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_trans_stock_trans_types");

            entity.HasOne(d => d.User).WithMany(p => p.StockTrans)
                .HasForeignKey(d => d.Userid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_trans_users");
        });

        modelBuilder.Entity<StockTransDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("stock_trans_details")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Transid, "FK__stock_trans");

            entity.HasIndex(e => e.Conditionstatus, "FK_stock_trans_details_itemconditionstatuses");

            entity.HasIndex(e => e.Locid, "FK_stock_trans_details_locations");

            entity.HasIndex(e => e.Lotid, "FK_stock_trans_details_lots");

            entity.HasIndex(e => e.Pid, "pid");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Conditionstatus)
                .HasColumnType("int(11)")
                .HasColumnName("conditionstatus");
            entity.Property(e => e.DocumentLineid)
                .HasColumnType("int(11)")
                .HasColumnName("documentLineid");
            entity.Property(e => e.Locid)
                .HasColumnType("int(11)")
                .HasColumnName("locid");
            entity.Property(e => e.Lotid)
                .HasColumnType("int(11)")
                .HasColumnName("lotid");
            entity.Property(e => e.Ns)
                .HasMaxLength(200)
                .HasDefaultValueSql("''")
                .HasColumnName("ns");
            entity.Property(e => e.Pid)
                .HasColumnType("int(11)")
                .HasColumnName("pid");
            entity.Property(e => e.Qty)
                .HasColumnType("int(11)")
                .HasColumnName("qty");
            entity.Property(e => e.Si)
                .HasMaxLength(200)
                .HasDefaultValueSql("''")
                .HasColumnName("si");
            entity.Property(e => e.Transid)
                .HasColumnType("int(11)")
                .HasColumnName("transid");
            entity.Property(e => e.UnitcostRecalculationFlag).HasColumnName("unitcostRecalculationFlag");
            entity.Property(e => e.Unitcostprice)
                .HasPrecision(15, 2)
                .HasColumnName("unitcostprice");

            entity.HasOne(d => d.ConditionstatusNavigation).WithMany(p => p.StockTransDetails)
                .HasForeignKey(d => d.Conditionstatus)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_trans_details_itemconditionstatuses");

            entity.HasOne(d => d.Loc).WithMany(p => p.StockTransDetails)
                .HasForeignKey(d => d.Locid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_trans_details_locations");

            entity.HasOne(d => d.Lot).WithMany(p => p.StockTransDetails)
                .HasForeignKey(d => d.Lotid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_trans_details_lots");

            entity.HasOne(d => d.PidNavigation).WithMany(p => p.StockTransDetails)
                .HasForeignKey(d => d.Pid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_stock_trans_details_products");

            entity.HasOne(d => d.Trans).WithMany(p => p.StockTransDetails)
                .HasForeignKey(d => d.Transid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__stock_trans");
        });

        modelBuilder.Entity<StockTransReason>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("stock_trans_reasons")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.ReasonName)
                .HasMaxLength(50)
                .HasColumnName("reason_name");
        });

        modelBuilder.Entity<StockTransStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("stock_trans_statuses")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.HasIndex(e => e.Sorting, "sorting").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Sorting)
                .HasColumnType("int(11)")
                .HasColumnName("sorting");
        });

        modelBuilder.Entity<StockTransType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("stock_trans_types")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.TypeName)
                .HasMaxLength(50)
                .HasDefaultValueSql("'0'")
                .HasColumnName("type_name");
        });

        modelBuilder.Entity<StorageCondition>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("storage_conditions")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasDefaultValueSql("''")
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasDefaultValueSql("'0'")
                .HasColumnName("name");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("suppliers")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Code, "code").IsUnique();

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.ActivestatusFlag)
                .IsRequired()
                .HasDefaultValueSql("'1'")
                .HasColumnName("activestatus_flag");
            entity.Property(e => e.Address)
                .HasMaxLength(100)
                .HasDefaultValueSql("''")
                .HasColumnName("address");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .HasColumnName("code");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("country");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("email");
            entity.Property(e => e.ExcelattachmentinemailorderFlag).HasColumnName("excelattachmentinemailorder_flag");
            entity.Property(e => e.GeneralNotes)
                .HasDefaultValueSql("''")
                .HasColumnName("general_notes");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Website)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("website");
            entity.Property(e => e.Worknumber)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("worknumber");
        });

        modelBuilder.Entity<SupplierInvoice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("supplier_invoices")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Attachmentid, "FK_supplier_invoices_attachment_files");

            entity.HasIndex(e => e.VatId, "FK_supplier_invoices_vatrates");

            entity.HasIndex(e => new { e.Supid, e.Supinvno }, "supid_Supinvno").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Attachmentid)
                .HasColumnType("int(11)")
                .HasColumnName("attachmentid");
            entity.Property(e => e.SupInvShippingAndHandlingCost).HasPrecision(15, 2);
            entity.Property(e => e.Supid)
                .HasColumnType("int(11)")
                .HasColumnName("supid");
            entity.Property(e => e.Supinvdate).HasColumnType("datetime");
            entity.Property(e => e.Supinvno)
                .HasMaxLength(50)
                .HasDefaultValueSql("''");
            entity.Property(e => e.VatId)
                .HasColumnType("int(11)")
                .HasColumnName("vat_id");

            entity.HasOne(d => d.Attachment).WithMany(p => p.SupplierInvoices)
                .HasForeignKey(d => d.Attachmentid)
                .HasConstraintName("FK_supplier_invoices_attachment_files");

            entity.HasOne(d => d.Sup).WithMany(p => p.SupplierInvoices)
                .HasForeignKey(d => d.Supid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_supplier_invoices_suppliers");

            entity.HasOne(d => d.Vat).WithMany(p => p.SupplierInvoices)
                .HasForeignKey(d => d.VatId)
                .HasConstraintName("FK_supplier_invoices_vatrates");
        });

        modelBuilder.Entity<SupplierItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("supplier_items")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Productid, "FK_supplier_items_products");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => new { e.Supplierid, e.Productid }, "supid_itemid").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Productid)
                .HasColumnType("int(11)")
                .HasColumnName("productid");
            entity.Property(e => e.Supplierid)
                .HasColumnType("int(11)")
                .HasColumnName("supplierid");
            entity.Property(e => e.Unitpurcostprice)
                .HasPrecision(15, 2)
                .HasColumnName("unitpurcostprice");

            entity.HasOne(d => d.Product).WithMany(p => p.SupplierItems)
                .HasForeignKey(d => d.Productid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_supplier_items_products");

            entity.HasOne(d => d.Supplier).WithMany(p => p.SupplierItems)
                .HasForeignKey(d => d.Supplierid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_supplier_items_suppliers");
        });

        modelBuilder.Entity<Tender>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("tenders")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Createdbyempid, "FK_tenders_users");

            entity.HasIndex(e => e.Tendercode, "unique_tendercode_supplierid").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Activestatusflag).HasColumnName("activestatusflag");
            entity.Property(e => e.Createdbyempid)
                .HasColumnType("int(11)")
                .HasColumnName("createdbyempid");
            entity.Property(e => e.Createddate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("createddate");
            entity.Property(e => e.GeneralNotes)
                .HasDefaultValueSql("''")
                .HasColumnName("general_notes");
            entity.Property(e => e.Presystemamountspent)
                .HasPrecision(15, 2)
                .HasColumnName("presystemamountspent");
            entity.Property(e => e.Tendercode)
                .HasMaxLength(50)
                .HasDefaultValueSql("''")
                .HasColumnName("tendercode");
            entity.Property(e => e.Totalamount)
                .HasPrecision(15, 2)
                .HasColumnName("totalamount");

            entity.HasOne(d => d.Createdbyemp).WithMany(p => p.Tenders)
                .HasForeignKey(d => d.Createdbyempid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tenders_users");
        });

        modelBuilder.Entity<Tendersuppliersassigned>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("tendersuppliersassigned")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => new { e.Tid, e.Sid }, "pid_did").IsUnique();

            entity.HasIndex(e => e.Sid, "uid");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Sid)
                .HasColumnType("int(11)")
                .HasColumnName("sid");
            entity.Property(e => e.Tid)
                .HasColumnType("int(11)")
                .HasColumnName("tid");

            entity.HasOne(d => d.SidNavigation).WithMany(p => p.Tendersuppliersassigneds)
                .HasForeignKey(d => d.Sid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tendersuppliersassigned_suppliers");

            entity.HasOne(d => d.TidNavigation).WithMany(p => p.Tendersuppliersassigneds)
                .HasForeignKey(d => d.Tid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tendersuppliersassigned_tenders");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("users")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.JobRoleId, "FK_users_jobroles");

            entity.HasIndex(e => e.RoleId, "FK_users_userroles");

            entity.HasIndex(e => e.ApproverUid, "FK_users_users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.ApproverUid)
                .HasColumnType("int(11)")
                .HasColumnName("ApproverUID");
            entity.Property(e => e.CconpurchaseOrder).HasColumnName("CConpurchaseOrder");
            entity.Property(e => e.ClaimCanMakePo).HasColumnName("ClaimCanMakePO");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.JobRoleId)
                .HasColumnType("int(11)")
                .HasColumnName("JobRoleID");
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedDate)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime");
            entity.Property(e => e.RoleId)
                .HasColumnType("int(11)")
                .HasColumnName("roleID");

            entity.HasOne(d => d.ApproverU).WithMany(p => p.InverseApproverU)
                .HasForeignKey(d => d.ApproverUid)
                .HasConstraintName("FK_users_users");

            entity.HasOne(d => d.JobRole).WithMany(p => p.Users)
                .HasForeignKey(d => d.JobRoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_users_jobroles");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_users_userroles");
        });

        modelBuilder.Entity<UserPassword>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("user_password")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.UserId, "UserID").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.PasswordHash).HasColumnType("blob");
            entity.Property(e => e.PasswordSalt).HasColumnType("blob");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("UserID");

            entity.HasOne(d => d.User).WithOne(p => p.UserPassword)
                .HasForeignKey<UserPassword>(d => d.UserId)
                .HasConstraintName("FK_user_password_users");
        });

        modelBuilder.Entity<Userprojectsassigned>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("userprojectsassigned")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => new { e.Pid, e.Uid }, "pid_did").IsUnique();

            entity.HasIndex(e => e.Uid, "uid");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Pid)
                .HasColumnType("int(11)")
                .HasColumnName("pid");
            entity.Property(e => e.Uid)
                .HasColumnType("int(11)")
                .HasColumnName("uid");

            entity.HasOne(d => d.PidNavigation).WithMany(p => p.Userprojectsassigneds)
                .HasForeignKey(d => d.Pid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_userprojectsassigned_projects");

            entity.HasOne(d => d.UidNavigation).WithMany(p => p.Userprojectsassigneds)
                .HasForeignKey(d => d.Uid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_userprojectsassigned_users");
        });

        modelBuilder.Entity<Vatrate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("vatrates")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Id, "id").IsUnique();

            entity.HasIndex(e => e.Rate, "rate").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Rate)
                .HasPrecision(4, 2)
                .HasColumnName("rate");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
