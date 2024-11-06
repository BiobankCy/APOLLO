import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the alert type
interface Alert {
  id: number;
  message: string;
  severity: string;
}

// Define the context
const AlertContext = createContext<{
  alerts: Alert[];
  showAlert: (message: string, severity?: string) => void;
  removeAlert: (id: number) => void;
}>({
  alerts: [],
  showAlert: () => { },
  removeAlert: () => { },
});

// Define the provider
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (message: string, severity: string = "info") => {
    const id = new Date().getTime();
    const newAlert = { id, message, severity };
    console.log(newAlert);
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

    // Automatically remove the alert after a certain time (e.g., 5 seconds)
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const removeAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Define the useAlert hook
export const useAlert = () => {
  return useContext(AlertContext);
};
