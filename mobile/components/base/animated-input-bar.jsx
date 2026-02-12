import React, { useState, useEffect, memo } from "react"
import { TextInput, View, StyleSheet, TextStyle, StyleProp } from "react-native"
import Animated, {
  withDelay,
  withSpring,
  withTiming,
  Easing,
  LinearTransition,
  useAnimatedProps,
  useSharedValue,
  interpolate,
  withSequence,
} from "react-native-reanimated"
import { BlurView } from "expo-blur"

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

const Character = ({ char, index, enterDuration, exitDuration, delayIncrement, style }) => {
  const animationDelay = index * delayIncrement

  const enteringAnimation = () => {
    "worklet"

    return {
      initialValues: {
        opacity: 0,
        transform: [{ translateY: 20 }, { scale: 0.5 }],
      },
      animations: {
        opacity: withDelay(animationDelay, withTiming(1, { duration: enterDuration })),
        transform: [
          {
            translateY: withDelay(
              animationDelay,
              withSpring(0, {
                damping: 15,
                stiffness: 150,
                mass: 0.9,
              }),
            ),
          },
          {
            scale: withDelay(
              animationDelay,
              withSpring(1, {
                damping: 15,
                stiffness: 150,
                mass: 0.9,
              }),
            ),
          },
        ],
      },
    }
  }

  const exitingAnimation = () => {
    "worklet"

    return {
      initialValues: {
        opacity: 1,
        transform: [{ translateY: 0 }, { scale: 1 }],
      },
      animations: {
        opacity: withDelay(animationDelay, withTiming(0, { duration: exitDuration })),
        transform: [
          {
            translateY: withDelay(animationDelay, withTiming(-5, { duration: exitDuration })),
          },
          {
            scale: withDelay(animationDelay, withTiming(0.5, { duration: exitDuration })),
          },
        ],
      },
    }
  }

  return (
    <Animated.Text
      entering={enteringAnimation}
      exiting={exitingAnimation}
      layout={LinearTransition.duration(180).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
      style={style}
    >
      {char}
    </Animated.Text>
  )
}

const StaggeredPlaceholder = ({ text, enterDuration, exitDuration, delayIncrement, style }) => {
  const characters = Array.from(text)

  return (
    <Animated.View style={styles.placeholderWrapper} layout={LinearTransition.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}>
      {characters.map((char, index) => (
        <Character
          key={`${char}-${index}-${text}`}
          char={char}
          index={index}
          enterDuration={enterDuration}
          exitDuration={exitDuration}
          delayIncrement={delayIncrement}
          style={style}
        />
      ))}
    </Animated.View>
  )
}

const AnimatedInput = memo(
  ({
    placeholders,
    animationInterval = 3000,
    value,
    onChangeText,
    containerStyle = {
      width: "100%",
    },
    inputWrapperStyle,
    inputStyle,
    placeholderStyle,
    characterEnterDuration = 300,
    characterExitDuration = 200,
    characterDelayIncrement = 30,
    blurAnimationDuration = 400,
    blurIntensityRange = [0, 2.5, 4.5],
    blurProgressRange = [0, 0.2, 1],
    ...props
  }) => {
    const [isFocused, setIsFocused] = useState(false)
    const [inputValue, setInputValue] = useState(value || "")
    const [currentIndex, setCurrentIndex] = useState(0)

    const blurProgress = useSharedValue(0)

    useEffect(() => {
      if (isFocused || inputValue) return

      blurProgress.value = withSequence(
        withTiming(1, {
          duration: blurAnimationDuration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(0, {
          duration: blurAnimationDuration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      )
    }, [currentIndex, blurAnimationDuration])

    useEffect(() => {
      if (isFocused || inputValue) return
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % placeholders.length)
      }, animationInterval)

      return () => clearTimeout(timeout)
    }, [currentIndex, isFocused, inputValue, placeholders.length, animationInterval])

    const handleChangeText = (text) => {
      setInputValue(text)
      onChangeText?.(text)
    }

    const animatedBlurViewProps = useAnimatedProps(() => {
      const intensity = withSpring(interpolate(blurProgress.value, blurProgressRange, blurIntensityRange))
      return {
        intensity,
      }
    })

    return (
      <View style={[styles.wrapper, containerStyle]}>
        <View style={[styles.inputWrapper, inputWrapperStyle]}>
          {!isFocused && !inputValue && (
            <StaggeredPlaceholder
              text={placeholders[currentIndex]}
              enterDuration={characterEnterDuration}
              exitDuration={characterExitDuration}
              delayIncrement={characterDelayIncrement}
              style={[styles.character, placeholderStyle]}
            />
          )}
          <AnimatedBlurView
            style={[
              StyleSheet.absoluteFillObject,
              {
                overflow: "hidden",
              },
            ]}
            animatedProps={animatedBlurViewProps}
          />
          <TextInput
            style={[styles.input, inputStyle]}
            value={inputValue}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor="transparent"
            {...props}
          />
        </View>
      </View>
    )
  },
)

export default memo(AnimatedInput)

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  inputWrapper: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    position: "relative",
    minHeight: 56,
    justifyContent: "center",
  },
  placeholderWrapper: {
    position: "absolute",
    left: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    pointerEvents: "none",
  },
  character: {
    fontSize: 16,
    color: "#71717a",
    fontWeight: "400",
  },
  input: {
    fontSize: 16,
    color: "#fafafa",
    paddingVertical: 0,
    fontWeight: "400",
  },
})

