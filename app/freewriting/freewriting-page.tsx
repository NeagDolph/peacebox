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


const handleLayout = (event: NativeSyntheticEvent<any>) => {
  if (event.nativeEvent.contentSize.height >= 420) {

  }
}

const Freewriting = (props) => {
  const [nextCard, setNextCard] = useState(true);
  return (
    <>
      <View style={styles.animatedCard} >
        <WritingCard editable={false}/>
      </View>
      <View style={styles.settings}></View>
      <View style={styles.container}>
        <WritingCard handleLayout={handleLayout}/>
      </View>
    </>
  );
};

export default Freewriting;

const styles = StyleSheet.create({
  settings: {},
  container: {
    padding: 30,
  },
  animatedCard: {
    transform: [
      {scale: 0.4},
    ]
  }
});
