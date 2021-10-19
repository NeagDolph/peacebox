import React from 'react';

import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from "../../config/colors";
import {setStart} from "../../store/features/breathingSlice";
import {useDispatch} from "react-redux";
import FastImage from "react-native-fast-image";
import Clock from '../../assets/branch.svg'
import {SvgXml} from "react-native-svg";

const PatternCompleted = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {id} = route.params

  const restart = () => {
    dispatch(setStart({id, start: Date.now()}));
    navigation.navigate("Time", {id});
  }

  const complete = () => navigation.navigate("Patterns");

  return (
    <SafeAreaView style={styles.container}>

      <SvgXml style={styles.backgroundImage} fill="#e9e9e9" stroke="none" width={550} height={550} xml={Clock} />
      <Text style={styles.completedText}>Pattern Completed</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={restart}>
          <View style={[styles.button, styles.restart]}>
            <Text style={styles.buttonText}>Repeat</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={complete}>
          <View style={[styles.button, styles.finish]}>
            <Text style={styles.doneText}>Done</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    bottom: -15,
    left: 20
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  buttonContainer: {
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    marginVertical: 120,
    alignItems: "center"
  },
  button: {
    margin: 6,
    paddingVertical: 10,
    // paddingHorizontal: 20,
    // height: 40,
    width: "auto",
    position: "relative",
    borderRadius: 15,
  },
  finish: {
    backgroundColor: colors.accent,
    width: 140
  },
  restart: {
    borderColor: colors.accent,
    borderWidth: 1.5,
    width: 110
  },
  buttonText: {
    fontSize: 20,
    color: colors.accent,
    textAlign: "center",
    width: "100%",
    fontFamily: "Avenir-Medium"
  },
  doneText: {
    fontSize: 27,
    color: colors.background,
    textAlign: "center",
    width: "100%",
    fontFamily: "Avenir-Medium"
  },

  completedText: {
    fontSize: 30,
    marginTop: 100,
    textAlign: "center"
  }
})

export default PatternCompleted;
