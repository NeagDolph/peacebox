/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {withTheme} from "react-native-paper";
import Header from "./components/header"

const App = (props: any) => {
  const {colors} = props.theme
  return (
    <SafeAreaView>
      <View style={{padding: 20}}>
        <Header/>
      </View>
    </SafeAreaView>
  );
};



export default withTheme(App);
