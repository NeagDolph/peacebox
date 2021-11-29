import React, {useCallback, useEffect, useState} from 'react';
import {
  LayoutAnimation,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import {colors} from "../../../config/colors";
import {Surface} from "react-native-paper";
import Fade from "../../../components/fade-wrapper";
import PropTypes from "prop-types"
import {Link} from "@react-navigation/native";
import Tooltip from "react-native-walkthrough-tooltip";
import breathingGuide from "../../../guides/breathing-guide";
import {useDispatch, useSelector} from "react-redux";
import { guideNext, openedTutorial, closedTutorial } from '../../../store/features/tutorialSlice';
import useTooltip from "../../../components/tooltip-hook";

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

    if (!text.matchAll) return <Text style={styles.desc}>{text}</Text>
    const results = Array.from(text.matchAll(/\[(.+)\]\((.+)\)/g))

    if (results.length < 1) return <Text style={styles.desc}>{text}</Text>


    return results.reduce((curr, match, i) => {
      const before = <Text style={styles.desc}>{text.substring(0, match.index)}</Text>
      const after = <Text style={styles.desc}>{text.substring(match.index + match[0].length, match.input.length)}</Text>
      return <Text style={styles.desc}>{before}<Text style={styles.link} onPress={() => Linking.openURL(match[2])}>{match[1]}</Text>{after}</Text>
    }, <Text style={styles.desc}></Text>)
  }

  const truncate = (text, length) => {
    const inputText = text.length > (length) ? (text.substring(0, length) + "...") : text

    const link = addLink(inputText)
    return link
  }

  const handleUse = () => {
    props.usePattern(props.item)
    dispatch(closedTutorial("breathing"))

    if (running && breathingIndex === 3) setTimeout(() => {
      dispatch(guideNext("breathing"))
    }, 600)
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.patternContainer}>{renderSequence()}</View>
      <View style={styles.descContainer}>
        {truncate(description, descriptionBig ? 99999 : 70)}
        <View style={styles.readMore}>
          <Pressable onPress={toggleReadMore} hitSlop={30}>
            <Text style={styles.readMoreTitle}>{descriptionBig ? "Read Less" : "Read More"}</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.useContainer}>
        <TouchableOpacity onPress={handleUse}>
          <View style={styles.useButton}>
            <Text style={styles.useTitle}>Use Pattern</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

PremadePattern.propTypes = {
  usePattern: PropTypes.func,
  item: PropTypes.object,
  itemNum: PropTypes.number

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
    paddingHorizontal: 8,
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
