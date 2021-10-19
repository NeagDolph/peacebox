import React from 'react';

import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {useSelector} from "react-redux";
import {colors} from "../../config/colors";

const StartScreen = (props) => {
  const used = useSelector(state => state.settings.general.used);

  return used ? <></> : (
    <View style={styles.container}>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    height: Dimensions.get("window").height + 300
  }
})

export default StartScreen;
