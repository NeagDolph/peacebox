import React, {useEffect, useMemo, useState} from 'react';

import {Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import PageHeader from "../components/header";
import {colors} from "../config/colors";
import {Surface} from "react-native-paper";
import AudioSet from "./components/audio-set";
import {getAudioList} from "../helpers/getAudioList";
import {useDispatch, useSelector} from "react-redux";
import Fade from "../components/fade-wrapper";
import DisclaimerModal from "./components/disclaimer-modal";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconIonicons from "react-native-vector-icons/Ionicons";


const AudioPage = () => {
  const audioData = useSelector(state => state.tapes.audioData)
  const favorites = useSelector(state => state.tapes.favorites)
  const dispatch = useDispatch()

  const [disclaimerVisible, setDisclaimerVisible] = useState(false);


  const favoriteSets = useMemo(() => {
    return audioData.filter(el => favorites.includes(el.name))
  }, [favorites, audioData]);

  return (
    <>
      <PageHeader title={"Audio"} settingsButton={false}/>
      <ScrollView style={styles.container}>
        <Pressable style={styles.disclaimerButtonContainer} onPress={() => setDisclaimerVisible(true)}>
          <View style={styles.disclaimerButton}>
            <IconMaterial name="alert-box-outline" size={25} color={colors.primary}/>
            <Text style={styles.disclaimerButtonText}>Disclaimer</Text>
          </View>
        </Pressable>

        <View style={{paddingTop: 0, marginBottom: 40}}>
          {
            favoriteSets.length >= 1 &&
            <>
              <Text style={styles.sectionTitle}>Favorites</Text>
              {favoriteSets.map((el, i) => <AudioSet key={i} set={el}/>)}
            </>
          }
        </View>

        <View style={{paddingTop: 0, marginBottom: 100}}>
          <Text style={styles.sectionTitle}>All Sets</Text>
          {
            audioData !== false ?
              audioData.map((el, i) => <AudioSet key={i} set={el} setIndex={i}/>) :
              <Text style={styles.loadingText}>Loading...</Text>
          }
        </View>
      </ScrollView>
      <DisclaimerModal disclaimerVisible={disclaimerVisible} setDisclaimerVisible={setDisclaimerVisible}/>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 30,
    marginLeft: 10,
    color: colors.primary,
    fontFamily: "avenir"
  },
  disclaimerButtonContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 10,
  },
  disclaimerButton: {
    flexDirection: "row",
    borderRadius: 5,
    paddingVertical: 4,
    width: "auto",
    marginTop: 20,
    paddingHorizontal: 10,
    right: 0,
    backgroundColor: colors.background3
  },
  disclaimerButtonText: {
    fontSize: 19,
    lineHeight: 28,
    marginLeft: 4,
    fontFamily: "baloo 2",
    color: colors.primary
  },
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
    paddingTop: 30,
  }
})

export default AudioPage;
