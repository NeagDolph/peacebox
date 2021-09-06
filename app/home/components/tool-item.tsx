import React from 'react';

import {StyleSheet, Text, View, ImageBackground, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Chip, Surface, useTheme} from "react-native-paper";
import {white} from "react-native-paper/lib/typescript/styles/colors";

interface ToolData {
  title: string;
  icon: any;
  description: string;
  tags: string[];
  navigation: () => any;
}

const renderTags = (chipList: ToolData["tags"], colors: any) => {
  return chipList.map(el => (
    <Chip mode="flat" style={styles.chip} key={el}>{el}</Chip>
  ))
}

const ToolItem = (props: ToolData) => {
  const {colors} = useTheme()
  return (
    <Surface style={styles.toolItem}>

      <TouchableOpacity onPress={props.navigation}>
        <>
          <View style={styles.toolItemContent}>
            <View style={styles.chipView}>
              {renderTags(props.tags, colors)}
            </View>
            <Text style={[styles.toolItemTitle, {color: colors.text}]}>{props.title}</Text>
            <Text style={[styles.toolItemDescription, {color: colors.placeholder}]}>{props.description}</Text>
          </View>
          <Image source={props.icon} resizeMode="contain" style={styles.iconBackground}></Image>
        </>
      </TouchableOpacity>
    </Surface>
  );
};

let styles = StyleSheet.create({
  iconBackground: {
    height: 100,
    width: 100,
    position: "absolute",
    right: 0,
    bottom: 10,
    zIndex: -1
    // flex: 1,
    // justifyContent: "flex-end"
  },
  toolItem: {
    elevation: 3,
    width: "100%",
    height: "auto",
    borderRadius: 20,
    padding: 15,
    flexDirection: "column",
    marginVertical: 10
  },
  toolItemContent: {
    width: "70%"
  },
  toolItemTitle: {
    fontSize: 36,
    marginVertical: 5,
    fontWeight: "bold"
  },
  toolItemDescription: {
    fontSize: 16,

  },
  chipView: {
    flexDirection: "row",
    width: "auto"
  },
  chip: {
    marginRight: 5
  }
})

export default ToolItem;
