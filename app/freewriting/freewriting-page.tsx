import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface freewritingProps {}

const freewriting = (props: freewritingProps) => {
  return (
    <View style={styles.container}>
      <Text>freewriting</Text>
    </View>
  );
};

export default freewriting;

const styles = StyleSheet.create({
  container: {}
});
