import React, {useEffect, useRef, useState} from 'react';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PageHeader from "../../components/header";
import {useSelector} from "react-redux";
import TimeHeader from "./components/time-header";
import {Surface} from "react-native-paper";
import {colors} from "../../config/colors";
import RenderSequence from "./components/render-sequence";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BreathingAnim from "./components/breathing-animation";

const breatheText = ["Inhale", "Hold", "Exhale", "Hold"]


const PatternTime = ({route, navigation}) => {
  const {id} = route.params
  const patternData = useSelector(state => state.breathing.patterns[id]);
  const countInterval = useRef(null);
  const startTime = useRef(Date.now());

  const sequence = patternData.sequence;
  const [cycleCount, setCycleCount] = useState(0)
  const [currentSeq, setCurrentSeq] = useState(0) // Index of current sequence
  const [sequenceTime, setSequenceTime] = useState(patternData.sequence[0]) // Seconds in current sequence index
  const [currentTime, setCurrentTime] = useState(0)

  const [title, setTitle] = useState(breatheText[0])

  useEffect(() => {

    // waitCount(seqTime);
    if (patternData.settings.breakBetweenCycles && cycleCount % patternData.settings.pauseFrequency === 0) {
      patternBreak(patternData.settings.pauseDuration)
        .then(() => countSequence())
    } else countSequence()

  }, [cycleCount])


  const patternBreak = (duration) => {
    return new Promise((res, rej) => {
      setTitle("Break");
      setSequenceTime(duration)
      setTimeout(res, duration * 1000);
    })
  }

  const countSequence = async() => {
    for (let i of sequence) {
      await waitCount(i);
    }
    setCycleCount(count => count + 1)
  }

  const waitCount = (time) => {
    return new Promise((res, rej) => {

      clearInterval(countInterval.current); //Remove previous count interval
      createCountInterval(time) // create count interval

      setSequenceTime(time);
      setTitle(breatheText[currentSeq]);
      setTimeout(() => {
        setCurrentSeq(seq => (seq + 1) % 4)
        res();
      }, time * 1000)
    })
  }

  const createCountInterval = (time) => {
    setCurrentTime(time)
    countInterval.current = setInterval((setCurrentTime) => {
      setCurrentTime(time => time - 1);
    }, 1000, setCurrentTime)
  }



  return (
    <View style={styles.container}>
      <TimeHeader navigation={navigation}/>
      <RenderSequence style={styles.sequenceContainer} sequence={patternData.sequence} backgroundColor="white"/>
      <View style={styles.animationContainer}>
        <BreathingAnim
          sequenceTime={sequenceTime}
          currentIndex={currentSeq}
          currentTime={currentTime}
          title={title}
          baseSize={45}
          canvasSize={260}/>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity>
          <View style={styles.pauseButton}>
            <Icon></Icon>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {

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
