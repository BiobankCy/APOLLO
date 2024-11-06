import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
//bootstrap removed 22/01/2024: to enable, include this in package.json  "bootstrap": "^5.1.3",
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import router from "./router";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import UserProvider from "./contexts/UserContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AlertProvider } from "./contexts/AlertsContext";
import AlertSnackbar from "./contexts/alerts/AlertSnackbar";


const App = () => {
  let routes = useRoutes(router);
  return routes;
};

const AppWrapper = () => {
  return (

    <HelmetProvider>
      <AlertProvider>
        <Router>
          <UserProvider>
            <ThemeProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline />
                <SidebarProvider>
                  <App />
                </SidebarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </UserProvider>
        </Router>
        <AlertSnackbar />
      </AlertProvider>
    </HelmetProvider>

  );
};

export default AppWrapper;