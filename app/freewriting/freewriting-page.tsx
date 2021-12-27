import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {AppState, Dimensions, Linking, NativeSyntheticEvent, Pressable, StyleSheet, Text, View,} from 'react-native';
import WritingCard from "./components/writing-card";
import PrefersHomeIndicatorAutoHidden from 'react-native-home-indicator';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Background from "../components/background"
import GenieCard from "./components/animations-page";

import {setUsed, setSetting} from "../store/features/settingsSlice"
import {useDispatch, useSelector} from "react-redux"
import PageHeader from "../components/header";
import crashlytics from "@react-native-firebase/crashlytics";
import haptic from "../helpers/haptic";
import InfoContent from "./components/info-content";
import {colors} from '../config/colors';
import FullscreenCard from "./components/fullscreen-card";
import useSession from "./components/session-hook";


const Freewriting = (props: any) => {
  const bgCredits = useSelector((state) => state.background.credits)
  const settings = useSelector((state) => state.settings.freewriting)
  const fullscreen = useSelector((state) => state.settings.freewriting.fullscreen)

  const dispatch = useDispatch();


  //Pages session manager hook
  const {pages, addPage} = useSession();

  const setFullScreen = (value) => dispatch(setSetting({page: "freewriting", setting: "fullscreen", value}));

  const [content, setContent] = useState("")
  // const [contentHeight, setContentHeight] = useState(0)
  const [placeholderText, setPlaceholderText] = useState("Just start typing...");
  const [editable, setEditable] = useState(true)

  const isEditable = useRef(true);
  const contentHeight = useRef(0);


  const inputRef = useRef<any>(null);
  const tempInputRef = useRef(null)
  const clearedRef = useRef(null);
  const sheetRef = useRef(null);
  const startedDelete = useRef(null)


  //Background State
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  // const [fullscreen, setFullScreen] = useState(false)

  //Animation state
  const [genieVisible, setGenieVisible] = useState(false);
  const [genieContent, setGenieContent] = useState<string>("");
  const fullscreenValue = useSharedValue(Number(fullscreen ?? false));

  //Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [closeEnabled, setCloseEnabled] = useState(false);

  //Activity state
  const [activityBg, setActivityBg] = useState(false)

  useEffect(() => {
    crashlytics().log("Page Opened: Freewriting")
    if (!settings.used) {
      setTimeout(() => {
        setModalVisible(true);
        dispatch(setUsed("freewriting"))
      }, 200)
    }

    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState.match(/^background$/)) {
        clearFull()
      }

      if (nextAppState.match(/^inactive$/)) {
        setActivityBg(true);
      } else if (nextAppState.match(/^active$/)) {
        setActivityBg(false)
      }
    });

    return () => {
      subscription.remove();
    }
  }, [])

  useEffect(() => {
    if (modalVisible) {
      sheetRef.current.snapTo(1)
    } else {
      sheetRef.current.snapTo(0);
    }
  }, [modalVisible])

  //Control animations for fullscreen button
  useEffect(() => {
    fullscreenValue.value = withTiming(Number(fullscreen), {duration: 200})
  }, [fullscreen])

  //Input change callbacks
  const handleLayout = (event) => {
    contentHeight.current = event.nativeEvent.contentSize.height
  }

  const handleContent = async (event: NativeSyntheticEvent<any>) => {
    if (contentHeight.current >= 400) { //Page completion
      addPage();
      clearFull();
      if (!fullscreen) showAnimation();
      haptic(0)
      // setTimeout(() => {
      //   inputRef.current.selection(100, 100)
      // }, 100)

    } else setContent(event?.nativeEvent?.text ?? "")
  }

  const clearFull = () => setContent("")

  const fullscreenToggle = () => {
    setFullScreen(!fullscreen);
    setTimeout(() => {
      inputRef.current.focus()
    }, 10)
  }


  //Reset animation functions
  const resetGenie = () => setGenieVisible(false);

  const showAnimation = () => {
    if (settings.showAnimations) {
      setGenieContent(content);
      setGenieVisible(true)
    }
  }

  const fullscreenStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(fullscreenValue.value, [0, 1], [-32, 0]) },
        { translateY: interpolate(fullscreenValue.value, [0, 1], [35, 0]) },
      ],
    };
  });

  const containerStyles = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(fullscreenValue.value, [0, 1], [40, 18]),
      marginHorizontal: interpolate(fullscreenValue.value, [0, 1], [40, 0])
    }
  })



  const handleCloseInfo = () => setModalVisible(false)

  const writingCard = () => {
    return (
      <>
        <Pressable style={styles.pressable} onPress={() => inputRef.current.blur()} hitSlop={0}/>
        <Animated.View style={[styles.container, containerStyles]}>
          <WritingCard
            placeholder={placeholderText}
            editable={true}
            handleLayout={handleLayout}
            content={content}
            clearFull={clearFull}
            inputRef={inputRef}
            setContent={handleContent}
            activityBg={activityBg}
            fullscreen={fullscreen}
            pages={pages}
            settings={settings}
          >
            <View style={styles.footerContainer}>
              <Text style={[styles.credit, {
                opacity: (settings.showBackground && !fullscreen) ? 1 : 0,
              }]}>
                {backgroundLoaded ?
                  <>
                    Photo by&nbsp;
                    <Text
                      style={styles.creditName}
                      onPress={() => Linking.openURL(bgCredits?.link)}
                    >
                      {bgCredits?.name?.replace("  ", " ")}
                    </Text>
                  </>
                  : "Loading background..."}
              </Text>
              <Pressable hitSlop={12} onPress={() => setModalVisible(true)}>
                <Icon
                  name="information"
                  size={30}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </WritingCard>
        </Animated.View>
        {settings.showAnimations &&
        genieVisible &&
        <GenieCard
            style={styles.genieCard}
            genieVisible={genieVisible}
            genieContent={genieContent}
            resetGenie={resetGenie}
        />}
      </>
    )
  }

  return (
    <>
      <View style={styles.pageContainer} pointerEvents={modalVisible ? "none" : "auto"}>
        <PrefersHomeIndicatorAutoHidden/>
        <Animated.View style={[styles.headerContainer, fullscreenStyles]}>
          <Pressable hitSlop={5} onPress={() => fullscreenToggle()}>
            <View style={styles.fullScreen}>
              <Icon name="arrow-expand" size={27} color={colors.primary}/>
            </View>
          </Pressable>
        </Animated.View>
        <Background showBackground={settings.showBackground} opacity={fullscreenValue} setLoaded={setBackgroundLoaded} loaded={backgroundLoaded}>
          <PageHeader
            settingsIcon="cog"
            titleWhite={settings.showBackground}
            settingsCallback={() => props.navigation.push("settings", {
              page: "freewriting",
              pageTitle: "Freewriting Settings",
            })}
            title="Freewriting"
          />
          {writingCard()}

        </Background>
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[0, 630]}
        onCloseEnd={handleCloseInfo}
        borderRadius={20}
        renderContent={() => <InfoContent modalVisible={modalVisible} handleClose={handleCloseInfo}
                                          closeEnabled={closeEnabled} setCloseEnabled={setCloseEnabled}/>}
        overflow={"visible"}
        enabledGestureInteraction={closeEnabled}
        enabledBottomInitialAnimation={true}
        springConfig={{mass: 2, damping: 30, stiffness: 150}}
      />
    </>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: "100%",
    backgroundColor: colors.background
  },
  fullScreen: {
    borderRadius: 40,
    backgroundColor: "rgba(140, 120, 140, 0.2)",
    // width: 50,
    padding: 9,
    marginRight: 10,
    right: 0
  },
  headerContainer: {
    zIndex: 10,
    // width: "100%",
    // justifyContent: "flex-end",
    // flexDirection: "column",
    position: "absolute",
    // top: 125,
    // right: 42,
    top: 90,
    right: 10,
  },
  pressable: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    top: 80,
    left: 0
  },
  tempInput: {
    // position: "absolute",
    // top: -300,
    // opacity: 0,
    height: 20,
    width: "100%",
    backgroundColor: colors.white
  },
  footerContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    // height: 30,
    marginTop: 5,
    paddingRight: 3,
  },
  settings: {
    width: "100%",
    height: 60,
    position: "relative",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    elevation: 2,
    justifyContent: "center"
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 40,
    zIndex: 0,
    // paddingHorizontal: 40
  },
  genieCard: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    padding: 30,
    height: 440,
    borderRadius: 150
  },
  letterBox: {
    position: "absolute",
    top: 30,
    left: 50
  },
  credit: {
    color: colors.primary,
    // position: "absolute",
    // bottom: -30,
    // left: 0,
    padding: 5,
    fontSize: 12,
  },
  creditName: {
    fontWeight: "bold",
    color: colors.primary
  },
});

export default Freewriting;
