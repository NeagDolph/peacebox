import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {colors} from "../config/colors";
import IconEntypo from "react-native-vector-icons/Entypo"
import {store} from '../store/store';
import {closedTutorial, openedTutorial, guideNext, pushRestart, exitTutorial} from "../store/features/tutorialSlice"
import {useDispatch, useSelector} from "react-redux";
import {dispatchWalkthroughEvent, goToWalkthroughElementWithId, startWalkthrough} from "react-native-walkthrough";
import {setEditScroll} from '../store/features/breathingSlice';
import haptic from "../helpers/haptic";

const styles = StyleSheet.create({
  tooltipView: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    // backgroundColor: colors.background2,
    // color: colors.primary,
    // borderRadius: 16,
  },
  tooltipText: {
    color: 'black',
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 45
  },
  button: {
    backgroundColor: colors.primary,
    // width: 50,
    height: 35,
    paddingVertical: 8,
    paddingTop: 4,
    paddingHorizontal: 12,
    borderRadius: 8,


  },
  buttonText: {
    color: colors.background,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Avenir",
    textAlign: "center"
  }
});

const closeNext = {
  breathing: [
    {
      id: 0,
      skip: false,
      confirm: true
    },
    {
      id: 1,
      skip: true,
      onRun: () => {
        store.dispatch(setEditScroll(300));
      }
    },
    {
      id: 2,
      confirm: true,
      skip: false,
    },
  ]
}

const runTut = (nextFound) => {
  if (nextFound.length >= 1) {
    if (nextFound[0].onRun) {
      console.log("run")
      nextFound[0].onRun();
    }
  }
}

const completeTutorial = () => {
  const state = store.getState();

  store.dispatch(exitTutorial(state.tutorial.currentTutorial));
}


const closeTutorial = () => {
  const state = store.getState();

  const nextFound = closeNext[state.tutorial.currentTutorial].filter(tut => tut.id === state.tutorial[state.tutorial.currentTutorial].completion)

  runTut(nextFound)
  if (nextFound.length >= 1) {

    if (nextFound[0].confirm && !nextFound[0].skip) {
      return Alert.alert(
        "Exit tutorial?",
        `Are you sure you want to exit the tutorial for ${state.tutorial.currentTutorial}? You can always restart it from the settings menu.`,
        [
          {
            text: "Cancel", onPress: () => {
              store.dispatch(pushRestart({section: "breathing", value: true}))
            }
          },
          {
            text: "Exit", onPress: () => {
              store.dispatch(exitTutorial(state.tutorial.currentTutorial))
            }
          },
        ]
      );
    }

    if (nextFound[0].skip) setTimeout(() => {
      // store.dispatch(guideNext(state.tutorial.currentTutorial))
    }, 1);
  }
}

const handleClose = () => {
  const state = store.getState();

  store.dispatch(closedTutorial("breathing"))
  const nextFound = closeNext[state.tutorial.currentTutorial].filter(tut => tut.id === state.tutorial[state.tutorial.currentTutorial].completion)
  runTut(nextFound)
  setTimeout(() => {
    store.dispatch(guideNext("breathing"))
    store.dispatch(openedTutorial("breathing"))
  }, 200)
}

const makeTooltipContent = (text) => <MakeTooltipRender text={text}/>


const MakeTooltipRender = props => {
  return (
    <>
      <View style={styles.tooltipView}>
        <Text style={styles.tooltipText}>{props.text}</Text>
      </View>
    </>
  )
}

const guide = [
  {
    content: makeTooltipContent("Tap here to create a new pattern"),
    tooltipProps: {
      // accessible: true,
      allowChildInteraction: true,
      closeOnChildInteraction: false,
      backgroundColor: "rgba(0,0,0,0.7)",
      disableShadow: true,
      // allowChildInteraction: true,
      // useInteractionManager: true,
      // closeOnChildInteraction: true,
      placement: "bottom",
      closeOnContentInteraction: true,
      onClose: () => closeTutorial(),
    }
  },
  {
    content: makeTooltipContent("You can create custom patterns here."),
    tooltipProps: {
      accessible: true,
      placement: "bottom",
      closeOnChildInteraction: true,
      closeOnContentInteraction: true,
      // onClose: closeTutorial,
      topAdjustment: 58,
      onClose: handleClose
    }
  },
  {
    content: makeTooltipContent("Or select a premade pattern"),
    tooltipProps: {
      placement: "bottom",
      // displayInsets: {
      //   bottom: 400
      // },
      // topAdjustment: 400

      closeOnChildInteraction: true,

      allowChildInteraction: false,
      closeOnContentInteraction: true,
      onClose: handleClose,
    }
  },
  {
    content: makeTooltipContent("Tap here to use the box pattern"),
    tooltipProps: {

      accessible: true,
      allowChildInteraction: true,
      placement: "bottom",
      closeOnChildInteraction: false,
      closeOnContentInteraction: true,
      onClose: () => closeTutorial(),
    }
  },
  // {
  //   content: makeTooltipContent("Tap to save your box pattern"),
  //   tooltipProps: {
  //
  //     accessible: true,
  //     allowChildInteraction: true,
  //     placement: "top",
  //     arrowSize: 0,
  //     closeOnChildInteraction: false,
  //     closeOnContentInteraction: true,
  //     onClose: () => closeTutorial(),
  //   }
  // }
];

export default guide
