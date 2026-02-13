import { Dimensions } from "react-native"

const DEFAULT_SPRING_CONFIG = {
  damping: 50,
  stiffness: 400,
  mass: 0.8,
  overshootClamping: false,
}

const DEFAULT_TIMING_CONFIG = {
  duration: 250,
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window")
const HANDLE_HEIGHT = 28
const SCROLL_TOP_THRESHOLD = 1

export { DEFAULT_SPRING_CONFIG, DEFAULT_TIMING_CONFIG, HANDLE_HEIGHT, SCREEN_HEIGHT, SCROLL_TOP_THRESHOLD }

