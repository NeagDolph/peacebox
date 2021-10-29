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

const WritingCard = (props: any) => {
  const inputRef = useRef<any>(null)
  const {content, setContent, handleLayout, editable, placeholder} = props
  const [lineHeight, setLineHeight] = useState(0)

  const setContentHandle = (event) => {
    setContent(event)
  }

  const cardLayout = ({nativeEvent: {layout}}) => {
    setLineHeight(layout.height / 18.9529614) // Constant for number of lines in the paper image
  }


  return (
    <Surface style={styles.card} onLayout={cardLayout}>
      <FastImage
        style={styles.imageStyle}
        source={require("../../assets/paper.png")}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8A897C"
        multiline={true}
        returnKeyType="done"
        autoCapitalize="none"
        autoCorrect={false}
        importantForAutofill="no"
        onChange={(event) => setContentHandle(event)}
        onContentSizeChange={props.handleLayout}
        autoFocus={false}
        keyboardType="default"
        editable={editable}
        contextMenuHidden={true}
        onSubmitEditing={Keyboard.dismiss}
        ref={inputRef}
      >
        <Text style={[styles.inputLine, {lineHeight}]}>{content}</Text>
      </TextInput>
      {props.children}
    </Surface>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: Dimensions.get("window").height * 0.547740584,
    width: Dimensions.get("window").height * 0.38,
    borderRadius: 8,
    top: 0,
    left: 0,
    position: "absolute"
  },
  card: {
    height: Dimensions.get("window").height * 0.547740584,
    width: Dimensions.get("window").height * 0.38,

    backgroundColor: "#f5f7ea",
    paddingTop: 3,
    paddingLeft: 22,
    borderRadius: 8,
    paddingRight: 10,
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
    top: -8,
    position: "relative"
  },
  inputLine: {
    alignItems: "stretch",
    top: -3
  }
});


export default withTheme(WritingCard);
