import React from 'react';

import {StyleSheet, Text, View, ImageBackground, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Chip, Surface, useTheme} from "react-native-paper";
import {colors} from "../../config/colors";
import {useNavigation} from '@react-navigation/native';
import crashlytics from "@react-native-firebase/crashlytics";

interface ToolData {
  title: string;
  icon: any;
  iconDark: any;
  description: string;
  tags: string[];
  nav: string
}

const renderTags = (chipList: ToolData["tags"]) => {
  return chipList.map(el => (
    <Chip mode="flat" style={styles.chip} key={el}>{el}</Chip>
  ))
}

const ToolItem = (props: ToolData) => {
  const imageSource = Image.resolveAssetSource(colors.dark ? props.iconDark : props.icon)

  const openMenu = () => {
    crashlytics().log("Tool Opened: " + props.title)
    if (props.nav) props.nav();
  }

  return (
    <Surface style={styles.toolItem}>

      <TouchableOpacity onPress={openMenu} activeOpacity={props.navigation ? 0.2 : 1}>
        <>
          <View style={styles.toolItemContent}>
            {
              props.tags.length >= 1 &&
              <View style={styles.chipView}>
                {renderTags(props.tags)}
              </View>
            }
            <Text style={[styles.toolItemTitle]} numberOfLines={1}
                  adjustsFontSizeToFit>{props.title}</Text>
            <Text style={[styles.toolItemDescription]}>{props.description}</Text>
          </View>
          {
            imageSource &&
            <Image
                source={colors.dark ? props.iconDark : props.icon}
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
    backgroundColor: colors.background2,
    borderColor: colors.dark ? colors.background : colors.background2,
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
    color: colors.primary
  },
  toolItemDescription: {
    fontSize: 16,
    color: colors.text

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
