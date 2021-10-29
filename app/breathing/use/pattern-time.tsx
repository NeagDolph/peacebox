import React, {useCallback, useEffect, useRef, useState} from 'react';

import {ActivityIndicator, AppState, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TimeHeader from "./components/time-header";
import RenderSequence from "./components/render-sequence";
import BreathingAnim from "./components/breathing-animation";
import {useDispatch, useSelector} from "react-redux";
import {setStart} from "../../store/features/breathingSlice";
import TimeControls from "./components/time-controls";
import PrefersHomeIndicatorAutoHidden from "react-native-home-indicator";
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import {pattern} from "../../helpers/haptic"
import crashlytics from '@react-native-firebase/crashlytics';
import Sound from "react-native-sound"

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
  const [completionText, setCompletionText] = useState("");
  const [secondsPassed, setSecondsPassed] = useState(0)

  const [paused, setPaused] = useState(false);
  const [title, setTitle] = useState(breatheText[0])

  //Audio State
  const audioFiles = useRef({})

  //On component loaded
  useEffect(() => {
    calcCompletion();

    crashlytics().log("Page Opened: Pattern timer")

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
    } else {
      countInterval.current = setTimeout(() => {
        countStep();
      }, 1400)
    }
    return clearTimer;
  }, [paused]);

  useEffect(() => {
    calcCompletion();

    if (secondsPassed <= 0) return;

    let intervalTime = 1000;

    if ([1,3].includes(currentIndex) && currentTime + 1 === sequenceTime) intervalTime = 1300;

    if (!paused) countInterval.current = setTimeout(countStep, intervalTime);
  }, [secondsPassed])

  useEffect(() => {
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
        }).catch(err => {
          crashlytics().log("Error: failed to load timer audio")
          crashlytics().recordError(err)
          rej(err)
        })
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
          crashlytics().log("Failed to load sound: " + name)
          crashlytics().recordError(error);
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
      pattern(2, 400, 2)

    }
  }

  const countStep = () => {
    setSecondsPassed(seconds => seconds + 1)
    setCurrentTime(nextTime => nextTime + 1);
  }

  const clearTimer = () => {
    clearInterval(countInterval.current)
    countInterval.current = false;
  }

  /*
   Pause Functions
  */
  const togglePause = () => {
    crashlytics().log("Timer toggled pause state: " + !paused)
    if (paused) setPaused(false);
    else setPaused(true);
  }

  const exit = () => navigation.navigate("Patterns")

  const completed = () => {
    crashlytics().log("Pattern timer completed | ID: " + id)
    navigation.goBack();
    navigation.navigate("Completed", {id})
    dismountAudio();
  }

  /*
    Other
   */
  const formatSeconds = (seconds) => {
    const timeString = new Date(null, null, null, null, null, seconds).toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0]
    const timeFormat = timeString // Remove extra 0's and :'s
      .replace(/^00\:00\:/g, "0:")
      .replace(/^00\:0?/g, "")
      .replace(/^0(?!:)/, "")

    return timeFormat
  }

  const calcCompletion = () => {
    // Completion tests
    if (patternData.durationType === "Cycles") {
      const completedCycles = cycleCount - 1
      setPatternCompletion(completedCycles / patternData.totalDuration);
      setCompletionText(`${completedCycles} / ${patternData.totalDuration} Cycles`)
    } else if (patternData.durationType === "Minutes") {
      const totalTime = (patternData.totalDuration * 60)
      setPatternCompletion(secondsPassed / totalTime)
      setCompletionText(`${formatSeconds(secondsPassed)} / ${formatSeconds(totalTime)}`);
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
          secondsPassed={secondsPassed}
          settings={settings}
          paused={paused}
          title={title}
          baseSize={45}
          canvasSize={260}/>
      </View>

      <TimeControls
        patternCompletion={patternCompletion}
        completionText={completionText}
        togglePause={togglePause}
        paused={paused}
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
