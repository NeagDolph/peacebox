import React, {useMemo} from 'react';

import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import PageHeader from "../components/header";
import {colors} from "../config/colors";
import {Surface} from "react-native-paper";
import AudioSet from "./components/audio-set";

const audioData = require("./audio-files.json")


const AudioPage = () => {
  return (
    <>
      <PageHeader title={"Audio"}/>
      <ScrollView style={styles.container}>
        <View style={{paddingTop: 15, marginBottom: 100}}>
          {audioData.map((el, i) => <AudioSet key={i} set={el}/>)}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: -1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 24,
    paddingTop: 15,
  }
})

export default AudioPage;
