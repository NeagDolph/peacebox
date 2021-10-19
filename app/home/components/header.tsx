import React, {Component} from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
// import {connect} from 'react-redux';
import {withTheme} from 'react-native-paper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {colors} from "../../config/colors";

const generateMotd = () => {
  let motdList = [
    "What tool will most help you?",
    "What tool do you need right now?",
    "What support does your mind need?",
    "How do you want to soothe yourself?",
    "Ready to comfort your mind?"
  ]

  let dayMod = Math.floor(Date.now() / 86400000) % motdList.length

  return motdList[dayMod];
}

const generateIcon = () => {
  let iconList = [
    "bolt",
    "burn",
    "certificate",
    "cloud",
    "gem",
  ]

  let dayMod = Math.floor(Date.now() / 86400000) % iconList.length

  return iconList[dayMod];
}

const Header = (props: any) => {
  return (
    <View style={{width: "100%"}}>
      {/*<FontAwesomeIcon style={{color: colors.text, position: "absolute", right: 0}} icon="cog" size={33}/>*/}
      <View>
        <Text style={styles.title}>
          Here's your mental toolbox
        </Text>
        <Text style={styles.subtitle}>
          Pick a tool that works for you
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    paddingTop: 0,
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: "Avenir"
  },
  title: {
    paddingTop: 10,
    color: colors.primary,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 35,
    fontFamily: "Avenir-Black"
  },
  welcome: {
    marginLeft: 10,
    color: colors.text,
    fontSize: 17,
    lineHeight: 21,
  }
})

// @ts-ignore
export default Header
