import React, {useEffect, useRef, useState} from 'react';

import {StyleSheet, View, Button, ScrollView, TouchableOpacity, Animated, Easing} from 'react-native';
import PageHeader from "../components/header";
import {Text} from "react-native-paper";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {colors} from "../config/colors";
import {useDispatch, useSelector} from "react-redux";
import {addPattern, removePattern, editPattern} from "../store/features/breathingSlice";
import PatternItem from "./components/pattern-item";

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import NumberPicker from "./components/numberpicker";

const BreathingPage = (props) => {
  const patterns = useSelector(state => state.breathing.patterns);
  const dispatch = useDispatch();


  const [editMode, setEditMode] = useState(false);
  const editMargin = useRef(new Animated.Value(6)).current;
  const buttonScaleOpacity = Animated.add(Animated.divide(editMargin, -6), 1);
  const buttonScaleHeight = Animated.multiply(buttonScaleOpacity, 50)
  const [buttonVisible, setButtonVisible] = useState(false)

  useEffect(() => {
    if (editMode) setButtonVisible(true)
    Animated.timing(editMargin, {
      toValue: editMode ? 0 : 6,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start(() => setButtonVisible(editMode))
  }, [editMode]);

  const newPattern = () => {
    setEditMode(false)
    const newId = uuidv4();

    const patternObj = {
      id: newId,
      name: "New Pattern",
      sequence: [4, 4, 4, 4],
      totalDuration: 1,
      durationType: 1,
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

    props.navigation.push("Edit", {id: newId});
  }

  const editPattern = (id) => {
    setEditMode(false);
    props.navigation.navigate("Edit", {id})
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
      {...{editMargin, buttonScaleOpacity, buttonScaleHeight, buttonVisible}}
      editMode={editMode}
    />
  ));

  const deletePattern = (id) => {
    dispatch(removePattern(id))
  }

  const toggleEditMode = () => setEditMode(lastMode => !lastMode);

  return (
    <>
      <PageHeader
        title="Breathing"
        inlineTitle={true}
        settingsButton={true}
        titleWhite={false}
        settingsCallback={() => props.navigation.push("settings", {
          page: "breathing",
          pageTitle: "Breathing Settings"
        })}
        navigation={props.navigation}/>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Your Breathing Patterns</Text>
            <TouchableOpacity onPress={toggleEditMode}>
              <View style={styles.newButton}>
                <Text style={[styles.newText, editMode && {fontWeight: "800"}]}>{editMode ? "Done" : "Edit"}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView} bounces={false}>
            <View style={styles.patternList}>
              {renderPatterns()}
              <View style={styles.newButtonContainer}>
                <TouchableOpacity style={styles.createNewButton} onPress={newPattern}>
                  <Text style={{color: colors.background, fontSize: 18}}>New Pattern</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

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
    // height: "100%",
    position: "relative"
  },
  patternList: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    overflow: "visible",
    padding: 28,
    paddingTop: 15
  },
  container: {
    width: "100%",
    height: "100%",
    marginTop: 15
  },
  header: {
    width: "100%",
    flexDirection:'row',
    justifyContent:'space-between',
    padding: 28,
    paddingBottom: 0,
  },
  headerText: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: "300",
    position: "relative"
  },
  newButton: {
    width: 65,
    height: 28,
    position: "relative",
    borderRadius: 25,
    borderColor: colors.background2,
    borderWidth: 0.5,
    padding: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2

  }
})

export default BreathingPage;
