import React from 'react';

import {StyleSheet, Text, View} from 'react-native';
import ScrollPicker from './scrollpicker';
import {colors} from "../../config/colors";

const NumberPicker = (props) => {
  return (
      <ScrollPicker
        dataSource={Array(props.maxNumber).fill("").map((el, i) => i + (props.includeZero ? 0 : 1))}
        selectedIndex={props.value - 1}
        onValueChange={(data) => props.setSequenceAmount(data, props.index)}
        wrapperHeight={46}
        wrapperWidth={41}
        wrapperStyle={props.style}
        wrapperBackground={'#FFFFFF'}
        itemHeight={27}
        borderRadius={6}
        highlightColor={'#d8d8d8'}
        highlightBorderWidth={2}
        activeItemColor={colors.primary}
        itemColor={colors.text2}
        itemTextStyle={{
          fontSize: 27,
          color: colors.text2,
        }}
        activeItemTextStyle={{
          color: colors.primary
        }}
      />
  );
};

export default NumberPicker;
