import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {useSelector} from "react-redux";

interface HeaderProps {
  inlineTitle: boolean | void;
  title: string;
  navigation: any;
  settingsIcon: string,
  settingsCallback: () => void;
  titleWhite: boolean,
  settingsButton: boolean,

}

const PageHeader = ({inlineTitle=false, title, navigation, settingsIcon, settingsCallback, titleWhite, settingsButton}: HeaderProps) => {

  const getTitleColor = () => (titleWhite ?? true) && !inlineTitle ? "white" : "black"

  return (
    <View style={[styles.headerContainer, inlineTitle && styles.inlineHeader]}>
      <VibrancyView
        style={styles.absolute}
        blurType="regular"
        blurAmount={8}
        reducedTransparencyFallbackColor="white"
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon="long-arrow-alt-left" color="#222" size={26}/>
      </TouchableOpacity>
      <View style={styles.settingsButton}>
        {
          (settingsButton ?? true) &&
          <TouchableOpacity onPress={settingsCallback}>
            <FontAwesomeIcon icon={settingsIcon || "cog"} color="#222" size={26}/>
          </TouchableOpacity>
        }
      </View>
      <Text numberOfLines={1} style={[
        styles.title,
        {color: getTitleColor()},
        inlineTitle ? styles.inlineTitle : styles.titleUnder
      ]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 160,
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
  inlineHeader: {
    height: 90,
    textAlign: "center",
    // flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
  titleUnder: {
    left: 30,
    position: "absolute",
    bottom: 0,
  },
  inlineTitle: {
    position: "relative",
    marginTop: 30,
    fontSize: 24,
    maxWidth: 200,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Helvetica"
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 25,
  },
  settingsButton: {
    top: 45,
    position: "absolute",
    right: 25
  }
})

export default PageHeader;
