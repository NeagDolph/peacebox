import React, {useEffect} from 'react';

import {Dimensions, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {useSelector} from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import Animated, {Extrapolation, interpolate, useAnimatedStyle} from "react-native-reanimated";
import {colors} from "../../config/colors";
import PropTypes from 'prop-types'


const StartScreen = (props) => {
  const chevronStyles = useAnimatedStyle(() => {
    const opacity = interpolate(props.scrollOffset.value, [0, 60], [1, 0]);

    return {
      opacity
    }
  })

  return (<View style={styles.container}>
      <Animated.View style={[styles.iconContainer, chevronStyles]}>
        <Pressable onPress={props.scrollBottom}>
          <Icon name="chevron-thin-up" size={25}></Icon>
        </Pressable>
        <Text style={styles.disclaimer}>Practices conducted with PeaceBox are not a replacement for or a form of therapy, nor are they intended to cure, treat, or diagnose medical conditions.</Text>
      </Animated.View>
    </View>)
};

StartScreen.propTypes = {
  scrollBottom: PropTypes.func,
  scrollOffset: PropTypes.any,
}


const styles = StyleSheet.create({
  disclaimer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    color: colors.text,
    textAlign: "center",
    width: 350

  },
  iconContainer: {
    width: "100%",
    position: "absolute",
    bottom: 120,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    zIndex: -5,
  },
  container: {
    // padding: 20,
    width: "100%",
    height: Dimensions.get("window").height,
  }
})

export default StartScreen;
