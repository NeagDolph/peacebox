import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {Button, Surface, Text} from "react-native-paper";
import {colors} from "../../config/colors";
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types'
import crashlytics from "@react-native-firebase/crashlytics"
import {PanGestureHandler, TapGestureHandler, State} from "react-native-gesture-handler";
import {setTSpan} from "react-native-svg/lib/typescript/lib/extract/extractText";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler, useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import Backplate from "./backplate";
import haptic from "../../helpers/haptic";

const PatternItem = props => {
  const [itemHeight, setItemHeight] = useState(0);
  const [dragMode, setDragMode] = useState(0)
  const [beingDragged, setBeingDragged] = useState(false)

  const tapRef = useRef(null)

  const hasPause = useCallback(() => props.patternData.settings.breakBetweenCycles && !props.buttonVisible, [props.buttonVisible, props.patternData.settings.breakBetweenCycles])

  useEffect(() => {
    console.log("dragmod", dragMode)
    if (dragMode !== 0) haptic(1)
  }, [dragMode])

  const dragX = useSharedValue(0);

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = dragX.value;
      ctx.directionPositive = undefined
      runOnJS(setBeingDragged)(true)
    },
    onActive: ({translationX}, ctx) => {
      if (ctx.directionPositive === undefined) ctx.directionPositive = translationX - ctx.startX > 0

      const offsetAmount = 30

      const translationXInput = ctx.directionPositive ? Math.max(0, translationX) : Math.min(0, translationX)

      let calcMove;
      if (translationXInput !== 0) {
        const absNum = Math.abs(translationXInput / 2)
        const dragSlowed = Math.min(absNum, offsetAmount) + Math.pow(Math.max(0, absNum - offsetAmount), 0.6)
        calcMove = translationXInput < 0 ? -dragSlowed : dragSlowed
      }

      if (calcMove > offsetAmount) runOnJS(setDragMode)(1);
      else if (calcMove < -offsetAmount) runOnJS(setDragMode)(2);
      else runOnJS(setDragMode)(0);


      dragX.value = ctx.startX + (calcMove ?? 0);
    },
    onEnd: (_) => {
      dragX.value = withSpring(0, {
        overshootClamping: true,
        mass: 2,
        damping: 25,
        stiffness: 260
      });
      console.log("end")

      runOnJS(swipeActivate)();
      runOnJS(setDragMode)(0)
      runOnJS(setBeingDragged)(false)
    },
  })

  function swipeActivate() {
    console.log("opin seame", props.patternData.id, dragMode)
    if (dragMode !== 0) haptic(1);
    if (dragMode === 2) confirmDeletePattern();
    else if (dragMode === 1) props.editPattern(props.patternData.id);
  }

  const panStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: dragX.value,
        },
      ],
    };
  });

  const generateSequence = (sequence) => {
    const textList = ["Inhale", "Hold", "Exhale", "Hold"];

    return sequence.map((el, i) => (
      <View key={i} style={styles.sequenceContainer}>
        <Text style={styles.sequenceTitle}>{textList[i]}</Text>
        <Text style={styles.sequence}>{el}<Text style={styles.seconds}> sec</Text></Text>
      </View>
    ))
  }

  const truncateTitle = (title) => {
    return title.length > 20 ? title.substring(0, 20) + "..." : title
  }

  const confirmDeletePattern = () => {
    return Alert.alert(
      "Delete this pattern?",
      `Are you sure you want to delete "${props.patternData.name}"?`,
      [
        {text: "Nevermind",},
        {
          text: "Confirm", onPress: () => {
            crashlytics().log("Pattern deleted: " + JSON.stringify(props.patternData));
            props.deletePattern(props.patternData.id)
          }
        },
      ]
    );
  }

  const renderPauseText = () => {
    if (props.patternData.settings.breakBetweenCycles && !props.buttonVisible) {
      return (
        <View style={[styles.pauseContainer]}>
          <IconMaterial name={"clock"} size={17} color={colors.placeholder}></IconMaterial>
          <Text style={styles.pauseText}>
            Pause {props.patternData.settings.pauseDuration}s {props.patternData.settings.pauseFrequency > 1 ? `/ ${props.patternData.settings.pauseFrequency}` : ""}
          </Text>
        </View>
      )
    }
  }

  const handleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      if (props.editMode) props.editPattern(props.patternData.id);
      else props.usePattern(props.patternData.id)
    }
  }

  return (
    <View style={[styles.itemOuter, {zIndex: beingDragged ? 200 : 0}]}>
      <Backplate height={itemHeight} dragX={dragX} dragMode={dragMode} setDragMode={setDragMode}/>
      <TapGestureHandler maxDist={0} onHandlerStateChange={handleTap} ref={tapRef}>
        <Animated.View>

          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View style={[styles.patternItem, panStyle]}
                           onLayout={(event) => setItemHeight(event.nativeEvent.layout.height)}>
              {/*<View style={styles.swipeContainer}>*/}
              {/*  <IconMaterial size={20} color={colors.text} name="arrow-left-right"/>*/}
              {/*</View>*/}
              <Text style={styles.title} numberOfLines={1}
                    adjustsFontSizeToFit>{truncateTitle(props.patternData.name)}</Text>
              <View
                style={[styles.patternData, {paddingBottom: (props.patternData.settings.breakBetweenCycles || props.editMode) ? 0 : 0}]}>
                <View style={styles.arrowContainer}>
                  <IconEntypo style={styles.arrow} name="chevron-thin-left" size={25} color={colors.text2}/>
                  <View style={styles.sequenceList}>
                    {generateSequence(props.patternData.sequence)}
                  </View>
                  <IconEntypo style={styles.arrow} name="chevron-thin-right" size={25} color={colors.text2}/>
                </View>
                <View style={[styles.actionButtons, {marginVertical: hasPause() ? 0 : 10}]}>
                  <Button
                    mode="contained"
                    style={styles.button}
                    contentStyle={{height: "100%", alignItems: "center"}}
                    labelStyle={styles.buttonText}
                    color={colors.accent}
                  >Use</Button>
                </View>
                {renderPauseText()}
              </View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

PatternItem.propTypes = {
  editPattern: PropTypes.func,
  usePattern: PropTypes.func,
  patternData: PropTypes.object,
  editMargin: PropTypes.any,
  editMode: PropTypes.bool,
  buttonVisible: PropTypes.bool
}

const styles = StyleSheet.create({
  arrow: {
    width: "14%",
    height: "auto"
  },
  arrowContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  swipeContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    marginTop: 3,
  },
  pauseContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    padding: 0,
    alignItems: "center",
    height: 16,
    opacity: 1,
    marginVertical: 3
  },
  pauseText: {
    color: colors.placeholder2,
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Avenir Next",
    marginLeft: 4,
  },
  seconds: {
    fontSize: 13,
    color: colors.accent,
    fontFamily: "Avenir Next",
    right: 0
  },
  sequence: {
    fontSize: 19,
    color: colors.accent,
    fontFamily: "Helvetica",
    fontWeight: "400",
    right: 1,
    textAlign: "right"
  },
  sequenceTitle: {
    fontSize: 16,
    fontFamily: "Avenir Next",
    color: colors.primary,
    left: 0,
  },
  sequenceContainer: {
    flexDirection: "row",
    paddingVertical: 3,
    borderRadius: 6,
    marginVertical: 0,
    // flex: 1,
    width: "100%",
    justifyContent: "space-between"
  },
  sequenceList: {
    flexDirection: "column",
    // justifyContent: "space-between",
    // alignItems: "center",
    position: "relative",
    width: "72%",
    flex: 1,
    paddingLeft: 6,
    paddingRight: 0
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
    paddingHorizontal: 15,
    color: colors.primary,
    height: 23,
    textAlign: "left",
    width: "100%",
    fontFamily: "Avenir Next"
  },
  buttonText: {
    marginHorizontal: 15,
    color: "white",
    marginVertical: 0,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  button: {
    borderRadius: 10,
    margin: 0,
    minWidth: "80%",
    marginHorizontal: 25,
    shadowColor: "transparent",
    borderColor: colors.accent,
  },
  actionButtons: {
    bottom: 0,
    flexDirection: "row",
    alignSelf: "center",
    flex: 1,
    paddingHorizontal: 25,
    marginHorizontal: 15,
    alignItems: "stretch",
    height: 30,
    opacity: 1,
  },
  patternItem: {
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingTop: 10,
    paddingHorizontal: 2,
    paddingBottom: 5,
    width: (Dimensions.get('window').width - 84) / 2,
    position: "relative",
    height: "auto",
  },
  itemOuter: {
    marginVertical: 15,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: (Dimensions.get('window').width - 84) / 2,
    position: "relative",
    height: "auto",

  },
  patternData: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    position: "relative",
    height: "auto"
  }
})

export default PatternItem;
