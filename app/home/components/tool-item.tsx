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
  nav: string;
}


const ToolItem = (props: ToolData) => {
  const imageSource = Image.resolveAssetSource(colors.dark ? props.iconDark : props.icon)

  const openMenu = () => {
    if (props.nav) props.nav();
  }

  return (
    <Surface style={styles.toolItem}>

      <TouchableOpacity onPress={openMenu} activeOpacity={props.navigation ? 0.2 : 1}>
        <View style={styles.innerContainer}>
          <View style={styles.toolItemContent}>
            <Text style={[styles.toolItemTitle]} numberOfLines={1}
                  adjustsFontSizeToFit>{props.title}</Text>
            <Text style={[styles.toolItemDescription]}>{props.description}</Text>
          </View>
          {
            imageSource &&
            <Image
              source={colors.dark ? props.iconDark : props.icon}
              resizeMode={Platform.OS === "ios" ? "cover" : "contain"} style={styles.iconBackground}
              width={imageSource.width / (imageSource.height / 120)}
            />
          }
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

let styles = StyleSheet.create({
  innerContainer: {
    paddingTop: 15,
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
    marginVertical: 8,
    // overflow: "hidden"
  },
  toolItemContent: {
    width: "80%",
    overflow: "visible"
  },
  toolItemTitle: {
    fontSize: 36,
    // marginVertical: 5,
    marginBottom: 6,
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
    marginRight: 5,
    color: colors.accent
  }
})

export default ToolItem;
