import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {LayoutAnimation, Pressable, StyleSheet, Text, View} from "react-native";
import {Surface} from "react-native-paper";
import PropTypes from 'prop-types'
import {colors} from "../../config/colors";
import AudioPage from "../audio-page";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  concat, runOnJS
} from "react-native-reanimated";
import createAnimatedComponent from "react-native-reanimated";
import IconEntypo from "react-native-vector-icons/Entypo";
import AudioSetFiles from "./audio-set-files";
import {useDispatch, useSelector} from "react-redux";
import IconIonicons from "react-native-vector-icons/Ionicons";
import {downloadAudioSet} from "../../helpers/downloadAudio";
import {setDownload, setDownloaded, setFavorite, setProgress} from "../../store/features/tapesSlice";
import RNBackgroundDownloader from 'react-native-background-downloader'
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import ReanimatedArc from "../../breathing/use/components/ReanimatedArc";
import haptic from "../../helpers/haptic";

const AudioSet = (props) => {
  const downloads = useSelector(state => state.tapes[props.set.name]);
  const favorites = useSelector(state => state.tapes.favorites);

  const dispatch = useDispatch();

  const anyDownloaded = useMemo(() => {
    return downloads?.some(tape => tape?.downloads?.some(part => part?.downloadState >= 1) ?? false) ?? false
  }, [downloads])


  const isFavorite = useMemo(() => favorites.includes(props.set.name), [props.set.name, favorites]);

  const toggleFavorite = () => {
    if (isFavorite) dispatch(setFavorite({set: props.set.name, favorite: false}));
    else dispatch(setFavorite({set: props.set.name, favorite: true}))
  }


  const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;


  const [downloadingAll, setDownloadingAll] = useState(false);

  const fullProgressCalc = useMemo(() => {
    return downloadingAll ? downloads?.reduce((tot, el, i) => {
      return tot.concat(el?.downloads?.slice(0, props.set.files[i].parts.length).reduce((tot2, el2) => {
        return tot2.concat([el2?.progress])
      }, []))
    }, []) : [0]
  }, [downloads, downloadingAll]);


  const tapeSize = useMemo(() => {
    return props.set.files.map(file => file.parts.length)
  }, [props.set]);
  const allDownloaded = useMemo(() => {
    return downloads?.every((tape, i) => {
      return tape?.downloads?.slice(0, tapeSize[i]).every(part => part.downloadState === 3) ?? false
    }) ?? false
  }, [downloads]);

  const filesLength = (audioSet) => audioSet.files.reduce((tot, el) => tot + el.parts.length, 0)

  const [open, setOpen] = useState(false);

  const [showOpen, setShowOpen] = useState(false);
  useEffect(() => {
    if (open) {
      setShowOpen(true)
    }

    setTimeout(() => { //the fucky wucky quick fix (see below)
      if (open) {
        setShowOpen(true)
      }
    }, 100)

    openValue.value = open ? 1 : 0
  }, [open]);

  useEffect(() => {
    if (allDownloaded) setDownloadingAll(false)
  }, [allDownloaded]);


  const toggleOpen = () => {
    // showOpen displays the inner content which should only be set to false once the animation is done so that the
    // box can close before it disappears. So when opening it sets showOpen to true but when closing it doesn't set showOpen
    // Once the animation finishes it sets showOpen to false but there's a glitch where if you open it again right before it sets it to
    // false then it keeps showOpen as false while open is true so the inner content is invisible. To fix this there's a useEffect on open.
    // When open is set to true it waits 100ms and checks if open is still true, if it is then it sets showOpen to true. This is very hacky but
    // the only way I could get this stupid fucking thing to work

    if (!open) {
      setShowOpen(true)
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const layoutContent = ({nativeEvent}) => {
    openHeightValue.value = nativeEvent.layout.height + 100
  }


  const openValue = useSharedValue(0)
  const openHeightValue = useSharedValue(0)

  const stopShowOpen = () => {
      setShowOpen(false)
  }

  const heightStyle = useAnimatedStyle(() => {
    const heightValue = interpolate(openValue.value, [0, 1], [90, openHeightValue.value], {});
    // const heightValue = (openHeightValue.value < 200 && open) ? 900 : interpolate(openValue.value, [0, 1], [72, openHeightValue.value], {});

    return {
      height: withTiming(heightValue, {
        duration: 300,
        easing: Easing.linear
      }, () => {
        if (!open) runOnJS(stopShowOpen)()
      }),
    };
  }, [open]);

  const buttonStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(openValue.value, [0, 1], [0, 90], {extrapolateRight: "clamp"});

    return {
      transform: [
        {
          rotateZ: withTiming(rotateValue + "deg", {
            duration: 250,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        }
      ]
    }
  })

  const downloadSet = () => {
    haptic(0)
    setDownloadingAll(true)
    downloadAudioSet(props.set)
      .catch(console.error)
  }

  const renderOpenButton = () => {
    const calcAverage = average(fullProgressCalc)
    return <View style={styles.animatedButtonContainer}>
      {
        (calcAverage < 100 && downloadingAll) &&
        <ReanimatedArc
          color={colors.text}
          style={{position: "absolute"}}
          diameter={38}
          width={2}
          arcSweepAngle={(average(fullProgressCalc) * 3.6) ?? 0}
          animationDuration={200}
          lineCap="round"
        />
      }
      <Animated.View style={[styles.openButton, buttonStyle]}>
        <IconEntypo size={22} name="chevron-right" color={colors.text}/>
      </Animated.View>
    </View>
  }

  return (

    <Animated.View style={[styles.animatedContainer, heightStyle]}>
      <Surface style={styles.audioSet} key={props.set.name}>
        <View style={styles.topContainer}>
          <Pressable style={{width: "100%", flexDirection: "row"}} onPress={toggleOpen}>
            <View style={{justifyContent: "center"}}>
              <Pressable onPress={toggleFavorite}>
                {
                  isFavorite ?
                    <IconIonicons name={"md-heart"} color={colors.red}></IconIonicons> :
                    <IconIonicons name={"md-heart-outline"} color={colors.text}></IconIonicons>

                }
              </Pressable>
              <View style={[styles.setIcon, {backgroundColor: props.set.icon}]}></View>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.author}>Richard L. Johnson</Text>
              <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>{props.set.name}</Text>
              <Text style={styles.subtitle}>{filesLength(props.set)} Tapes</Text>
            </View>
            <View style={styles.openButtonContainer}>
              {anyDownloaded ?
                renderOpenButton() :
                <Pressable onPress={downloadSet}>
                  <View style={styles.downloadButton}>
                    <IconIonicons size={25} name="md-download-outline" color={colors.primary}/>
                  </View>
                </Pressable>
              }
            </View>
          </Pressable>
        </View>
        <View style={styles.audioContainer}>
          <View onLayout={layoutContent}>
            {
              showOpen &&
                <>
                    {/*<View style={styles.descriptionContainerOuter}>*/}
                    {/*    <View style={styles.descriptionContainer}>*/}
                    {/*        <View style={styles.descriptionTitleContainer}>*/}
                    {/*            <IconMaterial name="note-text-outline" size={25} color={colors.primary}/>*/}
                    {/*            <Text style={styles.descriptionTitle}>About This Tape</Text>*/}
                    {/*        </View>*/}
                    {/*        <Text style={styles.description}>{props.set.description}</Text>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                    <AudioSetFiles set={props.set}/>
                </>
            }
          </View>
        </View>
      </Surface>
    </Animated.View>
  );
};

AudioSet.propTypes = {
  set: PropTypes.object,
  setIndex: PropTypes.number
}

const styles = StyleSheet.create({
  author: {
    fontFamily: "avenir",
    fontSize: 14,
    color: colors.text
  },
  animatedButtonContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  descriptionTitleContainer: {
    flexDirection: "row",

  },
  descriptionTitle: {
    fontSize: 18,
    color: colors.primary,
    marginLeft: 5,
    fontFamily: "Baloo 2",
  },
  description: {
    fontSize: 16,
    paddingHorizontal: 2,
    fontFamily: "Baloo 2",
    color: colors.primary
  },
  descriptionContainer: {
    width: "100%",
    backgroundColor: colors.background3,
    paddingVertical: 8,
    borderRadius: 5,
    paddingHorizontal: 12
  },

  descriptionContainerOuter: {
    width: "100%",
    paddingHorizontal: 5
  },
  downloadButton: {
    // padding: 9,
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background3,
    borderRadius: 50
  },
  openButtonContainer: {
    justifyContent: "center",
    marginRight: 5,
  },
  openButton: {
    padding: 6,
    backgroundColor: colors.background3,
    borderRadius: 50
  },
  animatedContainer: {
    marginTop: 15,
    overflow: "hidden",
    // flex: 1,
    padding: 3,
  },
  audioContainer: {
    // height: 260,
    // flex: 1,
    width: "100%",
  },
  topContainer: {
    flexDirection: "row",
    height: 75,
    alignItems: "center"
  },
  audioOpen: {
    height: 300
  },
  audioSet: {
    flex: 1,
    minHeight: 65,
    width: "100%",
    backgroundColor: colors.background2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    // justifyContent: "center",
    flexDirection: "column",
    elevation: 2,
    marginBottom: 0
  },
  setIcon: {
    backgroundColor: "#71A8FA",
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  titleContainer: {
    flexDirection: "column",
    paddingLeft: 16,
    width: "100%",
    height: 66,
    paddingRight: "100%",
    flex: 1,
    justifyContent: "flex-start",
    paddingRight: 4
  },
  title: {
    fontFamily: "Roboto",
    fontSize: 18,
    // lineHeight: 26,
    // maxWidth: 200,
    color: colors.primary,
    paddingRight: 10,
    marginVertical: 0,
    // flex: 0
    paddingBottom: 2,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,

    color: colors.text,
    fontFamily: "Baloo 2"
  }
})
export default AudioSet;
