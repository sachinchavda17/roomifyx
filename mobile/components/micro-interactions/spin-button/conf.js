import { Easing } from "react-native-reanimated";
import { Colors } from "../../../constants/Theme";

const DEFAULT_ANIMATION_CONFIG = {
  spring: {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  },
  timing: {
    duration: 200,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  characterDelay: 25,
  characterEnterDuration: 200,
  characterExitDuration: 200,
  buttonTransitionDuration: 250,
  buttonPressDuration: 80,
  buttonReleaseDuration: 150,
  spinnerEnterDuration: 250,
  spinnerExitDuration: 200,
  colorTransitionDuration: 300,
};

const DEFAULT_CHARACTER_ENTER_INITIAL = {
  opacity: 0,
  translateY: 20,
  scale: 0.5,
};

const DEFAULT_CHARACTER_ENTER_FINAL = {
  opacity: 1,
  translateY: 0,
  scale: 1,
};

const DEFAULT_CHARACTER_EXIT_INITIAL = {
  opacity: 1,
  translateY: 0,
  scale: 1,
};

const DEFAULT_CHARACTER_EXIT_FINAL = {
  opacity: 0,
  translateY: -20,
  scale: 0.5,
};

const DEFAULT_BUTTON_COLORS = {
  idle: {
    background: Colors.primary,   // #1E3A8A — Deep Royal Blue
    text: Colors.white,           // #FFFFFF
  },
  active: {
    background: Colors.primary,   // same — opacity change handles the visual diff
    text: Colors.white,           // #FFFFFF
  },
};

const DEFAULT_SPINNER_CONFIG = {
  size: 20,
  strokeWidth: 1.6,
  color: Colors.white,              // #FFFFFF
  containerSize: 35,
  containerBackground: Colors.primary, // #1E3A8A
  position: {
    right: -12,
    bottom: 20,
  },
};

const DEFAULT_BUTTON_STYLE = {
  paddingHorizontal: 40,
  paddingVertical: 12,
  borderRadius: 99,
  fontSize: 17,
  fontWeight: "700",
};

const BUTTON_SCALE = {
  pressed: 0.96,
  released: 1,
};

export {
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_CHARACTER_ENTER_INITIAL,
  DEFAULT_CHARACTER_ENTER_FINAL,
  DEFAULT_CHARACTER_EXIT_INITIAL,
  DEFAULT_CHARACTER_EXIT_FINAL,
  DEFAULT_BUTTON_COLORS,
  DEFAULT_SPINNER_CONFIG,
  DEFAULT_BUTTON_STYLE,
  BUTTON_SCALE,
};
