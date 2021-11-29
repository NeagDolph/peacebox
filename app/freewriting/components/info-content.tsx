import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import {colors} from "../../config/colors";
import PropTypes from 'prop-types'
import Animated, {interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";

import {mixColor} from 'react-native-redash'
import Extrapolate = module;
import {Button} from "react-native-paper";
import Fade from '../../components/fade-wrapper';

const textContent = [
  {
    title: "Welcome to freewriting",
    content: "Freewriting is an incredibly useful technique for stress management and has been shown to [help reduce anxiety, lessen feelings of distress, and increase well-being.](https://mental.jmir.org/2018/4/e11290/) \n\nHere are some tips to help you get started."
  },
  {
    title: "Let go of what you write",
    content: "Not just figuratively, but literally. \n\nWhat we write gives a window into our very personal thoughts. Deleting everything you write gives your subconscious a sense of freedom to write what you truly feel."
  },
  {
    title: "Avoid lingering on thoughts",
    content: "Often we end up lingering on things we write; stuck in thought about why what we wrote might be true, important, or stressful. These thoughts only contribute to more ruminating and anxiety. \n\nIf you find yourself stopping to think, try typing those thoughts down too."
  },
  {
    title: "How to begin",
    content: "If you're having trouble beginning, here are some techniques you could try.\n" +
      "- Start with a leading sentence such as \"I feel like...\", \"I want...\" or \"I'm unhappy with...\" and try to answer it.\n" +
      "- Keep typing random words, it doesn't have to make any sense. Just don't stop to think of words, it's fine to repeat the same word.",
    size: 16

  }
]

const InfoContent = (props) => {
  const scrollRef = useRef(null);

  const currentPage = useSharedValue(0);

  const [pageInt, setPageInt] = useState(0);

  const [modalWidth, setModalWidth] = useState(0)

  const [currentTip, setCurrentTip] = useState("")

  const {closeEnabled, setCloseEnabled} = props

  const isLastPage = useCallback(() => {
    return pageInt === textContent.length - 1
  }, [pageInt])

  useEffect(() => {
    setModalWidth(Dimensions.get("window").width - 100);
  }, [])

  useEffect(() => {
    if (props.modalVisible) {
      scrollRef.current.scrollTo({x: 0, animated: false})
      setPageInt(0)

      setCurrentTip(randomTip());
    }
  }, [props.modalVisible])

  const randomTip = () => {
    const tips = [
      "Double tap the page to clear it",
      "Tap the ⓘ to reopen this info"
    ]

    const num = Math.floor(Math.random() * tips.length)

    return tips[num ?? 0]
  }

  const addLink = (text) => {
    if (!text.matchAll) return <Text style={styles.desc}>{text}</Text>
    const results = Array.from(text.matchAll(/\[(.+)\]\((.+)\)/g))

    if (results.length < 1) return <Text style={styles.desc}>{text}</Text>


    return results.reduce((curr, match, i) => {
      const before = <Text style={styles.desc}>{text.substring(0, match.index)}</Text>
      const after = <Text style={styles.desc}>{text.substring(match.index + match[0].length, match.input.length)}</Text>
      return (<Text style={styles.desc}>{before}
        <Text style={[styles.link]} onPress={() => Linking.openURL(match[2])}>{match[1]}</Text>{after}
      </Text>)
    }, <Text style={styles.desc}></Text>)
  }

  const addBullets = (item) => {
    const {content: text, size} = item;
    const splitText = text.split("\n")

    return splitText.map((el, i) => {
      if (el.startsWith("-")) return <View style={styles.bulletItem} key={i}>
        <Icon name="dot-single" size={40} color={colors.primary}/><Text
        style={[styles.desc, {fontSize: size}]}>{el.replace("- ", "")}</Text>
      </View>;
      else return <Text style={styles.desc} key={i}>{el}</Text>
    })
  }

  const processText = (item) => {
    return item.content.includes("\n- ") ? addBullets(item) : addLink(item.content)
  }


  const scrollHandler = (event, offsetX?) => {
    const offset = (event?.nativeEvent.contentOffset.x || offsetX) ?? 0;

    // const pages = startLoc + ((offset / modalWidth) * 15)

    const currentPageCalc = offset / modalWidth

    currentPage.value = currentPageCalc; //animation

    if (currentPageCalc >= textContent.length - 1.5 && !closeEnabled) setCloseEnabled(true);
    else if (closeEnabled) setCloseEnabled(false);


    const calcPageInt = Math.round(offset / modalWidth)
    if (calcPageInt !== pageInt) setPageInt(calcPageInt);
  }

  const renderPages = () => {
    return textContent.map((item, i) => (
      <View style={[styles.contentPage, {width: modalWidth}]} key={i}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        {processText(item)}
      </View>
    ))
  }

  const indicatorStyles = (num) => useAnimatedStyle(() => {
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

    const pageDist = Math.abs(currentPage.value - num);
    const calcWidth = clamp(interpolate(pageDist, [0, 1], [35, 15]), 15, 35)


    return {
      width: calcWidth,
      backgroundColor: mixColor(pageDist, "#111111", "#c4c4c4")
    }
  })

  const renderIndicators = () => {
    const returnArray = []
    for (let i = 0; i < textContent.length; i++) {
      returnArray.push(
        <Animated.View key={i} style={[styles.indicatorLine, indicatorStyles(i)]}></Animated.View>
      )
    }

    return returnArray
  }

  const nextPage = () => {
    scrollRef.current.scrollTo({x: modalWidth * (pageInt + 1), animated: true})
  }

  const lastPage = () => {
    scrollRef.current.scrollTo({x: modalWidth * (pageInt - 1), animated: true})
  }


  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Introduction</Text>
          <TouchableOpacity onPress={props.handleClose}>
            <View style={styles.exit}><Icon style={styles.exitIcon} size={28} name="cross"></Icon></View>
          </TouchableOpacity>
        </View>
        <Text style={styles.tip}><Text style={styles.tipNote}>TIP&nbsp;&nbsp;</Text>{currentTip}</Text>
        <View style={styles.contentContainer}>
          <ScrollView
            pinchGestureEnabled={false}
            // onLayout={event => setModalWidth(event.nativeEvent.layout.width)}
            bounces={false}
            horizontal={true}
            snapToInterval={modalWidth}
            pagingEnabled={true}
            disableScrollViewPanResponder={true}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            decelerationRate="fast"
            scrollEventThrottle={33}
            onScroll={scrollHandler}
            ref={scrollRef}
          >
            {renderPages()}
          </ScrollView>
          <View style={styles.controlsContainer}>
            <Pressable onPress={lastPage} hitSlop={15}>
              <View style={styles.backContainer}>
                <Icon name="chevron-left" size={37} color={pageInt === 0 ? colors.text2 : colors.primary}/>
              </View>
            </Pressable>
            <View style={styles.indicatorContainer}>
              {renderIndicators()}
            </View>
            <Pressable onPress={nextPage} hitSlop={15}>
              <View style={styles.backContainer}>
                <Icon name="chevron-right" size={37} color={isLastPage() ? colors.text2 : colors.primary}/>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.exitContainer}>
          <Fade visible={isLastPage()} duration={400}>
            <Button color={colors.primary} onPress={props.handleClose} mode="outlined">Exit</Button>
          </Fade>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tipNote: {
    fontFamily: "Helvetica",
    fontWeight: "800",
    color: colors.primary,
    fontSize: 18,
    paddingRight: 20,
  },
  tip: {
    fontSize: 16,
    color: colors.text,
    letterSpacing: 0.8,
    fontFamily: "Avenir",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%"

  },
  exitContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  backContainer: {
    height: 52,
  },
  indicatorLine: {
    height: 5,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginHorizontal: 2,
  },
  indicatorContainer: {
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5

  },
  controlsContainer: {
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    // paddingTop: 25

  },
  contentTitle: {
    color: "#222",
    fontFamily: "Avenir",
    fontSize: 23,
    fontWeight: "600",
    paddingBottom: 20,
  },
  desc: {
    color: colors.primary,
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "400"
  },
  link: {color: colors.accent},
  contentPage: {
    height: "100%",
    paddingTop: 5
  },
  contentContainer: {
    backgroundColor: colors.background2,
    borderRadius: 15,
    width: "100%",
    height: 450,
    padding: 20,
    marginBottom: 15,
    marginTop: 8
  },
  exitIcon: {
    color: colors.primary,
  },
  exit: {
    borderRadius: 200,
    backgroundColor: colors.background2,
    // padding: 4,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 10
  },
  title: {
    fontSize: 27,
    fontFamily: "Avenir",
    fontWeight: "bold",
    color: "black"
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",

    marginBottom: 15
    // paddingHorizontal: 10,
  },
  container: {
    width: "100%",
    height: 630,
    // top: Dimensions.get("window").height - 630,
    paddingVertical: 20,
    paddingHorizontal: 30,
    // flex: 1,
    backgroundColor: "white",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 0,
      height: -1
    },
    borderRadius: 20,
    shadowRadius: 6,
    elevation: 3,
    shadowOpacity: 0.12,
  },
  bulletItem: {
    marginTop: 12,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    left: -10,
    width: "90%"
  }
})


InfoContent.propTypes = {
  handleClose: PropTypes.func,
  closeEnabled: PropTypes.bool,
  setCloseEnabled: PropTypes.func,
  modalVisible: PropTypes.bool
}


export default InfoContent;
