import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  EventSubscription,
  NativeSyntheticEvent,
  LayoutAnimation, Animated, Easing, TouchableWithoutFeedback, Dimensions, ImageBackground, Keyboard
} from 'react-native';
import WritingCard from "./components/writing-card";
import {ChangeEvent, Ref, RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Linking} from 'react-native';

import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {Provider, Snackbar, Surface} from "react-native-paper";

import InfoModal from "./components/info-modal";
import Background from "../components/background"
import GenieCard from "./components/animations-page";

import {setTime, setUrl} from "../store/features/backgroundSlice"
import {useDispatch, useSelector} from "react-redux"
import PageHeader from "../components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Freewriting = (props: any) => {
  const bgCredits = useSelector((state) => state.background.credits)
  const settings = useSelector((state) => state.settings.freewriting)
  const dispatch = useDispatch();

  const [content, setContent] = useState("")
  const [contentHeight, setContentHeight] = useState(0)
  const [placeholderText, setPlaceholderText] = useState("Starting is the hardest part...");

  //Trash related
  const [trashFeedbackVisible, setTrashFeedbackVisible] = useState(false)

  //Animation state
  const [genieVisible, setGenieVisible] = useState(false);
  const [genieContent, setGenieContent] = useState<string>("");

  //Modal state
  const [modalVisible, setModalVisible] = useState(false);

  //Input change callbacks
  const handleLayout = (event: NativeSyntheticEvent<any>) => {
    const height = event.nativeEvent.contentSize.height;
    setContentHeight(height);

    if (settings.showAnimations.value) {
      if (height >= 420 && !genieVisible) { //On page completion run genie animation
        const tempContent = content;

        setContent("");
        setGenieVisible(true)
        setGenieContent(tempContent);
        setPlaceholderText("") //remove placeholder on subsequent pages
      }
    } else {
      if (height >= 420) { //On page completion run genie animation
        setContent("");
        setPlaceholderText("") //remove placeholder on subsequent pages
      }
    }

    // if (content.includes("\n")) { // Disable newlines
    //   setContent(content.replace(/(.*)\n/g, "$1"));
    //   Keyboard.dismiss()
    // }
  }

  const handleContent = async (event: NativeSyntheticEvent<any>) => {
    const text = event.nativeEvent.text;
    const lastChar = text.substring(text.length - 1)
    const firstChar = text.substring(0, 1)

    if (text === "reset") AsyncStorage.clear()

    //Force text to clear if input is too fast
    if (content.length === 0) {
      setContent(lastChar)
    } else setContent(text) // fucked up placement of default functionality
  }
  //Reset animation functions
  const resetGenie = () => setGenieVisible(false);

  return (
    <>
      <Background>
        <PageHeader
          settingsIcon="info-circle"
          titleWhite={settings.showBackground.value}
          settingsCallback={() => props.navigation.push("settings", {
            page: "freewriting",
            pageTitle: "Freewriting Settings"
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
            <Text style={[styles.credit, {display: settings.showBackground.value ? "flex" : "none"}]}>
              Photo by&nbsp;
              <Text style={styles.creditName} onPress={() => Linking.openURL(bgCredits?.link)}>
                {bgCredits?.name.replace("  ", " ")}
              </Text>
            </Text>
          </WritingCard>
        </View>
      </Background>
      {/* GenieCard for page completion animation */}
      {settings.showAnimations.value &&
      genieVisible &&
      <GenieCard
          style={styles.genieCard}
          genieVisible={genieVisible}
          genieContent={genieContent}
          resetGenie={resetGenie}
      />}
      <Provider>
        <InfoModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      </Provider>
    </>
  );
};

export default Freewriting;

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
  trashIcon: {
    position: "absolute",
    bottom: 18,
    right: 18,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
