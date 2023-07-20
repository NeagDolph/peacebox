import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReanimatedArc from "./ReanimatedArc";
import { colors } from "../../../config/colors";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import PropTypes from "prop-types";
import { interpolate } from "react-native-reanimated";
import VolumeSlider from "../../../components/volume-slider";

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
        <Text style={styles.completionText}>{props.completionText}</Text>
      </View>
      <TouchableOpacity onPress={props.togglePause}>
        <View style={styles.pauseButton}>
          <Icon name={props.paused ? "play" : "pause"} size={28} color={colors.primary}/>
        </View>
        <View style={styles.arcContainer}>
          {Platform.OS === "ios" && <ReanimatedArc
            color={colors.accent}
            diameter={76}
            width={6}
            arcSweepAngle={props.patternCompletion * 360}
            animationDuration={1000}
            lineCap="round"
          />}
        </View>
      </TouchableOpacity>
      <View style={styles.volumeContainer}>
        <VolumeSlider/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  volumeContainer: {
    paddingHorizontal: 40,
    marginTop: 20
  },
  completionText: {
    color: colors.primary
  },
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
    backgroundColor: colors.black,
    borderRadius: 20
  },
  maxValue: {
    position: "absolute",
    width: "100%",
    height: 6,
    top: 0,
    left: 0,
    backgroundColor: colors.white,
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
    backgroundColor: colors.background2,
    borderRadius: 50,
    borderColor: Platform.OS === "android" ? colors.accent : colors.background3,
    borderWidth: 6
  },
  controlsContainer: {
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginVertical: interpolate(Dimensions.get("window").height, [650, 900], [0, 60], {
      extrapolateRight: "extend",
      extrapolateLeft: "clamp"
    }),
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
