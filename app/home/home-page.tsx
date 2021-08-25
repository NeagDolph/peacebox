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
    title: "Freewriting",
    icon: require("../assets/freewriting-icon.png"),
    description: "Free your subconscious from its internal disagreement.",
    tags: ["Anxiety", "Self-doubt"],
    nav: "Freewriting"
  }
]

const renderTools = (toolsData: ToolData[], navigation) => {
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


const HomePage = ({navigation, theme}) => {
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
