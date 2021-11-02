import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  EventSubscription,
  NativeSyntheticEvent,
  LayoutAnimation,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
  Keyboard,
  Pressable,
  ScrollView
} from 'react-native';
import WritingCard from "./components/writing-card";
import {ChangeEvent, Ref, RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Linking} from 'react-native';
import PrefersHomeIndicatorAutoHidden from 'react-native-home-indicator';

import {Provider, Snackbar, Surface} from "react-native-paper";

import InfoModal from "./components/info-modal";
import Background from "../components/background"
import GenieCard from "./components/animations-page";

import {setUsed} from "../store/features/settingsSlice"
import {useDispatch, useSelector} from "react-redux"
import PageHeader from "../components/header";
import crashlytics from "@react-native-firebase/crashlytics";
import haptic from "../helpers/haptic";


const modalContent = require("./info.json");


const Freewriting = (props: any) => {
  const bgCredits = useSelector((state) => state.background.credits)
  const settings = useSelector((state) => state.settings.freewriting)
  const dispatch = useDispatch();

  const [content, setContent] = useState("")
  const [contentHeight, setContentHeight] = useState(0)
  const [placeholderText, setPlaceholderText] = useState("Just start typing...");
  const inputRef = useRef<any>(null);
  const clearedRef = useRef(null);


  //Animation state
  const [genieVisible, setGenieVisible] = useState(false);
  const [genieContent, setGenieContent] = useState<string>("");

  //Modal state
  const [modalVisible, setModalVisible] = useState(false);

  //Background State
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)

  useEffect(() => {
    crashlytics().log("Page Opened: Freewriting")
    if (!settings.used) {
      setTimeout(() => {
        setModalVisible(true);
        dispatch(setUsed("freewriting"))
      }, 0)
    }
  }, [])

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
      haptic(2);
      showAnimation();

      inputRef.current.clear()
      setContent(" ")
      setTimeout(() => {
        setContent("");
        setPlaceholderText("");
      }, 0)
    } else setContent(event.nativeEvent.text)
  }

  //Reset animation functions
  const resetGenie = () => setGenieVisible(false);

  const onBgLoad = () => {
    setBackgroundLoaded(true);
  }

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={{height: "100%"}} scrollEnabled={false}>
        <PrefersHomeIndicatorAutoHidden/>
        <Background showBackground={settings.showBackground} onLoad={onBgLoad}>
          <PageHeader
            settingsIcon="information"
            titleWhite={settings.showBackground}
            settingsCallback={() => props.navigation.push("settings", {
              page: "freewriting",
              pageTitle: "Freewriting Settings",
            })}
            title="Freewriting"
          />
          <View style={styles.container}>
            <WritingCard
              placeholder={placeholderText}
              editable={true}
              handleLayout={handleLayout}
              content={content}
              inputRef={inputRef}
              setContent={handleContent}
            >
              <Text style={[styles.credit, {
                display: settings.showBackground ? "flex" : "none",
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

      </ScrollView>
      <Provider>
        <InfoModal content={modalContent} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
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
    paddingTop: 40,
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
    position: "absolute",
    bottom: -30,
    left: 0,
    padding: 5,
    fontSize: 12,
  },
  creditName: {
    fontWeight: "bold",
  },
});

export default Freewriting;
