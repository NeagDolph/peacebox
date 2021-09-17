/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  View,
} from 'react-native';


import {withTheme, Surface, Title, Paragraph, Button, Chip} from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import Header from "./components/header"
import ToolItem from "./components/tool-item";
// import Card from "../components/card"

interface ToolData {
  title: string;
  icon: string;
  description: string;
  tags: string[];
  nav: string;
}

const toolsData: ToolData[] = [
  {
    title: "Free Writing",
    icon: require("../assets/writing.png"),
    description: "Free your subconscious from its internal disagreement.",
    tags: ["Anxiety", "Quick Relief", "Skill"],
    nav: "Freewriting"
  },
  {
    title: "Breathing",
    icon: require("../assets/wind.png"),
    description: "Various breathing exercises to relax and improve your mood",
    nav: "Breathing",
    tags: ["Anxiety", "Discontentment"],
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
      navigation={() => navigation.navigate(data.nav)}
    />
  })
}


const HomePage = ({navigation, theme}: any) => {
  const {colors} = theme
  return (
    <SafeAreaView>
      <View style={{padding: 20}}>
        <Header/>
        <View style={{marginTop: 20}}>
          {renderTools(toolsData, navigation)}
        </View>
      </View>
    </SafeAreaView>
  );
};



export default withTheme(HomePage);
