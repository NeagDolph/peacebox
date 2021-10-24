import React, {useEffect, useRef, useState} from 'react';
import {Alert, Animated, Dimensions, Easing, StyleSheet, TouchableOpacity, View} from "react-native";
import {Button, Surface, Text} from "react-native-paper";
import {colors} from "../../config/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types'

const PatternItem = props => {
  const generateSequence = (sequence) => {
    const textList = ["Inhale", "Hold", "Exhale", "Hold"];

    return sequence.map((el, i) => (
      <View key={i} style={[styles.sequenceContainer, {
        marginVertical: props.editMode ? 0 : 4,
        borderColor: props.editMode ? "transparent" : colors.background2
      }]}>
        <Text style={styles.sequenceTitle}>{textList[i]}</Text>
        <Text style={styles.sequence}>{el}<Text style={styles.seconds}> sec</Text></Text>
      </View>
    ))
  }

  const truncateTitle = (title) => {
    return title.length > 20 ? title.substring(0, 20) + "..." : title
  }

  const confirmDeletePattern = () => {
    return Alert.alert(
      "Delete this pattern?",
      `Are you sure you want to delete "${props.patternData.name}"?`,
      [
        {text: "Nevermind",},
        {text: "Confirm", onPress: () => props.deletePattern(props.patternData.id)},
      ]
    );
  }

  return (
    <TouchableOpacity
      onPress={() => props.editMode ? props.editPattern(props.patternData.id) : props.usePattern(props.patternData.id)}>
      <View style={styles.patternItem}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{truncateTitle(props.patternData.name)}</Text>
        <View style={[styles.patternData, {paddingBottom: (props.patternData.settings.breakBetweenCycles || props.editMode) ? 0 : 20}]}>
          <View style={styles.sequenceList}>{generateSequence(props.patternData.sequence)}</View>
          {
            props.editMode &&
            <View style={[styles.actionButtons, {
              height: props.editMode ? 52 : 0,
              opacity: props.editMode ? 1 : 0,
            }]}>
                <Button
                    onPress={confirmDeletePattern}
                    mode="contained"
                    style={styles.button}
                    contentStyle={{height: "100%", alignItems: "center"}}
                    labelStyle={styles.buttonText}
                    color={colors.red}
                >Delete</Button>
            </View>
          }
          {
            (props.patternData.settings.breakBetweenCycles && !props.buttonVisible) &&
            <View style={[styles.pauseContainer, {
              opacity: props.editMode ? 0 : 1,
              height: props.editMode ? 0 : 20,
            }]}>
              <Icon name={"clock"} size={17} color={colors.placeholder}></Icon>
              <Text style={styles.pauseText}>Pause {props.patternData.settings.pauseDuration}s {props.patternData.settings.pauseFrequency > 1 ? `/ ${props.patternData.settings.pauseFrequency}` : ""}</Text>
            </View>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
};

PatternItem.propTypes = {
  editPattern: PropTypes.func,
  usePattern: PropTypes.func,
  patternData: PropTypes.object,
  editMargin: PropTypes.any,
  editMode: PropTypes.bool,
  buttonVisible: PropTypes.bool
}

const styles = StyleSheet.create({
  pauseContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    padding: 0,
    alignItems: "center",
    height: 16
  },
  pauseText: {
    color: colors.placeholder2,
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Avenir Next",
    marginLeft: 4,
  },
  seconds: {
    fontSize: 13,
    color: colors.accent,
    fontFamily: "Avenir Next"
  },
  sequence: {
    fontSize: 19,
    color: colors.accent,
    fontFamily: "Helvetica",
    fontWeight: "400",
  },
  sequenceTitle: {
    fontSize: 16,
    fontFamily: "Avenir Next",
    color: colors.primary,
  },
  sequenceContainer: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.background2,
    flex: 1,
    width: "100%",
    justifyContent: "space-between"
  },
  sequenceList: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
    paddingHorizontal: 5,
    color: colors.primary,
    height: 23,
    textAlign: "left",
    width: "100%",
    fontFamily: "Avenir Next"
  },
  buttonText: {
    marginHorizontal: 15,
    color: "white",
    marginVertical: 0,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  button: {
    borderRadius: 10,
    margin: 8,
    minWidth: "80%",
    marginHorizontal: 25,
    shadowColor: "transparent",
    borderColor: colors.accent,
  },
  actionButtons: {
    bottom: 0,
    flexDirection: "row",
    alignSelf: "center",
    flex: 1,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    alignItems: "stretch"
  },
  patternItem: {
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: (Dimensions.get('window').width - 84) / 2,
    position: "relative",
    height: "auto",
    marginVertical: 10,
  },
  patternData: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    position: "relative",
    height: "auto"
  }
})

export default PatternItem;
