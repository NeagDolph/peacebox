import React from 'react';

import {StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {colors} from "../../../config/colors";

const ModalHeader = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.bar}/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },
  bar: {
    width: 40,
    height: 6,
    borderRadius: 10,
    backgroundColor: colors.placeholder
  }
})

export default ModalHeader;
