import React, { useRef, useState } from "react";

import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import EditSettings from "./edit-settings";
import { Button, Modal, Portal } from "react-native-paper";
import { colors } from "../../config/colors";
import { PauseSettings } from "./pause-modal";
import PropTypes from "prop-types";

const ModalContent = props => {
  const [pauseSettingsVisible, setPauseSettingsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(true);
  const settingsLeft = useRef(new Animated.Value(1)).current;
  const pauseLeft = Animated.add(settingsLeft, Dimensions.get("window").width);
  const animationSpeed = 350;
  const easing = Easing.inOut(Easing.ease);

  const showPauseModal = () => {
    setPauseSettingsVisible(true)
    Animated.timing(settingsLeft, {
        toValue: -Dimensions.get('window').width,
        duration: animationSpeed,
        easing,
        useNativeDriver: true
      }).start(() => {
      setSettingsVisible(false)
    })
  }


  const hidePauseModal = () => {
    setSettingsVisible(true)
    Animated.timing(settingsLeft, {
        toValue: 0,
        duration: animationSpeed,
        easing,
        useNativeDriver: true
      }).start(() => {
      setPauseSettingsVisible(false)
    })
  }


  return (
    <>
      {
        settingsVisible &&
        <Animated.View style={{transform: [{translateX: settingsLeft}]}}>
            <EditSettings
                showEditModal={showPauseModal}
                id={props.patternData.id}
                patternSettings={props.patternData.settings}
            >
                <View style={styles.dismissContainer}>
                    <Button
                        mode="contained"
                        color={colors.accent}
                        uppercase={false}
                        labelStyle={{fontSize: 20, color: colors.constantWhite}}
                        contentStyle={{marginHorizontal: 6}}
                        onPress={props.hideModal}
                    >Done</Button>
                </View>
            </EditSettings>
        </Animated.View>
      }
      {
        pauseSettingsVisible &&
        <Animated.View style={{
          width: Dimensions.get('window').width - 40,
          position: "absolute",
          transform: [{translateX: pauseLeft ?? 1000}],
          padding: 25,
        }}><PauseSettings buttonText="Back" patternData={props.patternData} hideModal={hidePauseModal}/></Animated.View>
      }
    </>
  )
}

const SettingsModal = props => {
  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={props.hideEditModal} contentContainerStyle={styles.containerStyle}>
        <ModalContent hideModal={props.hideEditModal} patternData={props.patternData}/>
      </Modal>
    </Portal>
  );
};

SettingsModal.propTypes = {
  visible: PropTypes.bool,
  hideEditModal: PropTypes.func,
  patternData: PropTypes.object
}

ModalContent.propTypes = {
  patternData: PropTypes.object,
  hideModal: PropTypes.func
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
    // alignSelf: "center",
    height: 280,
    overflow: "hidden"
  },
})


export default SettingsModal;
