import React, {Props, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {withTheme, Surface, Title, Paragraph, Button, Chip} from "react-native-paper";
import {
  Dimensions,
  Image,
  ImageBackground, Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux'
import FastImage from "react-native-fast-image";
import {NativeViewGestureHandler, State, TapGestureHandler} from "react-native-gesture-handler";
import FadeGradient from "../../components/fade-gradient";
import Animated from 'react-native-reanimated';

const WritingCard = (props: any) => {
  const {inputRef, content, setContent, handleLayout, editable, placeholder} = props
  const [lineHeight, setLineHeight] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)

  const tapRef = useRef(null)

  const cardLayout = ({nativeEvent: {layout}}) => {
    setLineHeight(layout.height / 18.9529614) // Constant for number of lines in the paper image
    setPageHeight(layout.width * 1.44142259) // Constant for paper image aspect ratio
    // setPageHeight(layout.width * 1.94142259) // Constant for paper image aspect ratio
    setPageWidth(layout.width)
  }

  const handleTap = (event) => {
    console.log('handle', event.nativeEvent.state)
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log("handle active")
      setContent("")
    } else if (event.nativeEvent.state = State.BEGAN && !inputRef.current.isFocused()) {
      inputRef.current.focus();
    }
  }

  const handleEvent = (event) => {
    console.log(event.nativeEvent)
  }

  return (
    <View style={[styles.card, {height: pageHeight}]} onLayout={cardLayout}>
      <FastImage
        style={[styles.imageStyle, {height: pageHeight, width: pageWidth}]}
        source={require("../../assets/paper.jpg")}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8A897C"
        multiline={true}
        autoCapitalize="none"
        autoCorrect={false}
        importantForAutofill="no"
        onChange={setContent}
        onContentSizeChange={props.handleLayout}
        autoFocus={false}
        keyboardType="default"
        editable={editable}
        ref={inputRef}
        contextMenuHidden={true}
      >
        <Text style={[styles.inputLine, {lineHeight}]}>{content}</Text>
      </TextInput>
      <TapGestureHandler onHandlerStateChange={handleTap} ref={tapRef} hitSlop={30} numberOfTaps={2}>
        <Animated.View
          style={{
            zIndex: 1,
            position: 'absolute',
            ...StyleSheet.absoluteFillObject,
          }}
        />
      </TapGestureHandler>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    // height: Dimensions.get("window").height * 0.547740584,
    // width: Dimensions.get("window").height * 0.38,
    borderRadius: 8,
    top: 0,
    left: 0,
    position: "absolute"
  },
  card: {
    // height: Dimensions.get("window").height * 0.547740584,
    // width: Dimensions.get("window").height * 0.38,
    width: "100%",

    backgroundColor: "#f5f7ea",
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
