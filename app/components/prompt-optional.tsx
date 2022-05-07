import React, {useState} from 'react';

import {Pressable, StyleSheet, Text, TextComponent, View} from 'react-native';
import {colors} from "../config/colors";
import {Surface} from "react-native-paper";
import PropTypes from "prop-types";
import IconIonicons from "react-native-vector-icons/Ionicons";

const PromptOptional = (props) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const containerLayout = ({nativeEvent}) => {
    console.log("HEUGHT", nativeEvent.layout.height)
    setContainerHeight(nativeEvent.layout.height);
  }

  const confirm = () => {
    props.close();
    props.callback();
  }


  return props.visible && (
    <View style={styles.container}>
      <Surface style={styles.prompt} onLayout={containerLayout}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{props.title ?? "hi"}</Text>
          <Text style={styles.subtitle}>{props.subtitle}</Text>
        </View>


        <Pressable style={styles.exitButton} onPress={props.close} hitSlop={20}>
          <IconIonicons name="close-circle-outline" size={28} color={colors.white}/>
        </Pressable>
        <View style={[styles.options, {top: 25}]}>
          <Pressable onPress={confirm}
                     style={[styles.optionButton, {borderRightColor: colors.text, borderRightWidth: 1}]}>
            <Text style={styles.optionText}>Okay</Text>
          </Pressable>
          <Pressable onPress={props.close}
                     style={[styles.optionButton, {borderLeftColor: colors.text, borderLeftWidth: 1}]}>
            <Text style={styles.optionText}>No Thanks</Text>
          </Pressable>
        </View>
      </Surface>
    </View>
  );
};

PromptOptional.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  callback: PropTypes.func,
  visible: PropTypes.bool,
  close: PropTypes.func,
}

const styles = StyleSheet.create({
  titleContainer: {
    // height: ,
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  title: {
    color: colors.opposite.primary,
    fontSize: 18,
    fontFamily: "baloo 2"
  },
  subtitle: {
    color: colors.opposite.text,
    fontSize: 16,
    fontFamily: "baloo 2"
  },
  optionButton: {
    // paddingHorizontal: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "50%",
    // width: "100%"
  },
  options: {
    flexDirection: "row",

    backgroundColor: colors.opposite.background4,

    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    top: 36,
    // alignItems: "stretch",
    alignSelf: "flex-end",
    // height: "100%"
    // justifyContent: "space-between",
  },
  exitButton: {
    position: "absolute",
    top: 4,
    right: 4
  },
  optionText: {
    color: colors.opposite.primary,
    fontSize: 18,
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "baloo 2"
  },
  container: {
    width: "100%",
    // height: 100,
    position: "absolute",
    bottom: 60,
    justifyContent: "center",
    alignContent: "stretch",
    paddingHorizontal: 40
  },
  prompt: {
    width: "100%",
    // backgroundColor: colors.background3,
    backgroundColor: colors.opposite.background3,
    borderRadius: 8,
    paddingBottom: 20,
    height: "100%",
  }
})

export default PromptOptional;
