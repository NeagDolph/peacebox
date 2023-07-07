import React, {
  Props,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";

import {
  withTheme,
  Surface,
  Title,
  Paragraph,
  Button,
  Chip
} from "react-native-paper";
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import FastImage from "react-native-fast-image";
import {
  NativeViewGestureHandler,
  State,
  TapGestureHandler
} from "react-native-gesture-handler";
import FadeGradient from "../../components/fade-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import haptic from "../../helpers/haptic";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../config/colors";
import useKeyboardHeight from "../../components/keyboard-hook";

let PlatormBlurView = Platform.OS === "ios" ? VibrancyView : BlurView;

const WritingCard = ({
                       clearContent,
                       setInputRef,
                       handleLayout,
                       editable,
                       placeholder,
                       activityBg,
                       fullscreen,
                       children,
                       pages,
                       settings,
                       lineHeight,
                       setLineHeight,
                       setCurrentText

                     }) => {
  const [pageHeight, setPageHeight] = useState(0);

  const keyboardHeight = useKeyboardHeight();

  const tapRef = useRef(null);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef.current && setInputRef) {
      setInputRef(inputRef.current);
    }
  }, [inputRef]);

  const cardLayout = ({ nativeEvent: { layout } }) => {
    const lineConstant = fullscreen ? 37.9059228 : 18.9209614; // Constant for number of lines in the paper image
    const aspectRatio = fullscreen ? 2.88284518 : 1.44142259; // Constant for paper image height/width

    if (setLineHeight) setLineHeight(layout.height / lineConstant); //For some reason setLineHeight is undefined when layout event runs on page deletion
    setPageHeight(layout.width * aspectRatio);
  };

  const handleTap = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // inputRef.current.blur() // Causing issues
      clearContent();
      haptic(2);
      if (inputRef.current) {
        setTimeout(() => inputRef.current.blur(), 100);
      }
    } else if (event.nativeEvent.state == State.BEGAN && inputRef.current && !inputRef.current.isFocused()) {
      inputRef.current.focus();
    }
  };

  const inputContainerHeight = useCallback(() => {
    return (pageHeight ?? 0) - (lineHeight ?? 0) + 1;
  }, [pageHeight, lineHeight]);

  const calcImageSource = () => {
    if (colors.dark) {
      return fullscreen
        ? require("../../assets/dark/long_paper.png")
        : require("../../assets/dark/paper.png");
    } else {
      return fullscreen
        ? require("../../assets/long_paper.png")
        : require("../../assets/long_paper.png");
    }
  };

  const pagesStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: fullscreen ? -keyboardHeight.value * 1.01 : 0 }]
    };
  }, [fullscreen]);

  const renderPageCount = () => {
    return (
      settings?.showCompletedPages && (
        <Animated.View
          style={[
            styles.countContainer,
            fullscreen
              ? {
                top: Dimensions.get("window").height - 148,
                right: 15
              }
              : { bottom: 0 },
            pagesStyle
          ]}>
          <Text style={[styles.count, { fontSize: fullscreen ? 28 : 24 }]}>
            {pages}
          </Text>
        </Animated.View>
      )
    );
  };

  return (
    <>
      <View
        style={[
          styles.card,
          { height: pageHeight, shadowRadius: fullscreen ? 0 : 4.4 }
        ]}>
        {activityBg && (
          <PlatormBlurView
            style={styles.absolute}
            blurType={colors.dark ? "dark" : "light"}
            blurAmount={8}
          />
        )}
        <FastImage
          onLayout={cardLayout}
          style={[
            styles.imageStyle,
            { height: fullscreen ? "100%" : "141%", width: "100%", borderRadius: fullscreen ? 0 : 8 }
          ]}
          source={calcImageSource()}
          resizeMode={Platform.OS == "ios" ? FastImage.resizeMode.cover : FastImage.resizeMode.stretch}
        />
        <View
          style={[
            styles.inputContainer,
            { width: "100%", height: inputContainerHeight() }
          ]}>
          <TextInput
            style={styles.input}
            // style={{lineHeight: 350, includeFontPadding: false, paddingTop: 0, textAlignVertical: "top", fontSize: 15, margin: 0, }}
            placeholder={placeholder}
            allowFontScaling={true}
            placeholderTextColor="#8A897C"
            textAlignVertical={"top"}
            multiline={true}
            autoCapitalize="none"
            disableFullscreenUI={true}
            importantForAutofill="no"
            onChangeText={setCurrentText}
            onContentSizeChange={handleLayout}
            autoFocus={false}
            autoCorrect={false}
            keyboardType="default"
            editable={editable}
            selectionColor={colors.accent}
            ref={inputRef}
            contextMenuHidden={true}
          />
          <TapGestureHandler
            onHandlerStateChange={handleTap}
            ref={tapRef}
            hitSlop={10}
            numberOfTaps={2}>
            <View
              style={{
                zIndex: 1,
                position: "absolute",
                ...StyleSheet.absoluteFillObject
              }}
            />
          </TapGestureHandler>
        </View>

        {renderPageCount()}
      </View>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    overflow: "hidden",
    lineHeight: 40
  },
  countContainer: {
    position: "absolute",

    right: 0,
    padding: 10
  },
  count: {
    color: colors.primary,
    fontFamily: "Futura",
    fontSize: 20
  },
  fullScreen: {
    borderRadius: 40,
    backgroundColor: "rgba(140, 120, 140, 0.2)",
    // width: 50,
    padding: 9,
    marginRight: 10,
    right: 0
  },
  headerContainer: {
    zIndex: 10,
    // width: "100%",
    // justifyContent: "flex-end",
    // flexDirection: "column",
    position: "absolute",
    top: 10,
    right: 0
  },
  background: {
    color: "#fff0",
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: {
      width: 0,
      height: 0
    },
    textShadowRadius: 10,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize"
  },
  imageStyle: {
    // height: Dimensions.get("window").height * 0.547740584,
    // width: Dimensions.get("window").height * 0.38,
    top: 0,
    left: 0,
    position: "absolute"
  },
  absolute: {
    width: "100%",
    top: 0,
    left: 0,
    height: "100%",
    zIndex: 99,
    position: "absolute",
    borderRadius: 8
  },
  card: {
    // height: Dimensions.get("window").height * 0.547740584,
    // width: Dimensions.get("window").height * 0.38,
    width: "100%",

    overflow: "hidden",
    backgroundColor: colors.dark ? colors.background2 : "#f5f7ea",
    paddingTop: 0,
    // paddingLeft: "7%",
    borderRadius: 8,
    // paddingRight: 10,
    fontSize: 12,
    lineHeight: 40,
    // overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.7)",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 4.4,
    elevation: 2
  },
  input: {
    width: "100%",
    lineHeight: 10,
    fontFamily: "Roboto",
    paddingLeft: "7%",
    paddingTop: 5,
    color: colors.primary,
    paddingRight: 10,
    top: -5,
    position: "relative"
  },
  inputLine: {
    alignItems: "stretch",
    top: -3
  }
});

export default WritingCard;
