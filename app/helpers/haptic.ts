import ReactNativeHapticFeedback, { HapticFeedbackTypes } from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false
};

export default function haptic(typeNum: number) {
  const typeName = ["impactLight", "impactMedium", "impactHeavy"][typeNum]
  ReactNativeHapticFeedback.trigger(<HapticFeedbackTypes>typeName, options);
}

export function success(pause=200) {
  ReactNativeHapticFeedback.trigger("impactHeavy", options);
  setTimeout(() => ReactNativeHapticFeedback.trigger("impactMedium", options), pause)
}

export function pattern(count: number, duration: number, typeNum: number) {
  const typeName = ["impactLight", "impactMedium", "impactHeavy"][typeNum]

  for (let i = 0; i < count; i++) {
    setTimeout(() => ReactNativeHapticFeedback.trigger(<HapticFeedbackTypes>typeName, options), duration * i)
  }
}
