import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import PremadePattern from "./premade-pattern";
import {editPattern} from "../../../store/features/breathingSlice";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import EditCard from "./edit-card";
import PropTypes from "prop-types";
import {colors} from "../../../config/colors";
import Tooltip from "react-native-walkthrough-tooltip";
import breathingGuide from "../../../guides/breathing-guide";
import useTooltip from "../../../components/tooltip-hook";

const premadePatterns = [
  {
    name: "Box Breathing",
    sequence: [4, 4, 4, 4],
    description: "Box breathing, also known as square breathing, is a technique used when taking slow, deep breaths. It can heighten performance and concentration while also being a powerful stress reliever.",
    settings: {
      breakBetweenCycles: false,
      pauseDuration: 5,
      pauseFrequency: 1
    }
  },
  {
    name: "Pranayama Counts",
    sequence: [4, 4, 6, 2],
    description: "Breathing counts meant for Pranayama yoga. These breaths can be utilized for 3 sets of 20 when performing daily Kriya.",
    settings: {
      breakBetweenCycles: true,
      pauseDuration: 20,
      pauseFrequency: 8
    }
  },
  {
    name: "4-7-8",
    sequence: [4, 7, 8, 0],
    description: "The 4-7-8 breathing technique is based on pranayama breathing exercises. These types of mindful breathing exercises have been shown to have many benefits for stress reduction, relaxation and sleep. There are some proponents even claim that the method helps people \"get to sleep in 1 minute\"",
    settings: {
      breakBetweenCycles: false,
    }
  },
  {
    name: "Coherent breathing",
    sequence: [5, 0, 5, 0],
    description: "This is a simple breathing technique that requires you to complete five full breaths every minute. Coherent breathing maximizes your heart rate variability and can reduce stress. There was also a [study](https://www.liebertpub.com/doi/10.1089/acm.2016.0140) that showed it to be able to reduce symptoms associated with depression.",
    settings: {
      breakBetweenCycles: true,
      pauseDuration: 10,
      pauseFrequency: 5
    }
  }
]


const PatternNew = ({id, showEditModal, patternData}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const scrollRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const breathingIndex = useSelector(state => state.tutorial.breathing.completion);
  const open = useSelector(state => state.tutorial.breathing.open);
  const tooltip = useTooltip();

  const listenScrollY = useSelector(state => state.breathing.editScroll);

  useEffect(() => {
    if (breathingIndex === 1 || breathingIndex === 3) scrollRef.current.scrollTo({y: listenScrollY, animated: true})
  }, [listenScrollY])

  const renderPremades = () => {
    const patterns = <View style={styles.patternContainer} key={0}>{premadePatterns.map((el, i) => {
      const pattern = <PremadePattern key={i} itemNum={i} item={el} usePattern={usePattern}/>

      return breathingIndex === 3 && i === 0 ? tooltip(pattern, 3, i) : pattern
    })}</View>

    return breathingIndex === 2 ? tooltip(patterns, 2) : patterns


  }

  const usePattern = (item) => {
    const newObj = {
      ...patternData,
      ...item,
      settings: {...patternData.settings, ...item.settings}
    }

    dispatch(editPattern({
      id,
      new: newObj
    }));

    scrollRef.current.scrollTo({x: 0, animated: true})
  }

  const handleScroll = ({nativeEvent}) => {
    setScrollY(nativeEvent.contentOffset.y)
  }

  return (
    <>
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={0}
        scrollEnabled={!open}
      >
        <Text style={styles.premadeText}>Create a pattern</Text>
        {tooltip(<EditCard id={id} showEditModal={showEditModal} patternData={patternData} newPattern={true}/>, 1)}
        <Text style={[styles.premadeText, {marginTop: 15}]}>Or choose one</Text>
        {renderPremades()}
        <View style={styles.footer}></View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  patternContainer: {
    // display: "flex",
    width: "100%",
    backgroundColor: colors.background,
    paddingHorizontal: 15,
    borderRadius: 10
  },
  footer: {
    height: 160
  },
  list: {
    overflow: "visible",
    // marginBottom: 150,
    paddingHorizontal: 28
  },
  premadeText: {
    fontSize: 26,
    fontWeight: "bold"
  },
  header: {
    marginBottom: 5,
  },
  container: {
    // marginHorizontal: 28,
    height: "100%"
  }
})

PatternNew.propTypes = {
  id: PropTypes.string,
  patternData: PropTypes.any,
  showEditModal: PropTypes.func,
  premadePattern: PropTypes.func
}

export default PatternNew
