import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  EventSubscription,
  NativeSyntheticEvent,
  LayoutAnimation
} from 'react-native';
import WritingCard from "./components/writing-card";
import {ChangeEvent, useState} from "react";


const Freewriting = (props) => {
  const [animateVisible, setVisible] = useState(false);
  const [content, setContent] = useState("")
  const [animateContent, setAnimateContent] = useState("")

  const handleLayout = (event: NativeSyntheticEvent<any>) => {
    if (event.nativeEvent.contentSize.height >= 420) {
      setVisible(true);
      setAnimateContent(content);
      setContent("");
    }
  }

  return (
    <>
      <View style={styles.settings}></View>
      <View style={styles.container}>
        <WritingCard editable={true} handleLayout={handleLayout} content={content} setContent={setContent}/>
      </View>
      {
        animateVisible && ( <View style={styles.animatedCard}>
          <WritingCard content={animateContent} editable={false}/>
        </View>)
      }
    </>
  );
};

export default Freewriting;

const styles = StyleSheet.create({
  settings: {},
  container: {
    padding: 30,
    zIndex: 0,
  },
  animatedCard: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    padding: 30,
    transform: [
      {scale: 0.4},
    ]
  }
});
