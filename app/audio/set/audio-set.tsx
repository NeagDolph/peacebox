import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, LayoutAnimation, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { colors } from "../../config/colors";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

import IconEntypo from "react-native-vector-icons/Entypo";
import AudioSetFiles from "./audio-set-files";
import { useDispatch, useSelector } from "react-redux";
import IconIonicons from "react-native-vector-icons/Ionicons";
import { cancelDownload, deleteAudio, downloadAudioSet } from "../../helpers/downloadAudio";
import { deleteTape, removeFromQueue, setFavorite } from "../../store/features/tapesSlice";
import ReanimatedArc from "../../breathing/use/components/ReanimatedArc";
import haptic from "../../helpers/haptic";
import { PanGestureHandler } from "react-native-gesture-handler";

let ContextMenuView;

if (Platform.OS === 'ios') {
  ContextMenuView = require('react-native-ios-context-menu').ContextMenuView;
}

const AudioSet = props => {
  const downloads = useSelector(
    state => state.tapes.downloadData[props.set.name],
  );
  const favorites = useSelector(state => state.tapes.favorites);

  const pressTimeRef = useRef(Date.now());
  const panRef = useRef();

  const tempCurrent = useRef(props.currentOpen);

  const isFavorite = useMemo(
    () => favorites.includes(props.set.name),
    [props.set.name, favorites],
  );

  const [dragMode, setDragMode] = useState(0);
  const [showOpen, setShowOpen] = useState(false);
  const [tapeHeight, setTapeHeight] = useState(0);

  const open = useMemo(() => {
    return props.currentOpen === props.renderId;
  }, [props.currentOpen, props.renderId]);

  const setOpen = () => {
    props.setCurrentOpen(
      props.currentOpen === props.renderId ? '' : props.renderId,
    );
  };

  const dragX = useSharedValue(0);

  const activateFavorite = () => toggleFavorite();

  const panHandler = useAnimatedGestureHandler(
    {
      onStart: (_, ctx) => {
        ctx.startX = dragX.value;
        ctx.activateOffset = 30;
        ctx.dragMode = 0;
      },
      onActive: ({translationX}, ctx) => {
        if (open) return;

        if (translationX !== 0) {
          // const deadZone = 30 //Acts like min dist
          if (translationX < 0) {
            translationX = -Math.pow(-translationX, 0.75);
            translationX = Math.min(translationX, 0);
          } else translationX = 0;
        }

        ctx.totalMove = translationX;
        if (translationX < -ctx.activateOffset) {
          if (ctx.dragMode !== 1) runOnJS(haptic)(1);
          ctx.dragMode = 1;
        } else if (translationX > -ctx.activateOffset) {
          if (ctx.dragMode !== 0) runOnJS(haptic)(0);
          ctx.dragMode = 0;
        }

        runOnJS(setDragMode)(ctx.dragMode);

        dragX.value = ctx.startX + translationX;
      },
      onEnd: (_, ctx) => {
        if (ctx.totalMove < -ctx.activateOffset) runOnJS(activateFavorite)();

        ctx.totalMove = 0;

        dragX.value = withSpring(0, {
          overshootClamping: true,
          mass: 3.5,
          damping: 25,
          stiffness: 340,
        });
      },
    },
    [open, dragMode],
  );

  const panStyle = useAnimatedStyle(() => ({
    transform: [{translateX: dragX.value}],
  }));

  const dispatch = useDispatch();

  const anyDownloaded = useMemo(() => {
    return (
      downloads?.some(
        tape =>
          tape?.downloads?.some(part => part?.downloadState >= 1) ?? false,
      ) ?? false
    );
  }, [downloads]);

  const anyDownloading = useMemo(() => {
    return (
      downloads?.some(
        tape =>
          tape?.downloads?.some(
            part => part?.downloadState === 1 || part?.downloadState === 2,
          ) ?? false,
      ) ?? false
    );
  }, [downloads]);

  const toggleFavorite = () => {
    haptic(1);
    LayoutAnimation.easeInEaseOut();
    dispatch(
      setFavorite({
        set: props.set.name,
        favorite: !favorites.includes(props.set.nam),
      }),
    );
  };

  const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  const [downloadingAll, setDownloadingAll] = useState(false);

  const calculateProgess = () => {
    // reduce each file in downloads and average progress for all parts, then average the total of that.
    return (
      downloads?.reduce((tot, el, i) => {
        const partsLength = props.set.files[i].parts.length;

        return (
          tot +
          el?.downloads
            ?.slice(0, partsLength) // For 2+ part support in the future
            ?.reduce(
              (tot, item) =>
                tot + (item.downloadState === 3 ? 100 : item.progress),
              0,
            ) /
            partsLength
        );
      }, 0) / downloads.length
    );
  };

  const fullProgressCalc = useMemo(() => {
    return downloadingAll ? calculateProgess() : 0;
  }, [downloads, downloadingAll]);

  const allDownloaded = useMemo(() => {
    //If all parts of all tapes are downloaded
    if (downloads?.length < props.set.files.length)
      // If not all downloads items are initialized
      return false;

    return (
      downloads?.every((tape, i) => {
        return (
          tape?.downloads
            ?.slice(0, props.set.files[i].parts.length)
            .every(part => part.downloadState === 3) ?? false
        );
      }) ?? false
    );
  }, [downloads]);

  const filesLength = audioSet =>
    audioSet.files.reduce((tot, el) => tot + el.parts.length, 0);

  useEffect(() => {
    if (open) {
      openValue.value = 1;
      setShowOpen(true);
    } else openValue.value = 0;
  }, [open]);

  useEffect(() => {
    if (allDownloaded) setDownloadingAll(false);
  }, [allDownloaded]);

  const layoutContent = ({nativeEvent}) => {
    openHeightValue.value = nativeEvent.layout.height + 100;
  };

  const openValue = useSharedValue(0);
  const openHeightValue = useSharedValue(0);

  const heightStyle = useAnimatedStyle(() => {
    const heightValue = interpolate(
      openValue.value,
      [0, 1],
      [90, openHeightValue.value],
      {extrapolateLeft: 'clamp'},
    );
    // const heightValue = (openHeightValue.value < 200 && open) ? 900 : interpolate(openValue.value, [0, 1], [72, openHeightValue.value], {});

    return {
      height: withTiming(
        heightValue,
        {
          duration: 200,
          easing: Easing.linear,
        },
        () => {
          if (openValue.value < 0.5) {
            runOnJS(setShowOpen)(false);
          }
        },
      ),
    };
  }, [open]);

  const buttonStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(openValue.value, [0, 1], [0, 90], {
      extrapolateRight: 'clamp',
    });

    return {
      transform: [
        {
          rotateZ: withTiming(rotateValue + 'deg', {
            duration: 150,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });

  const downloadSet = () => {
    haptic(0);
    setDownloadingAll(true);
    downloadAudioSet(props.set).catch(console.error);
  };

  const cancelAllDownloads = () => {
    dispatch(removeFromQueue({set: props.set.name}));
    setDownloadingAll(false);
    for (let file of props.set.files) {
      const downloadVal = downloads?.[file.episode]?.downloads?.some(
        el => el.downloadState === 1 || el.downloadState === 2,
      );
      if (downloadVal) {
        cancelDownload({set: props.set.name, tape: file.episode}).catch(
          console.error,
        );
        deleteAudio({set: props.set.name, tape: file.episode}).catch(
          console.error,
        );
        dispatch(deleteTape({set: props.set.name, tape: file.episode}));
      }
    }
  };

  const renderOpenButton = () => {
    return (
      <View style={styles.animatedButtonContainer}>
        {fullProgressCalc < 100 && downloadingAll && (
          <ReanimatedArc
            color={colors.text}
            style={{position: 'absolute'}}
            diameter={38}
            width={2}
            arcSweepAngle={fullProgressCalc * 3.6 ?? 0}
            // arcSweepAngle={(75 * 3.6) ?? 0}
            animationDuration={200}
            lineCap="round"
          />
        )}
        <Animated.View style={[styles.openButton, buttonStyle]}>
          <IconEntypo size={22} name="chevron-right" color={colors.text} />
        </Animated.View>
      </View>
    );
  };

  const pressToggle = () => {
    const timeSinceIn = Date.now() - pressTimeRef.current;

    if (timeSinceIn < 170) setOpen(!open);
  };

  const renderInner = (preview = false) => {
    return (
      <View
        style={
          preview && open && {height: Dimensions.get('window').height / 2}
        }>
        <View style={[styles.backplate, {height: Math.min(tapeHeight, 90)}]}>
          <IconIonicons
            name={
              isFavorite
                ? dragMode === 1
                  ? 'heart-dislike-sharp'
                  : 'heart-dislike-outline'
                : dragMode === 1
                ? 'heart-sharp'
                : 'heart-outline'
            }
            size={30}
            color={
              dragMode === 0
                ? colors.text
                : isFavorite
                ? colors.primary
                : colors.red
            }
          />
        </View>
        <PanGestureHandler
          ref={panRef}
          minDist={30}
          onGestureEvent={panHandler}
          simultaneousHandlers={[props.scrollRef]}>
          <Animated.View style={[styles.animatedContainer, panStyle]}>
            <Animated.View
              onLayout={e => {
                setTapeHeight(e.nativeEvent.layout.height);
              }}
              style={[
                styles.audioSet,
                {borderLeftWidth: 6, borderLeftColor: props.set.icon},
                heightStyle,
              ]}
              key={props.set.name}>
              <View style={styles.topContainer}>
                <Pressable
                  style={{width: '100%', flexDirection: 'row'}}
                  onPressIn={() => (pressTimeRef.current = Date.now())}
                  onPress={pressToggle}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.author}>Richard L. Johnson</Text>
                    <Text
                      style={styles.title}
                      adjustsFontSizeToFit
                      numberOfLines={1}>
                      {props.set.name}
                    </Text>
                    <Text style={styles.subtitle}>
                      {filesLength(props.set)} Tapes
                    </Text>
                  </View>
                  <View style={styles.openButtonContainer}>
                    {isFavorite && (
                      <IconIonicons
                        style={{right: 4}}
                        size={14}
                        name="heart"
                        color={colors.red}
                      />
                    )}
                    {anyDownloaded ? (
                      renderOpenButton()
                    ) : (
                      <Pressable onPress={downloadSet}>
                        <View style={styles.downloadButton}>
                          <IconIonicons
                            size={25}
                            name="md-download-outline"
                            color={colors.primary}
                          />
                        </View>
                      </Pressable>
                    )}
                    {/*<Pressable onPress={toggleFavorite} style={styles.favoriteContainer} hitSlop={15}>*/}
                    {/*  {*/}
                    {/*    isFavorite ?*/}
                    {/*      <IconIonicons name={"md-heart"} color={colors.red} size={22}></IconIonicons> :*/}
                    {/*      <IconIonicons name={"md-heart-outline"} color={colors.text} size={22}></IconIonicons>*/}

                    {/*  }*/}
                    {/*</Pressable>*/}
                  </View>
                </Pressable>
              </View>
              <View style={styles.audioContainer}>
                <View onLayout={layoutContent}>
                  {showOpen && (
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
                      <AudioSetFiles set={props.set} downloadData={downloads} />
                    </>
                  )}
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  };

  const menuShowClose = () => {};

  const menuHideOpen = () => {};

  if (Platform.OS === 'ios') {
    return renderInner(false);
  }

  return (
    <ContextMenuView
      // isContextMenuEnabled={!open}
      previewConfig={{
        previewType: 'CUSTOM',
        previewSize: 'INHERIT',
        preferredCommitStyle: 'pop',
        isResizeAnimated: false,
        // borderRadius?: number,
        // backgroundColor?: DynamicColor | string,
        // targetViewNode?: number,
      }}
      onMenuWillShow={menuShowClose}
      onMenuDidHide={menuHideOpen}
      renderPreview={() => renderInner(true)}
      shouldWaitForMenuToHideBeforeFiringOnPressMenuItem={true}
      lazyPreview={true}
      menuConfig={{
        menuTitle: `${props.set.name}`,
        menuItems: [
          {
            actionKey: 'toggleFavorite',
            actionTitle: isFavorite
              ? 'Remove From Favorites'
              : 'Add to Favorites',
            icon: {
              type: 'IMAGE_SYSTEM',
              imageValue: {
                systemName: isFavorite ? 'heart.slash' : 'heart',
              },
            },
          },
          allDownloaded || {
            actionKey: 'downloadAll',
            actionTitle: 'Download all Tapes',
            icon: {
              type: 'IMAGE_SYSTEM',
              imageValue: {
                systemName: 'square.and.arrow.down.on.square',
              },
            },
          },
          anyDownloading && {
            actionKey: 'cancelAll',
            actionTitle: 'Cancel Downloads',
            icon: {
              type: 'IMAGE_SYSTEM',
              imageValue: {
                systemName: 'square.and.arrow.down.on.square',
              },
            },
          },
        ],
      }}
      onPressMenuItem={({nativeEvent}) => {
        if (nativeEvent.actionKey === 'toggleFavorite') toggleFavorite();
        if (nativeEvent.actionKey === 'downloadAll') downloadSet();
        if (nativeEvent.actionKey === 'cancelAll') cancelAllDownloads();
      }}>
      {renderInner(false)}
    </ContextMenuView>
  );
};

AudioSet.propTypes = {
  set: PropTypes.object,
  setIndex: PropTypes.number,
  scrollRef: PropTypes.any,
  currentOpen: PropTypes.string,
  setCurrentOpen: PropTypes.func,
  renderId: PropTypes.string,
};

const styles = StyleSheet.create({
  backplate: {
    width: '100%',
    paddingRight: 5,
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    // paddingVertical: 5,
    backgroundColor: colors.background3,
    position: 'absolute',
  },
  favoriteContainer: {
    marginLeft: 5,
  },
  author: {
    fontFamily: 'avenir',
    fontSize: 14,
    color: colors.text,
  },
  animatedButtonContainer: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionTitleContainer: {
    flexDirection: 'row',
  },
  descriptionTitle: {
    fontSize: 18,
    color: colors.primary,
    marginLeft: 5,
    fontFamily: 'Baloo 2',
  },
  description: {
    fontSize: 16,
    paddingHorizontal: 2,
    fontFamily: 'Baloo 2',
    color: colors.primary,
  },
  descriptionContainer: {
    width: '100%',
    backgroundColor: colors.background3,
    paddingVertical: 8,
    borderRadius: 5,
    paddingHorizontal: 12,
  },

  descriptionContainerOuter: {
    width: '100%',
    paddingHorizontal: 5,
  },
  downloadButton: {
    padding: 9,
    // width: 42,
    // height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background3,
    borderRadius: 50,
  },
  openButtonContainer: {
    justifyContent: 'center',
    marginRight: 5,
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  openButton: {
    padding: 6,
    backgroundColor: colors.background3,
    borderRadius: 50,
  },
  animatedContainer: {
    // marginTop: 15,
    overflow: 'hidden',
    borderRadius: 10,
    // flex: 1,
    // padding: 3,
  },
  audioContainer: {
    // height: 260,
    // flex: 1,
    width: '100%',
  },
  topContainer: {
    flexDirection: 'row',
    height: 75,
    alignItems: 'center',
  },
  audioOpen: {
    height: 300,
  },
  audioSet: {
    // flex: 1,
    minHeight: 65,
    width: '100%',
    backgroundColor: colors.background2,
    borderRadius: 10,
    // height: "100%",
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 5,
    // justifyContent: "center",
    flexDirection: 'column',
    // elevation: 2,
    // marginBottom: 0
  },
  setIcon: {
    backgroundColor: '#71A8FA',
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  titleContainer: {
    flexDirection: 'column',
    paddingLeft: 0,
    height: 62,
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: 4,
  },
  title: {
    fontFamily: 'Roboto',
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
    fontFamily: 'Baloo 2',
  },
});
export default AudioSet;
