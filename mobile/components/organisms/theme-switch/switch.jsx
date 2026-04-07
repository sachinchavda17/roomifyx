import React, { memo, useCallback, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { useTheme } from "./hooks";

const TRACK_WIDTH = 56;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 26;
const TRACK_PADDING = 3;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ThemeSwitch = ({ style, onToggle }) => {
  const { isDark, toggleTheme } = useTheme();

  const progress = useSharedValue(isDark ? 1 : 0);
  const thumbScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(isDark ? 1 : 0, {
      stiffness: 120,
      damping: 14,
      mass: 0.8,
    });
  }, [isDark]);

  const handlePress = useCallback(
    async (e) => {
      const { locationX, locationY } = e.nativeEvent;
      thumbScale.value = withSpring(0.85, { stiffness: 300, damping: 15 });
      impactAsync(ImpactFeedbackStyle.Medium);

      await toggleTheme({ touchX: locationX, touchY: locationY });
      onToggle?.();

      thumbScale.value = withSpring(1, { stiffness: 200, damping: 12 });
    },
    [toggleTheme, onToggle],
  );

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#E2E8F0", "#1E293B"],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(progress.value * TRAVEL, { stiffness: 120, damping: 14 }) },
      { scale: thumbScale.value },
    ],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#FBBF24", "#7C3AED"],
    ),
  }));

  const sunStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1 - progress.value, { duration: 200 }),
    transform: [{ scale: withTiming(1 - progress.value * 0.5, { duration: 200 }) }],
  }));

  const moonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value, { duration: 200 }),
    transform: [{ scale: withTiming(0.5 + progress.value * 0.5, { duration: 200 }) }],
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.track, trackStyle, style]}
    >
      <Animated.View style={[styles.thumb, thumbStyle]}>
        <Animated.View style={[styles.iconContainer, sunStyle]}>
          <Ionicons name="sunny" size={16} color="#FFF" />
        </Animated.View>
        <Animated.View style={[styles.iconContainer, styles.iconOverlay, moonStyle]}>
          <Ionicons name="moon" size={14} color="#FFF" />
        </Animated.View>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: TRACK_PADDING,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  iconOverlay: {
    position: "absolute",
  },
});

export default memo(ThemeSwitch);
