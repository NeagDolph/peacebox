import React from "react";

import { StyleSheet, Text, View } from "react-native";
import { Button, Divider, Modal, Portal } from "react-native-paper";
import { colors } from "../../config/colors";
import NumberPicker from "./numberPicker";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { setSetting } from "../../store/features/breathingSlice";

export const PauseSettings = props => {
  const dispatch = useDispatch();

  const setPauseDuration = (amount) => dispatch(setSetting({
    id: props.patternData.id,
    setting: "pauseDuration",
    value: amount
  }));

  const setPauseFrequency = (amount) => dispatch(setSetting({
    id: props.patternData.id,
    setting: "pauseFrequency",
    value: amount
  }))

  return (
    <>
      <Text style={styles.modalTitle}>Pause Settings</Text>
      <Divider/>
      <View style={styles.pauseSetTitle}>
        <Text style={styles.settingTitle}>Pause for</Text>

        <NumberPicker
          includeZero={false}
          max={99}
          selectedIndex={props.patternData.settings.pauseDuration || 5}
          onValueChange={setPauseDuration}
        />
        <Text style={styles.settingTitle}>{props.patternData.settings.pauseDuration > 1 ? "Seconds" : "Second"}</Text>
      </View>
      <Divider/>
      <View style={styles.pauseSetTitle}>
        <Text style={styles.settingTitle}>Pause Every</Text>
        <NumberPicker
          includeZero={false}
          max={99}
          selectedIndex={props.patternData.settings.pauseFrequency || 1}
          onValueChange={setPauseFrequency}
        />
        <Text style={styles.settingTitle}>{props.patternData.settings.pauseFrequency > 1 ? "Cycles" : "Cycle"}</Text>
      </View>
      <Divider/>
      <View style={styles.dismissContainer}>
        <Button
          mode="contained"
          color={colors.accent}
          uppercase={false}
          style={{borderColor: colors.accent, borderWidth: 1}}
          labelStyle={{fontSize: 20}}
          contentStyle={{marginHorizontal: 6}}
          onPress={props.hideModal}
        >{props.buttonText ?? "Done"}</Button>
      </View>
    </>
  );
};

const PauseModal = (props) => {
  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={props.hideEditModal} contentContainerStyle={styles.containerStyle}>
        <PauseSettings hideModal={props.hideEditModal} patternData={props.patternData}/>
      </Modal>
    </Portal>
  );
};

PauseModal.propTypes = {
  visible: PropTypes.bool,
  hideEditModal: PropTypes.func,
  patternData: PropTypes.object,
}

PauseSettings.propTypes = {
  hideModal: PropTypes.func,
  patternData: PropTypes.object,
  buttonText: PropTypes.string
}

const styles = StyleSheet.create({
  dismissContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  modalTitle: {
    fontSize: 22,
    color: colors.primary,
    marginBottom: 10,
    fontWeight: "bold"

  },
  containerStyle: {
    backgroundColor: colors.background2,
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  settingItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    width: "100%",
    height: 50,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  pauseSetTitle: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
  },
  settingTitle: {
    fontSize: 18,
    color: colors.primary,
    lineHeight: 30
  },
})

export default PauseModal;

