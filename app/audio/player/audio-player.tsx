import React, { useEffect, useRef, useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../components/header";
import { setViewed } from "../../store/features/tapesSlice";
import { useDispatch, useSelector } from "react-redux";
import TrackPlayer, { Event, State, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import { colors } from "../../config/colors";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import PauseButton from "./components/pause-button";
import SeekTime from "./components/seek-time";
import VolumeSlider from "../../components/volume-slider";
import { RootState } from "../../store/store";

const AudioPlayer = props => {
  const currentAudio = useSelector((state: RootState) => state.tapes.currentlyPlaying);

  const {
    set,
    tapeNum: tape,
    tapeName,
    partData,
    part,
    artist,
    totalParts
  }: any = currentAudio;

  const dispatch = useDispatch();
  const progress = useProgress();

  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const beginTimeRef = useRef(Date.now());

  const [localViewed, setLocalViewed] = useState(false);

  const events = [Event.PlaybackState, Event.PlaybackError];

  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.', event);
    }
    if (event.type === Event.PlaybackState) {
      if (event.state === State.Paused || event.state === State.Stopped)
        setPaused(true);
      else if (event.state === State.Playing) setPaused(false);

      // if (event.state === State.Stopped) TrackPlayer.reset();
    }
  });

  const typeIcons = {
    listen: (
      <IconMaterial
        name="headphones"
        style={{paddingTop: 4}}
        size={25}
        color={colors.text}
      />
    ),
    sleep: <IconMaterial name="sleep" size={30} color={colors.text} />,
    relax: (
      <IconMaterial name="bed-queen-outline" size={32} color={colors.text} />
    ),
  };

  const typeDesc = {
    listen: 'Listen While Awake',
    relax: 'Listen with Eyes Closed',
    sleep: 'Play Audio before Sleeping',
  };

  // Page load
  useEffect(() => {
    beginTimeRef.current = Date.now();

    return () => {
      //unload
      TrackPlayer.reset();
    };
  }, []);

  // If audio is running for more than 50% of track time then mark audio as listened
  useEffect(() => {
    const msSinceStart = Date.now() - beginTimeRef.current;
    const msHalfTape = (progress.duration * 1000) / 2; //Total Milliseconds of audio tape divided by 2

    if (msSinceStart < 1000 || msHalfTape < 1000) return;

    if (msSinceStart > msHalfTape) {
      if (!localViewed) {
        confirmView();
        setLocalViewed(true);
      }
    }
  }, [progress]);

  const playAudio = () => {
    if (progress.duration - progress.position < 1) {
      TrackPlayer.seekTo(0);
    }
    TrackPlayer.play();
  };
  const pauseAudio = () => TrackPlayer.pause();

  const skipForward = () => {
    TrackPlayer.getPosition().then(pos => {
      setTime(pos + 10);
      setCurrentTime(pos + 10);
    });
  };

  const skipBackwards = () => {
    TrackPlayer.getPosition().then(pos => {
      setTime(pos - 10);
      setCurrentTime(pos - 10);
    });
  };

  const setTime = time => {
    if (Math.abs(time - currentTime) <= 1) {
      return;
    }

    if (!paused)
      TrackPlayer.play().then(() => {
        TrackPlayer.seekTo(time);
      });
    else TrackPlayer.seekTo(time);
  };

  const confirmView = () => {
    dispatch(setViewed({set: set?.name, tape, part, viewed: true}));
  };

  return (
    <>
      <PageHeader title={artist} settingsButton={false} />
      <View style={styles.container}>
        <Text style={styles.setTitle}>{set?.name}</Text>
        <Text
          style={styles.title}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          {tapeName}
        </Text>
        {totalParts >= 2 && (
          <Text style={styles.subtitle}>Part {'ABCDEFG'[part]}</Text>
        )}
        <View style={styles.listenTypeContainer}>
          {typeIcons[partData?.[part]?.type ?? 0]}
          <Text style={styles.listenType}>
            {typeDesc[partData?.[part]?.type]}
          </Text>
        </View>
        <View style={styles.controlsContainer}>
          <Pressable style={styles.skipContainer} onPress={skipBackwards}>
            <IconMaterial name={'rewind-10'} color={colors.primary} size={40} />
          </Pressable>
          <PauseButton
            paused={paused}
            pauseAudio={pauseAudio}
            playAudio={playAudio}
          />
          <Pressable style={styles.skipContainer} onPress={skipForward}>
            <IconMaterial
              name={'fast-forward-10'}
              color={colors.primary}
              size={40}
            />
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
          <VolumeSlider />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  volumeContainer: {
    paddingHorizontal: 60,
    marginTop: 20,
  },
  skipContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  controlsContainer: {
    marginTop: 40,
    width: '100%',
    flexDirection: 'row',
    // flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  listenType: {
    fontSize: 20,
    color: colors.text,
    fontFamily: 'Baloo 2',
    fontWeight: '500',
    lineHeight: 32,
    marginLeft: 10,
  },
  listenTypeContainer: {
    flexDirection: 'row',

    marginVertical: 40,
  },
  setTitle: {
    fontSize: 15,
    color: colors.text,
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
  title: {
    fontSize: 26,
    color: colors.primary,
    textAlign: 'center',

    fontFamily: 'Avenir',
  },
  subtitle: {
    fontSize: 19,
    textAlign: 'center',

    color: colors.text,
    fontFamily: 'Avenir',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    height: '100%',
    padding: 15,
    paddingTop: 50,
  },
});

export default AudioPlayer;
