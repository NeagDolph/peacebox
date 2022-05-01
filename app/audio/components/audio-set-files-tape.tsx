import React from 'react';

import {Pressable, StyleSheet, Text, View} from 'react-native';
import PropTypes from "prop-types";
import {colors} from "../../config/colors";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import {useDispatch, useSelector} from "react-redux";
import {setViewed} from "../../store/features/tapesSlice";

import { useNavigation } from '@react-navigation/native';

const AudioSetFilesTape = (props) => {
  const viewedData = useSelector(state => state.tapes?.[props.setTitle]?.[props.file.episode]?.parts)
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const updateViewed = ({index, partData, tapeName, fileName}) => {

    var trackData = {
      url: partData.url,
      title: fileName + (fileName !== tapeName ? (" " + tapeName) : ""),
      artist: 'Richard L. Johnson',
      album: props.setTitle,
      genre: 'Sleep Meditation',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      duration: 1858 // Duration in seconds
    };

    // dispatch(setViewed({set: props.setTitle, tape: props.file.episode, part: index, viewed: !viewedData?.[index]}));

    navigation.navigate('AudioPlayer', {trackData, set: props.setTitle, tape: props.file.episode, part: index, fileName, tapeName})
  }

  const renderSingle = ({tapeName, partData, index, inner=false, fileName}) => { //Tapename is name of part (eg. part A, part B or can also be same as filename)
    return <Pressable onPress={() => updateViewed({index, partData, tapeName, fileName})}>
      <View style={inner ? styles.singleTapeInner : styles.singleTape}>
        <IconEntypo name="controller-play" size={32} color={colors.text}/>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tapeName}</Text>
          <View style={styles.subtitle}>

            {partData.type === "listen" ?
              <IconMaterial name="headphones" size={18} color={colors.text}/> :
              <IconMaterial name="bed-queen-outline" size={23} color={colors.text}/>
            }
            <Text style={styles.tapeTime}>{partData.time || "33:40"}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  }

  const renderMulti = (file) => {
    const partNames = ["Part A", "Part B", "Part C", "Part D"]
    return <View style={styles.multiTape}>
      <Text style={styles.multiTapeTitle}>{file.name}</Text>
      <View style={{flexDirection: "row"}}>
        {file.parts.map((part, i) => {
          return <View style={styles.multiInner} key={i}>{renderSingle({tapeName: partNames[i], partData: part, index: i, inner: true, fileName: file.name})}</View>
        })}
      </View>
    </View>
  }

  return (
    <View style={styles.container}>
      {props.file.parts.length === 1 ?
        renderSingle({tapeName: props.file.name, partData: props.file.parts[0], fileName: props.file.name, index: 0}) :
        renderMulti(props.file)
      }
    </View>
  );
};


AudioSetFilesTape.propTypes = {
  file: PropTypes.object,
  setTitle: PropTypes.string
}

const styles = StyleSheet.create({
  multiTapeTitle: {
    marginLeft: 6,
    marginTop: 8,
    fontFamily: "Baloo 2",
    maxWidth: 230,
    lineHeight: 23,
    color: colors.primary,
    fontSize: 19,
  },
  multiInner: {
    margin: 5,
  },
  multiTape: {
    backgroundColor: colors.background3,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  titleContainer: {
    marginLeft: 5,
    paddingTop: 6,
    justifyContent: "center"
  },
  title: {
    fontFamily: "Baloo 2",
    maxWidth: 230,
    lineHeight: 21,
    fontSize: 18,
    // textAlign: "center",
    textAlignVertical: "bottom",
    color: colors.primary,
    transform: [
      {translateY: 3}
    ]
  },
  subtitle: {
    flexDirection: "row",
    alignItems: "center",
    transform: [
      {translateY: -3}
    ]
  },
  tapeTime: {
    marginLeft: 4,
    fontFamily: "Baloo 2",
    fontSize: 18,
    color: colors.text
  },
  singleTape: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 7,
    backgroundColor: colors.background3,
    paddingLeft: 8,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 16,
  },
  singleTapeInner: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 7,
    backgroundColor: colors.background3,
    paddingLeft: 4,
    paddingTop: 1,
    paddingBottom: 0,
    paddingRight: 12,
  },
  container: {
    // flexDirection: "row",
    // width: "100%",
    // height: 200
    // flex: 1,
  },
})

export default AudioSetFilesTape;
