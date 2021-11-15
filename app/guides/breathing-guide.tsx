import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Alert, Pressable} from 'react-native';
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
    justifyContent: "center"
  },
  tooltipText: {
    color: 'black',
    fontSize: 18,
    textAlign: "center"
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
  },

  exitButton: {
    position: "absolute",
    height: 30,
    bottom: -36,
    right: 6,
  },
  exit: {
    fontSize: 17,
    color: colors.background,
    fontFamily: "Avenir",
    fontWeight: "700",
    textAlign: "right"

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

const runTutorial = (nextFound) => {
  if (nextFound.length >= 1) {
    if (nextFound[0].onRun) nextFound[0].onRun();
  }
}

const completeTutorial = () => {
  const state = store.getState();

  store.dispatch(exitTutorial(state.tutorial.currentTutorial));
}


const closeTutorial = () => {
  const state = store.getState();

  // const nextFound = closeNext[state.tutorial.currentTutorial].filter(tut => tut.id === state.tutorial[state.tutorial.currentTutorial].completion)
  //
  // runTut(nextFound)
      return Alert.alert(
        "Exit tutorial?",
        `Are you sure you want to exit this tutorial? You can always re-open the tutorial from the settings menu.`,
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

const handleClose = (timeout) => {
  const state = store.getState();

  store.dispatch(closedTutorial("breathing"))
  const nextFound = closeNext[state.tutorial.currentTutorial].filter(tut => tut.id === state.tutorial[state.tutorial.currentTutorial].completion)
  runTutorial(nextFound)
  setTimeout(() => {
    store.dispatch(guideNext("breathing"))
  }, timeout ?? 600)
}

const makeTooltipContent = (text, bottom) => <MakeTooltipRender text={text} bottom={bottom}/>


const MakeTooltipRender = props => {
  return (
    <>
      <View style={styles.tooltipView}>
        <Text style={styles.tooltipText}>{props.text}</Text>
      </View>
      <View style={[styles.exitButton, {[props.bottom ? "bottom" : "top"]: props.bottom ? -36 : -28}]}>
        <Pressable onPress={closeTutorial} hitSlop={20}>
          <Text style={styles.exit}>Exit Tutorial</Text>
        </Pressable>
      </View>
    </>
  )
}

const guide = [
  {
    content: makeTooltipContent("Tap here to create a new pattern.", true),
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
      // onClose: () => closeTutorial(),
      contentStyle: {
        overflow: "visible"
      },
    }
  },
  {
    content: makeTooltipContent("You can customize your own pattern using these settings", true),
    tooltipProps: {
      placement: "bottom",
      closeOnChildInteraction: true,
      closeOnContentInteraction: true,
      displayInsets: {
        left: 20,
        right: 20
      },
      // onClose: closeTutorial,
      topAdjustment: 56,
      onClose: () => handleClose(600),
      contentStyle: {
        overflow: "visible"
      },
    }
  },
  {
    content: makeTooltipContent("For this tutorial we'll choose one of the curated patterns.", false),
    tooltipProps: {
      placement: "top",

      closeOnChildInteraction: true,

      allowChildInteraction: false,
      closeOnContentInteraction: true,
      displayInsets: {
        left: 20,
        right: 20
      },
      onClose: () => handleClose(400),
      contentStyle: {
        overflow: "visible"
      },
    }
  },
  {
    content: makeTooltipContent("You can read more or press \"Use Pattern\" to select this pattern.", true),
    tooltipProps: {
      // accessible: true,
      allowChildInteraction: true,
      placement: "bottom",
      closeOnChildInteraction: false,
      // topAdjustment: 0,
      displayInsets: {
        left: 0,
        right: 20
      },
      closeOnContentInteraction: false,
      childContentSpacing: 25,
      // onClose: () => closeTutorial(),
      contentStyle: {
        overflow: "visible"
      },
    }
  },
  {
    content: makeTooltipContent("Tap \"Done\" to save your new pattern", false),
    tooltipProps: {

      accessible: true,
      allowChildInteraction: true,
      placement: "top",
      displayInsets: {
        left: 20,
        right: 20
      },
      // arrowSize: 0,
      closeOnChildInteraction: false,
      closeOnContentInteraction: false,
      // onClose: () => closeTutorial(),
      contentStyle: {
        overflow: "visible"
      },
    }
  },
  {
    content: makeTooltipContent("Tap your new pattern to use it.", false),
    tooltipProps: {
      accessible: true,
      allowChildInteraction: true,
      placement: "top",
      displayInsets: {
        left: 20,
        right: 20
      },
      // arrowSize: 0,
      closeOnChildInteraction: false,
      closeOnContentInteraction: true,
      // onClose: () => closeTutorial(),
      contentStyle: {
        overflow: "visible"
      },
    }
  },
  {
    content: makeTooltipContent("You can set the duration and other settings from here. Press \"Start\" to begin the pattern."),
    tooltipProps: {
      accessible: false,
      allowChildInteraction: true,
      placement: "bottom",
      displayInsets: {
        left: 20,
        right: 20
      },
      // arrowSize: 0,
      closeOnChildInteraction: false,
      closeOnContentInteraction: false,
      useInteractionManager: true,
      // onClose: () => closeTutorial(),
      contentStyle: {
        overflow: "visible"
      },
    }
  }
];

export default guide
