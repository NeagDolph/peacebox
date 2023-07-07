import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../config/colors";
import { store } from "../store/store";
import { closedTutorial, exitTutorial, guideNext, pushRestart } from "../store/features/tutorialSlice";
import { setEditScroll } from "../store/features/breathingSlice";

const styles = StyleSheet.create({
  tooltipView: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: colors.background2,
    // color: colors.primary,
    // borderRadius: 16,
    justifyContent: "center"
  },
  tooltipText: {
    color: colors.primary,
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

  nextStep: {
    position: "absolute",
    height: 30,
    bottom: -36,
    left: 0,
  },
  exit: {
    fontSize: 17,
    color: colors.constantWhite,
    fontFamily: "Avenir",
    fontWeight: "700",
    textAlign: "right"
  },
  next: {
    fontSize: 16,
    color: colors.constantWhite
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

const makeTooltipContent = (text, bottom, tip) => <MakeTooltipRender text={text} bottom={bottom} tip={tip}/>


const MakeTooltipRender = props => {
  return (
    <>
      <View style={styles.tooltipView}>
        <Text style={styles.tooltipText}>{props.text}</Text>
      </View>
      <View style={[styles.exitButton, props.bottom ? {bottom: -36} : {top: -28}]}>
        <Pressable onPress={closeTutorial} hitSlop={20}>
          <Text style={styles.exit}>Exit Tutorial</Text>
        </Pressable>
      </View>

      <View style={[styles.nextStep, props.bottom ? {bottom: -36} : {top: -28}]}>
          <Text style={styles.next}>{props.tip}</Text>
      </View>
    </>
  )
}

const guide = [
  {
    content: makeTooltipContent("Use this button to create new breathing patterns", true, "Tap plus button to continue"),
    tooltipProps: {
      accessible: true,
      allowChildInteraction: true,
      closeOnChildInteraction: false,
      backgroundColor: "rgba(0,0,0,0.7)",
      disableShadow: true,
      // allowChildInteraction: true,
      // useInteractionManager: true,
      // closeOnChildInteraction: true,
      placement: "bottom",
      closeOnContentInteraction: true,
      contentStyle: {
        overflow: "visible",
        backgroundColor: colors.background2
      },
    }
  },
  {
    content: makeTooltipContent("You can customize your own pattern using these settings", true, "Tap anywhere to continue"),
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
        overflow: "visible",
        backgroundColor: colors.background2
      },
    }
  },
  {
    content: makeTooltipContent("Or you can select from one of the pre-made patterns", false, "Tap anywhere to continue"),
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
        overflow: "visible",
        backgroundColor: colors.background2
      },
    }
  },
  {
    content: makeTooltipContent("We'll select the Box Breathing pattern as an example", true, "Tap \"Use Pattern\" to continue"),
    tooltipProps: {
      // accessible: true,
      allowChildInteraction: true,
      placement: "bottom",
      closeOnChildInteraction: false,
      // topAdjustment: 0,
      displayInsets: {
        left: 20,
        right: 20
      },
      closeOnContentInteraction: false,
      childContentSpacing: 25,
      // onClose: () => closeTutorial(),
      contentStyle: {
        overflow: "visible",
        backgroundColor: colors.background2
      },
    }
  },
  {
    content: makeTooltipContent("Now you can save your newly created breathing pattern", false, "Tap \"Done\" to continue"),
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
        overflow: "visible",
        backgroundColor: colors.background2
      },
    }
  },
  {
    content: makeTooltipContent("You can access all your saved patterns from the home screen. Try using the one you just created.", false, "Tap pattern to continue"),
    tooltipProps: {
      accessible: true,
      allowChildInteraction: true,
      placement: "bottom",
      // topAdjustment: -56,
      childContentSpacing: 26,
      displayInsets: {
        left: 20,
        right: 20
      },
      // arrowSize: 0,
      closeOnChildInteraction: false,
      closeOnContentInteraction: true,
      // onClose: () => closeTutorial(),
      contentStyle: {
        overflow: "visible",
        backgroundColor: colors.background2
      },
    }
  },
  {
    content: makeTooltipContent("You can set the duration and other settings from here. Press \"Start\" to begin the pattern.", true, "Tap \"Start\" to continue"),
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
        overflow: "visible",
        backgroundColor: colors.background2
      },
    }
  },
  {
    content: makeTooltipContent("If you decide to finish your breathing early you can tap here to exit the breathing pattern", false, ""),
    tooltipProps: {
      accessible: false,
      allowChildInteraction: true,
      placement: "top",
      displayInsets: {
        left: 20,
        right: 20
      },
      // arrowSize: 0,
      closeOnChildInteraction: false,
      closeOnContentInteraction: true,
      useInteractionManager: true,
      // onClose: () => store.dispatch(exitTutorial("breathing")),
      contentStyle: {
        overflow: "visible",
        backgroundColor: colors.background2
      },
    }
  }
];

export default guide
