import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Dimensions, Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import WritingCard from "./components/writing-card";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { setAdjustNothing } from "rn-android-keyboard-adjust";

import Background from "../components/background";
import GenieCard from "./components/animations-page";

import { setSetting, setUsed } from "../store/features/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/header";
import haptic from "../helpers/haptic";
import { colors } from "../config/colors";
import useSession from "./components/session-hook";
import InfoContent from "./components/info-content";

let PrefersHomeIndicatorAutoHidden;

if (Platform.OS === 'ios') {
  PrefersHomeIndicatorAutoHidden =
    require('react-native-home-indicator').PrefersHomeIndicatorAutoHidden;
}

const Freewriting = (props: any) => {
  // @ts-ignore
  const bgCredits = useSelector(state => state.background.credits);

  // @ts-ignore
  const settings = useSelector(state => state.settings.freewriting);

  // @ts-ignore
  const fullscreen = useSelector(state => state.settings.freewriting.fullscreen);

  const dispatch = useDispatch();

  //Pages session manager hook
  const { pages, addPage } = useSession();

  const setFullScreen = value =>
    dispatch(setSetting({ page: "freewriting", setting: "fullscreen", value }));

  // const [content, setContent] = useState("")
  // const [contentHeight, setContentHeight] = useState(0)

  function clearContent() {
    setTimeout(() => inputRef.current.clear(), 1);
  }

  const placeholderText = 'Just start typing...';
  let [currentText, setCurrentText] = useState<string>();

  const [lineHeight, setLineHeight] = useState(25);

  const inputRef = useRef<TextInput>();
  const lastClear = useRef(Date.now());
  const sheetRef = useRef<BottomSheet>(null);

  const getInputRef = (ref: TextInput) => inputRef.current = ref;

  //Background State
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  // const [fullscreen, setFullScreen] = useState(false)

  //Animation state
  const [genieVisible, setGenieVisible] = useState(false);
  const [genieContent, setGenieContent] = useState<string>("");
  const fullscreenValue = useSharedValue(fullscreen ? 1 : 0);

  //Modal state
  const [modalVisible, setModalVisible] = useState(false);

  //Activity state
  const [activityBg, setActivityBg] = useState(false);

  useEffect(() => {
    // crashlytics().log('Page Opened: Freewriting');
    setAdjustNothing();

    if (!settings.used) {
      setTimeout(() => {
        setModalVisible(true);
        dispatch(setUsed("freewriting"));
      }, 200);
    }

    AppState.addEventListener("change", nextAppState => {
      if (nextAppState.match(/^background$/)) {
        clearContent();
      }

      if (nextAppState.match(/^inactive$/)) {
        setActivityBg(true);
      } else if (nextAppState.match(/^active$/)) {
        setActivityBg(false);
      }
    });
  }, []);

  useEffect(() => {
    if (modalVisible) {
      sheetRef.current.expand();
    } else {
      sheetRef.current.close();
    }
  }, [modalVisible]);

  //Control animations for fullscreen button
  useEffect(() => {
    fullscreenValue.value = withTiming(fullscreen ? 1 : 0, { duration: 200 });
  }, [fullscreen]);

  //Input size change callback
  const handleLayout = event => {
    const contentHeight = event.nativeEvent.contentSize.height;

    const pageHeight = lineHeight * 15;

    const timeSinceClear = Date.now() - lastClear.current;

    //Page completion
    if (contentHeight >= pageHeight && timeSinceClear > 1000) {
      addPage();
      if (!fullscreen) showAnimation();
      clearContent();
      haptic(0);
    }
  };

  const fullscreenToggle = (): void => {
    setFullScreen(!fullscreen);
    setTimeout(() => {
      if (inputRef.current) {
        setInputFocus(true);
      }
    }, 10);
  };

  //Reset animation functions
  const resetGenie = (): void => setGenieVisible(false);

  const showAnimation = (): void => {
    if (settings.showAnimations) {
      setGenieContent(currentText);
      setGenieVisible(true);
    }
  };

  const fullscreenStyles = useAnimatedStyle(() => {
    // let topFullscreenOffset = Platform.OS == "ios" ? 35;

    return {
      transform: [
        { translateX: interpolate(fullscreenValue.value, [0, 1], [-32, 0]) },
        { translateY: interpolate(fullscreenValue.value, [0, 1], [32, 0]) }
      ]
    };
  });

  const containerStyles = useAnimatedStyle(() => {

    return {
      marginTop: interpolate(fullscreenValue.value, [0, 1], [40, 25]),
      marginHorizontal: interpolate(fullscreenValue.value, [0, 1], [40, 0])
      // transform: [
      //   {scale: interpolate(fullscreenValue.value, [0, 1], [0.9, 1.5])}
      // ]
    };
  });

  const setInputFocus = (focus: boolean): void => {
    if (inputRef.current) {
      if (focus)
        inputRef.current.focus();
      else
        inputRef.current.blur();
    }
  }

  const getInputFocus = (): boolean => {
    if (inputRef.current) {
      return inputRef.current.isFocused();
    }
  };

  const handleCloseInfo = () => setModalVisible(false);

  const handleSheetChange = useCallback((index: number) => {
    if (index == -1) {
      setModalVisible(false);
    }
  }, []);

  const writingCard = () => {
    return (
      <>
        <Pressable
          style={styles.pressable}
          onPress={() => setInputFocus(false)}
          hitSlop={0}
        />
        <Animated.View style={[styles.container, containerStyles]}>
          <WritingCard
            placeholder={placeholderText}
            editable={true}
            handleLayout={handleLayout}
            clearContent={clearContent}
            setInputRef={getInputRef}
            activityBg={activityBg}
            fullscreen={fullscreen}
            setCurrentText={setCurrentText}
            pages={pages}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            settings={settings}>
            <View style={styles.footerContainer}>
              <Text
                style={[
                  styles.credit,
                  {
                    opacity: settings.showBackground && !fullscreen ? 1 : 0,
                  },
                ]}>
                {backgroundLoaded ? (
                  <>
                    Photo by&nbsp;
                    <Text
                      style={styles.creditName}
                      onPress={() => Linking.openURL(bgCredits?.link)}>
                      {bgCredits?.name?.replace('  ', ' ')}
                    </Text>
                  </>
                ) : (
                  'Loading background...'
                )}
              </Text>
              <Pressable hitSlop={12} onPress={() => setModalVisible(true)}>
                <Icon name="information" size={30} color={colors.primary} />
              </Pressable>
            </View>
          </WritingCard>
        </Animated.View>
        {settings.showAnimations && genieVisible && (
          <GenieCard
            style={styles.genieCard}
            genieVisible={genieVisible}
            genieContent={genieContent}
            resetGenie={resetGenie}
          />
        )}
      </>
    );
  };

  let [closeEnabled, setCloseEnabled] = useState(false);
  return (
    <>
      <View
        style={styles.pageContainer}
        pointerEvents={modalVisible ? 'none' : 'auto'}>
        {Platform.OS === 'ios' && <PrefersHomeIndicatorAutoHidden />}
        <Animated.View style={[styles.headerContainer, fullscreenStyles]}>
          <Pressable hitSlop={5} onPress={() => fullscreenToggle()}>
            <View style={styles.fullScreen}>
              <Icon name="arrow-expand" size={27} color={colors.primary} />
            </View>
          </Pressable>
        </Animated.View>
        <Background
          showBackground={settings.showBackground}
          opacity={fullscreenValue}
          setLoaded={setBackgroundLoaded}
          loaded={backgroundLoaded}>
          <PageHeader
            settingsIcon="cog"
            titleWhite={settings.showBackground}
            settingsCallback={() =>
              props.navigation.push("settings", {
                page: "freewriting",
                pageTitle: "Freewriting Settings"
              })
            }
            title="Freewriting"
          />
          {writingCard()}
        </Background>
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[645]}
        index={-1}
        handleHeight={645}
        onChange={handleSheetChange}
        animateOnMount={false}
        enablePanDownToClose={closeEnabled}
        // springConfig={{mass: 3, damping: 50, stiffness: 150}}
      >
        <InfoContent
          modalVisible={modalVisible}
          handleClose={handleCloseInfo}
          closeEnabled={closeEnabled}
          setCloseEnabled={setCloseEnabled}
        />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
    backgroundColor: colors.background,
  },
  fullScreen: {
    borderRadius: 40,
    backgroundColor: 'rgba(140, 120, 140, 0.2)',
    // width: 50,
    padding: 9,
    marginRight: 10,
    right: 0,
  },
  headerContainer: {
    zIndex: 10,
    // width: "100%",
    // justifyContent: "flex-end",
    // flexDirection: "column",
    position: 'absolute',
    // top: 125,
    // right: 42,
    top: 90,
    right: 10,
  },
  pressable: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 80,
    left: 0,
  },
  tempInput: {
    // position: "absolute",
    // top: -300,
    // opacity: 0,
    height: 20,
    width: '100%',
    backgroundColor: colors.white,
  },
  footerContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    // height: 30,
    marginTop: 5,
    paddingRight: 3,
  },
  settings: {
    width: '100%',
    height: 60,
    position: 'relative',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 2,
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 40,
    zIndex: 0,
    // paddingHorizontal: 40
  },
  genieCard: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    padding: 30,
    height: 440,
    borderRadius: 150,
  },
  letterBox: {
    position: 'absolute',
    top: 30,
    left: 50,
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
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default Freewriting;
