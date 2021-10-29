import {useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import React, {useRef} from "react";
import PremadePattern from "./premade-pattern";
import {editPattern} from "../../../store/features/breathingSlice";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import EditCard from "./edit-card";
import PropTypes from "prop-types";
import {colors} from "../../../config/colors";

const premadePatterns = [
  {
    name: "Pranayama Counts",
    sequence: [4, 4, 6, 2],
    description: "Breathing counts meant for pranayama yoga. Do these breaths for 3 sets of 20 when performing kriya."
  },
  {
    name: "4-7-8",
    sequence: [4, 7, 8, 0],
    description: "The 4-7-8 breathing technique is based on pranayama breathing exercises. These types of mindful breathing exercises have been shown to have many benefits for stress reduction and relaxation. The 4-7-8 breathing technique was developed by Dr. Andrew Weil. He refers to it as a \"natural tranquilizer for the nervous system\"."
  }
]


const PatternNew = ({id, showEditModal, patternData}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const scrollRef = useRef(null)

  const renderPremades = () => {
    return premadePatterns.map((el, i) => <PremadePattern key={i} item={el} usePattern={usePattern}/>)
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

  return (
    <>
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={scrollRef}
      >
        <Text style={styles.premadeText}>Create a pattern</Text>
        <EditCard id={id} showEditModal={showEditModal} patternData={patternData} newPattern={true}/>
        <Text style={[styles.premadeText, {marginTop: 15}]}>Or choose one</Text>
        {renderPremades()}
        <View style={styles.footer}></View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
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
