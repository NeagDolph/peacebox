import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
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
        <View style={{flexDirection: "row", width: "auto"}}>
          <FontAwesomeIcon style={{color: colors.accent}} icon={generateIcon()} size={22}/>
          <Text style={{marginLeft: 10, color: colors.text, fontSize: 17, lineHeight: 21,}}>
            Hey Neil!
          </Text>
        </View>
        <FontAwesomeIcon style={{color: colors.text, position: "absolute", right: 0}} icon="cog" size={33}/>
        <View style={{width: "75%"}}>
          <Text
            style={{paddingTop: 8, color: colors.text, fontSize: 30, fontWeight: 'bold',}}>{generateMotd()}</Text>
        </View>
      </View>
    );
}

// @ts-ignore
export default Header
