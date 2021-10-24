import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false
};

export default function haptic(typeNum: number) {
  const typeName = ["impactLight", "impactMedium", "impactHeavy"][typeNum]
  ReactNativeHapticFeedback.trigger(typeName, options);
}

export function success(pause=200) {
  ReactNativeHapticFeedback.trigger("impactHeavy", options);
  setTimeout(() => ReactNativeHapticFeedback.trigger("impactMedium", options), pause)
}
