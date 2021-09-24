import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {colors} from "../../../config/colors";
import PropTypes from "prop-types"

function RenderSequence(props) {
  const patternTitles = ["Inhale", "Hold", "Exhale", "Hold"]

  const renderItems = () => props.sequence.map((el, i) => (
    <View style={[styles.sequenceItem, {backgroundColor: props.backgroundColor}]} key={i}>
      <Text style={[styles.sequenceCount, {color: props.numColor}]}>{el}</Text>
      <Text style={[styles.sequenceTitle, {color: props.color}]}>{patternTitles[i]}</Text>
    </View>
  ));

  return (
    <View style={[styles.sequenceContainer, props.style]}>
      {renderItems()}
    </View>
  )
}

RenderSequence.propTypes = {
  sequence: PropTypes.object.isRequired,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  numColor: PropTypes.string,
  style: PropTypes.object
}

export default RenderSequence

const styles = StyleSheet.create({
  sequenceItem: {
    width: 65,
    height: 60,
    backgroundColor: colors.background2,
    borderRadius: 11,
    padding: 7
  },
  sequenceTitle: {
    fontFamily: "Avenir Next",
    textAlign: "center",
    color: colors.primary,
    width: "100%",
    lineHeight: 18,
    fontWeight: "300",
    fontSize: 16
  },
  sequenceCount: {
    fontFamily: "Avenir-Black",
    color: colors.accent,
    fontSize: 25,
    width: "100%",
    lineHeight: 30,
    textAlign: "center",
  },
  sequenceContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row"
  },
})
