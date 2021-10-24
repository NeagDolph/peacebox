import React, {useEffect, useRef, useState} from 'react';

import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ModalHeader from "./components/modal-header";
import EditCard from "./components/edit-card";
import PremadePattern from "./components/premade-pattern";
import PropTypes from "prop-types"
import {Provider, Surface} from "react-native-paper";
import PauseModal from "../components/pause-modal";
import {useDispatch, useSelector} from "react-redux";
import {editPattern} from "../../store/features/breathingSlice";
import {colors} from "../../config/colors";
import {useNavigation} from '@react-navigation/native';
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import FadeGradient from "../../components/fade-gradient";
import haptic from "../../helpers/haptic";

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

PatternNew.propTypes = {
  id: PropTypes.string,
  patternData: PropTypes.any,
  showEditModal: PropTypes.func,
  premadePattern: PropTypes.func
}

const PatternModal = ({route, navigation}) => {
  const {newPattern} = route.params

  const {id} = route.params
  const patternData = useSelector(state => state.breathing.patterns[id]);

  const showEditModal = () => setEditModalVisible(true)
  const hideEditModal = () => setEditModalVisible(false)
  const [editModalVisible, setEditModalVisible] = useState(false)

  const closeModal = () => {
    haptic(1);
    navigation.goBack();
  }

  return (
    <>

      <FadeGradient top={0} bottom={newPattern ? 0.15 : 0}>
        <ModalHeader style={styles.header}/>
        {newPattern ? <PatternNew id={id} patternData={patternData} showEditModal={showEditModal}/> :
          <View style={styles.list}>
            <EditCard id={id} showEditModal={showEditModal} patternData={patternData}/>
          </View>
        }
      </FadeGradient>
      <View style={styles.doneButtonContainer} pointerEvents="box-none">
        <TouchableOpacity onPress={closeModal}>
          <View style={styles.doneButton}>
            <Text style={styles.doneText}>Done</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Provider>
        <PauseModal hideEditModal={hideEditModal} visible={editModalVisible} patternData={patternData}/>
      </Provider>
    </>
  )
}

const styles = StyleSheet.create({
  doneButtonContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  doneButton: {
    paddingVertical: 13,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  doneText: {
    fontSize: 24,
    color: colors.background,
    fontFamily: "Avenir",
    fontWeight: "700"
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

export default PatternModal;
