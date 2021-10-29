import React, {useEffect, useRef, useState} from 'react';

import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ModalHeader from "./components/modal-header";
import EditCard from "./components/edit-card";
import PremadePattern from "./components/premade-pattern";
import {Provider, Surface} from "react-native-paper";
import PauseModal from "../components/pause-modal";
import {useDispatch, useSelector} from "react-redux";
import {colors} from "../../config/colors";
import FadeGradient from "../../components/fade-gradient";
import haptic from "../../helpers/haptic";
import crashlytics from "@react-native-firebase/crashlytics";
import PatternNew from "./components/pattern-new";

const PatternModal = ({route, navigation}) => {
  const {newPattern} = route.params

  const {id} = route.params
  const patternData = useSelector(state => state.breathing.patterns[id]);

  const showEditModal = () => setEditModalVisible(true)
  const hideEditModal = () => setEditModalVisible(false)
  const [editModalVisible, setEditModalVisible] = useState(false)

  useEffect(() => {
    crashlytics().log("Page Loaded: Pattern Modal")
  }, [])

  const closeModal = () => {
    crashlytics().log("Done button pressed in pattern edit modal");
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
})

export default PatternModal;
