import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  EventSubscription,
  NativeSyntheticEvent,
  LayoutAnimation, Animated, Easing, TouchableWithoutFeedback, Dimensions
} from 'react-native';
import WritingCard from "./components/writing-card";
import {ChangeEvent, Ref, RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {LetterBox} from "./components/animations-letter";
import {GenieCard} from "./components/animations-page";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import useSettings from "../hooks/settings";
import useStats from "../hooks/stats";
import {Provider, Snackbar, Surface} from "react-native-paper";
import {loadBgImage} from "./helper";
import InfoModal from "./components/info-modal";
import useStat from "../hooks/stats";

const settings = { //Temp settings (to-do: move to kv store and change with settings page)
  freewrite: {
    backgroundImage: true,
    showAnimations: true,

  }
}


const Freewriting = (props: any) => {
  const [content, setContent] = useState("")
  const [contentHeight, setContentHeight] = useState(0)
  const [placeholderText, setPlaceholderText] = useState("Starting is the hardest part...");
  const [sessionPages, setSessionPages] = useState(0);
  const inputRef = useRef(null);

  //Trash mode related
  const [trashMode, setTrashMode] = useState(0)
  const [trashFeedbackVisible, setTrashFeedbackVisible] = useState(false)

  //Trash mode 0 animation state
  const [genieVisible, setGenieVisible] = useState(false);
  const [genieContent, setGenieContent] = useState<string>("");

  //Trash mode 1 animation state
  const [letterStack, setLetterStack] = useState([]);

  //Modal state
  const [modalVisible, setModalVisible] = useState(false);

  //Stats/settings
  const [pagesStat, setPagesStat] = useStat("freewriting.pages");
  const [bgStat, setBgStat] = useStat("freewriting.bg");


  useEffect(() => {
    //Load unsplash background
    if (bgStat) {
      // let bgImage =
    }

    // Show info modal
    setModalVisible(true);
  }, [])


  //Input change callbacks
  const handleLayout = (event: NativeSyntheticEvent<any>) => {
    const height = event.nativeEvent.contentSize.height;
    setContentHeight(height);

    if (height >= 420 && !genieVisible && trashMode === 0) { //On page completion run genie animation
      const tempContent = content;

      setContent("");
      setGenieVisible(true)
      setGenieContent(tempContent);
      setPlaceholderText("") //remove placeholder on subsequent pages
      incrementSessionPages();

      setPagesStat(pagesStat + 1)
    }

    if (content.includes("\n")) { // Disable newlines
      setContent(content.replace(/\n/g, ""));
    }
  }
  const handleContent = async (event: NativeSyntheticEvent<any>) => {
    const text = event.nativeEvent.text;
    const lastChar = text.substring(text.length - 1)
    const firstChar = text.substring(0, 1)

    if (contentHeight >= 400 && trashMode === 1) { //On line completion trash mode 1
      setContent(text.substring(1))
      let letterId = Math.random().toString(36).substr(2, 9);

      setLetterStack(stack => stack.concat({
        char: firstChar,
        id: letterId,
      }))

    } else {
      //Force text to clear if input is too fast
      if (content.length === 0) {
        setContent(lastChar)
      } else setContent(text) // fucked up placement of default functionality
    }
  }

  //Reset animation functions
  const resetGenie = () => setGenieVisible(false);
  const resetLetter = (id: string) => setLetterStack(stack => stack.filter(el => el.id !== id))

  const toggleTrashMode = () => {
    setTrashMode(mode => mode ? 0 : 1);
    setTrashFeedbackVisible(true)
  }

  const incrementSessionPages = () => setSessionPages(pages => pages + 1);

  const getLetterBoxes = () => { //Map animation letters on type
    return trashMode === 1 && letterStack.map(obj => (
      <LetterBox
        key={obj.id}
        style={styles.letterBox}
        letterContent={obj.char}
        complete={resetLetter}
        id={obj.id}
      />
    ));
  }

  return (
    <>
      <View style={styles.container}>
        <Text>{pagesStat}</Text>
        <WritingCard
          placeholder={placeholderText}
          editable={true}
          handleLayout={handleLayout}
          content={content}
          setContent={handleContent}
        />
        {/* LetterBoxes for letter animation */}
        {getLetterBoxes()}
        <View style={styles.trashIcon}>
          <TouchableWithoutFeedback onPress={toggleTrashMode}>
            <View style={{padding: 7}}>
              <FontAwesomeIcon icon={trashMode == 0 ? ['far', 'trash-alt'] : ['fas', 'recycle']} size={26}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Snackbar visible={trashFeedbackVisible} onDismiss={() => setTrashFeedbackVisible(false)} duration={2000}>
        {trashMode === 0 ? "pages will be deleted" : "notes will scroll down"} as you write.
      </Snackbar>
      {/* GenieCard for page completion animation */}
      {genieVisible && <GenieCard
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
  }
});
