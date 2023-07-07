import React, { useEffect, useRef, useState } from "react";

import { Alert, Dimensions, LayoutAnimation, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Surface } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../../config/colors";
import { removePattern, setName, setSequence } from "../../../store/features/breathingSlice";
import NumberPicker from "../../components/numberpicker";
import EditSettings from "../../components/edit-settings";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";


const EditCard = (props) => {
  const {id, patternData, showEditModal} = props

  const [patternTitle, setPatternTitle] = useState(patternData.name);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const titleRef = useRef(null);

  const tutorialState = useSelector(state => state.tutorial);

  // const setPatternName = (name) => dispatch(setName({id, name}));

  useEffect(() => {
    // if (tutorialState.breathing.completion === 1 && tutorialState.breathing.open && tutorialState.currentTutorial === "breathing") {
      // dispatchWalkthroughEvent('pattern-edit-open')
    // }
  }, [])

  useEffect(() => {
    if (patternTitle.length >= 1 && patternData.name !== patternTitle) dispatch(setName({id, name: patternTitle}));
  }, [patternTitle])

  useEffect(() => {
    if (patternData.name !== patternTitle) setPatternTitle(patternData.name)
  }, [patternData.name])

  const setSequenceAmount = (amount, index) => {
    const newPattern = [...patternData.sequence];
    newPattern[index] = amount;

    dispatch(setSequence({id, sequence: newPattern}))
  }

  const renderPatternPicker = () => {
    const patternTitles = ["Inhale", "Hold", "Exhale", "Hold"]

    return patternData.sequence.map((el, i) => (
      <View key={i} style={styles.patternItem}>
        <Text style={styles.patternTitle}>{patternTitles[i]}</Text>
        <NumberPicker scrollView={true} maxNumber={12} listKey={i} includeZero={true} value={el} index={i}
                      setSequenceAmount={setSequenceAmount}/>
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.goBack();
    dispatch(removePattern(id));
  }

  const renderButton = () => {
    return props.newPattern || <View style={styles.deleteContainer}>
        <Button style={styles.deleteButton} mode="contained" compact color={colors.red} onPress={confirmDeletePattern}>
            <Icon name="trash-can" size={30} style={{width: "auto"}} color="#FFF"/>
        </Button>
    </View>
  }

  return (
    <>
        <Surface style={styles.card}>
          <View style={styles.titleContainer}>
            <TextInput
              placeholder="Pattern Name..."
              style={styles.title}
              value={patternTitle}
              onChangeText={setPatternTitle}
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
          {renderButton()}
        </Surface>
    </>
  );
};

EditCard.propTypes = {
  id: PropTypes.string,
  patternData: PropTypes.any,
  showEditModal: PropTypes.func,
  newPattern: PropTypes.bool
}

const styles = StyleSheet.create({
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    width: "auto",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderColor: colors.text,
    width: "auto",
  },
  deleteContainer: {
    paddingHorizontal: 15,
    marginVertical: 15,
    marginTop: 25,
    // display: "flex",
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  patternContainer: {
    width: "100%",
    // display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20
  },
  patternItem: {
    // flex: 1,
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
    height: 25,
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
    marginVertical: 18,
    padding: 15,
    backgroundColor: colors.background2,
    borderRadius: 20,
    elevation: 3,
    overflow: "visible",
    width: Dimensions.get("window").width - 60
  }
})

export default EditCard;
