import React from 'react';

import {StyleSheet, View, Button, ScrollView, TouchableOpacity} from 'react-native';
import PageHeader from "../components/header";
import {Text} from "react-native-paper";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {colors} from "../config/colors";
import {useDispatch, useSelector} from "react-redux";
import {addPattern, removePattern, editPattern} from "../store/features/breathingSlice";
import PatternItem from "./pattern/pattern-item";

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import NumberPicker from "./components/numberpicker";

interface PatternData {
  id: number | string;
  name: string;
  sequence: [number, number, number, number];
  settings: {
    hapticFeedback: boolean;
    breakBetweenCycles: boolean;
    breakSeconds: number | void;
    alertFinish: boolean;

  }
}

const BreathingPage = (props) => {
  const patterns = useSelector(state => state.breathing.patterns);
  const dispatch = useDispatch();

  const newPattern = () => {
    const newId = uuidv4();

    const patternObj = {
      id: newId,
      name: "New Pattern",
      sequence: [4, 4, 4, 4],
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

  const editPattern = (id) => props.navigation.push("Edit", {id});
  const usePattern = (id) => props.navigation.push("Use", {id});

  const renderPatterns = () => Object.values(patterns).map(el => (
    <PatternItem
      key={el.id}
      editPattern={editPattern}
      usePattern={usePattern}
      deletePattern={deletePattern}
      pattern={el}
    />
  ));

  const deletePattern = (id) => {
    dispatch(removePattern(id))
  }

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
            <TouchableOpacity onPress={newPattern}>
              <View style={styles.newButton}>
                <FontAwesomeIcon color={colors.accent} icon="plus"/>
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView} bounces={false}>
            <View style={styles.patternList}>
              {renderPatterns()}
            </View>
          </ScrollView>

        </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    width: 56,
    height: 26,
    position: "relative",
    borderRadius: 15,
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
