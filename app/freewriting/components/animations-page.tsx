import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import WritingCard from "./writing-card";
import * as React from "react";
import { useEffect } from "react";


const GenieCard = (props: any) => {
  const animOpacity = useSharedValue(0.8)
  const animX = useSharedValue(0)
  const animY = useSharedValue(0)
  const animScale = useSharedValue(1)
  const totalSpeed = 750

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
            duration: 0.98 * totalSpeed,
            easing: Easing.inOut(Easing.ease)
          })
        },
        {
          translateY: withTiming(animY.value, {
            duration: 0.87 * totalSpeed,
            easing: Easing.back(3)
          })
        },
        {
          scale: withTiming(animScale.value, {
            duration: totalSpeed,
            easing: Easing.out(Easing.ease),
          })
        },
      ],
      opacity: withTiming(animOpacity.value, {
        duration: 0.98 * totalSpeed,
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

export default GenieCard
