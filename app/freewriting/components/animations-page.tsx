import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing, runOnJS
} from 'react-native-reanimated';
import WritingCard from "./writing-card";
import * as React from "react";
import {useEffect, useLayoutEffect, useState} from "react";
import {Text} from "react-native";


export const GenieCard = (props: any) => {
  const animOpacity = useSharedValue(0.8)
  const animX = useSharedValue(0)
  const animY = useSharedValue(0)
  const animScale = useSharedValue(1)

  useEffect(() => {
    animX.value = 160
    animY.value = 220
    animOpacity.value = 0
    animScale.value = 0.15
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(animX.value, {
            duration: 980,
            easing: Easing.inOut(Easing.ease)
          })
        },
        {
          translateY: withTiming(animY.value, {
            duration: 870,
            easing: Easing.back(3)
          })
        },
        {
          scale: withTiming(animScale.value, {
            duration: 1000,
            easing: Easing.out(Easing.ease),
          })
        },
      ],
      opacity: withTiming(animOpacity.value, {
        duration: 980,
        easing: Easing.in(Easing.circle),
      }, runOnJS(props.resetGenie))
    }
  })

  return (
    <Animated.View style={[props.style, animatedStyle]}>
        <WritingCard content={props.genieContent} editable={false}/>
        {/*<Text>hi</Text>*/}
    </Animated.View>
  );
}

// opacity: props.animScaleOpacity.interpolate({
//             inputRange: [0, 0.95, 1],
//             outputRange: [1, 0.8, 0.4]  // 0 : 150, 0.5 : 75, 1 : 0
//           }),
//           transform: [
//             {translateX: props.animX},
//             {translateY: props.animY}
//           ],
//         }}
//     >
//         <WritingCard style={{
//           transform: [
//             {
//               scale: props.animScaleOpacity.interpolate({
//                 inputRange: [0, 0.25, 0.9, 1],
//                 outputRange: [0.9, 1, 0.1, 0.1]
//               }),
//             },
//           ]
