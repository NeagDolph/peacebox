import React, { useCallback, useRef, useState } from "react";
import { Alert, Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { colors } from "../../config/colors";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import PropTypes from "prop-types";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload
} from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import Backplate from "./backplate";
import haptic from "../../helpers/haptic";
import useTooltip from "../../components/tooltip-hook";
import { useDispatch, useSelector } from "react-redux";
import { closedTutorial, guideNext } from "../../store/features/tutorialSlice";
import { RootState } from "../../store/store";

const PatternItem = props => {
  const [itemHeight, setItemHeight] = useState(0);
  const [dragMode, setDragMode] = useState(0);
  const [beingDragged, setBeingDragged] = useState(false);
  const lastDrag = useRef(null);

  const breathingIndex = useSelector((state: RootState) => state.tutorial.breathing.completion);
  const createdPattern = useSelector((state: RootState) => state.tutorial.breathing.createdPattern);
  const open = useSelector((state: RootState) => state.tutorial.breathing.open);

  const dispatch = useDispatch();

  const tapRef = useRef(null);

  const tooltip = useTooltip();

  const hasPause = useCallback(() => props.patternData.settings.breakBetweenCycles && !props.buttonVisible, [props.buttonVisible, props.patternData.settings.breakBetweenCycles]);


  const dragX = useSharedValue(0);

  function swipeActivate() {
    lastDrag.current = dragMode;
    setDragMode(0);
    // haptic(1)

    if (dragMode !== 0) haptic(1);
    if (dragMode === 2) confirmDeletePattern();
    else if (dragMode === 1) props.editPattern(props.patternData.id, false);
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
        {text: "Nevermind"},
        {
          text: "Confirm", onPress: () => {
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
          <IconMaterial name={"clock"} size={17} color={colors.text}></IconMaterial>
          <Text style={styles.pauseText}>
            Pause {props.patternData.settings.pauseDuration}s {props.patternData.settings.pauseFrequency > 1 ? `/ ${props.patternData.settings.pauseFrequency}` : ""}
          </Text>
        </View>
      )
    }
  }

  const handleTap = () => {
    props.usePattern(props.id);
    if (breathingIndex === 5 && open && props.id === createdPattern) {
      dispatch(closedTutorial("breathing"));

      setTimeout(() => dispatch(guideNext("breathing")), 600);
    }
  };


  const context = useSharedValue({ startX: 0, directionPositive: undefined, dragMode: 0 });

  const tapGesture = Gesture.Tap();
  const panGesture = Gesture.Pan();

  const panStart = (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    context.value = {
      startX: dragX.value,
      directionPositive: undefined,
      dragMode: 0
    };
    runOnJS(setBeingDragged)(true);
  };

  const panActive = (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    let translationX = e.translationX;

    const offsetAmount = 30; // Required movement of actual pattern card for activation

    let calcMove;

    if (translationX !== 0) {
      const deadZone = 30; //Acts like min dist but works on both directions.
      if (translationX > 0) translationX = Math.max(translationX - deadZone, 0);
      else if (translationX < 0) translationX = Math.min(translationX + deadZone, 0);

      const absNum = Math.abs(translationX / 2);
      const dragSlowed = Math.min(absNum, offsetAmount) + Math.pow(Math.max(0, absNum - offsetAmount), 0.6);
      calcMove = translationX < 0 ? -dragSlowed : dragSlowed;
    }

    if (calcMove > offsetAmount) {
      if (context.value.dragMode !== 1) runOnJS(haptic)(2);
      context.value.dragMode = 1;
      runOnJS(setDragMode)(1);
    } else if (calcMove < -offsetAmount) {
      if (context.value.dragMode !== 2) runOnJS(haptic)(2);
      context.value.dragMode = 2;
      runOnJS(setDragMode)(2);
    } else {
      // if (ctx.dragMode !== 0) runOnJS(haptic)(1)
      context.value.dragMode = 0;
      runOnJS(setDragMode)(0);
    }


    dragX.value = context.value.startX + (calcMove ?? 0);
  };

  const panEnd = (_) => {
    dragX.value = withSpring(0, {
      overshootClamping: true,
      mass: 2,
      damping: 25,
      stiffness: 260
    });
    runOnJS(swipeActivate)();
  };


  panGesture
    .requireExternalGestureToFail(tapRef)
    .simultaneousWithExternalGesture(props.scrollRef)
    .minDistance(0)
    .withRef(props.panRef)
    .onStart(panStart)
    .onUpdate(panActive)
    .onEnd(panEnd);


  const renderCard = () => {
    const card = (<Animated.View style={[styles.patternItem, panStyle]}
                                 onLayout={(event) => setItemHeight(event.nativeEvent.layout.height)}>
      <Text style={styles.title} numberOfLines={1}
            adjustsFontSizeToFit>{truncateTitle(props.patternData.name)}</Text>
      <View
        style={styles.patternData}>
        <View style={styles.arrowContainer}>
          <IconEntypo style={styles.arrowLeft} name="chevron-thin-left" size={25} color={colors.text2} />
          <View style={styles.sequenceList}>
            {generateSequence(props.patternData.sequence)}
          </View>
          <IconEntypo style={styles.arrowRight} name="chevron-thin-right" size={25} color={colors.text2}/>
        </View>
        <View style={[styles.actionButtons, {marginVertical: hasPause() ? 0 : 10}]}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleTap}
            contentStyle={{height: "100%", alignItems: "center"}}
            labelStyle={styles.buttonText}
            color={colors.accent}
          >Use</Button>
        </View>
        {renderPauseText()}
      </View>
    </Animated.View>)

    if (breathingIndex === 5 && createdPattern === props.id) {
      return tooltip(<Pressable onPress={handleTap}>{card}</Pressable>, 5)
    } else return card
  }


  return (
    <View style={[styles.itemOuter, { zIndex: beingDragged ? 200 : 0 }]}>
      <Backplate height={itemHeight} dragX={dragX} dragMode={dragMode} setDragMode={setDragMode} />
      <GestureDetector gesture={Gesture.Race(tapGesture, panGesture)}>
        <Animated.View>
          {renderCard()}
        </Animated.View>
      </GestureDetector>
      {/*<TapGestureHandler maxDist={0} ref={tapRef} onActivated={handleTap}>*/}
      {/*  <Animated.View>*/}

      {/*    <PanGestureHandler ref={props.panRef} minDist={0} onGestureEvent={panHandler} waitFor={tapRef} simultaneousHandlers={[props.scrollRef]}>*/}
      {/*      {renderCard()}*/}
      {/*    </PanGestureHandler>*/}
      {/*  </Animated.View>*/}
      {/*</TapGestureHandler>*/}
    </View>
  );
};

PatternItem.propTypes = {
  editPattern: PropTypes.func,
  usePattern: PropTypes.func,
  patternData: PropTypes.object,
  editMargin: PropTypes.any,
  editMode: PropTypes.bool,
  buttonVisible: PropTypes.bool,
  panRef: PropTypes.any,
  scrollRef: PropTypes.any,
  id: PropTypes.string
}

const styles = StyleSheet.create({
  arrowLeft: {
    width: "14%",
    height: "auto",
    left: -3,
    transform: [
      {scaleX: 0.8},
      {scaleY: 1.2},
      // {translateX: -5}
    ],
  },
  arrowRight: {
    width: "14%",
    height: "auto",
    transform: [
      {scaleX: 0.8},
      {scaleY: 1.2}
    ]

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
    color: colors.text,
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
    marginHorizontal: 0,
    color: colors.white,
    marginVertical: 0,
    lineHeight: 34,
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
    // flex: 1,
    paddingHorizontal: 25,
    marginHorizontal: 15,
    alignItems: "stretch",
    height: 34,
    opacity: 1,
  },
  patternItem: {
    borderRadius: 15,
    backgroundColor: colors.background2,
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
