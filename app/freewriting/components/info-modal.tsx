import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Button, Modal, Portal, Text} from 'react-native-paper';
import {Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {colors} from "../../config/colors";
import Fade from "../../components/fade-wrapper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from "@react-native-firebase/crashlytics";



const InfoModal = (props) => {
  const {modalVisible, setModalVisible} = props;
  const [modalPage, setModalPage] = useState(0);
  const [modalWidth, setModalWidth] = useState(0);
  const [doneButton, setDoneButton] = useState(false)

  const hideModal = () => setModalVisible(false);
  const indicatorRef = useRef(null)
  const scrollRef = useRef(null)

  //Correct layout for page indicator on first load
  useEffect(() => {
    crashlytics().log("Component loaded: Info modal")
    if (indicatorRef.current) scrollHandler(undefined, 0)
  }, [modalWidth])

  const renderPages = () => {
    return props.content.map((item, i) => (
      <View style={[styles.modalPage, {width: modalWidth}]} key={item.title}>
        <Text style={styles.pageTitle}>{item.title}</Text>
        <Text style={styles.pageContent}>{item.content}</Text>
      </View>
    ))
  }

  const renderIndicators = () => {
    return Array(props.content.length).fill(undefined).map((item, index) => (
      <View key={index} style={styles.indicator}></View>
    ))
  }

  const nextPage = () => {
    scrollRef.current.scrollTo({x: modalWidth * (modalPage + 1), animated: true})
  }

  const scrollHandler = (event, offsetX) => {
    const offset = (event?.nativeEvent.contentOffset.x || offsetX) ?? 0;

    const startLoc = (modalWidth / 2) - ((props.content.length * 15) / 2)

    const pages = startLoc + ((offset / modalWidth) * 15)

    if (pages) indicatorRef.current.setNativeProps({
      left: pages
    })

    //Done Button
    if (offset / modalWidth >= props.content.length - 1) setDoneButton(true);
    else setDoneButton(false);

    //Calc current page
    setModalPage(Math.round(offset / modalWidth));
  }

  return (
    <Portal style={{height: Dimensions.get('window').height}}>
      <Modal
        visible={modalVisible}
        onDismiss={hideModal}
        dismissable={doneButton}
        contentContainerStyle={styles.container}>
        <View style={styles.closeIcon}>
          <TouchableWithoutFeedback onPress={hideModal}>
            <Icon name="close-circle-outline" size={26} color={colors.primary}/>
          </TouchableWithoutFeedback>
        </View>
        <ScrollView
          pinchGestureEnabled={false}
          onLayout={event => setModalWidth(event.nativeEvent.layout.width)}
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
        <View style={styles.pageIndicators}>
          <View style={styles.buttonContainer}>
            <Button uppercase={false} mode="contained" color={colors.primary} onPress={doneButton ? hideModal : nextPage}>{doneButton ? "Done" : "Next"}</Button>
          </View>
          {renderIndicators()}
          <View ref={indicatorRef} style={styles.movingIndicator}>
            <View ref={indicatorRef} style={[styles.indicator, {backgroundColor: colors.primary}]}/>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 2,
    right: 2,
    zIndex: 1,
    borderRadius: 100
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
    position: "absolute",
    width: "100%"
  },
  pageIndicators: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    bottom: 10
  },
  indicator: {
    width: 7,
    height: 7,
    borderRadius: 25,
    backgroundColor: colors.text,
    marginHorizontal: 4
  },
  movingIndicator: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "Helvetica",
    color: colors.primary,
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: "500"
  },
  pageContent: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 50,
    minHeight: 100,
    fontFamily: "Helvetica"
  },
  container: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    top: -50,
  },
  modalPage: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    height: "100%",
    padding: 20


  }
})

export default InfoModal;
