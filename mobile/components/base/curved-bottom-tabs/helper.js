import { Dimensions } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export const VIEWPORT_WIDTH = SCREEN_WIDTH / 100
export const VIEWPORT_HEIGHT = SCREEN_HEIGHT / 100

export const processGradient = (colors) => {
  if (!colors || colors.length === 0) {
    return ["#6366f1", "#8b5cf6"]
  }
  if (colors.length === 1) {
    return [colors[0], colors[0]]
  }
  return [colors[0], colors[1]]
}

export const calculateTabPosition = (index, totalTabs) => {
  const screenWidth = Math.ceil(VIEWPORT_WIDTH * 100)
  const tabWidth = screenWidth / totalTabs
  const tabCenter = index * tabWidth + tabWidth / 2
  const screenCenter = screenWidth / 2
  return -screenWidth + (tabCenter - screenCenter)
}

