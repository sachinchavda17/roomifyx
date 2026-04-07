import { Easing } from "react-native-reanimated";
import { EasingType } from "./types";

const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getEasingFunction = (easing) => {
  switch (easing) {
    case EasingType.Linear:
    case "linear":
      return Easing.linear;
    case EasingType.Ease:
    case "ease":
      return Easing.ease;
    case EasingType.EaseIn:
    case "easeIn":
      return Easing.in(Easing.ease);
    case EasingType.EaseOut:
    case "easeOut":
      return Easing.out(Easing.ease);
    case EasingType.EaseInOut:
    case "easeInOut":
    default:
      return Easing.inOut(Easing.ease);
  }
};

const getMaxRadius = (x, y, screenWidth, screenHeight) => {
  const corners = [
    { x: 0, y: 0 },
    { x: screenWidth, y: 0 },
    { x: 0, y: screenHeight },
    { x: screenWidth, y: screenHeight },
  ];

  const distances = corners.map((corner) =>
    Math.sqrt(Math.pow(corner.x - x, 2) + Math.pow(corner.y - y, 2)),
  );

  return Math.max(...distances);
};

export { wait, getEasingFunction, getMaxRadius };
