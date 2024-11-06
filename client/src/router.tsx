import React from "react";
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { RouteObject } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";
import BaseLayout from "./layouts/BaseLayout";
import SuspenseLoader from "./Components/SuspenseLoader";
const Loader = (Component: any) => (props: any) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Pages
const Profile = Loader(lazy(() => import("./Components/Auth/Profile")));
const LogIn = Loader(lazy(() => import("./content/login")));

// Dashboards
const HomePage = Loader(lazy(() => import("./content/dashboards/ImsHomePage")));
const UserSettings = Loader(
  lazy(() => import("./content/applications/CurrentUser/settings")),
);
const GlobalSettings = Loader(
  lazy(() => import("./content/applications/ApplicationSettings/settings")),
);
// const Orders = Loader(lazy(() => import("./content/applications/Orders")));

const Suppliers = Loader(
  lazy(() => import("./content/applications/Suppliers")),
);

const SupplierEdit = Loader(
  lazy(() => import("./content/applications/Suppliers/Edit")),
);
const SupplierAddNew = Loader(
  lazy(() => import("./content/applications/Suppliers/Add")),
);

const Manufacturers = Loader(
  lazy(() => import("./content/applications/Manufacturers")),
);

const ManufacturerEdit = Loader(
  lazy(() => import("./content/applications/Manufacturers/Edit")),
);
const ManufacturerAddNew = Loader(
  lazy(() => import("./content/applications/Manufacturers/Add")),
);

const Locations = Loader(
  lazy(() => import("./content/applications/Locations")),
);
const Categories = Loader(
  lazy(() => import("./content/applications/Categories")),
);
const PurchaseOrders = Loader(
  lazy(() => import("./content/applications/PurchaseOrders")),
);
const PurchaseOrdersByItem = Loader(
  lazy(() => import("./content/applications/PurchaseOrdersByLine")),
);
const Lots = Loader(lazy(() => import("./content/applications/Lots")));
const Tenders = Loader(lazy(() => import("./content/applications/Tenders")));
const Projects = Loader(lazy(() => import("./content/applications/ProjectsFinal")));
const Products = Loader(lazy(() => import("./content/applications/Products")));
const ProductEdit = Loader(
  lazy(() => import("./content/applications/Products/Edit")),
);
const ProductAddNew = Loader(
  lazy(() => import("./content/applications/Products/Add")),
);

const RequestLines = Loader(
  lazy(() => import("./content/applications/RequestLines")),
);

const InventoryTransfer = Loader(
  lazy(() => import("./content/applications/InventoryTransfer")),
);
const InventoryAdjustment = Loader(
  lazy(() => import("./content/applications/InventoryAdjustment")),
);
const Reporting = Loader(
  lazy(() => import("./content/applications/ReportingTool")),
);
const AdminUtils = Loader(
  lazy(() => import("./content/applications/AdminUtils")),
);

// Components
 

// Status
const Status404 = Loader(
  lazy(() => import("./content/pages/Status/Status404")),
);

const StatusMaintenance = Loader(
  lazy(() => import("./content/pages/Status/Maintenance")),
);

const routes: RouteObject[] = [
  //{
  //    path: 'login',
  //    element: <BaseLayout />

  //}

  {
    path: "home",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: <HomePage></HomePage>,
      },
    ],
  },

  {
    path: "",
    element: <BaseLayout />,
    //  element: <SidebarLayout />,
    // element: <Navigate to="/home" replace />,

    children: [
      {
        path: "/",
      
        element: <Navigate to="/home" replace />,
      },
      //{
      //    path: 'home',
      //    element: <SidebarLayout children={HomePage} />
      ////element: <Navigate to="/home" replace />
      //},
      {
        path: "login",
        element: <LogIn />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "status",
        children: [
          {
            path: "",
            element: <Navigate to="404" replace />,
          },
          {
            path: "404",
            element: <Status404 />,
          },

          {
            path: "maintenance",
            element: <StatusMaintenance />,
          },

        ],
      },
      {
        path: "*",
        element: <Status404 />,
      },
    ],
  },
  {
    path: "dashboards",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="maindash" replace />,
      },
      {
        path: "maindash",
        element: <HomePage />,
      },

    ],
  },
  {
    path: "admin-utils",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="import" replace />,
      },
      {
        path: "import",
        element: <AdminUtils />,
      },
    ],
  },
  {
    path: "management",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="products" replace />,
      },
      {
        path: "products",
        element: <Products />,
      },

      {
        path: "products",
        children: [
          {
            path: "",
            element: <Products />,
           
          },
          //{
          //    path: 'list',
          //    element: <Products />
          //},
          {
            path: "edit/:id",
            element: <ProductEdit />,
          },
          {
            path: "add",
            element: <ProductAddNew />,
          },
        ],
      },

      {
        path: "inventorytransfer",
        element: <InventoryTransfer />,
      },

      {
        path: "inventoryadjustment",
        element: <InventoryAdjustment />,
      },
      {
        path: "reporting",
        element: <Reporting />,
      },

      {
        path: "requests",
        children: [
          {
            path: "",
            element: <RequestLines />,
          },
          //{
          //    path: 'edit/:id',
          //    element: <RequestEdit />
          //},
          //{
          //    path: 'add',
          //    element: <RequestAddNew />
          //}
        ],
      },

      {
        path: "suppliers",
        children: [
          {
            path: "",
            element: <Suppliers />,
           
          },
          
          {
            path: "edit/:id",
            element: <SupplierEdit />,
          },
          {
            path: "add",
            element: <SupplierAddNew />,
          },
        ],
      },
      {
        path: "manufacturers",
        children: [
          {
            path: "",
            element: <Manufacturers />,
       
          },
          
          {
            path: "edit/:id",
            element: <ManufacturerEdit />,
          },
          {
            path: "add",
            element: <ManufacturerAddNew />,
          },
        ],
      },
      {
        path: "categories",
        children: [
          {
            path: "",
            element: <Categories />,
         
          },
        ],
      },
      {
        path: "purchase-orders",
        children: [
          {
            path: "",
            element: <PurchaseOrders />,
             
          },
        ],
      },
      {
        path: "purchase-orders-by-item",
        children: [
          {
            path: "",
            element: <PurchaseOrdersByItem />,
           
          },
        ],
      },
      {
        path: "locations",
        children: [
          {
            path: "",
            element: <Locations />,
           
          },
        ],
      },
      {
        path: "lots",
        children: [
          {
            path: "",
            element: <Lots />,
           
          },
        ],
      },
      {
        path: "tenders",
        children: [
          {
            path: "",
            element: <Tenders />,
           
          },
        ],
      },

      {
        path: "projects",
        children: [
          {
            path: "",
            element: <Projects />,
           
          },
        ],
      },
      {
        path: "user",
        children: [
          {
            path: "",
            element: <Navigate to="details" replace />,
          },
         
          {
            path: "settings",
            element: <UserSettings />,
          },
        ],
      },
      {
        path: "application",
        children: [
          {
            path: "",
            element: <Navigate to="details" replace />,
          },
        
          {
            path: "settings",
            element: <GlobalSettings />,
          },
        ],
      },
    ],
  },
  //childrens of management
  {
    path: "orders",
    element: <SidebarLayout />,
    children: [
      // {
      //   path: "",
      //   element: <Orders />,
      //   // element: <Navigate to="view" replace />
      // },
      // {
      //   path: "add",
      //   element: <Orders />,
      // },
      // {
      //   path: "edit",
      //   element: <Orders />,
      // },
    ],
  },
  
];

export default routes;
