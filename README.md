# APOLLO Project

**APOLLO (Advanced Platform for Open Labs, Logistics, and Operations)** is an open-source, FAIR-compliant laboratory inventory and compliance management system developed by biobank.cy. Designed for biomedical research environments, APOLLO helps labs track reagents, manage safety documentation (e.g., SDS), monitor stock levels, and align with ISO/GLP standards. It promotes reproducibility, audit readiness, and operational transparency—making advanced lab management accessible to all.

**APOLLO** is a modern web application consisting of a **C# RESTful API** backend and a **React (TypeScript)** frontend. This project is designed for organizations that need efficient tracking and flow management of their inventory.

## Project Structure

- `/api`: The **C# RESTful API** backend built using .NET.
- `/client`: The **React (TypeScript)** frontend for the user interface.

## Prerequisites

Make sure you have the following installed on your machine:

- **.NET SDK** (for the API)
- **Node.js** and **npm** (for the client)
- **MariaDB Server (minimum v10.11.2)**

## Installation

### Backend (API)
1. Navigate to the `/api` folder.
2. Run `dotnet restore` to install the dependencies.
3. Update your appsettings.json with the required configuration.

### Frontend (Client)
1. Navigate to the `/client` folder.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file based on `.env.example`.

## Running the Project
To Be Added (TBA)

## UI Overview
Below are examples of the primary screens and dialogs in the **APOLLO** Web Application.

---

### Catalog

![Products catalog view](demo/screenshots/products.png)  
*List of all catalog items with quick-action buttons for requests and orders.*

![Product categories & subcategories](demo/screenshots/product-categories-subcategories.png)  
*Hierarchical navigation of product categories and nested subcategories.*

![Filtering & search within Products](demo/screenshots/products-filtering-requests-order.png)  
*Advanced filter panel and search bar to narrow down products by status, brand, supplier, etc.*

---

### Inventory Management

![Inventory locations map/list](demo/screenshots/inventory-locations.png)  
*Map/list view showing every storage location and its current status.*

![Inventory lots overview](demo/screenshots/inventory-lots.png)  
*Table of inventory lots with lot numbers and expiry dates*

![Adjust inventory quantities](demo/screenshots/inventory-adjustment.png)  
*Form for adjusting inventory levels—search and choose the item and location,choose available lot, enter the delta, select a reason, and add optional comments.*

![Inventory transactions history](demo/screenshots/inventory-transactions.png)  
*Chronological log for the selected product, detailing each stock movement, manual adjustment, and transfer, complete with timestamps, quantity changes, and user notes.*

![Transfer stock between locations](demo/screenshots/inventory-transfer.png)  
*Interactive form for creating stock transfers between locations—select source and destination, specify quantities, and add optional notes.*

![Analysis of a product’s inventory](demo/screenshots/inventory-analysis-of-product.png)  
*Table view listing current inventory for the selected product, grouped by lot number and storage location, including available quantities and expiration dates.*

---

### Ordering & Receiving

![Order list & statuses](demo/screenshots/orders.png)  
*Detailed purchase orders list for the selected product, showing supplier, order date, requesting user, and receipt status (fully, partially, or not yet received), with quick-action buttons for receiving items and accessing related supplier invoices.*

![Receive goods into inventory](demo/screenshots/order-receiving.png)  
*Form for logging received shipments: enter received quantities, link to a supplier invoice (number, date, and amounts), upload the PDF invoice for paperless records, and have stock levels update automatically.*

![Primer request popup](demo/screenshots/primer-request.png)  
*Request form for custom primer orders—manually enter individual sequences or batch-import from an Excel file, specify quantities, assign to a project, and add optional comments.*

---

### Requests

![Request list for products](demo/screenshots/request-list.png)  
*Comprehensive table of reagent and material requests—includes column filters, inline status updates, approval status, estimated cost, submitting user, approver, request date, and quick-action buttons.*

![Products request popup](demo/screenshots/products-request-popup.png)  
*Popup form to submit new product requests, set urgency, and optionally assign to a project.*

---

### Procurement & Planning

![Tender list & details](demo/screenshots/tenders.png)  
*Overview of tenders with budget usage bars and expandable product line-items.*

![Project list & details](demo/screenshots/projects.png)  
*Overview of projects, showing approved budget, spend to date, and remaining funds.*

---

### Administration

![Supplier management](demo/screenshots/suppliers.png)  
*List of suppliers with contact details and country, featuring a toggle to include an Excel attachment directly in the email when placing a purchase order.*

![System users & permissions](demo/screenshots/system-users.png)  
*Admin view of all user accounts, roles, and approver assignments.*

![My user settings & permissions](demo/screenshots/user-permissions.png)  
*Personal settings panel showing your system role, job role, and feature-level toggles.*

---

### Reporting

![Reports gallery & filters](demo/screenshots/reports.png)  
*Reporting tool with pie charts, bar graphs, and export options*



## Docker
The project includes Docker support to simplify the setup for both the API and frontend.

To Be Implemented (TBI)
Detailed Docker setup instructions coming soon.

## Contributing
Contributing
Feel free to submit issues or pull requests to contribute to the project. Ensure that any major changes are discussed via an issue first to avoid conflicts.
