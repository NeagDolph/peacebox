/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {Dimensions, SafeAreaView, ScrollView, View,} from 'react-native';


import {withTheme, Surface, Title, Paragraph, Button, Chip} from "react-native-paper";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


import Header from "./components/header"
import ToolItem from "./components/tool-item";
import FadeGradient from "../components/fade-gradient";
import StartScreen from "./start/start-screen";
import LogoBox from "./components/logo-box";
import Animated, {
  Extrapolation,
  interpolate, runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";

interface ToolData {
  title: string;
  icon: string;
  description: string;
  tags: string[];
  nav: string | undefined;
}

const toolsData: ToolData[] = [
  {
    title: "Free Writing",
    icon: require("../assets/writing.png"),
    description: "Let go of internal troubles by writing your thoughts.",
    tags: ["Anxiety", "Quick Relief"],
    nav: "Freewriting"
  },
  {
    title: "Breathing",
    icon: require("../assets/wind.png"),
    description: "Breathing exercises to relax and improve your mood",
    nav: "Patterns",
    tags: ["Anxiety", "Stress", "Discontentment"],
  },
  {
    title: "Coming Soon...",
    description: "Some very calming features are in the works...",
    nav: undefined,
    tags: [],
    icon: require("../assets/toolbox.png")
  }
]

const renderTools = (toolsData: ToolData[], navigation: any) => {
  return toolsData.map(data => {
    return <ToolItem
      key={data.title}
      tags={data.tags}
      title={data.title}
      icon={data.icon}
      description={data.description}
      navigation={data.nav}
    />
  })
}

const HomePage = ({navigation, theme}: any) => {
  const {colors} = theme
  const scrollOffset = useSharedValue(-300);
  const windowHeight = useSharedValue(Dimensions.get("window").height ?? 0);
  const [endOfScroll, setEndOfScroll] = useState(false)

  const scrollHandler = useAnimatedScrollHandler((event) => {
    if (event.contentOffset.y + windowHeight.value + 5 >= event.contentSize.height) runOnJS(setEndOfScroll)(true);
    else if (endOfScroll) runOnJS(setEndOfScroll)(false);
    scrollOffset.value = event.contentOffset.y - 300;
  });


  return (
    <>
      <LogoBox
        scrollOffset={scrollOffset}
        endOfScroll={endOfScroll}
      />
      <Animated.ScrollView
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        scrollEnabled={!endOfScroll}
      >
        <StartScreen/>
        <SafeAreaView style={{marginBottom: 100}}>
          <FadeGradient top={0} bottom={0.2}>
            <View style={{padding: 20}}>
              <Header/>
              <View style={{marginTop: 20}}>
                {renderTools(toolsData, navigation)}
              </View>
            </View>
          </FadeGradient>
        </SafeAreaView>
      </Animated.ScrollView>
    </>
  );
};


export default withTheme(HomePage);
