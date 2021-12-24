import React, {useEffect, useRef, useState} from 'react';

import {Dimensions, PanResponder, Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import useAnimatedValue from "react-native-paper/lib/typescript/utils/useAnimatedValue";
import {colors} from "../../../config/colors";
import Slider from "@react-native-community/slider";
import SystemSetting from 'react-native-system-setting'
import Icon from "react-native-vector-icons/Ionicons";

const VolumeSlider = (props) => {
  const [volume, setVolume] = useState(0)

  useEffect(() => {
    SystemSetting.getVolume().then(vol => {
      setVolume(vol);
    });

    const volumeListener = SystemSetting.addVolumeListener((data) => {
      setVolume(data.value)
    });

    return () => {
      SystemSetting.removeVolumeListener(volumeListener)
    }
  }, [])

  const handleVolume = (vol) => {
    SystemSetting.setVolume(vol);
    setVolume(vol)
  }

  return (
    <View style={styles.container}>
      <Icon style={styles.icon} name="ios-volume-off" size={28} color={colors.primary}/>
      <Slider
        onValueChange={handleVolume}
        style={styles.slider}
        minimumValue={0}
        value={volume}
        maximumValue={1}
        step={0.01}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.primary}
        thumbTintColor={colors.accent}
      />
      <Icon style={styles.icon} name="ios-volume-high" size={28} color={colors.primary}/>
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: "100%",
    height: 40,
    color: colors.text,
  },
  icon: {
    width: 30,
    marginHorizontal: 3,
  },
  container: {
    width: "100%",
    height: 50,
    position: "relative",
    paddingHorizontal: 40,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  }
})

export default VolumeSlider;
