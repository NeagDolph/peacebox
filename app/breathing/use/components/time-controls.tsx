import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ReanimatedArc from "./ReanimatedArc";
import {colors} from "../../../config/colors";
import Icon from "react-native-vector-icons/Ionicons";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ReanimatedArcBase from './ReanimatedArcBase';
import PropTypes from 'prop-types';
import Reanimated, {EasingNode} from 'react-native-reanimated';
import VolumeSlider from "./volume-slider";
import AnimatedArc from "./ReanimatedArcBase";

const TimeControls = (props) => {
  // const arcAngle = useRef(new Reanimated.Value(0));
  // const startTime = useRef(null);
  // const animation = useRef(null);

  // useEffect(() => {
  //   if (props.paused) {
  //     animation.current.stop();
  //     setLeftTime(time => time - (Date.now() - startTime.current) + 500);
  //   } else {
  //     animation.current = Reanimated.timing(arcAngle.current, {
  //       toValue: 180,
  //       easing: EasingNode.linear,
  //       duration: leftTime,
  //     })
  //     animation.current.start()
  //     startTime.current = Date.now();
  //   }
  // }, [props.paused])

  return (
    <View style={styles.controlsContainer}>
      <View style={styles.progressContainer}>
        <Text>{props.completionText}</Text>
      </View>
      <TouchableOpacity onPress={props.togglePause}>
        <View style={styles.pauseButton}>
          <Icon name={props.paused ? "play" : "pause"} size={28} color={colors.primary}/>
        </View>
        <View style={styles.arcContainer}>
          <ReanimatedArc
            color={colors.accent}
            diameter={76}
            width={6}
            arcSweepAngle={props.patternCompletion * 360}
            animationDuration={1000}
            lineCap="round"
          />
        </View>
      </TouchableOpacity>
      <VolumeSlider/>
    </View>
  );
}

const styles = StyleSheet.create({
  arcContainer: {
    position: "absolute",
    left: 1,
    bottom: 0,
    // width: 100
  },
  minValue: {
    position: "absolute",
    width: "50%",
    height: 6,
    top: 0,
    left: 0,
    backgroundColor: "black",
    borderRadius: 20
  },
  maxValue: {
    position: "absolute",
    width: "100%",
    height: 6,
    top: 0,
    left: 0,
    backgroundColor: "white",
    borderRadius: 20
  },
  progressBar: {
    width: 150,
    marginTop: 6
  },
  progressContainer: {
    width: 180,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  absolute: {
    position: "absolute"
  },
  pauseButton: {
    paddingVertical: 17,
    paddingHorizontal: 19,
    backgroundColor: "white",
    borderRadius: 50,
    borderColor: colors.background,
    borderWidth: 7,
  },
  controlsContainer: {
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginVertical: 80,
    // flex: 1,
    // width: 300
  },
})

TimeControls.propTypes = {
  patternCompletion: PropTypes.number,
  togglePause: PropTypes.func,
  paused: PropTypes.bool,
  cycleTime: PropTypes.func,
  cycleCount: PropTypes.number,
  completionText: PropTypes.string
}

export default TimeControls
