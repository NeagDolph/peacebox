import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  NativeSyntheticEvent, Pressable, Dimensions, Alert,
} from 'react-native';
import WritingCard from "./components/writing-card";
import {ChangeEvent, Ref, RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Linking} from 'react-native';
import PrefersHomeIndicatorAutoHidden from 'react-native-home-indicator';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Provider, Snackbar, Surface} from "react-native-paper";

import Background from "../components/background"
import GenieCard from "./components/animations-page";

import {setUsed} from "../store/features/settingsSlice"
import {useDispatch, useSelector} from "react-redux"
import PageHeader from "../components/header";
import crashlytics from "@react-native-firebase/crashlytics";
import haptic from "../helpers/haptic";
import InfoContent from "./components/info-content";
import { colors } from '../config/colors';
import {TapGestureHandler} from "react-native-gesture-handler";


const Freewriting = (props: any) => {
  const bgCredits = useSelector((state) => state.background.credits)
  const settings = useSelector((state) => state.settings.freewriting)
  const dispatch = useDispatch();

  const [content, setContent] = useState("")
  const [contentHeight, setContentHeight] = useState(0)
  const [placeholderText, setPlaceholderText] = useState("Just start typing...");
  const inputRef = useRef<any>(null);
  const clearedRef = useRef(null);
  const sheetRef = useRef(null);


  //Animation state
  const [genieVisible, setGenieVisible] = useState(false);
  const [genieContent, setGenieContent] = useState<string>("");

  //Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [closeEnabled, setCloseEnabled] = useState(false)

  //Background State
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)

  useEffect(() => {
    crashlytics().log("Page Opened: Freewriting")
    if (!settings.used) {
      setTimeout(() => {
        setModalVisible(true);
        dispatch(setUsed("freewriting"))
      }, 200)
    }
  }, [])

  useEffect(() => {
    console.log("modalvisible", modalVisible)
    if (modalVisible) {
      sheetRef.current.snapTo(1)
    } else {
      sheetRef.current.snapTo(0);
    }
  }, [modalVisible])


  const showAnimation = () => {
    if (settings.showAnimations) {
      setGenieContent(content);
      setGenieVisible(true)
    }
  }

  //Input change callbacks
  const handleLayout = (event) => {
    setContentHeight(event.nativeEvent.contentSize.height);

    // Disable newlines
    if (content.includes("\n")) {
      // setContent(content.replace(/(.*)\n/g, "$1"));
    }
  }

  const handleContent = async (event: NativeSyntheticEvent<any>) => {
    if (contentHeight >= 420) {
      crashlytics().log("Freewriting page completed.");
      showAnimation();

      // inputRef.current.clear()
      setContent(" ")
      setTimeout(() => {
        setContent("");
        setPlaceholderText("");
      }, 0)
    } else setContent(event?.nativeEvent?.text ?? "")
  }

  //Reset animation functions
  const resetGenie = () => setGenieVisible(false);

  const onBgLoad = () => {
    setBackgroundLoaded(true);
  }

  const handleCloseInfo = () => setModalVisible(false)

  return (
    <>
      <View style={{height: "100%"}} pointerEvents={modalVisible ? "none" : "auto"}>
        <PrefersHomeIndicatorAutoHidden/>
        <Background showBackground={settings.showBackground} onLoad={onBgLoad} onPress={() => inputRef.current.blur()}>
          <PageHeader
            settingsIcon="cog"
            titleWhite={settings.showBackground}
            settingsCallback={() => props.navigation.push("settings", {
              page: "freewriting",
              pageTitle: "Freewriting Settings",
            })}
            title="Freewriting"
          />
          <View style={styles.container} pointerEvents='box-none'>
            <WritingCard
              placeholder={placeholderText}
              editable={true}
              handleLayout={handleLayout}
              content={content}
              inputRef={inputRef}
              setContent={handleContent}
            >

              <View style={styles.footerContainer}>
                <Text style={[styles.credit, {
                  opacity: settings.showBackground ? 1 : 0,
                  color: backgroundLoaded ? "white" : "black"
                }]}>
                  {backgroundLoaded ?
                    <>
                      Photo by&nbsp;
                      <Text
                        style={styles.creditName}
                        onPress={() => Linking.openURL(bgCredits?.link)}
                      >
                        {bgCredits?.name.replace("  ", " ")}
                      </Text>
                    </>
                    : "Loading background..."}
                </Text>
                <Pressable hitSlop={12} onPress={() => setModalVisible(true)}>
                  <Icon name="information" size={30} color={settings.showBackground ? colors.background : colors.primary}/>
                </Pressable>
              </View>
            </WritingCard>
          </View>
        </Background>
        {/* GenieCard for page completion animation */}
        {settings.showAnimations &&
        genieVisible &&
        <GenieCard
            style={styles.genieCard}
            genieVisible={genieVisible}
            genieContent={genieContent}
            resetGenie={resetGenie}
        />}

      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[0, 630]}
        onCloseEnd={handleCloseInfo}
        borderRadius={20}
        renderContent={() => <InfoContent modalVisible={modalVisible} handleClose={handleCloseInfo} closeEnabled={closeEnabled} setCloseEnabled={setCloseEnabled}/>}
        overflow={"visible"}
        enabledGestureInteraction={closeEnabled}
        enabledBottomInitialAnimation={true}
        springConfig={{mass: 2, damping: 30, stiffness: 150}}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "white",
    elevation: 2,
    justifyContent: "center"
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    zIndex: 0,
    paddingHorizontal: 40
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
    color: "#d6d6d6",
    // position: "absolute",
    // bottom: -30,
    // left: 0,
    padding: 5,
    fontSize: 12,
  },
  creditName: {
    fontWeight: "bold",
  },
});

export default Freewriting;
