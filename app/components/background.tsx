import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {setTime, setUrl, setCredits, setColor, setBackgroundData} from "../store/features/backgroundSlice"
import {useDispatch, useSelector} from "react-redux";
import {ImageBackground, StyleSheet, View, Text, Dimensions, Pressable} from "react-native";
import FastImage from 'react-native-fast-image'
import PropTypes from 'prop-types'
import {colors} from "../config/colors";


const Background = (props) => {
  const lastSetTime = useSelector((state: any) => state.background.lastSetTime)
  const bgUrl = useSelector((state: any) => state.background.url)

  const {showBackground, visible} = props
  const bgOld = useRef(showBackground)

  const dispatch = useDispatch();

  const loadSetBackground = () => {
    const collections = [3488059, 9400790, 3533949, 93804623]
    const topics = ["nature"]
    const args = {
      // collections: collections.join(","),
      topics: topics.join(","),
      content_filter: "high",
      orientation: "portrait",
      client_id: "3T3B_SA-ohORfg2VNrn0i09_31jonbG_DbSPaaGpcQY",
      count: 15,
    }

    const url = `https://api.unsplash.com/photos/random?topics=nature&content_filter=high&query=nature&orientation=portrait&client_id=3T3B_SA-ohORfg2VNrn0i09_31jonbG_DbSPaaGpcQY&count=5`
    // const url = `https://api.unsplash.com/photos/random?${new URLSearchParams(args).toString()}`;

    fetch(url)
      .then(async response => {
        const responseObj = await response.json();

        //Filter images for images based on device appearance
        const filterImages = responseObj.filter(el => {
          el.color
        })

        const chosenImage = filterImages.reduce((o, imgData) => imgData.downloads > o.downloads ? imgData : o, {downloads: 0})

        dispatch(setTime(Date.now()));
        dispatch(setBackgroundData(chosenImage));
      })
  }

  useEffect(() => {
    if (!bgOld.current && showBackground) {
      loadSetBackground();
    } else if (showBackground && (Date.now() - lastSetTime >= 3600000 || !lastSetTime)) {
      loadSetBackground();
    }

    bgOld.current = showBackground

  }, [showBackground]);


  const renderImage = () => {
    const image = <FastImage
      source={{uri: bgUrl, priority: FastImage.priority.high}}
      force-cache="force-cache"
      style={styles.backgroundImage}
      resizeMode={FastImage.resizeMode.cover}
      onLoad={props.onLoad}
    />

    return (showBackground && bgUrl && visible) ? <Pressable onPress={props.onPress} children={image}/> : <View style={styles.backgroundImage}></View>
  }

  return (
    <View>
      {renderImage()}
      {props.children}
    </View>
  )
}

Background.propTypes = {
  showBackground: PropTypes.bool.isRequired,
  onLoad: PropTypes.func,
  onPress: PropTypes.func,
  visible: PropTypes.bool
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 0,
    left: 0,
    // height: "100%",
  }
})

export default Background
