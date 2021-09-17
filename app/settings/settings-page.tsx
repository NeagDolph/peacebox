import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import PageHeader from "../components/header";
import {Switch, Text, Divider} from "react-native-paper";
import { setSetting } from '../store/features/settingsSlice';
import {colors} from "../config/colors";

const SettingItem = (props) => {
  const {name, value, callback, setting} = props

  return (
    <View style={styles.settingItem}>
      <Text style={styles.settingName}>{name}</Text>
      <Switch value={value} onValueChange={(value) => callback(setting, value)} color={colors.accent}/>
    </View>
  )
}

const SettingsPage = ({route, navigation}) => {
  const {page, pageTitle} = route.params;

  const dispatch = useDispatch()
  const settings = useSelector(state => Object.entries(state.settings[page] ))
  // const [settings, setSettings] = useState([["showBackground", {name: "Show Background", value: false}]])

  const toggleSetting = (name, value) => {
    dispatch(setSetting({page: page, setting: name, value: value}))
  }

  const renderSetting = ({item}) => {
    return <SettingItem setting={item[0]} name={item[1].name} value={item[1].value} callback={toggleSetting}/>
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
            data={settings}
            renderItem={renderSetting}
            keyExtractor={item => item[0]}
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
