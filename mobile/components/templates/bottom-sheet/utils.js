import { Platform, SectionList, VirtualizedList } from "react-native"
import { SCREEN_HEIGHT } from "./conf"
import { impactAsync, AndroidHaptics, performAndroidHapticsAsync, ImpactFeedbackStyle } from "expo-haptics"
import { isValidElement } from "react"
import { FlatList } from "react-native-gesture-handler"

const parseSnapPoint = (snapPoint) => {
  if (typeof snapPoint === "number") {
    return snapPoint
  }
  const percentage = parseFloat(snapPoint)
  return (SCREEN_HEIGHT * percentage) / 100
}

const triggerHaptic = () => {
  if (Platform.OS === "ios") {
    try {
      impactAsync(ImpactFeedbackStyle.Medium).catch(() => {})
    } catch {}
  } else {
    try {
      performAndroidHapticsAsync(AndroidHaptics.Toggle_On).catch(() => {})
    } catch {}
  }
}

const isScrollableList = (element) => {
  if (!isValidElement(element)) return false

  const type = element.type

  if (type === FlatList || type === SectionList || type === VirtualizedList) {
    return true
  }

  const typeName = type?.displayName || type?.name || ""

  return typeName.includes("FlatList") || typeName.includes("SectionList") || typeName.includes("VirtualizedList") || typeName.includes("FlashList")
}

export { parseSnapPoint, triggerHaptic, isScrollableList }

