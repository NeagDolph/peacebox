import React, { useEffect, useMemo, useState } from "react";

import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../config/colors";
import Slider from "@react-native-community/slider";
import TrackPlayer, { State } from "react-native-track-player";
import PropTypes from "prop-types";

const SeekTime = (props) => {

  const [sliding, setSliding] = useState(false);
  const [slidingVal, setSlidingVal] = useState(0);
  const [showSliding, setShowSliding] = useState(false);

  const [slideWhilePlaying, setSlideWhilePlaying] = useState(false);

  useEffect(() => {
    props.setCurrentTime(props.progress.position)
    if (!sliding) {
      setShowSliding(false)
      setSlidingVal(props.progress.position)
    }
  }, [props.progress]);

  const formatTime = (time) => {
    const date = new Date(0);
    date.setSeconds(Math.max(time, 0)); // specify value for SECONDS here
    return date.toISOString().substr(11, 8).replace("00:", "");
  }

  const formattedPosition = useMemo(() => {
    return showSliding ? formatTime(slidingVal) : formatTime(props.currentTime)
  }, [props.currentTime, slidingVal, showSliding]);

  const seek = (data) => {
    setSlidingVal(data)
  }

  const slidingStart = async() => {
    setShowSliding(true)
    setSliding(true)

    const state = await TrackPlayer.getState();
    setSlideWhilePlaying(state === State.Playing)

    props.pauseAudio()
  }

  const slideComplete = () => {
    setSliding(false);
    props.setTime(slidingVal);
    if (slideWhilePlaying) props.playAudio()
    setSlideWhilePlaying(false)
  }

  return (
    <View style={styles.seekContainer}>
      <Text style={styles.seekTiming}>{formattedPosition} / {formatTime(props.progress.duration)}</Text>
      <Slider
        onValueChange={seek}
        onSlidingStart={slidingStart}
        onSlidingComplete={slideComplete}
        style={styles.slider}
        minimumValue={0}
        value={showSliding ? slidingVal : props.currentTime}
        maximumValue={props.progress.duration}
        step={0.01}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.text}
        thumbTintColor={colors.primary}
      />
    </View>
  );
};

SeekTime.propTypes = {
  progress: PropTypes.object,
  setTime: PropTypes.func,
  currentTime: PropTypes.number,
  setCurrentTime: PropTypes.func,
  pauseAudio: PropTypes.func,
  playAudio: PropTypes.func
}

const styles = StyleSheet.create({
  seekTiming: {
    textAlign: "center",
    fontFamily: "Avenir",
    fontSize: 18,
    color: colors.primary
  },
  seekContainer: {
    width: "100%",
    height: 40,
    marginVertical: 40,
    paddingHorizontal: 30,
    justifyContent: "center"
  },
  slider: {
    width: "100%",
    height: 40,
    color: colors.text,
  }
})

export default SeekTime;
