import React, {useEffect, useState} from 'react';

import {Pressable, StyleSheet, Text, View} from 'react-native';
import PageHeader from "../../components/header";
import {setViewed} from "../../store/features/tapesSlice";
import {useDispatch} from "react-redux";
import TrackPlayer, {Event, State, useProgress, useTrackPlayerEvents} from "react-native-track-player";
import {colors} from "../../config/colors";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import PauseButton from "./components/pause-button";
import SeekTime from "./components/seek-time";
import VolumeSlider from "../../components/volume-slider";

const AudioPlayer = (props) => {
  const {trackData, set, tape, part, fileName, tapeName, partData} = props.route.params
  const dispatch = useDispatch()
  const progress = useProgress();

  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused] = useState(true);

  const events = [
    Event.PlaybackState,
    Event.PlaybackError,
  ];

  useTrackPlayerEvents(events, (event) => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      if (event.state === State.Paused || event.state === State.Stopped) setPaused(true);
      else if (event.state === State.Playing) setPaused(false)

      if (event.state === State.Stopped) audioEnded();
    }

  });




  const typeIcons = {
    "listen": <IconMaterial name="headphones" style={{paddingTop: 4}} size={25} color={colors.text}/>,
    "sleep": <IconMaterial name="sleep" size={30} color={colors.text}/>,
    "relax": <IconMaterial name="bed-queen-outline" size={32} color={colors.text}/>,
  }

  const typeDesc = {
    "listen": "Listen While Awake",
    "relax": "Listen with Eyes Closed",
    "sleep": "Play Audio before Sleeping"
  }

  useEffect(() => {
    TrackPlayer.add([trackData]);
    playAudio()
    setPaused(false)

    return () => { //unload
      audioEnded()
    }
  }, []);

  const playAudio = () => {
    TrackPlayer.play();
  }

  const pauseAudio = () => {
    TrackPlayer.pause();
  }

  const skipForward = () => {
    TrackPlayer.getPosition().then(pos => {
      TrackPlayer.seekTo(pos + 10);
      setCurrentTime(pos + 10)
    })
  }

  const skipBackwards = () => {
    TrackPlayer.getPosition().then(pos => {
      TrackPlayer.seekTo(pos - 10);
      setCurrentTime(pos - 10)
    })
  }

  const setTime = (time) => {
    TrackPlayer.seekTo(time);
  }

  const audioEnded = () => {
    TrackPlayer.reset();
    dispatch(setViewed({set, tape, part, viewed: true}));
  }


  return (
    <>
      <PageHeader title={trackData.artist} settingsButton={false}/>
      <View style={styles.container}>
        <Text style={styles.setTitle}>{set}</Text>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit={true}>{fileName}</Text>
        {tapeName !== fileName && <Text style={styles.subtitle}>{tapeName}</Text>}
        <View style={styles.listenTypeContainer}>
          {typeIcons[partData.type]}
          <Text style={styles.listenType}>{typeDesc[partData.type]}</Text>
        </View>
        <View style={styles.controlsContainer}>
          <Pressable style={styles.skipContainer} onPress={skipBackwards}>
            <IconMaterial name={"rewind-10"} color={colors.primary} size={40}/>
          </Pressable>
          <PauseButton paused={paused} pauseAudio={pauseAudio} playAudio={playAudio}/>
          <Pressable style={styles.skipContainer} onPress={skipForward}>
            <IconMaterial name={"fast-forward-10"} color={colors.primary} size={40}/>
          </Pressable>
        </View>
        <SeekTime
          progress={progress}
          setTime={setTime}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          playAudio={playAudio}
          pauseAudio={pauseAudio}
        />
        <View style={styles.volumeContainer}>
          <VolumeSlider/>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  volumeContainer: {
    paddingHorizontal: 60,
    marginTop: 20
  },
  skipContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25
  },
  controlsContainer: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    // flex: 1,
    justifyContent: "center",
    alignContent: "center"
  },
  listenType: {
    fontSize: 20,
    color: colors.text,
    fontFamily: "Baloo 2",
    fontWeight: "500",
    lineHeight: 32,
    marginLeft: 10,
  },
  listenTypeContainer: {
    flexDirection: "row",

    marginVertical: 40
  },
  setTitle: {
    fontSize: 15,
    color: colors.text,
    fontFamily: "Avenir",
    textAlign: "center"
  },
  title: {
    fontSize: 26,
    color: colors.primary,
    textAlign: "center",

    fontFamily: "Avenir",
  },
  subtitle: {
    fontSize: 19,
    textAlign: "center",

    color: colors.text,
    fontFamily: "Avenir",
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
