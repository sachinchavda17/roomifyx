import { BlurView } from "expo-blur"
import React, { createContext, useContext, useState, useCallback, useMemo, memo } from "react"
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native"
import Animated, { Easing, Extrapolation, interpolate, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

const createDisclosureGroupContext = () => createContext(undefined)

const useDisclosureGroup = (context) => {
  const value = useContext(context)
  if (!value) {
    throw new Error("DisclosureGroup components must be used within DisclosureGroup")
  }
  return value
}

const DisclosureGroupInstanceContext = createContext(undefined)

const DisclosureGroupBase = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)

  const DisclosureContext = useMemo(() => createDisclosureGroupContext(), [])

  const toggleDisclosure = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const closeDisclosure = useCallback(() => {
    setIsOpen(false)
  }, [])

  const contextValue = useMemo(
    () => ({
      isOpen,
      toggleDisclosure,
      closeDisclosure,
      contentHeight,
      setContentHeight,
      contextId: Math.random().toString(36),
    }),
    [isOpen, toggleDisclosure, closeDisclosure, contentHeight],
  )

  return (
    <DisclosureGroupInstanceContext.Provider value={DisclosureContext}>
      <DisclosureContext.Provider value={contextValue}>
        <View style={styles.container}>{children}</View>
      </DisclosureContext.Provider>
    </DisclosureGroupInstanceContext.Provider>
  )
}

const DisclosureGroupTriggerBase = ({ children, style, contentContainerStyle, showChevron = true, chevronColor = "#ffffff" }) => {
  const DisclosureContext = useContext(DisclosureGroupInstanceContext)
  if (!DisclosureContext) {
    throw new Error("DisclosureGroup.Trigger must be used within DisclosureGroup")
  }

  const { isOpen, toggleDisclosure } = useDisclosureGroup(DisclosureContext)

  const rotation = useSharedValue(0)
  const { width } = useWindowDimensions()

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    })
  }, [isOpen])

  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  return (
    <Pressable onPress={toggleDisclosure} style={[styles.trigger, style]}>
      <View style={[styles.triggerContent, contentContainerStyle]}>
        {children}
        {showChevron && (
          <Animated.View style={[styles.chevronContainer, animatedChevronStyle]}>
            <Text style={[styles.chevron, { color: chevronColor }]}>^</Text>
          </Animated.View>
        )}
      </View>
    </Pressable>
  )
}

const DisclosureGroupItemsBase = ({ children, maxHeight = 400, scrollable = true, blurTint = "dark", useBlur = false, style }) => {
  const DisclosureContext = useContext(DisclosureGroupInstanceContext)
  if (!DisclosureContext) {
    throw new Error("DisclosureGroup.Items must be used within DisclosureGroup")
  }

  const { isOpen, contentHeight, setContentHeight } = useDisclosureGroup(DisclosureContext)

  const animationProgress = useSharedValue(0)
  const opacity = useSharedValue(0)
  const blurIntensity = useSharedValue(0)

  const [measured, setMeasured] = useState(false)

  React.useEffect(() => {
    if (isOpen && measured) {
      animationProgress.value = withTiming(1, {
        duration: 350,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
      blurIntensity.value = withTiming(0)
      opacity.value = withTiming(1, { duration: 300 })
    } else {
      blurIntensity.value = withTiming(20)
      animationProgress.value = withTiming(0)
      opacity.value = withTiming(0)
    }
  }, [isOpen, measured])

  const animatedContainerStyle = useAnimatedStyle(() => {
    const targetHeight = Math.min(contentHeight || 0, maxHeight)
    return {
      height: interpolate(animationProgress.value, [0, 1], [0, targetHeight], Extrapolation.CLAMP),
      opacity: opacity.value,
    }
  })

  const animatedBlurViewProps = useAnimatedProps(() => ({
    intensity: blurIntensity.value,
  }))

  const handleLayout = useCallback(
    (event) => {
      const { height } = event.nativeEvent.layout
      if (height > 0 && !measured) {
        setContentHeight(height)
        setMeasured(true)
      }
    },
    [measured],
  )

  if (!measured) {
    return (
      <View style={styles.measurementContainer} onLayout={handleLayout}>
        <View style={styles.itemsContent}>{children}</View>
      </View>
    )
  }

  const content = scrollable ? (
    <ScrollView style={{ maxHeight }} showsVerticalScrollIndicator={false} bounces>
      <View style={styles.itemsContent}>{children}</View>
      <AnimatedBlurView tint={blurTint} animatedProps={animatedBlurViewProps} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
    </ScrollView>
  ) : (
    <View style={styles.itemsContent}>{children}</View>
  )

  if (useBlur) {
    return (
      <Animated.View style={[styles.itemsContainer, animatedContainerStyle, style]}>
        {children}
        <AnimatedBlurView tint={blurTint} animatedProps={animatedBlurViewProps} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
      </Animated.View>
    )
  }

  return <Animated.View style={[styles.itemsContainer, animatedContainerStyle, style]}>{content}</Animated.View>
}

const DisclosureGroupItemBase = ({ children, onPress, style, disabled = false }) => {
  const DisclosureContext = useContext(DisclosureGroupInstanceContext)
  if (!DisclosureContext) {
    throw new Error("DisclosureGroup.Item must be used within DisclosureGroup")
  }

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = useCallback(
    (cb) => {
      if (!disabled) cb?.()
    },
    [disabled],
  )

  return (
    <Pressable disabled={disabled} onPress={() => handlePress(onPress)} onPressIn={() => (scale.value = 0.97)} onPressOut={() => (scale.value = 1)}>
      <Animated.View style={[styles.item, style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  )
}

const DisclosureGroupTrigger = memo(DisclosureGroupTriggerBase)
const DisclosureGroupItems = memo(DisclosureGroupItemsBase)
const DisclosureGroupItem = memo(DisclosureGroupItemBase)

export const DisclosureGroup = Object.assign(memo(DisclosureGroupBase), {
  Trigger: DisclosureGroupTrigger,
  Items: DisclosureGroupItems,
  Item: DisclosureGroupItem,
})

const styles = StyleSheet.create({
  container: { width: "100%" },
  trigger: {},
  triggerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  chevronContainer: { marginLeft: 12 },
  chevron: { fontSize: 16, fontWeight: "600" },
  measurementContainer: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
  },
  itemsContainer: {},
  itemsContent: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 4,
  },
  item: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
})

