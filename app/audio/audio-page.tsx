import React, {useEffect, useMemo, useState} from 'react';

import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import PageHeader from "../components/header";
import {colors} from "../config/colors";
import {Surface} from "react-native-paper";
import AudioSet from "./components/audio-set";
import {getAudioList} from "../helpers/getAudioList";
import {useDispatch, useSelector} from "react-redux";


const AudioPage = () => {
  const audioData = useSelector(state => state.tapes.audioData)
  const dispatch = useDispatch()

  return (
    <>
      <PageHeader title={"Audio"} settingsButton={false}/>
      <ScrollView style={styles.container}>
        <View style={{paddingTop: 15, marginBottom: 100}}>
          {
            audioData !== false ?
              audioData.map((el, i) => <AudioSet key={i} set={el}/>) :
              <Text style={styles.loadingText}>Loading...</Text>
          }
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 20,
    color: colors.primary,
    textAlign: "center",
    width: "100%"
  },
  container: {
    zIndex: -1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 24,
    paddingTop: 15,
  }
})

export default AudioPage;
