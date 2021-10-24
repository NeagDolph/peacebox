import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  EventSubscription,
  NativeSyntheticEvent,
  LayoutAnimation, Animated, Easing, TouchableWithoutFeedback, Dimensions, ImageBackground, Keyboard, Pressable
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


const modalContent = require("./info.json");


const Freewriting = (props: any) => {
  const bgCredits = useSelector((state) => state.background.credits)
  const settings = useSelector((state) => state.settings.freewriting)
  const dispatch = useDispatch();

  const [content, setContent] = useState("")
  const [contentHeight, setContentHeight] = useState(0)
  const [placeholderText, setPlaceholderText] = useState("Starting is the hardest part...");

  //Animation state
  const [genieVisible, setGenieVisible] = useState(false);
  const [genieContent, setGenieContent] = useState<string>("");

  //Modal state
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!settings.used) {
      setImmediate(() => {
        setModalVisible(true);
        dispatch(setUsed("freewriting"))
      })
    }
  }, [])

  const showAnimation = () => {
    if (settings.showAnimations) {
      setGenieContent(content);
      setGenieVisible(true)
    }
    setContent("");
    setPlaceholderText("")
  }

  //Input change callbacks
  const handleLayout = (event) => {
    setContentHeight(event.nativeEvent.contentSize.height);

    // Disable newlines
    if (content.includes("\n")) {
      setContent(content.replace(/(.*)\n/g, "$1"));
      Keyboard.dismiss();
    }
  }

  const handleContent = async (event: NativeSyntheticEvent<any>) => {
    if (contentHeight >= 420) showAnimation()
    else setContent(event.nativeEvent.text)
  }
  //Reset animation functions
  const resetGenie = () => setGenieVisible(false);

  return (
    <>
      <PrefersHomeIndicatorAutoHidden/>
      <Background>
        <PageHeader
          settingsIcon="information"
          titleWhite={settings.showBackground}
          settingsCallback={() => props.navigation.push("settings", {
            page: "freewriting",
            pageTitle: "Freewriting Settings",
          })}
          title="Free Writing"
          navigation={props.navigation}
        />
        <View style={styles.container}>
          <WritingCard
            placeholder={placeholderText}
            editable={true}
            handleLayout={handleLayout}
            content={content}
            setContent={handleContent}
          >
            <Text style={[styles.credit, {display: settings.showBackground ? "flex" : "none"}]}>
              Photo by&nbsp;
              <Text style={styles.creditName} onPress={() => Linking.openURL(bgCredits?.link)}>
                {bgCredits?.name.replace("  ", " ")}
              </Text>
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
    padding: 30,
    paddingTop: 10,
    zIndex: 0,
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
