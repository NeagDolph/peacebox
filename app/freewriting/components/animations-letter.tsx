import {StyleSheet, View, Text, StyleSheetProperties, StyleProp} from "react-native";
import WritingCard from "./writing-card";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing, runOnJS, useDerivedValue, interpolateColor
} from 'react-native-reanimated';
import * as React from "react";
import {useEffect, useLayoutEffect, useState} from "react";
import {useSelector} from "react-redux";

interface LetterProps {
  letterContent: string;
  style: StyleProp<any>,
  complete: (id: string) => void,
  id: string
}

const LetterBox = ({letterContent, style, complete, id}: LetterProps) => {
  const animX = useSharedValue(0);
  const animY = useSharedValue(0);
  const animOpacity = useSharedValue(1);
  const animColor = useSharedValue("#000000");
  const duration = useSharedValue(1);

  const toColor = useSelector(state => state.background.textColor)

  useEffect(() => {
    const radius = 50
    const degrees = (Math.random() * 90) + 180

    const angle = (degrees / (180 / Math.PI)); //Deg to rads

    animX.value = Math.cos(angle) * radius
    animY.value = Math.sin(angle) * radius
    animOpacity.value = 0.15
    animColor.value = toColor
    duration.value = 300 + (Math.random() * 200)

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
      }),
    };
  });

  const animatedColor = useAnimatedStyle(() => {
    return {
      color: withTiming(animColor.value, {
        duration: duration.value - 250,
        easing: Easing.linear
      })
    }
  })

  return (
    <Animated.View style={[style, animatedStyles]}>
      <Animated.Text style={[styles.innerText, animatedColor]}>{letterContent}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  innerText: {
    fontSize: 14
  }
})

export default LetterBox
