import React, { useEffect, useState } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ModalHeader from "./components/modal-header";
import EditCard from "./components/edit-card";
import { Provider } from "react-native-paper";
import PauseModal from "../components/pause-modal";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../config/colors";
import FadeGradient from "../../components/fade-gradient";
import haptic from "../../helpers/haptic";
import { setEditVisible } from "../../store/features/breathingSlice";
import PatternNew from "./components/pattern-new";
import useTooltip from "../../components/tooltip-hook";
import { guideNext, setCreatedPattern } from "../../store/features/tutorialSlice";
import { RootState } from "../../store/store";

const PatternModal = ({ route, navigation }) => {
  const { newPattern, id } = route.params;
  const dispatch = useDispatch();
  const patternData = useSelector((state: RootState) => state.breathing.patterns[id]);
  const editVisible = useSelector((state: RootState) => state.breathing.editVisible);

  const breathingIndex = useSelector((state: RootState) => state.tutorial.breathing.completion);
  const open = useSelector((state: RootState) => state.tutorial.breathing.open);

  const tooltip = useTooltip();

  const showEditModal = () => setEditModalVisible(true);
  const hideEditModal = () => setEditModalVisible(false);
  const [editModalVisible, setEditModalVisible] = useState(false);


  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      dispatch(setEditVisible(false));
    });

    return unsubscribe;
  }, [navigation]);

  const closeModal = () => {
    haptic(1);
    navigation.goBack();

    setTimeout(() => {
      if (open && breathingIndex === 4) {
        dispatch(setCreatedPattern(id));
        dispatch(guideNext("breathing"));
      }
    }, 200);
  };

  return (
    <>
      <Provider>
        <FadeGradient top={0} bottom={newPattern ? 0.15 : 0}>
          <ModalHeader />
          {newPattern ? <PatternNew id={id} patternData={patternData} showEditModal={showEditModal} /> :
            <View style={styles.list}>
              <EditCard id={id} showEditModal={showEditModal} patternData={patternData} />
            </View>
          }
        </FadeGradient>
        <View style={styles.doneButtonContainer} pointerEvents="box-none">
          {tooltip(
            <TouchableOpacity onPress={closeModal}>
              <View style={styles.doneButton}>
                <Text style={styles.doneText}>Done</Text>
              </View>
            </TouchableOpacity>,
            4
          )}
        </View>
        <PauseModal hideEditModal={hideEditModal} visible={editModalVisible} patternData={patternData} />
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 30
  },
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  doneText: {
    fontSize: 24,
    color: colors.background,
    fontFamily: "Avenir",
    fontWeight: "700"
  }
});

export default PatternModal;
