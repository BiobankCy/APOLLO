using System;
using System.Collections.Generic;

namespace IMSwebAPI.Models.AutoCreatedFromEFC;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public bool LockoutFlag { get; set; }

    public int RoleId { get; set; }

    public int JobRoleId { get; set; }

    public bool ClaimCanMakePo { get; set; }

    public bool ClaimCanApproveRequest { get; set; }

    public bool ClaimCanMakeRequest { get; set; }

    public bool ClaimCanTransferStock { get; set; }

    public bool ClaimCanMakeInventoryAdjustment { get; set; }

    public bool ClaimCanReceiveItems { get; set; }

    public bool ClaimCanViewReports { get; set; }

    public bool CconpurchaseOrder { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime LastUpdatedDate { get; set; }

    public int? ApproverUid { get; set; }

    public virtual User? ApproverU { get; set; }

    public virtual ICollection<AttachmentFile> AttachmentFiles { get; set; } = new List<AttachmentFile>();

    public virtual ICollection<User> InverseApproverU { get; set; } = new List<User>();

    public virtual Jobrole JobRole { get; set; } = null!;

    public virtual ICollection<Picking> Pickings { get; set; } = new List<Picking>();

    public virtual ICollection<Porder> PorderCreatedbyemps { get; set; } = new List<Porder>();

    public virtual ICollection<Porder> PorderSentbyemps { get; set; } = new List<Porder>();

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual ICollection<Receiving> Receivings { get; set; } = new List<Receiving>();

    public virtual ICollection<ReportsUsersaccess> ReportsUsersaccesses { get; set; } = new List<ReportsUsersaccess>();

    public virtual ICollection<Requestdecisionhistory> Requestdecisionhistories { get; set; } = new List<Requestdecisionhistory>();

    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<StockTran> StockTrans { get; set; } = new List<StockTran>();

    public virtual ICollection<Tender> Tenders { get; set; } = new List<Tender>();

    public virtual UserPassword? UserPassword { get; set; }

    public virtual ICollection<Userprojectsassigned> Userprojectsassigneds { get; set; } = new List<Userprojectsassigned>();
}
