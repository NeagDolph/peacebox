import React, {Props, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {withTheme, Surface, Title, Paragraph, Button, Chip} from "react-native-paper";
import {
  Dimensions,
  Image,
  ImageBackground, Keyboard,
  NativeSyntheticEvent, Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux'
import FastImage from "react-native-fast-image";
import {NativeViewGestureHandler, State, TapGestureHandler} from "react-native-gesture-handler";
import FadeGradient from "../../components/fade-gradient";
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import haptic from "../../helpers/haptic";
import {BlurView, VibrancyView} from "@react-native-community/blur";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {colors} from "../../config/colors";
import createAnimatedComponent = module

const WritingCard = ({clearFull, inputRef, content, setContent, handleLayout, editable, placeholder, activityBg, fullscreen, children}) => {
  const [lineHeight, setLineHeight] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)

  const tapRef = useRef(null)

  const cardLayout = ({nativeEvent: {layout}}) => {
    const lineConstant = fullscreen ? 37.9059228 : 18.9529614 // Constant for number of lines in the paper image
    const aspectRatio = fullscreen ? 2.88284518 : 1.44142259 // Constant for paper image height/width

    setLineHeight(layout.height / lineConstant)
    setPageHeight(layout.width * aspectRatio)

    setPageWidth(layout.width)
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

  const calcImageSource = () => {
    if (colors.dark) {
      return fullscreen ? require("../../assets/dark/long_paper.png") : require("../../assets/dark/paper.png")
    } else {
      return fullscreen ? require("../../assets/long_paper.png") : require("../../assets/paper.jpg")
    }
  }


  return (
    <>
      <View style={[styles.card, {height: pageHeight, shadowRadius: fullscreen ? 0 : 4.4,}]} onLayout={cardLayout}>
        <FastImage
          style={[styles.imageStyle, {height: pageHeight, width: pageWidth, borderRadius: fullscreen ? 0 : 8}]}
          source={calcImageSource()}
          resizeMode={FastImage.resizeMode.cover}
        />
        <TextInput
          style={[styles.input, {lineHeight: lineHeight || 10, fontSize: fullscreen ? 16 : 14}]}
          placeholder={placeholder}
          placeholderTextColor="#8A897C"
          multiline={true}
          autoCapitalize="none"
          importantForAutofill="no"
          onChange={setContent}
          onContentSizeChange={handleLayout}
          autoFocus={false}
          autoCorrect={false}
          keyboardType="default"
          editable={editable}

          selectionColor={colors.accent}
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
      {children}
      </>
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
  headerContainer: {
    zIndex: 10,
    // width: "100%",
    // justifyContent: "flex-end",
    // flexDirection: "column",
    position: "absolute",
    top: 10,
    right: 0,
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
    top: 0,
    left: 0,
    position: "absolute"
  },
  card: {
    // height: Dimensions.get("window").height * 0.547740584,
    // width: Dimensions.get("window").height * 0.38,
    width: "100%",

    backgroundColor: colors.dark ? colors.background2 : "#f5f7ea",
    paddingTop: 3,
    // paddingLeft: "7%",
    borderRadius: 8,
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
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: "7%",
    color: colors.primary,
    paddingRight: 10,
    top: -8,
    position: "relative"
  },
  inputLine: {
    alignItems: "stretch",
    top: -3
  }
});


export default WritingCard;
