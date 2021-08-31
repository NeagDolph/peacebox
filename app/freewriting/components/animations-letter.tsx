import {StyleSheet, View, Text, StyleSheetProperties, StyleProp} from "react-native";
import WritingCard from "./writing-card";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing, runOnJS
} from 'react-native-reanimated';
import * as React from "react";
import {useEffect, useLayoutEffect, useState} from "react";

interface LetterProps {
  letterContent: string;
  style: StyleProp<any>,
  complete: (id: string) => void,
  id: string
}

export const LetterBox = ({letterContent, style, complete, id}: LetterProps) => {
  const animX = useSharedValue(0);
  const animY = useSharedValue(0);
  const animOpacity = useSharedValue(1);
  const duration = useSharedValue(1);

  useEffect(() => {
    const radius = 50
    const degrees = (Math.random() * 90) + 180

    const angle = (degrees / (180 / Math.PI)); //Deg to rads

    animX.value = Math.cos(angle) * radius
    animY.value = Math.sin(angle) * radius
    animOpacity.value = 0.15
    // duration.value = (300 + (Math.random() * 400))
    duration.value = (400)

  }, [])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(animX.value, {
            duration: duration.value,
            easing: Easing.in(Easing.ease),
          }, () => runOnJS(complete)(id)) //Callback to remove letter
        },
        {
          translateY: withTiming(animY.value, {
            duration: duration.value - 10,
            easing: Easing.in(Easing.ease)
          })
        },
      ],
      opacity: withTiming(animOpacity.value, {
        duration: duration.value - 100,
        easing: Easing.circle
      })
    };
  });

  return (
    <Animated.View style={[style, animatedStyles]}>
      <Text style={{
        fontSize: 14
      }}>{letterContent}</Text>
    </Animated.View>
  );
}
