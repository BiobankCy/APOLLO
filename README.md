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
![Product categories & subcategories](demo/screenshots/product-categories-subcategories.png)  
![Filtering & search within Products](demo/screenshots/products-filtering-requests-order.png)  


---

### Inventory Management
![Inventory locations map/list](demo/screenshots/inventory-locations.png)  
![Inventory lots overview](demo/screenshots/inventory-lots.png)  
![Adjust inventory quantities](demo/screenshots/inventory-adjustment.png)  
![Inventory transactions history](demo/screenshots/inventory-transactions.png)  
![Transfer stock between locations](demo/screenshots/inventory-transfer.png)  
![Analysis of a product’s inventory](demo/screenshots/inventory-analysis-of-product.png)  

---

### Requests
![Request list for products](demo/screenshots/request-list.png)
![Products request popup](demo/screenshots/products-request-popup.png)
![Primers request popup](demo/screenshots/primer-request.png)

---

### Ordering & Receiving
![Order list & statuses](demo/screenshots/orders.png)  
![Receive goods into inventory](demo/screenshots/order-receiving.png)  

---

### Procurement & Reporting & Overview & Administration
![System users & permissions](demo/screenshots/system-users.png)  
![Project list & details](demo/screenshots/projects.png) 
![Tender list & details](demo/screenshots/tenders.png) 
![Reports  & filters](demo/screenshots/reports.png)  
![Supplier management](demo/screenshots/suppliers.png)  

## Docker
The project includes Docker support to simplify the setup for both the API and frontend.

To Be Implemented (TBI)
Detailed Docker setup instructions coming soon.

## Contributing
Contributing
Feel free to submit issues or pull requests to contribute to the project. Ensure that any major changes are discussed via an issue first to avoid conflicts.
