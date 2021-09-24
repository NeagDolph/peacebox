import React, {useEffect, useRef, useState} from 'react';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {setTotalDuration, setDurationType} from "../../store/features/breathingSlice";
import PageHeader from "../../components/header";
import {Button, Provider, Surface} from "react-native-paper";
import {colors} from "../../config/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontList from "../../components/font-list";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import NumberPicker from "../components/numberpicker";
import PauseModal from "../components/pause-modal";
import SettingsModal from "../components/settings-modal";
import RenderSequence from "./components/render-sequence";

const PatternUse = ({route, navigation}) => {
  const {id} = route.params
  const patternData = useSelector(state => state.breathing.patterns[id]);
  const dispatch = useDispatch();

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [totalDurationStore, setTotalDurationStore] = useState(patternData.totalDuration);
  const [durationTypeStore, setDurationTypeStore] = useState(patternData.durationType);

  const showSettingsModal = () => setSettingsVisible(true);
  const hideSettingsModal = () => setSettingsVisible(false);

  useEffect(() => {
    dispatch(setDurationType({
      id: patternData.id,
      type: durationTypeStore
    }))

    dispatch(setTotalDuration({
      id: patternData.id,
      total: totalDurationStore
    }))

  }, [durationTypeStore, totalDurationStore])

  const handleDurationType = () => setDurationTypeStore(durationTypeStore === "Minutes" ? 0 : 1)

  return (
    <>
      <PageHeader
        title={patternData.name}
        inlineTitle={true}
        settingsButton={false}
        titleWhite={false}
        navigation={navigation}
      />
      <Surface style={styles.card}>
        <RenderSequence sequence={patternData.sequence} backgroundColor={colors.background2}/>
        <View style={styles.timingContainer}>
          <NumberPicker
            value={totalDurationStore}
            maxNumber={99}
            setSequenceAmount={setTotalDurationStore}
            style={{width: 45}}/>
          <SegmentedControl
            style={styles.timingControl}
            values={['Minutes', "Cycles"]}
            selectedIndex={handleDurationType}
            onValueChange={setDurationTypeStore}
            fontStyle={{fontSize: 16, fontFamily: "Avenir Next"}}
            activeFontStyle={{fontWeight: "bold", fontSize: 16, fontFamily: "Avenir-Heavy"}}/>
        </View>
        <View style={styles.settingsContainer}>
          <Button
            onPress={showSettingsModal}
            style={{borderRadius: 6}}
            labelStyle={styles.buttonLabel}
            uppercase={false}
            compact={true}
            color={colors.background2}
            mode="contained">Settings</Button>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <Icon style={styles.infoIcon} name="information" size={30} color={colors.text}/>
          </TouchableOpacity>
          <Button
            mode="contained"
            color={colors.accent}
            uppercase={false}
            onPress={() => navigation.navigate("Time", {id})}
            style={styles.startStyle}
            labelStyle={{fontSize: 20, fontFamily: "AppleSDGothicNeo-Medium"}}
            contentStyle={{marginHorizontal: 10, marginVertical: 5}}>Start</Button>
        </View>
      </Surface>
      <Provider>
        <SettingsModal hideEditModal={hideSettingsModal} visible={settingsVisible} patternData={patternData}/>
      </Provider>
      {/*<FontList text={"Setting"}></FontList>*/}
    </>
  );
};

const styles = StyleSheet.create({
  infoIcon: {

  },
  startStyle: {
    borderRadius: 12,
    marginVertical: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 45
  },
  buttonLabel: {
    color: "black",
    letterSpacing: 0.7,
    fontFamily: "Avenir-Light",
    fontWeight: "300",
    fontSize: 15,
    marginVertical: 5,
    marginHorizontal: 15
  },
  settingsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  timingControl: {
    width: 160,
    marginLeft: 15,
    height: 40
  },
  timingContainer: {
    marginTop: 40,
    marginBottom: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  sequenceItem: {
    width: 65,
    height: 60,
    backgroundColor: colors.background2,
    borderRadius: 11,
    padding: 7
  },
  sequenceTitle: {
    fontFamily: "Avenir Next",
    textAlign: "center",
    color: colors.primary,
    width: "100%",
    lineHeight: 18,
    fontWeight: "300",
    fontSize: 16
  },
  sequenceCount: {
    fontFamily: "Avenir-Black",
    color: colors.accent,
    fontSize: 25,
    width: "100%",
    lineHeight: 30,
    textAlign: "center",
  },
  sequenceContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  card: {
    margin: 28,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20
  }
})

export default PatternUse;
