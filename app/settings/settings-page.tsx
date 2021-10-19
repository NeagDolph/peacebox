import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import PageHeader from "../components/header";
import {Switch, Text, Divider} from "react-native-paper";
import { setSetting } from '../store/features/settingsSlice';
import {colors} from "../config/colors";

const settingNames = require("./settings.json");

const SettingItem = (props) => {
  const {item, toggle, value} = props

  return (
    <View style={styles.settingItem}>
      <Text style={styles.settingName}>{item.name}</Text>
      <View style={styles.settingToggle}>
        <Text style={styles.settingToggleLabel}>{value ? "On" : "Off"}</Text>
        <Switch value={value} onValueChange={(value) => toggle(item, value)} color={colors.accent}/>
      </View>
    </View>
  )
}

const SettingsPage = ({route, navigation}) => {
  const {page, pageTitle} = route.params;

  const dispatch = useDispatch()
  const settingValues = useSelector(state => state.settings[page])

  const toggleSetting = (item, value) => {
    dispatch(setSetting({page: page, setting: item.setting, value: value}))
  }

  const renderSetting = ({item}) => {
    return <SettingItem key={item.setting} item={item} toggle={toggleSetting} value={settingValues[item.setting]}/>
  }

  return (
    <>
      <PageHeader
        settingsButton={false}
        titleWhite={false}
        title={pageTitle ?? "Settings"}
        navigation={navigation}
      />

      <SafeAreaView style={styles.safeView}>
        <View style={styles.container}>
          <FlatList
            data={settingNames[page]}
            renderItem={renderSetting}
            keyExtractor={item => item.setting}
            ItemSeparatorComponent={Divider}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20,
    margin: 30,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 8,
    height: "100%"
  },
  settingToggleLabel: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 30,
    textTransform: "capitalize",
    marginHorizontal: 6,
  },
  settingToggle: {
    flexDirection: "row",
  },
  settingItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10
  },
  settingName: {
    fontSize: 16,
    lineHeight: 28,

  }
})

export default SettingsPage;
