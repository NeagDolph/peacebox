import {Dimensions, StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import IconEntypo from "react-native-vector-icons/Entypo";
import React, {useEffect} from "react";
import {colors} from "../../config/colors";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import AnimatedArc from "../use/components/ReanimatedArcBase";

function Backplate(props: { height: number, dragX: any, dragMode: number, setDragMode: (number) => void }) {
  const bgColor = useSharedValue(colors.primary);

  useEffect(() => {
    const calcColor = [colors.text, colors.accent, colors.red][props.dragMode]

    bgColor.value = withTiming(calcColor, {
      duration: colors.dark ? 0 : 100,
      easing: Easing.linear
    })
  }, [props.dragMode])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: props.height - 1,
      backgroundColor: bgColor.value,
      transform: [
        {perspective: -300},
        {rotateY: props.dragX.value / 3 + 'deg'},
      ]
    }
  }, [props.height, props.dragMode])

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: props.dragX.value * 0.1}
      ]
    }
  })

  const editStyle = useAnimatedStyle(() => {
    return {
      height: props.height - 30,
      opacity: props.dragX.value,
      transform: [
        {translateX: Math.max(-props.dragX.value * 1.3, -34)}
      ],
    };
  })

  const deleteStyle = useAnimatedStyle(() => {
    return {
      height: props.height - 30,
      opacity: -props.dragX.value,
      transform: [
        {translateX: Math.min(-props.dragX.value * 1.3, 34)}
      ],
    };
  })

  return <Animated.View style={[styles.container, {height: props.height - 1}, containerStyle]}>
    <Animated.View style={[styles.backplate, animatedStyles]}>
    </Animated.View>
    <Animated.View style={[styles.editContainer, editStyle]}>
      {/*<Text style={[styles.edit, {fontWeight: props.dragMode !== 0 ? "500" : "800"}]}>Edit</Text>*/}
      <IconEntypo size={22} name="pencil" color={colors.background}/>
    </Animated.View>
    <Animated.View style={[styles.trashContainer, deleteStyle]}>
      <IconEntypo size={22} name="trash" color={colors.background}/>
    </Animated.View>
  </Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    width: (Dimensions.get('window').width - 84) / 2,
    zIndex: -100
  },
  editContainer: {
    width: 70,
    justifyContent: 'center',
    alignItems: "center",
    left: 20,
    position: "absolute",
    top: 10,
    zIndex: 1000
  },
  trashContainer: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    position: "absolute",
    top: 10,
    zIndex: 1000
  },
  edit: {
    fontFamily: "Avenir",
    fontWeight: "500",
    fontSize: 16,
    color: colors.background,
    textAlign: "center"
  },
  backplate: {
    width: (Dimensions.get('window').width - 84) / 2,
    backgroundColor: colors.text,
    borderRadius: 15,
    position: "absolute",
    top: 0,
    left: 0,
  },
})

export default Backplate
