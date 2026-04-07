import { useContext } from "react";
import { ThemeContext } from "./context";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
};

export const useThemeMode = () => {
  const { theme } = useTheme();
  return theme;
};
