import { useEffect } from "react";
import { Keyboard, KeyboardEvent } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";


//Originally taken from https://stackoverflow.com/a/65267045
const useKeyboardHeight = () => {
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const keyboardWillShow = (e: KeyboardEvent) => {
      const duration = e.duration === 0 ? 180 : e.duration;
      keyboardHeight.value = withTiming(e.endCoordinates.height, { duration, easing: Easing.bezier(.17, .59, .4, .77) }); // https://gist.github.com/jondot/1317ee27bab54c482e87
    };

    const keyboardWillHide = (e: KeyboardEvent) => {
      const duration = e.duration === 0 ? 180 : e.duration;

      keyboardHeight.value = withTiming(0, { duration, easing: Easing.bezier(.17, .59, .4, .77) }); // https://gist.github.com/jondot/1317ee27bab54c482e87
    };

    const keyboardWillShowSub = Keyboard.addListener(
      "keyboardDidShow",
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      "keyboardDidHide",
      keyboardWillHide
    );

    return () => {
      keyboardWillHideSub.remove();
      keyboardWillShowSub.remove();
    };
  }, []);

  return keyboardHeight;
};

export default useKeyboardHeight
