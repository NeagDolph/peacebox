import React from 'react';

import {StyleSheet, Text, View, ImageBackground, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Chip, Surface, useTheme} from "react-native-paper";
import {white} from "react-native-paper/lib/typescript/styles/colors";
import {colors} from "../../config/colors";
import {useNavigation} from '@react-navigation/native';
import crashlytics from "@react-native-firebase/crashlytics";

interface ToolData {
  title: string;
  icon: any;
  description: string;
  tags: string[];
  navigation: string
}

const renderTags = (chipList: ToolData["tags"], colors: any) => {
  return chipList.map(el => (
    <Chip mode="flat" style={styles.chip} key={el}>{el}</Chip>
  ))
}

const ToolItem = (props: ToolData) => {
  const {colors} = useTheme()
  const navigation = useNavigation();
  const imageSource = Image.resolveAssetSource(props.icon)

  const openMenu = () => {
    crashlytics().log("Tool Opened: " + props.title)
    if (props.navigation) props.navigation();
  }

  return (
    <Surface style={styles.toolItem}>

      <TouchableOpacity onPress={openMenu} activeOpacity={props.navigation ? 0.2 : 1}>
        <>
          <View style={styles.toolItemContent}>
            {
              props.tags.length >= 1 &&
              <View style={styles.chipView}>
                {renderTags(props.tags, colors)}
              </View>
            }
            <Text style={[styles.toolItemTitle, {color: colors.text}]} numberOfLines={1}
                  adjustsFontSizeToFit>{props.title}</Text>
            <Text style={[styles.toolItemDescription, {color: colors.placeholder}]}>{props.description}</Text>
          </View>
          {
            imageSource &&
            <Image
                source={props.icon}
                resizeMode="cover" style={styles.iconBackground}
                width={imageSource.width / (imageSource.height / 140)}
            />
          }
        </>
      </TouchableOpacity>
    </Surface>
  );
};

let styles = StyleSheet.create({
  iconBackground: {
    height: 140,
    position: "absolute",
    right: 20,
    top: -10,
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
    borderWidth: 1,
    borderColor: colors.background2,
    flexDirection: "column",
    marginVertical: 10,
    overflow: "hidden"
  },
  toolItemContent: {
    width: "80%",
    overflow: "visible"
  },
  toolItemTitle: {
    fontSize: 36,
    marginVertical: 5,
    fontWeight: "bold",
    width: "100%",
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
