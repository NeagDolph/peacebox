import React, {useEffect} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from "react-redux";
import PropTypes from 'prop-types'
import { VibrancyView } from "@react-native-community/blur";
import { useNavigation } from '@react-navigation/native';
import crashlytics from "@react-native-firebase/crashlytics";
import { hasNotch } from 'react-native-device-info';

interface HeaderProps {
  inlineTitle: boolean | void;
  title: string;
  navigation: any;
  settingsIcon: string,
  settingsCallback: () => void;
  titleWhite: boolean,
  settingsButton: boolean,

}

const PageHeader = ({title, settingsIcon, settingsCallback, titleWhite, settingsButton, shadow=true}) => {
  const navigation = useNavigation();
  const notch = hasNotch();

  useEffect(() => {
    crashlytics().log("Header Loaded | Page Title: " + title)
  }, [])

  const goBack = () => {
    crashlytics().log("Header Component: User pressed back button")
    navigation.goBack();
  }

  return (
    <View style={[styles.headerContainer, shadow && styles.headerShadow]}>
      <VibrancyView
        style={styles.absolute}
        blurType="light"
        blurAmount={8}
      />
      <Pressable style={[styles.backButton, {top: notch ? 14 : 7}]} onPress={goBack} hitSlop={10}>
        <Icon name="arrow-left" color="black" size={26}/>
      </Pressable>
      <View style={[styles.settingsButton, {top: notch ? 14 : 7}]}>
        {
          (settingsButton ?? true) &&
          <Pressable onPress={settingsCallback} hitSlop={10}>
            <Icon name={settingsIcon || "cog"} color="black" size={26}/>
          </Pressable>
        }
      </View>
      <View style={[styles.titleContainer, {marginTop: notch ? 16 : 7}]} pointerEvents="box-none">
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
      </View>
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
    height: Dimensions.get("window").height / 11,
    position: "relative",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: Dimensions.get("window").height / 11,
    // backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  title: {
    fontWeight: "400",
    fontFamily: "Avenir",
    fontSize: 24
  },
  titleContainer: {
    position: "relative",
    height: "100%",
    alignItems: "center",
    // maxWidth: 300,
    zIndex: 0,
    left: 0,
    justifyContent: "center"
  },
  backButton: {
    position: "absolute",
    height: "100%",
    left: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  settingsButton: {
    position: "absolute",
    top: 10,
    height: "100%",
    right: 25,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default PageHeader;
