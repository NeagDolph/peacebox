import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {useSelector} from "react-redux";

const PageHeader = (props) => {

  return (
    <View style={styles.headerContainer}>
      <VibrancyView
        style={styles.absolute}
        blurType="regular"
        blurAmount={8}
        reducedTransparencyFallbackColor="white"
      />
      <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
        <FontAwesomeIcon icon="long-arrow-alt-left" color="#222" size={26}/>
      </TouchableOpacity>
      <View style={styles.settingsButton}>
        {
          (props.settingsButton ?? true) &&
          <TouchableOpacity onPress={props.settingsCallback}>
            <FontAwesomeIcon icon={props.settingsIcon || "cog"} color="#222" size={26}/>
          </TouchableOpacity>
        }
      </View>
      <Text style={[styles.title, {color: props.titleWhite ?? true ? "white" : "black"}]}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 160,
    padding: 25,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 4.62,

    elevation: 4,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 90,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    position: "absolute",
    bottom: 0,
    left: 30,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 25,
  },
  settingsButton: {
    position: "absolute",
    top: 5,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    right: 25
  }
})

export default PageHeader;
