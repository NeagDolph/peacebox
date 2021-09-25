import React, {useCallback, useEffect, useRef, useState} from 'react';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PageHeader from "../../components/header";
import {useSelector} from "react-redux";
import TimeHeader from "./components/time-header";
import {Surface} from "react-native-paper";
import {colors} from "../../config/colors";
import RenderSequence from "./components/render-sequence";
import Icon from 'react-native-vector-icons/FontAwesome5';
import BreathingAnim from "./components/breathing-animation";

const breatheText = ["Inhale", "Hold", "Exhale", "Hold"]


const PatternTime = ({route, navigation}) => {
  const {id} = route.params
  const patternData = useSelector(state => state.breathing.patterns[id]);
  const countInterval = useRef(null);
  const pauseTimeout = useRef(null);

  const sequence = patternData.sequence;

  //Timing State
  const [cycleCount, setCycleCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0) // Index of current sequence
  const [sequenceTime, setSequenceTime] = useState(patternData.sequence[0]) // Seconds in current sequence index
  const [currentTime, setCurrentTime] = useState(-1)

  //
  const [paused, setPaused] = useState(false);

  const [title, setTitle] = useState(breatheText[0])

  useEffect(() => {
    if (paused) clearTimer();
    else countStep();

    return clearTimer;
  }, [paused]);

  useEffect(() => {
    (async () => {
      // if (currentIndex >= 5 || (currentIndex >= 4 && !patternData.settings.breakBetweenCycles)) await nextCycle();
      // else if (currentTime >= sequenceTime) await nextSequence();
    })();
  }, [currentTime])


  /*
    Timing functions
   */
  // const countSequence = async () => {
  //   for (let i in sequence) {
  //     setCurrentIndex(parseInt(i))
  //     setTitle(breatheText[i]);
  //     await waitCount(sequence[parseInt(i)]);
  //   }
  //
  //   if (patternData.settings.breakBetweenCycles &&
  //     cycleCount % patternData.settings.pauseFrequency === 0) {
  //     setCurrentIndex(4)
  //     await patternBreak(patternData.settings.pauseDuration);
  //   }
  //
  //   setCycleCount(count => count + 1)
  //
  //   return;
  // }

  const patternBreak = async () => {
    setCurrentIndex(i => i + 1)
    setTitle("Break");
    setCurrentTime(0)
    setSequenceTime(patternData.settings.pauseDuration)
  }

  const nextCycle = () => {
    setCycleCount(count => count + 1)
    setCurrentIndex(0)
    setTitle(breatheText[0]);
    setSequenceTime(sequence[0]);
    setCurrentTime(0);
  }

  const nextSequence = () => {

    setCurrentIndex(index => {
      const nextIndex = index + 1

      console.log("next", index, nextIndex);

      if (index === 3 &&
        patternData.settings.breakBetweenCycles &&
        cycleCount % patternData.settings.pauseFrequency === 0
      ) {
        patternBreak();
        return index;
      } else {
        console.log("reset")
        setTitle(breatheText[nextIndex]);
        setSequenceTime(sequence[nextIndex]);
        setCurrentTime(0);
        return nextIndex
      }
    });
  }

  const countStep = () => {


    setCurrentTime(time => {
      const nextTime = time + 1;
      if (currentIndex >= 5 || (currentIndex >= 4 && !patternData.settings.breakBetweenCycles)) {
        console.log(0)
        nextCycle();
        return time
      } else if (nextTime >= sequenceTime) {
        console.log(1)
        nextSequence();
        return time
      } else {
        console.log(2, currentIndex)
        return nextTime
      }
    })

    if (!paused) countInterval.current = setTimeout(countStep, 1000)
  }

  /*
   Pause Functions
  */
  const togglePause = () => {
    if (paused) resume();
    else pause();
  }

  const pause = () => {
    setPaused(true);
  }
  const resume = () => {
    setPaused(false);
  }

  const clearTimer = () => {
    clearInterval(countInterval.current)
    countInterval.current = false;
  }


  return (
    <View style={styles.container}>
      <TimeHeader navigation={navigation}/>
      <RenderSequence style={styles.sequenceContainer} sequence={patternData.sequence} backgroundColor="white"/>
      <View style={styles.animationContainer}>
        <BreathingAnim
          sequenceTime={sequenceTime}
          currentIndex={currentIndex}
          currentTime={currentTime}
          paused={paused}
          title={title}
          baseSize={45}
          canvasSize={260}/>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={togglePause}>
          <View style={styles.pauseButton}>
            <Icon name={paused ? "play" : "pause"} size={32} color={colors.primary}/>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pauseButton: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  controlsContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
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
