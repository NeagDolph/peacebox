import React, {Props, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {withTheme, Surface, Title, Paragraph, Button, Chip} from "react-native-paper";
import {Image, ImageBackground, NativeSyntheticEvent, StyleSheet, Text, TextInput, View} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'

const WritingCard = (props: any) => {
  const inputRef = useRef<any>(null)
  const {content, setContent, handleLayout, editable, placeholder} = props

  const {colors} = props.theme

  const setContentHandle = (event) => {
    inputRef.current.setNativeProps({selection: {start: event.nativeEvent.text.length, end: event.nativeEvent.text.length}});
    setContent(event)
  }


  return (
    <Surface style={[styles.card, props.style]}>
      <ImageBackground style={styles.cardBackground} source={require("../../assets/paper.png")} imageStyle={{borderRadius: 8}}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#8A897C"
          multiline={true}
          autoCapitalize="none"
          autoCorrect={false}
          importantForAutofill="no"
          onChange={(event) => setContentHandle(event)}
          onContentSizeChange={handleLayout}
          autoFocus={false}
          keyboardType="ascii-capable"
          editable={editable}
          contextMenuHidden={true}
          // selection={{start: content.length, end: content.length}}
          ref={inputRef}
        >
          <Text style={styles.inputLine}>{content}</Text>
        </TextInput>
      </ImageBackground>
    </Surface>
  );
};

const styles = StyleSheet.create({
  cardBackground: {
    // position: "absolute",
    zIndex: 0,
    // width: "100%",
    resizeMode: "contain",
    paddingTop: 3,
    paddingLeft: 22,
    paddingRight: 10,
  },
  card: {
    backgroundColor: "transparent",
    height: 440,
    fontSize: 12,
    elevation: 4,
  },
  input: {
    width: "100%",
    height: "100%",
    fontSize: 14,
    lineHeight: 20
  },
  inputLine: {
    lineHeight: 20
  }
});


export default withTheme(WritingCard);
