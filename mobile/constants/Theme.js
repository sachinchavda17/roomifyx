// Colors are now driven by the theme system.
// This re-exports lightColors as the static default for StyleSheet.create() calls.
// At runtime, useThemeColors() overrides these with the active theme's palette.
export { lightColors as Colors } from "../components/organisms/theme-switch/conf"

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}

export const Typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
}
