import React, { useState, ReactNode } from "react";
import { ThemeProvider } from "@mui/material";
import { themeCreator } from "./base";
import { StyledEngineProvider } from "@mui/system";

export const ThemeContext = React.createContext(
  (themeName: string): void => {},
);

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = (props) => {
  const curThemeName = localStorage.getItem("appTheme") || "MyTheme";
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    localStorage.setItem("appTheme", themeName);
    _setThemeName(themeName);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
};

export default ThemeProviderWrapper;
