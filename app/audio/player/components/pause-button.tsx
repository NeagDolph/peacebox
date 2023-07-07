import React from 'react';

import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from "../../../config/colors";
import PropTypes from "prop-types";

import IconIonicons from "react-native-vector-icons/Ionicons";

const PauseButton = (props) => {
  const togglePause = () => {
    if (props.paused) props.playAudio();
    else props.pauseAudio();
  }

  return (
    <Pressable onPress={togglePause}>
      <View style={styles.buttonContainer}>
        {props.paused ?
          <IconIonicons name="play" color={colors.primary} size={70}/> :
          <IconIonicons name="md-pause" color={colors.primary} size={70}/>
        }
      </View>
    </Pressable>
  );
};

PauseButton.propTypes = {
  paused: PropTypes.bool,
  playAudio: PropTypes.func,
  pauseAudio: PropTypes.func
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background2,
    borderRadius: 200,
    borderWidth: 8,
    borderColor: colors.background3,
  }
})

export default PauseButton;
