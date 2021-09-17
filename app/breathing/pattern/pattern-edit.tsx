import React, {useEffect, useRef, useState} from 'react';

import {Alert, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import PageHeader from "../../components/header";
import {Button, Divider, Provider, Surface} from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from "../../config/colors";
import {setName, setSequence, removePattern} from "../../store/features/breathingSlice";
import NumberPicker from "../components/numberpicker";
import EditSettings from "../components/edit-settings";
import PauseModal from "../components/pauseModal";


const PatternEdit = ({route, navigation}) => {
  const {id} = route.params
  const patternData = useSelector(state => state.breathing.patterns[id]);
  const dispatch = useDispatch();

  const titleRef = useRef(null)

  const [patternName, setPatternName] = useState(patternData.name);
  const [pattern, setPattern] = useState(patternData.sequence);
  const [editModalVisible, setEditModalVisible] = useState(false)

  useEffect(() => {
    dispatch(setSequence({id, sequence: pattern}))
    dispatch(setName({id, name: patternName}));
  }, [pattern, patternName])

  const setSequenceAmount = (amount, index) => {
    setPattern(state => {
      const newPattern = [...state];
      newPattern[index] = amount;
      return newPattern
    });
  }

  const renderPatternPicker = () => {
    const patternTitles = ["Breath In", "Hold", "Breath Out", "Hold"]
    return patternData.sequence.map((el, i) => (
      <View key={i} style={styles.patternItem}>
        <Text style={styles.patternTitle}>{patternTitles[i]}</Text>
        <NumberPicker maxNumber={9} value={el} index={i} setSequenceAmount={setSequenceAmount}/>
      </View>
    ))
  }

  const confirmDeletePattern = () => {
      return Alert.alert(
        "Delete this pattern?",
        `Are you sure you want to delete "${patternData.name}"?`,
        [
          {text: "Nevermind",},
          {text: "Confirm", onPress: deletePattern},
        ]
      );
  }

  const deletePattern = () => {
    navigation.goBack();
    dispatch(removePattern(id))
  }

  const showEditModal = () => setEditModalVisible(true)
  const hideEditModal = () => setEditModalVisible(false)

  return (
      <>
        <PageHeader
          inlineTitle={true}
          title={patternData.name}
          navigation={navigation}
          settingsCallback={() => navigation.push("settings", {
            page: "breathing",
            pageTitle: "Breathing Settings"
          })}
          titleWhite={false}
          settingsButton={true}
        />
        <Surface style={styles.card}>
          <View style={styles.titleContainer}>
            <TextInput
              placeholder="Pattern Name..."
              style={styles.title}
              value={patternName}
              onChangeText={setPatternName}
              clearTextOnFocus={true}
              blurOnSubmit={true}
              clearButtonMode="always"
              ref={titleRef}
              autoCorrect={false}
              autoCapitalize={"words"}
              returnKeyType="done"

            />
          </View>
          <Divider/>
          <View style={styles.patternContainer}>
            {renderPatternPicker()}
          </View>
          <Divider/>
          <EditSettings id={id} showEditModal={showEditModal} patternSettings={patternData.settings}/>
          <View style={styles.deleteContainer}>
            <Button style={styles.deleteButton} mode="contained" compact color={colors.red} onPress={confirmDeletePattern}>
              <Icon name="trash-can" size={30} style={{width: "auto"}} color="#FFF"/>
            </Button>
          </View>
        </Surface>
        <Provider>
          <PauseModal hideEditModal={hideEditModal} visible={editModalVisible} pattern={patternData}/>
        </Provider>
      </>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    width: "auto",
    paddingHorizontal: 2,
    // height: 50,
    // width: 50,
  },
  deleteContainer: {
    paddingHorizontal: 15,
    marginVertical: 15,
    marginTop: 25,
    // maxWidth: 60,
    display: "flex",
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "flex-start",

  },
  patternContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20
  },
  patternItem: {
    flex: 1,
    minWidth: 70
  },
  patternTitle: {
    fontSize: 15,
    color: colors.text,
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Helvetica"
  },
  titleContainer: {
    width: "auto",
    height: 30,
    flexDirection: "row",
    paddingBottom: 4,
    paddingHorizontal: 5,
  },
  editIcon: {
    marginTop: 2,
    marginLeft: 5,
  },
  title: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "200",
    fontStyle: "italic",
    width: "100%",
    fontFamily: "Avenir"
  },
  card: {
    margin: 28,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 20
  }
})

export default PatternEdit;
