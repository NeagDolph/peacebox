import { useRef, useEffect } from 'react';
import { Animated, Keyboard, KeyboardEvent } from 'react-native';
import {useSharedValue, withTiming, Easing} from "react-native-reanimated";


//Originally taken from https://stackoverflow.com/a/65267045
const useKeyboardHeight = () => {
  const keyboardHeight = useSharedValue(0)

  useEffect(() => {
    const keyboardWillShow = (e: KeyboardEvent) => {
      keyboardHeight.value = withTiming( e.endCoordinates.height, {duration: e.duration, easing: Easing.bezier(.17,.59,.4,.77)}) // https://gist.github.com/jondot/1317ee27bab54c482e87
    }

    const keyboardWillHide = (e: KeyboardEvent) => {
      keyboardHeight.value = withTiming(0, {duration: e.duration, easing: Easing.bezier(.17,.59,.4,.77)}) // https://gist.github.com/jondot/1317ee27bab54c482e87
    };

    const keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      keyboardWillHide
    );

    return () => {
      keyboardWillHideSub.remove();
      keyboardWillShowSub.remove();
    };
  }, [keyboardHeight]);

  return keyboardHeight;
};

export default useKeyboardHeight
