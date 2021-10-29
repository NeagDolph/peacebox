import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from "react-redux";
import PropTypes from 'prop-types'
import { VibrancyView } from "@react-native-community/blur";
import { useNavigation } from '@react-navigation/native';
import crashlytics from "@react-native-firebase/crashlytics";

interface HeaderProps {
  inlineTitle: boolean | void;
  title: string;
  navigation: any;
  settingsIcon: string,
  settingsCallback: () => void;
  titleWhite: boolean,
  settingsButton: boolean,

}

const PageHeader = ({inlineTitle=false, title, settingsIcon, settingsCallback, titleWhite, settingsButton, shadow=true}) => {

  const getTitleColor = () => (titleWhite ?? true) && !inlineTitle ? "white" : "black"
  const navigation = useNavigation();

  useEffect(() => {
    crashlytics().log("Header Loaded | Page Title: " + title)
  }, [])

  const goBack = () => {
    crashlytics().log("Header Component: User pressed back button")
    navigation.goBack();
  }

  return (
    <View style={[styles.headerContainer, inlineTitle && styles.inlineHeader, shadow && styles.headerShadow]}>
      <VibrancyView
        style={styles.absolute}
        blurType="chromeMaterialLight"
        blurAmount={8}
      />
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Icon name="arrow-left" color="#222" size={26}/>
      </TouchableOpacity>
      <View style={styles.settingsButton}>
        {
          (settingsButton ?? true) &&
          <TouchableOpacity onPress={settingsCallback}>
            <Icon name={settingsIcon || "cog"} color="#222" size={26}/>
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

PageHeader.propTypes = {
  inlineTitle: PropTypes.bool,
  title: PropTypes.string.isRequired,
  settingsIcon: PropTypes.any,
  settingsCallback: PropTypes.func,
  titleWhite: PropTypes.bool,
  settingsButton: PropTypes.bool
}

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 4.62,

    elevation: 4,
  },
  headerContainer: {
    width: "100%",
    height: 160,
    position: "relative",
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
    // backgroundColor: "rgba(255, 255, 255, 0.4)",
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
