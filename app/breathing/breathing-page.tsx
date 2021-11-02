import React, {useEffect, useRef, useState} from 'react';

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
  LayoutAnimation
} from 'react-native';
import PageHeader from "../components/header";
import Icon from "react-native-vector-icons/Entypo"
import {colors} from "../config/colors";
import {useDispatch, useSelector} from "react-redux";
import {addPattern, removePattern, editPattern} from "../store/features/breathingSlice";
import PatternItem from "./components/pattern-item";

import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import NumberPicker from "./components/numberpicker";
import InfoModal from "../freewriting/components/info-modal";
import {Provider} from "react-native-paper";
import {setUsed} from "../store/features/settingsSlice";
import FadeGradient from "../components/fade-gradient";
import haptic, {success} from "../helpers/haptic";
import GestureHandlerRootView from "react-native-gesture-handler";

const modalContent = require("./info.json");


const BreathingPage = (props) => {
  const patterns = useSelector(state => state.breathing.patterns);
  const settings = useSelector((state) => state.settings.breathing)
  const dispatch = useDispatch();


  const [editMode, setEditMode] = useState(false);
  const editMargin = useRef(new Animated.Value(6)).current;
  const buttonScaleOpacity = Animated.add(Animated.divide(editMargin, -6), 1);
  const buttonScaleHeight = Animated.multiply(buttonScaleOpacity, 50)
  const [buttonVisible, setButtonVisible] = useState(false)

  const [modalVisible, setModalVisible] = useState(false);

  // useEffect(() => {
    // if (!settings.used) {
    //   setImmediate(() => {
    //     dispatch(setUsed("breathing"))
    //
    //     setModalVisible(true);
    //   });
    // }
  // }, [])

  // useEffect(() => {
    // if (editMode) setButtonVisible(true)
  // }, [editMode]);

  const newPattern = () => {
    // setEditMode(false)
    const newId = uuidv4();

    const patternObj = {
      id: newId,
      name: "New Pattern",
      sequence: [4, 4, 4, 4],
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
    props.navigation.push("Edit", {id: newId, newPattern: true});
  }

  const editPattern = (id) => {
    props.navigation.navigate("Edit", {id, newPattern: false})
  };

  const usePattern = (id) => {
    setEditMode(false)
    props.navigation.navigate("Use", {id})
  };

  const renderPatterns = () => Object.values(patterns).map(el => (
    <PatternItem
      key={el.id}
      editPattern={editPattern}
      usePattern={usePattern}
      deletePattern={deletePattern}
      patternData={el}
      buttonVisible={buttonVisible}
      editMode={editMode}
    />
  ));

  const deletePattern = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    success();
    dispatch(removePattern(id))
  }

  const toggleEditMode = () => {
    if (editMode) setButtonVisible(false)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
      if (!editMode) setButtonVisible(true)
    })
    setEditMode(lastMode => !lastMode);
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
          pageTitle: "Breathing Settings"
        })}/>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Breathing Patterns</Text>
          <TouchableOpacity onPress={newPattern}>
            <View style={styles.newButton}>
              <Icon name="plus" size={23} color={colors.accent}/>
            </View>
          </TouchableOpacity>
        </View>
        <FadeGradient top={0.1} bottom={0}>
          <ScrollView style={styles.scrollView} bounces={false}>
            <View style={styles.patternList}>
              {renderPatterns()}
            </View>
          </ScrollView>
        </FadeGradient>
      </View>
      <Provider>
        <InfoModal content={modalContent} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      </Provider>
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
  },
  newButton: {
    width: 65,
    height: 28,
    position: "relative",
    borderRadius: 25,
    borderColor: "rgba(118, 118, 128, 0.32)",
    backgroundColor: "white",
    borderWidth: 0.5,
    padding: 0,
    right: 0,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2

  }
})

export default BreathingPage;
