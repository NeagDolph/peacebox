import React from 'react';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export const FWInfoIcon = (props: any) => {
  return (
    <View>
      <TouchableOpacity onPress={() => props.navigation.navigate("FWInfo")}>
        <FontAwesomeIcon size={24} icon="info-circle"></FontAwesomeIcon>
      </TouchableOpacity>
    </View>
  )
}

const InfoPage = () => {
  return (
    <Text>
      Info
    </Text>
  );
};

const styles = StyleSheet.create({

})

export default InfoPage;
