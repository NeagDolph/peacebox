import React from 'react';
import {Dimensions, StyleSheet, View} from "react-native";
import {Button, Surface, Text} from "react-native-paper";
import {colors} from "../../config/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const PatternItem = props => {
  const generateSequence = (sequence) => {
    const iconList = [
      <Icon style={styles.icon} size={25} name="chevron-double-down" />,
      <Icon style={[styles.icon, styles.iconCircle]} size={21} name="circle-double" />,
      <Icon style={styles.icon} size={25} name="chevron-double-up" />,
      <Icon style={[styles.icon, styles.iconCircle]} size={21} name="circle-double" />
    ];

    return sequence.map((el, i) => (
      <View key={i} style={styles.sequenceContainer}>
        <Text style={styles.sequence}>{el}</Text>
        {iconList[i]}
      </View>
    ))
  }


  const truncateTitle = (title) => {
    return title.length > 20 ? title.substring(0, 20) + "..." : title
  }



  return (
    <View style={styles.patternItem}>
      <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{truncateTitle(props.pattern.name)}</Text>
      <View style={styles.patternData}>
        <View style={styles.sequenceList}>{generateSequence(props.pattern.sequence)}</View>
        <View style={styles.actionButtons}>
          <Button onPress={() => props.editPattern(props.pattern.id)} labelStyle={styles.buttonText} mode="outlined" style={styles.button}>Edit</Button>
          <Button onPress={() => props.usePattern(props.pattern.id)} labelStyle={styles.buttonText} mode="contained" style={styles.button}>Use</Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: "#777",
  },
  iconCircle: {
    margin: 2.5
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.primary,
    fontFamily: "Avenir Next"

    // marginBottom: 10

  },
  buttonText: {
    marginVertical: 10,
    marginHorizontal: 15
  },
  button: {
    borderRadius: 10,
    marginTop: 8,
    borderColor: colors.accent,
    maxWidth: 100
  },
  actionButtons: {
    // width: "50%",
    height: "auto",
    bottom: 0,
    position: "relative",
    flexDirection: "column",
    marginTop: "auto",
    alignSelf: "flex-end",
    marginLeft: 8,
    alignItems: "baseline"
  },
  sequence: {
    fontSize: 21,
    fontWeight: "300",
  },
  sequenceContainer: {
    marginTop: 12,
    flexDirection: "row",
  },
  sequenceList: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "baseline",
    // height: "100%",
    position: "relative",
    // width: "50%",

  },

  patternItem: {
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    padding: 12,
    paddingRight: 16,
    paddingVertical: 16,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: (Dimensions.get('window').width - 84) / 2,
    position: "relative",
    height: "auto",
    marginTop: 20,
  },
  patternData: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    position: "relative",
    height: "auto"
  }
})

export default PatternItem;
