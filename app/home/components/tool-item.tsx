import React from "react";

import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Surface } from "react-native-paper";
import { colors } from "../../config/colors";

interface ToolData {
  title: string;
  icon: any;
  iconDark: any;
  description: string;
  tags: string[];
  nav: () => void;
}


const ToolItem = (props: ToolData) => {
  const getImageSource = () => {
    if (Platform.OS === "ios") {
      return colors.dark ? props.iconDark : props.icon;
    }

    return props.icon;
  };

  const imageSource = Image.resolveAssetSource(getImageSource());

  const openMenu = () => {
    if (props.nav) props.nav();
  };

  return (
    <Surface style={styles.toolItem}>

      <TouchableOpacity onPress={openMenu} activeOpacity={0.2}>
        <View style={styles.innerContainer}>
          <View style={styles.toolItemContent}>
            <Text style={[styles.toolItemTitle]} numberOfLines={1}
                  adjustsFontSizeToFit>{props.title}</Text>
            <Text style={[styles.toolItemDescription]}>{props.description}</Text>
          </View>
          {
            imageSource &&
            <Image
              source={imageSource}
              resizeMode={Platform.OS === "ios" ? "cover" : "contain"}
              style={[styles.iconBackground, Platform.OS === "android" && {
                width: imageSource.width / (imageSource.height / 120),
                opacity: 0.2
              }]}
            />
          }
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

let styles = StyleSheet.create({
  innerContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    overflow: "hidden"
  },
  iconBackground: {
    height: 120,
    position: "absolute",
    right: 35,
    top: -10,
    zIndex: -1
    // flex: 1,
    // justifyContent: "flex-end"
  },
  toolItem: {
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "auto",
    borderRadius: 20,
    // borderWidth: 1,
    backgroundColor: colors.background2,
    // borderColor: colors.dark ? colors.background : colors.background2,
    flexDirection: "column",
    marginVertical: 8
    // overflow: "hidden"
  },
  toolItemContent: {
    width: "80%",
    overflow: "visible"
  },
  toolItemTitle: {
    fontSize: 38,
    // marginVertical: 5,
    marginBottom: 0,
    // fontWeight: "bold",
    width: "100%",
    fontFamily: "Baloo2",
    color: colors.primary
  },
  toolItemDescription: {
    fontSize: 16,
    color: colors.text,
    fontFamily: "Baloo2",
    lineHeight: 20

  },
  chipView: {
    flexDirection: "row",
    width: "auto"
  },
  chip: {
    marginRight: 5,
    color: colors.accent
  }
});

export default ToolItem;
