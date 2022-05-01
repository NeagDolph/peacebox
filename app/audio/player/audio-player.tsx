import React, {useEffect, useState} from 'react';

import {StyleSheet, Text, View} from 'react-native';
import PageHeader from "../../components/header";
import {setViewed} from "../../store/features/tapesSlice";
import {useDispatch} from "react-redux";
import TrackPlayer, {useProgress} from "react-native-track-player";
import {colors} from "../../config/colors";

const AudioPlayer = (props) => {
  const {trackData, set, tape, part, fileName, tapeName} = props.route.params
  const dispatch = useDispatch()
  const progress = useProgress();

  const [paused, setPaused] = useState(true);

  useEffect(() => {
    TrackPlayer.add([trackData]);

    return () => { //unload
      TrackPlayer.reset();

      dispatch(setViewed({set, tape, part, viewed: true}));
    }
  }, []);

  const playAudio = () => {
    setPaused(false);
    TrackPlayer.play();
  }

  const pauseAudio = () => {
    setPaused(false);
    TrackPlayer.pause();
  }


  return (
    <>
      <PageHeader title={"Audio"}/>
      <View style={styles.container}>
        <Text style={styles.setTitle}>{set}</Text>
        <Text style={styles.title}>{fileName}</Text>
        {tapeName !== fileName && <Text style={styles.subtitle}>{tapeName}</Text>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  setTitle: {
    fontSize: 13,
    color: colors.text,
    fontFamily: "Avenir",
  },
  title: {
    fontSize: 24,
    color: colors.primary,

    fontFamily: "Avenir",
  },
  subtitle: {
    fontSize: 15
  },
  container: {
    width: "100%",
    alignItems: "center",
    height: "100%",
    padding: 15,
    paddingTop: 50,
  }
})

export default AudioPlayer;
