import React, {Props, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {withTheme, Surface, Title, Paragraph, Button, Chip} from "react-native-paper";
import {
  Dimensions,
  Image,
  ImageBackground,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux'

const WritingCard = (props: any) => {
  const inputRef = useRef<any>(null)
  const {content, setContent, handleLayout, editable, placeholder} = props

  const {colors} = props.theme

  const setContentHandle = (event) => {
    setContent(event)
  }


  return (
    <Surface style={styles.card}>
      <ImageBackground imageStyle={{borderRadius: 8}} style={styles.cardBackground} source={require("../../assets/paper.png")} force-cache="force-cache">
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
          onContentSizeChange={handleLayout}
          autoFocus={false}
          keyboardType="default"
          editable={editable}
          contextMenuHidden={true}
          // selection={{start: content.length, end: content.length}}
          ref={inputRef}
        >
          <Text style={[styles.inputLine, {lineHeight: Dimensions.get("window").height * 0.029}]}>{content}</Text>
        </TextInput>
      </ImageBackground>
      {props.children}
    </Surface>
  );
};

const styles = StyleSheet.create({
  cardBackground: {
    zIndex: 0,
    lineHeight: Dimensions.get("window").height * 0.0296,
    borderRadius: 8,
    height: Dimensions.get("window").height * 0.55,
    width: Dimensions.get("window").width * 0.793933052,
    resizeMode: 'contain',
    borderWidth: 0,
    paddingTop: 3,
    paddingLeft: 22,
    paddingRight: 10,
    backgroundColor: "#f5f7ea",
  },
  card: {
    backgroundColor: "transparent",
    height: Dimensions.get("window").height * 0.55,
    width: Dimensions.get("window").width * 0.793933052,
    padding: 0,
    paddingTop: 0,
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
  },
  inputLine: {
    alignItems: "stretch",
    top: -3
  }
});


export default withTheme(WritingCard);
