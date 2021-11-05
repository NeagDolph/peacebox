import React, {useCallback, useEffect, useState} from 'react';
import {LayoutAnimation, Linking, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {colors} from "../../../config/colors";
import {Surface} from "react-native-paper";
import Fade from "../../../components/fade-wrapper";
import PropTypes from "prop-types"
import {Link} from "@react-navigation/native";
import Tooltip from "react-native-walkthrough-tooltip";
import breathingGuide from "../../../guides/breathing-guide";
import {useDispatch, useSelector} from "react-redux";
import { guideNext } from '../../../store/features/tutorialSlice';
import useTooltip from "../../components/tooltip-hook";

const PremadePattern = (props) => {
  const {name, sequence, description} = props.item;
  const [descriptionBig, setDescriptionBig] = useState(false);

  const dispatch = useDispatch()

  const breathingIndex = useSelector(state => state.tutorial.breathing.completion);
  const running = useSelector(state => state.tutorial.breathing.running);

  const tooltip = useTooltip();

  const toggleReadMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDescriptionBig(val => !val);
  }


  const renderSequence = () => {
    const sequenceText = ["Inhale", "Hold", "Exhale", "Hold"]
    return sequence.map((count, idx) => (
      <View style={styles.patternItem} key={idx}>
        <View style={styles.count}>
          <Text style={styles.countText}>{count}</Text>
        </View>
        <Text style={styles.countTitle}>{sequenceText[idx]}</Text>
      </View>
    ))
  }

  const addLink = (text) => {
    const results = Array.from(text.matchAll(/\[(.+)\]\((.+)\)/g))

    if (results.length < 1) return {}


    return results.reduce((curr, match, i) => {

      const before = <>{text.substring(0, match.index)}</>
      const after = <>{text.substring(match.index + match[0].length, match.input.length)}</>
      return <>{before}<Text style={styles.link} onPress={() => Linking.openURL(match[2])}>{match[1]}</Text>{after}</>
    }, <></>)
  }

  const truncate = (text, length) => {
    let tempText

    if (!text || !length) tempText = addLink(text)
    else tempText = text.length > length ? text.substring(0, length) + "..." : text

    return <Text style={styles.desc}>
      {tempText}
    </Text>
  }

  const handleUse = () => {
    props.usePattern(props.item)

    if (running && breathingIndex === 3) dispatch(guideNext("breathing"))
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.patternContainer}>{renderSequence()}</View>
      <View style={styles.descContainer}>
        {truncate(description, descriptionBig ? undefined : 40)}
        <View style={styles.readMore}>
          <TouchableOpacity onPress={toggleReadMore}>
            <Text style={styles.readMoreTitle}>{descriptionBig ? "Read Less" : "Read More"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.useContainer}>
        {tooltip(
          <TouchableOpacity onPress={handleUse}>
            <View style={styles.useButton}>
              <Text style={styles.useTitle}>Use Pattern</Text>
            </View>
          </TouchableOpacity>,
          3
        )}
      </View>
    </View>
  );
};

PremadePattern.propTypes = {
  usePattern: PropTypes.func,
  item: PropTypes.object,
  tooltip: PropTypes.bool

}


const styles = StyleSheet.create({
  link: {
    color: colors.accent
  },
  useContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8
  },
  useButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.accent,
    borderRadius: 9
  },
  useTitle: {
    fontFamily: "Avenir-Heavy",
    color: colors.background,
    fontSize: 16,
  },
  readMore: {
    backgroundColor: colors.background2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 4,
    borderRadius: 100
  },
  readMoreTitle: {
    color: "#676767",
    fontSize: 12
  },
  descContainer: {
    alignItems: "flex-start",
    paddingRight: 8,
    // marginTop: 5,
  },
  desc: {
    color: colors.primary,
    fontWeight: "400",
    fontSize: 14,
    fontFamily: "Avenir"
  },

  count: {
    padding: 3,
    borderRadius: 100,
    backgroundColor: colors.primary,
    width: 38,
    height: 38
  },
  countText: {
    fontFamily: "Avenir-Heavy",
    textAlign: "center",
    fontSize: 21,
    lineHeight: 34,
    color: colors.background
  },
  countTitle: {
    fontFamily: "Helvetica",
    fontSize: 14,
    color: colors.primary,
    fontWeight: "300",
    marginTop: 3
  },
  patternItem: {
    flexDirection: "column",
    justifyContent: "center",

    alignItems: "center"
  },
  patternContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginVertical: 12,
    alignItems: "center"
  },
  title: {
    fontSize: 21,
    fontWeight: "500",
    lineHeight: 30,
    fontFamily: "Avenir"
  },
  container: {
    borderRadius: 12,
    backgroundColor: "white",
    padding: 15,
    width: "100%",
    marginVertical: 15,
    borderWidth: 1,
    borderColor: colors.placeholder

    // shadowColor: colors.primary,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,

  },
})

export default PremadePattern;
