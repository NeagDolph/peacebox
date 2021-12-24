import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {colors} from "../../config/colors";
import MaskedView from "@react-native-masked-view/masked-view";
import FastImage from "react-native-fast-image";
import Animated, {
  Easing,
  interpolate, runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue, withTiming
} from "react-native-reanimated";
import Fade from "../../components/fade-wrapper";
import PropTypes from 'prop-types'
import crashlytics from "@react-native-firebase/crashlytics";


const LogoBox = (props) => {
  const windowHeight = useSharedValue(Dimensions.get("window").height ?? 0);
  const windowWidth = useSharedValue(Dimensions.get("window").width ?? 0);
  const [layoutData, setLayoutData] = useState({
    x: 23.66666603088379,
    width: 48
  });

  const handleLayout = ({nativeEvent: event}) => {
    console.log(event.layout)
    setLayoutData(event.layout)
  }

  const leftOffset = useSharedValue(0);

  const calcOffset = useCallback(() => {
    const calcMove = (Dimensions.get("window").width - layoutData.width) / 2 - layoutData.x
    return props.endOfScroll ? calcMove : 0;
  }, [layoutData, props.endOfScroll])

  useEffect(() => {
    crashlytics().log("Finished scrolling on home page")
    leftOffset.value = withTiming(calcOffset(), {
      duration: 900,
      easing: Easing.out(Easing.circle)
    }, (res) => {
      if (res) {
        // runOnJS(props.setEndOfAnim)(true);
      }
    });

  }, [props.endOfScroll])


  const visibleStyles = useAnimatedStyle(() => {
    const logoTop = Math.min(Math.max(props.safeViewHeight / 2, 0), 30) - 30;
    const opacity = interpolate(props.scrollOffset.value, [0, 100], [0.4, 1]);
    const scrollTop = interpolate(props.scrollOffset.value, [0, windowHeight.value], [(windowHeight.value / 6), logoTop])

    const smallCalc = Math.min(scrollTop, 610) - Math.max( props.scrollOffset.value- 610, 0);
    const yTop = windowHeight.value > 800 ? scrollTop : smallCalc

    return {
      opacity: opacity,
      transform: [

        {translateY: yTop},
        {translateX: leftOffset.value}
      ],
    };

  }, [props.safeViewHeight]);

  const logoColorStyles = useAnimatedStyle(() => {
    const opacity = interpolate(leftOffset.value, [0, windowWidth.value * 0.3], [0, 1]);

    return {
      opacity,
    };
  });

  const renderLogoText = () => {
    return (
      <Animated.View style={[styles.maskElement, visibleStyles]}>
        <Text style={styles.logoText} onLayout={handleLayout}>P</Text>
        <Fade duration={500} disableMount={true} visible={!props.endOfScroll} style={{flexDirection: "row"}}>
          <>
            <Text style={styles.logoText}>eaceBox</Text>
          </>
        </Fade>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={[styles.titleContainer]}>
      <MaskedView
        style={{width: "100%"}}
        maskElement={renderLogoText()}>
        <FastImage
          style={styles.image}
          source={require("../../assets/background3.jpg")}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Animated.View style={[styles.blackView, logoColorStyles]}/>
      </MaskedView>
    </Animated.View>
  );
};

LogoBox.propTypes = {
  endOfScroll: PropTypes.bool,
  handleLayout: PropTypes.func,
  scrollOffset: PropTypes.any,
  setEndOfAnim: PropTypes.func,
  safeViewHeight: PropTypes.number,
  used: PropTypes.bool // Bool for if app has been opened before
}


const styles = StyleSheet.create({
  blackView: {
    width: Dimensions.get("window").width,
    height: 100,
    position: "absolute",
    backgroundColor: colors.black,
    zIndex: 10,
    top: 0,
    left: 0
  },
  image: {
    top: 0,
    width: "100%",
    height: Dimensions.get("window").height * 0.28125,
    position: "absolute",
  },
  maskElement: {
    backgroundColor: "transparent",
    justifyContent: 'center',
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    textAlign: "center",
    borderColor: "transparent"
  },
  titleContainer: {
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    top: 20,
    left: 0,
  },
  logoText: {
    fontSize: 67,
    fontFamily: "Futura",
    fontWeight: "900",
  },
  peace: {
    color: colors.black
  },
  box: {
    color: colors.black
  },
});

export default LogoBox;
