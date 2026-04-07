import { AnimationType, EasingType } from "./types";

// Light theme colors — mirrors the app's Colors constant structure
export const lightColors = {
  primary: "#1E3A8A",
  secondary: "#C8A951",
  black: "#1F2937",
  darkGray: "#6B7280",
  lightGray: "#E5E7EB",
  white: "#FFFFFF",
  background: "#F8F9FA",
  star: "#FBBF24",
  border: "#E5E7EB",
  red: "#EF4444",
  gray: {
    100: "#F9FAFB",
    200: "#F3F4F6",
    300: "#E5E7EB",
    400: "#D1D5DB",
    500: "#9CA3AF",
    600: "#6B7280",
    700: "#4B5563",
    800: "#374151",
    900: "#111827",
  },
  // semantic aliases
  card: "#FFFFFF",
  text: "#1F2937",
  textSecondary: "#6B7280",
  inputBackground: "#F9F9F9",
  statusBarStyle: "dark",
};

// Dark theme colors
export const darkColors = {
  primary: "#3B6FF5",
  secondary: "#D4B96A",
  black: "#F0F0F0",
  darkGray: "#A1A1AA",
  lightGray: "#27272A",
  white: "#121212",
  background: "#0A0A0A",
  star: "#FBBF24",
  border: "#27272A",
  red: "#F87171",
  gray: {
    100: "#1A1A1E",
    200: "#222226",
    300: "#2C2C30",
    400: "#3A3A3E",
    500: "#6B6B70",
    600: "#A1A1AA",
    700: "#C8C8D0",
    800: "#E0E0E8",
    900: "#F0F0F5",
  },
  // semantic aliases
  card: "#1A1A1E",
  text: "#F0F0F0",
  textSecondary: "#A1A1AA",
  inputBackground: "#1A1A1E",
  statusBarStyle: "light",
};

// Default animation settings
export const DEFAULT_ANIMATION_DURATION = 600;
export const DEFAULT_ANIMATION_TYPE = AnimationType.Circular;
export const DEFAULT_SWITCH_DELAY = 80;
export const DEFAULT_EASING = EasingType.EaseInOut;
