import React, {useMemo} from 'react';

import {Alert, Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import PropTypes from "prop-types";
import {colors} from "../../config/colors";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import {useDispatch, useSelector} from "react-redux";
import {deleteTape, setViewed} from "../../store/features/tapesSlice";

import {useNavigation} from '@react-navigation/native';
import IconIonicons from "react-native-vector-icons/Ionicons";
import ReanimatedArc from "../../breathing/use/components/ReanimatedArc";
import {cancelDownload, deleteAudio, downloadAudioSet, downloadAudioTape} from "../../helpers/downloadAudio";
import crashlytics from "@react-native-firebase/crashlytics";
import {confirm} from "../../helpers/confirm"

const AudioSetFilesTape = (props) => {
  // @ts-ignore
  const downloadData = useSelector(state => state.tapes?.[props.set.name]?.[props.file.episode]?.downloads)

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  const disabledColor = useMemo(() => {
    const fullyDownloaded = downloadData?.slice(0, props.file.parts.length).every(part => part.downloadState === 3)
    // return fullyDownloaded ? undefined : {color: colors.dark ? "#444444" : "#B4B4B4"}
    return fullyDownloaded ? undefined : {color: "rgba(100, 100, 100, 0.6)"}
  }, [downloadData])


  const typeIcons = {
    "listen": <IconMaterial name="headphones" size={18} color={colors.text} style={disabledColor}/>,
    "sleep": <IconMaterial name="sleep" size={21} color={colors.text} style={disabledColor}/>,
    "relax": <IconMaterial name="bed-queen-outline" size={23} color={colors.text} style={disabledColor}/>,
  }


  const playAudio = ({index, partData, tapeName, fileName}) => {
    const fileUrl = downloadData?.[index]

    // @ts-ignore
    if (!(fileUrl?.downloadState === 3) || !fileUrl.location) return

    var trackData = {
      url: fileUrl.location,
      title: fileName + (fileName !== tapeName ? (" " + tapeName) : ""), // if tape has multiple parts it shows name then part otherwise just the name
      artist: 'Richard L. Johnson',
      album: props.set.name,
      genre: 'Sleep Meditation',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      duration: props.file.parts[index].duration
    };

    // @ts-ignore
    navigation.navigate('AudioPlayer', {
      trackData,
      set: props.set.name,
      tape: props.file.episode,
      part: index,
      fileName,
      tapeName,
      partData
    })
  }


  const handleCancel = (downloadState) => {
    switch (downloadState) {
      case 3:
        confirm({title: "Delete Audio?", message: `\Delete "${props.file.name}" from downloads?`, destructive: true}, () => {
          deleteAudio({set: props.set.name, tape: props.file.episode}).catch(console.error);
          dispatch(deleteTape({set: props.set.name, tape: props.file.episode}));
        })
        break;
      case 1:
      case 2:
        confirm({title: `Cancel Download?`, message: `Stop downloading "${props.file.name}"?`, destructive: true}, () => {
            cancelDownload({set: props.set.name, tape: props.file.episode}).catch(console.error);
            deleteAudio({set: props.set.name, tape: props.file.episode}).catch(console.error);
            dispatch(deleteTape({set: props.set.name, tape: props.file.episode}));
        })

        break;
      default:
        downloadAudioTape(props.set, props.file.episode).catch(console.error);



    }
  }

  const renderDownload = ({index = 0, inner}) => {
    //If audio is part of two-set or more then it averages progress between files
    const progression = downloadData?.slice(0, props.file.parts.length).map(el => el?.progress ?? 0) ?? []

    const dlaverage = average(downloadData?.slice(0, props.file.parts.length).map(el => el?.progress ?? 0) ?? []) ?? 0

    let calcStatus

    if (props.file.parts.length >= 2 && downloadData) {
      const mapData = (downloadData ?? []).map(e => e.downloadState)

      if (mapData.every(data => data === 3)) calcStatus = 3;
      else if (mapData.some(data => data >= 1)) calcStatus = 2;
      else calcStatus = 0

    } else calcStatus = downloadData?.[index]?.downloadState ?? 0

    let partDownload = inner ? dlaverage : downloadData?.[index]?.progress

    //Pressable needs to be on outside and have variable onpress because pressable creates alignment issues
    return <Pressable
      style={[styles.download, inner ? styles.downloadInner : styles.downloadOuter]}
      hitSlop={12}
      onPress={() => handleCancel(calcStatus)}
    >
      {
        (calcStatus === 1 || calcStatus === 2) &&
          <View style={[styles.loadingContainer, inner && {top: 8}]}>
              <IconIonicons name={"ios-square"} size={10} color={colors.primary}/>
              <ReanimatedArc
                  color={colors.text}
                  style={{position: "absolute"}}
                  diameter={22}
                  width={2}
                  arcSweepAngle={(partDownload * 3.5) ?? 0}
                // arcSweepAngle={360}
                  animationDuration={100}
                  lineCap="round"
              />
          </View>
      }

      {
        calcStatus === 3 &&
          <IconMaterial style={{top: 5, height: 30}} name={"cancel"} size={20} color={colors.primary}/>
      }

      {
        calcStatus === 0 &&
          <IconIonicons style={{top: 5, height: 30}} name={"md-cloud-download-outline"} size={20}
                        color={colors.primary}/>
      }
    </Pressable>
  }

  const renderSingle = ({tapeName, partData, index, inner = false, fileName}) => { //Tapename is name of part (eg. part A, part B or can also be same as filename)
    return <Pressable onPress={() => playAudio({index, partData, tapeName, fileName})}>
      <View style={inner ? styles.singleTapeInner : styles.singleTape}>
        <IconIonicons name="play" size={28} color={colors.text} style={disabledColor}/>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, disabledColor]}>{tapeName}</Text>
          <View style={styles.subtitle}>
            {typeIcons[partData.type]}
            <Text style={[styles.tapeTime, disabledColor]}>{partData.time || "22:00"}</Text>
          </View>
          {!inner && renderDownload({index, inner: false})}
        </View>
      </View>
    </Pressable>
  }

  const renderMulti = (file) => {
    const partNames = ["Part A", "Part B", "Part C", "Part D"]
    return <View style={styles.multiTape}>
      <Text style={[styles.multiTapeTitle, disabledColor]}>{file.name}</Text>
      {renderDownload({inner: true})}
      <View style={{flexDirection: "row"}}>
        {file.parts.map((part, i) => {
          return <View style={styles.multiInner} key={i}>{renderSingle({
            tapeName: partNames[i],
            partData: part,
            index: i,
            inner: true,
            fileName: file.name
          })}</View>
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
  set: PropTypes.object
}

const styles = StyleSheet.create({
  loadingContainer: {
    right: 5,
    paddingLeft: 1,
    top: -8,
    justifyContent: "center",
    alignItems: "center"
  },
  downloadPress: {
    backgroundColor: "black",
    width: 20
  },
  download: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  },
  downloadInner: {
    top: 4,
    right: 10,
  },
  downloadOuter: {
    bottom: 1,
    right: -6
  },
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
    backgroundColor: colors.dark ? colors.background4 : colors.background3,
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
