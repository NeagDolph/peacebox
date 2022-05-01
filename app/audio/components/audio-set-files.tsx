import React, {useEffect, useState} from 'react';

import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from "../../config/colors";
import AudioSetFilesTape from "./audio-set-files-tape";
import PropTypes from "prop-types";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import {useSelector} from "react-redux";

const AudioSetFiles = (props) => {
  const viewedData = useSelector(state => state.tapes[props.setTitle])
  const [checkmarkConts, setCheckmarkConts] = useState([]);

  const [completedCalc, setCompletedCalc] = useState(Array(props.files.length).fill(false));

  useEffect(() => {
    const completedVal = viewedData?.map((file, i) => {
      return file?.parts?.slice(0,props.files[i]?.parts?.length).every(el => el === true)
    }) ?? []
    const falseList = Array(props.files.length).fill(false)

    setCompletedCalc(completedVal.concat(falseList))
  }, [viewedData]);

  const layoutCheckmarks = ({nativeEvent}, index) => {
    const checkmarkData = {
      x: nativeEvent.layout.x,
      y: nativeEvent.layout.y,
      height: nativeEvent.layout.height,
      index: index,
    }

    setCheckmarkConts(state => [...state, checkmarkData])
  }

  const renderProgress = () => {
    return checkmarkConts.map((checkmark, i) => {
      if (checkmark.index >= checkmarkConts.length - 1) return

      const nextCheckmark = checkmarkConts.find(el => {
        return el.index == checkmark.index + 1
      })

      const lineViewed = completedCalc?.slice(0, checkmark.index + 2).every(el => {
        return el === true
      })

      // if (checkmark.index == 0) console.log("EEK", completedCalc?.slice(0, checkmark.index + 2), completedCalc)

      const calcTop = checkmark.y + checkmark.height / 2 + 15
      const lineHeight = nextCheckmark?.y + nextCheckmark?.height / 2 - 15 - calcTop

      const checkmarkStyles = {
        top: calcTop,
        height: lineHeight || 50,
        backgroundColor: lineViewed ? colors.green : colors.accent
      }

      return <View key={i} style={[styles.progressBar, checkmarkStyles]}></View>
    })
  }

  const renderCheckmark = (completed) => {

    return (<View style={styles.checkmarkContainer}>
      {
        completed ?
          <IconMaterial name="check-circle" size={23} style={styles.checkMark} color={colors.green}/> :
          <View style={styles.uncheckMark}></View>
      }
    </View>)
  }

  const renderTapes = () => {
    return props.files.map(file => {
      const allCompleted = completedCalc?.[file.episode]

      return <View
        key={file.name}
        style={styles.tapeContainer}
        onLayout={(e) => layoutCheckmarks(e, file.episode)}
      >
        {renderCheckmark(allCompleted)}
        <AudioSetFilesTape file={file} setTitle={props.setTitle}/>
      </View>
    })
  }

  return (
    <View style={styles.container} onLayout={props.layout}>
      {renderProgress()}
      {renderTapes()}
    </View>
  );
};

AudioSetFiles.propTypes = {
  files: PropTypes.array,
  setTitle: PropTypes.string,
  layout: PropTypes.func
}

const styles = StyleSheet.create({
  checkMark: {
    width: 23,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    height: 23,
  },
  uncheckMark: {
    width: 19,
    height: 19,
    marginHorizontal: 2,
    borderRadius: 25,
    borderColor: colors.accent,
    borderWidth: 2.5,
  },
  checkmarkContainer: {
    // height: "100%",
    justifyContent: "center",
    // width: 20,
    paddingRight: 12

  },
  tapeContainer: {
    width: "100%",
    // flex: 1,
    flexDirection: "row",
    marginVertical: 15,
    // height: 100
  },
  container: {
    // flexDirection: "row",
    width: "100%",
    // height: 200
    // flex: 1,
  },
  progressBar: {
    height: 60,
    width: 5,
    left: 9,
    borderRadius: 50,
    // flex: 1,z
    position: "absolute",
    backgroundColor: colors.accent,
  }
})

export default AudioSetFiles;
