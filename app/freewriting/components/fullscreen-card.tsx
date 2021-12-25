import React, {useRef, useState} from 'react';

import {Dimensions, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {colors} from "../../config/colors";
import {State, TapGestureHandler} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import haptic from "../../helpers/haptic";

const FullscreenCard = ({inputRef, content, setContent, handleLayout, editable, placeholder, activityBg, fullscreenValue, clearFull}) => {
  const [lineHeight, setLineHeight] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)

  const tapRef = useRef(null)

  const cardLayout = ({nativeEvent}) => {
    console.log("E", nativeEvent)

    const aspectRatio = nativeEvent.height / nativeEvent.width
    const newPageHeight = aspectRatio * Dimensions.get("window").width
    setPageHeight(newPageHeight)

    setLineHeight(newPageHeight / 37.9059228) // Constant for number of lines in the paper image
  }

  const handleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      clearFull();
      haptic(2)
    } else if (event.nativeEvent.state = State.BEGAN && !inputRef.current.isFocused()) {
      inputRef.current.focus();
    }
  }

  const gibberish = text => {
    const letterMap = "abcdefghijklmnopqrstuvwxyz";

    const chooseRandomLetter = () => {
      return letterMap[Math.floor(letterMap.length * Math.random())]
    }

    return text.split("").map(char => char.match(/[\.\ \,\_]{1}/) ? char : chooseRandomLetter()).join("")
  }

  return (
    <View style={[styles.card, {width: Dimensions.get("window").width, height: Dimensions.get("window").height}]}>
      <FastImage
        style={[styles.imageStyle, {width: Dimensions.get("window").width, height: pageHeight ?? 1000}]}
        source={colors.dark ? require("../../assets/dark/long_paper.png") : require("../../assets/long_paper.png")}
        resizeMode={FastImage.resizeMode.contain}
        // onLayout={cardLayout}
        onLoad={cardLayout}
      />
      <TextInput
        style={[styles.input, {lineHeight: lineHeight || 30}]}
        placeholder={placeholder}
        placeholderTextColor="#8A897C"
        selectionColor={colors.accent}
        multiline={true}
        autoCapitalize="none"
        importantForAutofill="no"
        onChange={setContent}
        onContentSizeChange={handleLayout}
        autoFocus={false}
        autoCorrect={false}
        keyboardType="default"
        editable={editable}
        ref={inputRef}
        contextMenuHidden={true}
        value={activityBg ? gibberish(content) : content}
      />
      <TapGestureHandler onHandlerStateChange={handleTap} ref={tapRef} hitSlop={30} numberOfTaps={2}>
        <Animated.View
          style={{
            zIndex: 1,
            position: 'absolute',
            ...StyleSheet.absoluteFillObject,
          }}
        />
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    borderRadius: 40,
    backgroundColor: "rgba(140, 120, 140, 0.2)",
    // width: 50,
    padding: 9,
    marginRight: 10,
    right: 0
  },
  background: {
    color: "#fff0",
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 10,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  imageStyle: {
    // height: Dimensions.get("window").height * 0.547740584,
    // width: Dimensions.get("window").height * 0.38,
    top:0,
    left: 0,
    position: "absolute"
  },
  card: {
    // height: Dimensions.get("window").height * 0.547740584,
    // width: Dimensions.get("window").height * 0.38,
    width: "100%",
    backgroundColor: colors.background,
    // paddingTop: 3,
    // paddingLeft: "7%",
    // paddingRight: 10,
    fontSize: 12,
    // overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.7)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.35,
    shadowRadius: 4.4,

    elevation: 2,
  },
  input: {
    width: "100%",
    height: "100%",
    fontSize: 16,
    lineHeight: 20,
    color: colors.primary,
    paddingLeft: "7%",
    paddingRight: 10,
    top: -6,
    position: "relative"
  },
  inputLine: {
    alignItems: "stretch",
    top: -3
  }
})

export default FullscreenCard;
