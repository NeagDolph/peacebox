import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import crashlytics from "@react-native-firebase/crashlytics";


import Header from "./components/header"
import ToolItem from "./components/tool-item";
import FadeGradient from "../components/fade-gradient";
import StartScreen from "./start/start-screen";
import LogoBox from "./components/logo-box";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue
} from "react-native-reanimated";
import {useDispatch, useSelector} from "react-redux";
import {setUsed} from "../store/features/settingsSlice";
import {colors} from "../config/colors";

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
    function: () => {},
    icon: require("../assets/toolbox.png")
  }
]


const HomePage = ({navigation}: any) => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings.general);

  const scrollOffset = useSharedValue(0);
  const windowHeight = useSharedValue(Dimensions.get("window").height ?? 0);

  // const [endOfScroll, setEndOfScroll] = useState(settings.used)
  // const [endOfAnim, setEndOfAnim] = useState(settings.used)

  const [endOfScroll, setEndOfScroll] = useState(false)
  const [endOfAnim, setEndOfAnim] = useState(false)

  const [safeViewHeight, setSafeViewHeight] = useState(50);
  const scrollRef = useRef(null)

  useEffect(() => {
    if (endOfScroll && !settings.used) dispatch(setUsed("general"));
  }, [endOfScroll])

  useEffect(() => {
    crashlytics().log("Page loaded: Home Page")
    if (!settings.used) {
      crashlytics().log("Home page loaded for the first time")
    }
  }, [])


  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;


    if (event.contentOffset.y + windowHeight.value + 5 >= event.contentSize.height) runOnJS(setEndOfScroll)(true);
    else if (endOfScroll) runOnJS(setEndOfScroll)(false);
  });

  const safeViewLayout = ({nativeEvent}) => {
    const openHeight = windowHeight.value - nativeEvent.layout.height
    setSafeViewHeight(openHeight > 80 ? (openHeight / 2 - 20) : 0)
  }

  const scrollBottom = () => {
    scrollRef.current.scrollToEnd({animated: false})
  }

  const renderTools = (toolsData: ToolData[]) => {
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

  return (
    <>
      {endOfAnim || <LogoBox
          scrollOffset={scrollOffset}
          endOfScroll={endOfScroll}
          setEndOfAnim={setEndOfAnim}
          safeViewHeight={safeViewHeight}
      />}
      <Animated.ScrollView
        bounces={false}
        onScroll={scrollHandler}
        ref={scrollRef}
        scrollEventThrottle={16}
        // scrollEnabled={!(endOfScroll && !endOfAnim)}
        scrollEnabled={true}
        indicatorStyle="black"
        showsVerticalScrollIndicator={!endOfAnim}
      >
        {endOfAnim && <View style={styles.logoContainer}>
            <Text style={styles.logoText}>P</Text>
        </View>}
        {endOfAnim || <StartScreen scrollOffset={scrollOffset} scrollBottom={scrollBottom}/>}
        <View style={{marginBottom: safeViewHeight}} onLayout={safeViewLayout}>
          <View style={{paddingHorizontal: 20}}>
            <Header/>
            <View style={{marginTop: 20}}>
              {renderTools(toolsData)}
            </View>
            <View style={styles.aboutContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("About")}>
                <Text style={styles.about}>About</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </>
  );

};

const styles = StyleSheet.create({
  aboutContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  about: {
    fontSize: 16,
    fontFamily: "Avenir",
    color: colors.primary,
    width: 100,
    height: 40,
    textAlign: "center"
  },
  logoText: {
    fontSize: 67,
    fontFamily: "Futura",
    fontWeight: "900",
    lineHeight: 93
  },

  logoContainer: {
    height: 70,
    marginTop: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default HomePage;
