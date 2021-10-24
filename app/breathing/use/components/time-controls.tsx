import {StyleSheet, TouchableOpacity, View} from "react-native";
import ReanimatedArc from "./ReanimatedArc";
import {colors} from "../../../config/colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ReanimatedArcBase from './ReanimatedArcBase';
import PropTypes from 'prop-types';
import Reanimated, {EasingNode} from 'react-native-reanimated';

const TimeControls = (props) => {
  const arcAngle = useRef(new Reanimated.Value(0));
  const startTime = useRef(null);
  const animation = useRef(null);
  const cycleTime = useCallback(() => props.cycleTime() * 1000, [props.cycleTime])
  const [leftTime, setLeftTime] = useState(cycleTime())

  useEffect(() => {

    if (props.paused) {
      animation.current.stop();
      setLeftTime(time => time - (Date.now() - startTime.current) + 500);
    } else {
      animation.current = Reanimated.timing(arcAngle.current, {
        toValue: 180,
        easing: EasingNode.linear,
        duration: leftTime,
      })
      animation.current.start()
      startTime.current = Date.now();
    }
  }, [props.paused])

  return <View style={styles.controlsContainer}>
    <View style={styles.progressContainer}>
      <ReanimatedArc
        color={colors.placeholder}
        diameter={180}
        width={16}
        arcSweepAngle={180}
        rotation={-90}
        animationDuration={0}
        lineCap="round"
        style={styles.absolute}
      />
      <ReanimatedArcBase
        color={colors.accent}
        diameter={180}
        width={16}
        arcSweepAngle={arcAngle.current}
        lineCap="round"
        rotation={-90}
        style={styles.absolute}
      />
    </View>
    <TouchableOpacity onPress={props.togglePause}>
      <View style={styles.pauseButton}>
        <Icon name={props.paused ? "play" : "pause"} size={28} color={colors.primary}/>
      </View>
    </TouchableOpacity>
  </View>;
}

TimeControls.propTypes = {
  patternCompletion: PropTypes.number,
  togglePause: PropTypes.func,
  paused: PropTypes.bool,
  cycleTime: PropTypes.func,
  countStart: PropTypes.any,
  cycleCount: PropTypes.number
}

const styles = StyleSheet.create({
  progressContainer: {
    // justifyContent: "center",
    // position: "relative",
    width: 180,
    height: 35,
  },
  absolute: {
    position: "absolute"
  },
  pauseButton: {
    padding: 18,
    backgroundColor: "white",
    borderRadius: 50,
    borderColor: colors.background2,
    borderWidth: 7,
  },
  controlsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginVertical: 80,
    // flex: 1,
    // width: 300
  },
})

export default TimeControls
