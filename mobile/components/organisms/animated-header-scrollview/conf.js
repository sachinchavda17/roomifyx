import { Colors as AppColors } from "../../../constants/Theme"

const HEADER_HEIGHT = 60
const MAX_BLUR_INTENSITY = 30

// Re-export the app's Colors so this component stays in sync with the theme
const Colors = AppColors

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
}

export { HEADER_HEIGHT, MAX_BLUR_INTENSITY, Colors, spacing }

