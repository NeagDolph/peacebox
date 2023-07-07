import React from 'react';
import PropTypes from 'prop-types'

import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native';

const TimeFooter = props => {
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

TimeFooter.propTypes = {
  exit: PropTypes.func.isRequired
}

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
