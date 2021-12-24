import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
  StyleSheet,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Text,
  Dimensions,
  LayoutAnimation, Alert
} from 'react-native';
import PageHeader from "../components/header";
import Icon from "react-native-vector-icons/Entypo"
import {colors} from "../config/colors";
import {useDispatch, useSelector} from "react-redux";
import {addPattern, removePattern, editPattern, setEditVisible, setEditScroll} from "../store/features/breathingSlice";
import PatternItem from "./components/pattern-item";

import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import NumberPicker from "./components/numberpicker";
import {Provider} from "react-native-paper";
import {setUsed} from "../store/features/settingsSlice";
import FadeGradient from "../components/fade-gradient";
import haptic, {success} from "../helpers/haptic";
import GestureHandlerRootView, {NativeViewGestureHandler} from "react-native-gesture-handler";

import breathingGuide from '../guides/breathing-guide';
import {openedTutorial, guideNext, startTutorial, pushRestart, closedTutorial} from '../store/features/tutorialSlice';
import Tooltip from 'react-native-walkthrough-tooltip';
import useTooltip from "../components/tooltip-hook";
import crashlytics from "@react-native-firebase/crashlytics";

const modalContent = require("./info.json");


const BreathingPage = (props) => {
  const patterns = useSelector(state => state.breathing.patterns);
  const settings = useSelector((state) => state.settings.breathing)

  const tooltip = useTooltip();

  const breathingIndex = useSelector(state => state.tutorial.breathing.completion);
  const createdPattern = useSelector(state => state.tutorial.breathing.createdPattern);
  const completion = useSelector(state => state.tutorial.breathing.completion);
  const dispatch = useDispatch();


  const [editMode, setEditMode] = useState(false);
  const editMargin = useRef(new Animated.Value(6)).current;
  const buttonScaleOpacity = Animated.add(Animated.divide(editMargin, -6), 1);
  const buttonScaleHeight = Animated.multiply(buttonScaleOpacity, 50)
  const [buttonVisible, setButtonVisible] = useState(false)

  const [modalVisible, setModalVisible] = useState(false);

  const panRef = useRef(null)
  const scrollRef = useRef(null)
  const itemsScrollRef = useRef(null)

  const listenScrollY = useSelector(state => state.breathing.editScroll);

  useEffect(() => {
    if (breathingIndex === 5) itemsScrollRef.current.scrollTo({y: listenScrollY, animated: true})
  }, [listenScrollY])


  useEffect(() => {
    if (!settings.used) {
      setImmediate(() => {
        dispatch(setUsed("breathing"))
        // startGuide();


        setTimeout(startGuide, 500);

        // setModalVisible(true);
      });

    }

    // setTimeout(startGuide, 600);
  }, [])

  useEffect(() => {
    if (completion === 5) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut) //Tutorial new pattern animation
    }
  }, [completion])


  const startGuide = () => {
    dispatch(setEditScroll(0))
    dispatch(startTutorial("breathing"))
  }


  const confirmTutorial = () => {
    return Alert.alert(
      "Restart tutorial?",
      `Are you sure you want to start this tutorial?`,
      [
        {text: "Nevermind"},
        {
          text: "Confirm", onPress: () => {
            crashlytics().log("Pattern Tutorial restarted: ");
            props.navigation.goBack();
            setTimeout(startGuide, 500)
          }
        },
      ]
    );
  }


  const newPattern = () => {
    const newId = uuidv4();

    const patternObj = {
      id: newId,
      name: "New Pattern",
      sequence: [1, 2, 3, 4],
      totalDuration: 5,
      durationType: "Minutes",
      settings: {
        feedbackType: 2,
        breakBetweenCycles: false,
        breakSeconds: 0,
        alertFinish: true,
        pauseDuration: 5,
        pauseFrequency: 1
      }
    }

    dispatch(addPattern(patternObj));

    dispatch(closedTutorial("breathing"));

    setEditVisible(true);
    editPattern(newId, true)

      setTimeout(() => {
        dispatch(guideNext("breathing"))
      }, 1000);
  }

  const editPattern = (id, newPattern = false) => {
    props.navigation.navigate("Edit", {id, newPattern})
  };

  const usePattern = (id) => {
    setEditMode(false)
    props.navigation.navigate("Use", {id})
  };

  const renderPatterns = () => {
    let patternValues = Object.values(patterns);

    if (breathingIndex === 5 && createdPattern) patternValues = patternValues.sort((a,b) => a.id === createdPattern ? -1 : 1)

    return patternValues.map(el => {
      const item = <PatternItem
        key={el.id}
        id={el.id}
        editPattern={editPattern}
        panRef={panRef}
        usePattern={usePattern}
        deletePattern={deletePattern}
        patternData={el}
        buttonVisible={buttonVisible}
        editMode={editMode}
        scrollRef={scrollRef}
      />

      return item;
    });
  }

  const deletePattern = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    success();
    dispatch(removePattern(id))
  }


  return (
    <>
      <PageHeader
        title="Breathing"
        inlineTitle={true}
        shadow={false}
        settingsButton={true}
        titleWhite={false}
        settingsCallback={() => props.navigation.push("settings", {
          page: "breathing",
          pageTitle: "Breathing Settings",
          infoIcon: true,
          infoCallback: confirmTutorial
        })}/>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Patterns</Text>
          {tooltip(<TouchableOpacity onPress={newPattern}>
              <View style={styles.newButton}>
                <Icon name="plus" size={23} color={colors.accent}/>
              </View>
            </TouchableOpacity>, 0)}
        </View>
        <FadeGradient top={0.1} bottom={0}>
          <NativeViewGestureHandler ref={scrollRef} simultaneousHandlers={panRef}>
            <ScrollView style={styles.scrollView} ref={itemsScrollRef} bounces={false}>
              <View style={styles.patternList}>
                {renderPatterns()}
              </View>
            </ScrollView>
          </NativeViewGestureHandler>
        </FadeGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  newButtonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40
  },
  createNewButton: {
    paddingVertical: 8,
    lineHeight: 30,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
    color: colors.background,
    borderRadius: 100
  },
  newText: {
    color: colors.accent,
    lineHeight: 19,
    fontSize: 16,
    fontFamily: "Avenir-Black",
    fontWeight: "500"
  },
  scrollView: {
    // height: Dimensions.get("window").height - 100,
    position: "relative",
    // marginBottom: 90,
  },
  patternList: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    overflow: "visible",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 110
  },
  container: {
    width: "100%",
    height: "100%",
    // marginTop: 15
  },

  header: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 15,
    paddingBottom: 8,
    position: "absolute",
    backgroundColor: colors.background,
    zIndex: 10
  },
  headerText: {
    fontSize: 22,
    flex: 1,
    color: colors.primary,
    fontWeight: "300",
    position: "relative",
    fontFamily: "System"
  },
  newButton: {
    width: 65,
    height: 28,
    position: "relative",
    borderRadius: 25,
    borderColor: "rgba(118, 118, 128, 0.32)",
    backgroundColor: colors.background2,
    borderWidth: colors.dark ? 0 : 0.5,
    padding: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2

  }
})

export default BreathingPage;
