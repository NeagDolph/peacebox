import React, {useCallback, useEffect, useRef, useState} from 'react';

import {ActivityIndicator, AppState, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PageHeader from "../../components/header";
import TimeHeader from "./components/time-header";
import ReanimatedArc from './components/ReanimatedArc';
import {Surface} from "react-native-paper";
import {colors} from "../../config/colors";
import RenderSequence from "./components/render-sequence";
import Icon from 'react-native-vector-icons/FontAwesome5';
import BreathingAnim from "./components/breathing-animation";
import {EasingNode} from "react-native-reanimated";
import FastImage from "react-native-fast-image";
import {useDispatch, useSelector} from "react-redux";
import {setStart} from "../../store/features/breathingSlice";
import TimeControls from "./components/time-controls";
import PrefersHomeIndicatorAutoHidden from "react-native-home-indicator";
import { useKeepAwake } from '@sayem314/react-native-keep-awake';

const Sound = require('react-native-sound');

Sound.setCategory('Playback');

const breatheText = ["Inhale", "Hold", "Exhale", "Hold"]

const PatternTime = ({route, navigation}) => {
  const {id} = route.params
  const patternData = useSelector(state => state.breathing.patterns[id]);
  const settings = useSelector(state => state.settings.breathing);
  const countInterval = useRef(null);

  useKeepAwake();

  const sequence = patternData.sequence;

  //Timing State
  const [cycleCount, setCycleCount] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0) // Index of current sequence
  const [sequenceTime, setSequenceTime] = useState(patternData.sequence[0]) // Seconds in current sequence index
  const [currentTime, setCurrentTime] = useState(0)
  const [takingBreak, setTakingBreak] = useState(false);
  const [patternCompletion, setPatternCompletion] = useState(0);
  const [countStart, setCountStart] = useState(Date.now());
  const [secondsPassed, setSecondsPassed] = useState(0)
  let pauseStart = useRef(0);

  const [paused, setPaused] = useState(false);
  const [title, setTitle] = useState(breatheText[0])

  //Audio State
  const audioFiles = useRef({})

  //Single calculation
  const cycleTime = useCallback(() => {
    const sequenceTime = sequence.reduce((o, e) => o + e, 0)
    const breakCount = Math.floor(patternData.totalDuration / patternData.settings.pauseFrequency)
    const breakTime = patternData.settings.breakBetweenCycles ? patternData.settings.pauseDuration * breakCount : 0
    return patternData.durationType === "Cycles" ? (sequenceTime * patternData.totalDuration) + breakTime : patternData.totalDuration * 60
  }, [])

  useEffect(() => {
    if (cycleCount === 1 && currentIndex === 0 && currentTime <= 1) {
      preloadAllAudio().then(() => playAudio("breathein.mp3"));
    }

    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        setPaused(true)
      }
    });


    return () => {
      dismountAudio();
      subscription.remove();
    }
  }, [])

  useEffect(() => {
    if (paused) {
      clearTimer()
      pauseStart.current = Date.now();
    } else {
      countInterval.current = setTimeout(() => {
        countStep();
      }, 1400)
      if (pauseStart.current > 0) {
        const pauseTime = Date.now() - pauseStart.current;
        setCountStart(time => time + pauseTime + 1000)
      }
    }

    return clearTimer;
  }, [paused]);

  useEffect(() => {
    if (secondsPassed <= 0) return;

    let intervalTime = 1000;

    if (["Inhale", "Exhale"].includes(title) && currentTime === 0) intervalTime = title === "Inhale" ? 1400 : 1200;

    if (!paused) countInterval.current = setTimeout(countStep, intervalTime);
  }, [secondsPassed])

  useEffect(() => {
    calcCompletion();

    if (currentTime + 1 >= 2 && currentTime + 1 <= sequenceTime && !takingBreak) playAudio(`${(currentTime + 1)}.mp3`);


    switch (patternData.durationType) { // Completion tests
      case "Cycles":
        if (cycleCount > patternData.totalDuration) completed();
        break;
      case "Minutes":
        const totalTime = patternData.totalDuration * 60
        if (secondsPassed > totalTime) completed();
        break;
    }

    if (sequenceTime === 0) {
      nextSequence();
      return;
    }

    if (currentIndex >= 4 && !takingBreak) nextCycle();
    else if (currentTime >= sequenceTime) nextSequence();


  }, [currentTime, cycleCount, sequenceTime])

  const preloadAllAudio = () => {
    return new Promise((res, rej) => {
      const audioFileNames = ["breathein.mp3", "breatheout.mp3", "hold.mp3", "relax.mp3", "1.mp3", "2.mp3", "3.mp3", "4.mp3", "5.mp3", "6.mp3", "7.mp3", "8.mp3", "9.mp3", "10.mp3", "11.mp3", "12.mp3"]

      audioFileNames.forEach((fileName) => {
        preloadAudio(fileName).then(audio => {
          audioFiles.current[fileName] = audio;

          if (fileName === audioFileNames[audioFileNames.length - 1]) res();
        }).catch(rej)
      })
    })
  }


  /*
  * Audio functions
  */
  const playAudio = (name) => {
    if (audioFiles.current[name]) audioFiles.current[name].setVolume(1).play();
  }

  const preloadAudio = (name) => {
    return new Promise((res, rej) => {
      let audio = new Sound(name, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          rej(error);
        }
        res(audio);
      });
    });
  }

  const dismountAudio = () => {
    Object.keys(audioFiles.current).forEach(key => {
      audioFiles.current[key].stop();
      audioFiles.current[key].release();
    })
  }


  /*
  * Timing functions
  */
  const patternBreak = () => {
    setTakingBreak(true)
    setTitle("Break");
    setCurrentTime(0)
    setSequenceTime(patternData.settings.pauseDuration)
    playAudio("relax.mp3")
  }
  const nextCycle = () => {
    setCycleCount(count => count + 1)
    setCurrentIndex(0)
    setTitle(breatheText[0]);
    setSequenceTime(sequence[0]);
    setCurrentTime(0);
    playAudio("breathein.mp3")
  }

  const nextSequence = () => {
    let nextIndex = currentIndex + 1
    let audioNames = ["breathein.mp3", "hold.mp3", "breatheout.mp3", "hold.mp3"];

    setCountStart(Date.now());

    if (nextIndex === 4 &&
      patternData.settings.breakBetweenCycles &&
      cycleCount % patternData.settings.pauseFrequency === 0 &&
      !takingBreak
    ) {
      patternBreak()
    } else {
      setTakingBreak(false)
      setCurrentIndex(nextIndex);
      setTitle(breatheText[nextIndex]);
      setSequenceTime(sequence[nextIndex]);
      setCurrentTime(0);
      playAudio(audioNames[nextIndex]);

    }
  }

  const countStep = () => {
    setCurrentTime(nextTime => nextTime + 1);

    setSecondsPassed(seconds => seconds + 1)
  }

  const clearTimer = () => {
    clearInterval(countInterval.current)
    countInterval.current = false;
  }

  /*
   Pause Functions
  */
  const togglePause = () => {
    if (paused) setPaused(false);
    else setPaused(true);
  }
  const exit = () => navigation.navigate("Patterns")
  const completed = () => {
    navigation.goBack();
    navigation.navigate("Completed", {id})
    dismountAudio();
  }

  /*
    Other
   */
  const calcCompletion = () => {
    // Completion tests
    if (patternData.durationType === "Cycles") {
      const totalTime = cycleTime();
      setPatternCompletion(secondsPassed / totalTime + 0.1);

    } else if (patternData.durationType === "Minutes") {
      const totalTime = (patternData.totalDuration * 60)
      setPatternCompletion((secondsPassed / totalTime) + 0.1)
    }
  }

  return (
    <View style={styles.container}>
      <PrefersHomeIndicatorAutoHidden/>
      <TimeHeader exit={exit}/>
      <RenderSequence style={styles.sequenceContainer} sequence={patternData.sequence} backgroundColor="white"/>
      <View style={styles.animationContainer}>
        <BreathingAnim
          sequenceTime={sequenceTime}
          currentIndex={currentIndex}
          currentTime={currentTime}
          countStart={countStart}
          secondsPassed={secondsPassed}
          settings={settings}
          paused={paused}
          title={title}
          baseSize={45}
          canvasSize={260}/>
      </View>

      <TimeControls
        patternCompletion={patternCompletion}
        togglePause={togglePause}
        paused={paused}
        cycleTime={cycleTime}
        countStart={countStart}
        cycleCount={cycleCount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sequenceContainer: {
    marginTop: 20
  },
  container: {
    paddingHorizontal: 30,
  },
  animationContainer: {
    width: "100%",
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default PatternTime;
