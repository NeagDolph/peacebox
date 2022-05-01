import React, {useEffect, useState} from 'react';
import {LayoutAnimation, Pressable, StyleSheet, Text, View} from "react-native";
import {Surface} from "react-native-paper";
import PropTypes from 'prop-types'
import {colors} from "../../config/colors";
import AudioPage from "../audio-page";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
  concat
} from "react-native-reanimated";
import createAnimatedComponent from "react-native-reanimated";
import IconEntypo from "react-native-vector-icons/Entypo";
import AudioSetFiles from "./audio-set-files";

const AudioSet = (props) => {

  const filesLength = (audioSet) => audioSet.files.reduce((tot, el) => tot + el.parts.length, 0)

  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(last => !last)



  const [contentHeight, setContentHeight] = useState(0)
  const layoutContent = ({nativeEvent}) => {
    console.log(nativeEvent.layout.height)
    setContentHeight(nativeEvent.layout.height + 105)
    openHeightValue.value = nativeEvent.layout.height + 105
  }


  useEffect(() => {
    openValue.value = open ? 1 : 0

    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [open])

  const openValue = useSharedValue(0)
  const openHeightValue = useSharedValue(0)

  const heightStyle = useAnimatedStyle(() => {
    const heightValue = interpolate(openValue.value, [0, 1], [72, openHeightValue.value], {});
    return {
      height: withTiming(heightValue, {
        duration: 350,
        easing: Easing.ease,
      }),
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(openValue.value, [0, 1], [0, 90], { extrapolateRight: "clamp" });

    return {
      transform: [
        {
          rotateZ: withTiming(rotateValue + "deg", {
            duration: 250,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        }
      ]
    }
  })

  return (

    <Animated.View style={[styles.animatedContainer, heightStyle]}>
      <Surface style={styles.audioSet} key={props.set.name}>
        <View style={styles.topContainer}>

          <Pressable style={{width: "100%", flexDirection: "row"}} onPress={toggleOpen}>
            <View style={{justifyContent: "center"}}>
              <View style={styles.setIcon}></View>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>{props.set.name}</Text>
              <Text style={styles.subtitle}>{filesLength(props.set)} Tapes</Text>
            </View>
            <View style={styles.openButtonContainer}>
              <Animated.View style={[styles.openButton, buttonStyle]}>
                <IconEntypo size={22} name="chevron-right" color={colors.text}/>
              </Animated.View>
            </View>
          </Pressable>
        </View>
        <View style={styles.audioContainer} >
          <AudioSetFiles files={props.set.files} layout={layoutContent} setTitle={props.set.name}/>
        </View>
      </Surface>
    </Animated.View>
  );
};

AudioSet.propTypes = {
  set: PropTypes.object
}

const styles = StyleSheet.create({
  openButtonContainer: {
    justifyContent: "center",
    marginRight: 5,
  },
  openButton: {
    padding: 6,
    backgroundColor: colors.background3,
    borderRadius: 50
  },
  animatedContainer: {
    marginTop: 15,
    overflow: "hidden",
    // flex: 1,
    padding: 3,
  },
  audioContainer: {
    // height: 260,
    marginTop: 20,
    // flex: 1,
    width: "100%",
  },
  topContainer: {
    flexDirection: "row",
    height: 40
  },
  audioOpen: {
    height: 300
  },
  audioSet: {
    flex: 1,
    minHeight: 65,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "column",
    elevation: 2,
    marginBottom: 0
  },
  setIcon: {
    backgroundColor: "#71A8FA",
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  titleContainer: {
    flexDirection: "column",
    paddingLeft: 16,
    width: "100%",
    height: 42,
    paddingRight: "100%",
    flex: 1,
    justifyContent: "space-around",
    paddingRight: 4
  },
  title: {
    fontFamily: "Roboto",
    fontSize: 18,
    // lineHeight: 26,
    // maxWidth: 200,
    color: colors.primary,
    paddingRight: 10,
    marginTop: 0,
    // flex: 0
    // lineHeight: 18,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,

    color: colors.text,
    fontFamily: "Baloo 2"
  }
})
export default AudioSet;
