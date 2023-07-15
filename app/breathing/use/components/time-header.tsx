import React from "react";
import PropTypes from "prop-types";

import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TimeHeader = props => {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={props.exit}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerExit}>Exit</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

TimeHeader.propTypes = {
  exit: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  headerExit: {
    fontSize: 18
  },
  headerContainer: {
    justifyContent: "space-between",
    // flex: 1,
    width: "100%",
  }
})

export default TimeHeader;
