import { createContext, memo, useCallback, useRef, useState } from "react";
import { ThemeMode } from "./types";
import {
  darkColors,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANIMATION_TYPE,
  DEFAULT_EASING,
  lightColors,
} from "./conf";
import { ThemeSwitcher } from "./theme";

const ThemeContext = createContext(undefined);

export const ThemeProvider = memo(
  ({
    children,
    defaultTheme = ThemeMode.Dark,
    onThemeChange,
    onAnimationStart,
    onAnimationComplete,
    customLightColors,
    customDarkColors,
  }) => {
    const [theme, setThemeState] = useState(defaultTheme);
    const switcherRef = useRef(null);
    const [currentAnimation, setCurrentAnimation] = useState({
      type: DEFAULT_ANIMATION_TYPE,
      duration: DEFAULT_ANIMATION_DURATION,
      easing: DEFAULT_EASING,
    });

    const mergedLightColors = {
      ...lightColors,
      ...customLightColors,
    };

    const mergedDarkColors = {
      ...darkColors,
      ...customDarkColors,
    };

    const colors =
      theme === ThemeMode.Dark ? mergedDarkColors : mergedLightColors;

    const config = {
      mode: theme,
      colors,
      animationType: currentAnimation.type,
      animationDuration: currentAnimation.duration,
      easing: currentAnimation.easing,
    };

    const setTheme = useCallback(
      (newTheme) => {
        setThemeState(newTheme);
        onThemeChange?.(newTheme);
      },
      [onThemeChange],
    );

    const toggleTheme = useCallback(
      async (options) => {
        if (
          options?.animationType ||
          options?.animationDuration ||
          options?.easing
        ) {
          setCurrentAnimation({
            type: options.animationType ?? currentAnimation.type,
            duration: options.animationDuration ?? currentAnimation.duration,
            easing: options.easing ?? currentAnimation.easing,
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (switcherRef.current) {
          await switcherRef.current.animate(options?.touchX, options?.touchY);
        }
      },
      [currentAnimation],
    );

    const handleThemeChange = useCallback(
      (newTheme) => {
        setThemeState(newTheme);
        onThemeChange?.(newTheme);
      },
      [onThemeChange],
    );

    const value = {
      theme,
      colors,
      config,
      toggleTheme,
      setTheme,
      isDark: theme === ThemeMode.Dark,
      isLight: theme === ThemeMode.Light,
    };

    return (
      <ThemeContext.Provider value={value}>
        <ThemeSwitcher
          ref={switcherRef}
          theme={theme}
          onThemeChange={handleThemeChange}
          animationType={currentAnimation.type}
          animationDuration={currentAnimation.duration}
          easing={currentAnimation.easing}
          onAnimationStart={onAnimationStart}
          onAnimationComplete={onAnimationComplete}
        >
          {children}
        </ThemeSwitcher>
      </ThemeContext.Provider>
    );
  },
);

export { ThemeContext, ThemeMode };
