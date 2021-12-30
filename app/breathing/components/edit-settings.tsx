import React from 'react';

import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../store/features/breathingSlice";
import {Divider, Switch, Button, Provider} from "react-native-paper";
import {colors} from "../../config/colors";
import PropTypes from 'prop-types'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Fade from "../../components/fade-wrapper";
import PauseModal from "./pause-modal";
import haptic from "../../helpers/haptic";
import crashlytics from "@react-native-firebase/crashlytics";


const EditSettings = props => {
  const dispatch = useDispatch();

  const handleFeedbackChange = (feedback) => {
    const payload = ['None', 'Vibrate', "Haptic"].indexOf(feedback) || 0;

    crashlytics().log("Pattern Setting Changed: feedbackType | New value: " + payload)

    haptic(0)
    dispatch(setSetting({
      id: props.id,
      value: payload,
      setting: "feedbackType"
    }));
  }

  const toggleAlertFinish = () => {
    crashlytics().log("Pattern Setting Toggled: alertFinish | New value: " + !props.patternSettings.alertFinish)
    dispatch(setSetting({
      id: props.id,
      setting: "alertFinish",
      value: !props.patternSettings.alertFinish
    }))
  }

  const togglePause = () => {
    crashlytics().log("Pattern Setting Toggled: breakBetweenCycles | New value: " + !props.patternSettings.breakBetweenCycles)
    dispatch(setSetting({
      id: props.id,
      setting: "breakBetweenCycles",
      value: !props.patternSettings.breakBetweenCycles
    }))
  }

  return (
    <View style={props.style}>
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Feedback</Text>
        <SegmentedControl
          style={styles.feedbackControl}
          values={['None', 'Vibrate', "Haptic"]}
          appearance={colors.dark ? "dark" : "light"}
          selectedIndex={props.patternSettings.feedbackType || 0}
          onValueChange={handleFeedbackChange}
          fontStyle={{fontSize: 12}}
          activeFontStyle={{fontWeight: "400"}}
        />
      </View>
      <Divider style={styles.divider}/>
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Alert on finish</Text>
        <Switch color={colors.accent} value={props.patternSettings.alertFinish} onValueChange={toggleAlertFinish}/>
      </View>
      <Divider style={styles.divider}/>
      <View style={styles.settingItem}>
        <View style={styles.pauseTitle}>
          <Text style={styles.settingTitle}>Pause after cycle</Text>
          <Fade visible={props.patternSettings.breakBetweenCycles}>
            <Pressable onPress={props.showEditModal} hitSlop={20}>
              <Button labelStyle={styles.pauseText} style={styles.pauseEdit}>Edit</Button>
            </Pressable>
          </Fade>
        </View>
        <Switch color={colors.accent} value={props.patternSettings.breakBetweenCycles} onValueChange={togglePause}/>
      </View>
      {props.children}
    </View>
  );
};

EditSettings.propTypes = {
  id: PropTypes.string,
  patternSettings: PropTypes.object,
  showEditModal: PropTypes.func,
  children: PropTypes.element,
  style: PropTypes.object
}

const styles = StyleSheet.create({

  pauseTitle: {
    flexDirection: "row",
    alignItems: "center"
  },
  pauseEdit: {
    backgroundColor: colors.background3,
    borderRadius: 6,
    marginLeft: 5,
    minWidth: 40,
  },
  pauseText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: "Helvetica",
    textTransform: "none",
    fontWeight: "500",
    letterSpacing: 0,
    color: colors.primary,
    marginVertical: 5,

  },
  divider: {
    marginHorizontal: 15
  },
  feedbackControl: {
    width: 170,
  },
  settingTitle: {
    fontSize: 14,
    color: colors.primary,
    lineHeight: 30
  },
  settingItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    width: "100%",
    height: 50,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"

  }
})

export default EditSettings;
