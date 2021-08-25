import React, {useState} from 'react';

import {withTheme, Surface, Title, Paragraph, Button, Chip} from "react-native-paper";
import {Image, ImageBackground, StyleSheet, Text, TextInput, View} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import {setHeight} from "../freewriteSlice"

const processSizeChange = (contentSize) => {
  console.log(contentSize.nativeEvent.contentSize.height)
}

const WritingCard = (props) => {
  const {content, setContent, handleLayout, editable} = props
  const dispatch = useDispatch()

  const {colors} = props.theme

  return (
    <Surface style={styles.card}>
      <ImageBackground style={styles.cardBackground} source={require("../../assets/paper.png")}>
        <TextInput
          style={styles.input}
          placeholder="Starting is the hardest part..."
          placeholderTextColor={colors.text}
          multiline={true}
          autoCapitalize="none"
          autoCorrect={false}
          importantForAutofill="no"
          onChange={(event) => setContent(event.nativeEvent.text)}
          onContentSizeChange={handleLayout}
          autoFocus={editable}
          clearTextOnFocus={true}
          keyboardType="ascii-capable"
          editable={editable}
          contextMenuHidden={true}
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
    backgroundColor: "#FCF4DA",
    height: 440,
    borderRadius: 15,
    fontSize: 12,
    elevation: 2
  },
  input: {
    width: "100%",
    height: "100%"
  },
  inputLine: {
    lineHeight: 20
  }
});


export default withTheme(WritingCard);
