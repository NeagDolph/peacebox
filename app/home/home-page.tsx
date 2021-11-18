import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
import {setUsed, setSetting} from "../store/features/settingsSlice";
import {colors} from "../config/colors";
import Rate from 'react-native-rate'
import {store} from "../store/store";

interface ToolData {
  title: string;
  icon: string;
  description: string;
  tags: string[];
  nav: string | undefined;
}


const HomePage = ({navigation}: any) => {
  const settings = useSelector(state => state.settings.general);

  const askReview = () => {
    crashlytics().log("User clicked open review button.");

    if (settings.openedReview) {
      Alert.alert(
        "Throw us a review",
        `Do you want to open the app store?`,
        [

          {
            text: "Yes!", onPress: () => {
              crashlytics().log("Opened app store to give review");
              // https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336

              Linking.openURL("https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336")
              //   .catch((err) => {

              // });
            }

          },
          {text: "Nevermind"},
        ]
      );
    } else {
      const options = {
        AppleAppID: "1592436336",
        preferInApp: true,
        openAppStoreIfInAppFails: true,
        fallbackPlatformURL: "https://peacebox.app/download",
      }
      Rate.rate(options, (success, errorMessage) => {
        if (success) {
          // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
          crashlytics().log("User completed rating lifecycle.");
          dispatch(setSetting({
            page: "general",
            setting: "openedReview",
            value: true
          }))
        }
        if (errorMessage) {
          // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
          crashlytics().log("Error with reviewing.");
          crashlytics().recordError(Error(errorMessage));
        }
      })
    }
  }

  const toolsData: ToolData[] = [
    {
      title: "Free Writing",
      icon: require("../assets/writing.png"),
      description: "Let go of internal troubles by writing your thoughts.",
      tags: ["Anxiety", "Quick Relief"],
      nav: () => navigation.navigate("Freewriting")
    },
    {
      title: "Breathing",
      icon: require("../assets/wind.png"),
      description: "Breathing exercises to relax and improve your mood",
      nav: () => navigation.navigate("Patterns"),
      tags: ["Anxiety", "Stress", "Discontentment"],
    },
    {
      title: "More Coming Soon...",
      description: "Tap this card this to give us a review!",
      nav: askReview,
      tags: [],
      icon: require("../assets/toolbox.png")
    }
  ]

  const dispatch = useDispatch();

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
    scrollRef.current.scrollToEnd({animated: true})
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
      {/*<StatusBar*/}
      {/*  // animated={true}*/}
      {/*  // backgroundColor="#61dafb"*/}
      {/*  barStyle="dark-content"*/}
      {/*  // showHideTransition="slide"*/}
      {/*  />*/}

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
        // decelerationRate={0.5}
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
