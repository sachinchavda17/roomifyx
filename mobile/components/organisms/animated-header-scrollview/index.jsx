import { BlurView } from "expo-blur"
import MaskedView from "@react-native-masked-view/masked-view"
import { LinearGradient } from "expo-linear-gradient"
import React, { memo, useMemo } from "react"
import { Platform, StyleSheet, Text, View } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { easeGradient } from "react-native-easing-gradient"
import { useThemeColors } from "../theme-switch"
import { HEADER_HEIGHT, MAX_BLUR_INTENSITY, spacing } from "./conf"

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

export const AnimatedHeaderScrollView = memo(
  ({
    largeTitle,
    subtitle,
    children,
    rightComponent,
    showsVerticalScrollIndicator = false,
    contentContainerStyle,
    headerBackgroundGradient: _headerBgGradient,
    headerBlurConfig: _headerBlurConfig,
    smallTitleBlurIntensity = 90,
    smallTitleBlurTint: _smallTitleBlurTint,
    maskGradientColors: _maskGradientColors,
    largeTitleBlurIntensity = 20,
    largeHeaderTitleStyle: _largeTitleStyle = { fontSize: 40 },
    largeHeaderSubtitleStyle,
    smallHeaderSubtitleStyle: _smallHeaderSubtitleStylez,
    smallHeaderTitleStyle,
  }) => {
    const Colors = useThemeColors()
    const isDark = Colors.white !== "#FFFFFF"

    const headerBackgroundGradient = _headerBgGradient || {
      colors: isDark
        ? ["rgba(18, 18, 18, 0.95)", "rgba(18, 18, 18, 0.9)", "transparent"]
        : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.9)", "transparent"],
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 },
    }
    const headerBlurConfig = _headerBlurConfig || {
      intensity: 10,
      tint: isDark ? "dark" : (Platform.OS === "ios" ? "systemThinMaterialLight" : "light"),
    }
    const smallTitleBlurTint = _smallTitleBlurTint || (isDark ? "dark" : "light")
    const maskGradientColors = _maskGradientColors || {
      start: "transparent",
      middle: isDark ? "rgba(18,18,18,0.99)" : "rgba(255,255,255,0.99)",
      end: isDark ? "#121212" : "white",
    }
    const scrollY = useSharedValue(0)
    const insets = useSafeAreaInsets()

    const onScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y
      },
    })

    const animatedLargeTitleStylez = useAnimatedStyle(() => {
      const fontSizeValue = _largeTitleStyle?.fontSize || 40

      const fontSize = interpolate(-scrollY.value, [0, 100], [fontSizeValue, fontSizeValue * 2], Extrapolation.CLAMP)
      return {
        fontSize,
      }
    })

    const largeTitleStyle = useAnimatedStyle(() => {
      const opacity = interpolate(scrollY.value, [0, 60], [1, 0], Extrapolation.CLAMP)

      return {
        opacity,
      }
    })

    const smallHeaderStyle = useAnimatedStyle(() => {
      const opacity = withTiming(interpolate(scrollY.value, [40, 80], [0, 1], Extrapolation.CLAMP), {
        duration: 600,
      })

      const translateY = withTiming(interpolate(scrollY.value, [40, 80], [20, 0], Extrapolation.CLAMP), {
        duration: 600,
      })

      return {
        opacity,
        transform: [{ translateY }],
      }
    })

    const smallHeaderSubtitleStyle = useAnimatedStyle(() => {
      const shouldShow = scrollY.value > 100

      return {
        opacity: withSpring(shouldShow ? 0.5 : 0, {
          damping: 18,
          stiffness: 120,
          mass: 1.2,
        }),
        transform: [
          {
            translateY: withTiming(shouldShow ? 0 : 10, {
              duration: 900,
            }),
          },
        ],
      }
    })

    const headerBackgroundStylez = useAnimatedStyle(() => {
      const opacity = interpolate(scrollY.value, [0, 80], [0, 1], Extrapolation.CLAMP)

      return {
        opacity,
      }
    })

    const animatedHeaderBlur = useAnimatedProps(() => {
      const intensity = interpolate(scrollY.value, [0, 100], [0, MAX_BLUR_INTENSITY], Extrapolation.CLAMP)

      return {
        intensity,
      }
    })

    const smallTitleBlur = useAnimatedProps(() => {
      const intensity = interpolate(scrollY.value, [0, 80, 100], [0, 15, 0], Extrapolation.CLAMP)

      const _intensity = scrollY.value < 30 ? withTiming(0, { duration: 900 }) : intensity

      return {
        intensity: _intensity,
      }
    })

    const { colors: maskColors, locations: maskLocations } = easeGradient({
      colorStops: {
        0: { color: maskGradientColors.start },
        0.5: { color: maskGradientColors.middle },
        1: { color: maskGradientColors.end },
      },
      extraColorStopsPerTransition: 20,
    })

    const dynamicStyles = useMemo(() => ({
      container: { backgroundColor: Colors.white },
      webHeaderBackground: { backgroundColor: isDark ? "rgba(18,18,18,0.85)" : "rgba(255,255,255,0.85)" },
      largeTitle: { color: Colors.black },
      smallHeaderTitle: { color: Colors.black },
      largeSubtitle: { color: Colors.gray[600] },
      smallHeaderSubtitle: { color: Colors.gray[600] },
    }), [Colors, isDark])

    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <Animated.View
          style={[
            styles.headerBackgroundContainer,
            {
              height: HEADER_HEIGHT + insets.top + 50,
            },
            headerBackgroundStylez,
          ]}
          pointerEvents="none"
        >
          {Platform.OS !== "web" ? (
            <MaskedView
              maskElement={
                <LinearGradient
                  locations={maskLocations}
                  colors={maskColors}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                />
              }
              style={[StyleSheet.absoluteFill]}
            >
              <LinearGradient
                colors={headerBackgroundGradient.colors}
                locations={headerBackgroundGradient.locations}
                start={headerBackgroundGradient.start}
                end={headerBackgroundGradient.end}
                style={StyleSheet.absoluteFill}
              />
              <BlurView intensity={headerBlurConfig.intensity} tint={headerBlurConfig.tint} style={[StyleSheet.absoluteFill]} />
            </MaskedView>
          ) : (
            <Animated.View style={[StyleSheet.absoluteFill, dynamicStyles.webHeaderBackground]} />
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.fixedHeader,
            {
              paddingTop: insets.top,
              height: HEADER_HEIGHT + insets.top,
            },
            smallHeaderStyle,
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.fixedHeaderContent}>
            <View style={styles.fixedHeaderTextContainer}>
              <Animated.Text style={[styles.smallHeaderTitle, dynamicStyles.smallHeaderTitle, smallHeaderTitleStyle]}>{largeTitle}</Animated.Text>
              {subtitle && (
                <Animated.Text style={[styles.smallHeaderSubtitle, dynamicStyles.smallHeaderSubtitle, smallHeaderSubtitleStyle, _smallHeaderSubtitleStylez]}>{subtitle}</Animated.Text>
              )}
            </View>

            <MaskedView
              maskElement={
                <LinearGradient
                  locations={maskLocations}
                  colors={maskColors}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                />
              }
              style={[StyleSheet.absoluteFill]}
            >
              <LinearGradient colors={["transparent", "transparent"]} style={StyleSheet.absoluteFill} />
              <AnimatedBlurView
                animatedProps={smallTitleBlur}
                intensity={smallTitleBlurIntensity}
                tint={smallTitleBlurTint}
                style={[
                  styles.smallTitleBlurOverlay,
                  {
                    height: HEADER_HEIGHT + insets.top + 20,
                  },
                ]}
              />
            </MaskedView>

            {rightComponent && <View style={styles.rightComponentContainer}>{rightComponent}</View>}
          </View>
        </Animated.View>

        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          contentContainerStyle={[
            {
              paddingTop: insets.top + spacing.md,
              paddingBottom: insets.bottom + spacing.xl,
            },
            contentContainerStyle,
          ]}
        >
          <Animated.View style={[styles.largeTitleContainer, largeTitleStyle]}>
            <View style={styles.largeTitleTextContainer}>
              <Animated.Text style={[styles.largeTitle, dynamicStyles.largeTitle, _largeTitleStyle, animatedLargeTitleStylez]}>{largeTitle}</Animated.Text>
              {subtitle && <Text style={[styles.largeSubtitle, dynamicStyles.largeSubtitle, largeHeaderSubtitleStyle]}>{subtitle}</Text>}
            </View>
          </Animated.View>

          <View style={styles.content}>{children}</View>
        </Animated.ScrollView>
      </View>
    )
  },
)

export default memo(AnimatedHeaderScrollView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  webHeaderBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  smallTitleBlurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 11,
    justifyContent: "flex-end",
  },
  fixedHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  fixedHeaderTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  smallHeaderTitle: {
    fontSize: 24,
    textAlign: "center",
  },
  smallHeaderSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },
  rightComponentContainer: {
    marginLeft: spacing.md,
  },
  largeTitleContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  largeTitleTextContainer: {},
  backgroundImageContainer: {
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: 200,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.52)",
  },
  largeTitleContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    justifyContent: "flex-end",
    flex: 1,
  },
  largeTitle: {
    fontSize: 40,
    letterSpacing: -0.5,
    paddingTop: 5,
  },
  largeSubtitle: {
    fontSize: 18,
    marginTop: spacing.xs,
    paddingTop: 5,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  largeTitleBlurContainer: {
    backgroundColor: "transparent",
  },
})

