import {useState, useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import {pattern} from "../../../helpers/haptic";
import crashlytics from "@react-native-firebase/crashlytics";
import {AppState, Vibration} from "react-native";
import Sound from "react-native-sound";

function useTimer({id, paused, completed}) {
  const patternData = useSelector(state => state.breathing.patterns[id]);
  const settings = useSelector(state => state.settings.breathing);
  const countInterval = useRef(null);

  const sequence = patternData.sequence;

  const breatheText = ["Inhale", "Hold", "Exhale", "Hold"]

  const [title, setTitle] = useState(breatheText[0])

  //Timing State
  const [cycleCount, setCycleCount] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0) // Index of current sequence
  const [sequenceTime, setSequenceTime] = useState(patternData.sequence[0]) // Seconds in current sequence index
  const [currentTime, setCurrentTime] = useState(0)
  const [takingBreak, setTakingBreak] = useState(false);
  const [patternCompletion, setPatternCompletion] = useState(0);
  const [completionText, setCompletionText] = useState("");
  const [secondsPassed, setSecondsPassed] = useState(0)

  //Audio State
  const audioFiles = useRef({})

  useEffect(() => {
    calcCompletion();

    crashlytics().log("Timer hook loaded")

    if (cycleCount === 1 && currentIndex === 0 && currentTime <= 1) {
      preloadAllAudio().then(() => playAudio("breathein.mp3"));
    }


    return () => {
      dismountAudio();
    }
  }, []) //On load: preload audio

  useEffect(() => {
    if (paused) {
      clearTimer()
    } else {
      countInterval.current = setTimeout(() => {
        countStep();
      }, 1400)
    }
    return clearTimer;
  }, [paused]); //handle pause

  useEffect(() => {
    calcCompletion();

    if (secondsPassed <= 0) return;

    let intervalTime = 1000;

    if ([1, 3].includes(currentIndex) && currentTime + 1 === sequenceTime) intervalTime = 1300;

    if (!paused) countInterval.current = setTimeout(countStep, intervalTime);
  }, [secondsPassed]) //Update data every second

  useEffect(() => {
    if (currentTime + 1 >= 2 && currentTime + 1 <= sequenceTime && !takingBreak) playAudio(`${(currentTime + 1)}.mp3`);

    switch (patternData.durationType) { // Completion tests
      case "Cycles":
        if (cycleCount > patternData.totalDuration) {
          dismountAudio();
          completed();
        }
        break;
      case "Minutes":
        const totalTime = patternData.totalDuration * 60
        if (secondsPassed > totalTime) {
          dismountAudio();
          completed();
        }
        break;
    }

    if (sequenceTime === 0) {
      nextSequence();
      return;
    }

    if (currentIndex >= 4 && !takingBreak) nextCycle();
    else if (currentTime >= sequenceTime) nextSequence();
  }, [currentTime, cycleCount, sequenceTime]) //Handle timer cycle

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
      feedback();

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

    /*
  * Audio functions
  */
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
    Other
   */

  const feedback = () => {
    // ['None', 'Vibrate', "Haptic"]
    switch (patternData.settings.feedbackType) {
      case 0:
        break;
      case 1:
        Vibration.vibrate()
        break;
      case 2:
        pattern(2, 200, 2)
        break;
    }
  }

  const formatSeconds = (seconds) => {
    const timeString = new Date(null, null, null, null, null, seconds).toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0]
    const timeFormat = timeString // Remove extra 0's and :'s
      .replace(/^00\:00\:/g, "0:")
      .replace(/^00\:0?/g, "")
      .replace(/^0(?!:)/, "")

    return timeFormat
  }

  return {
    title,
    sequenceTime,
    currentIndex,
    currentTime,
    secondsPassed,
    patternCompletion,
    completionText
  };
}

export default useTimer
