import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {setTime, setUrl, setCredits, setColor, setBackgroundData} from "../store/features/backgroundSlice"
import {useDispatch, useSelector} from "react-redux";
import {ImageBackground, StyleSheet, View, Text} from "react-native";
import FastImage from 'react-native-fast-image'

const Background = (props) => {
  const lastSetTime = useSelector((state: any) => state.background.lastSetTime)
  const bgUrl = useSelector((state: any) => state.background.url)
  const [backgroundStyle, setBackgroundStyle] = useState({})

  const showBackground = useSelector((state) => state.settings.freewriting.showBackground)

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

    const url = `https://api.unsplash.com/photos/random?${new URLSearchParams(args).toString()}`;

    fetch(url)
      .then(async response => {
        const responseObj = await response.json();

        const chosenImage = responseObj.reduce((o, imgData) => imgData.downloads > o.downloads ? imgData : o, {downloads: 0})

        dispatch(setTime(Date.now()));
        dispatch(setBackgroundData(chosenImage));
      })
  }

  useEffect(() => {
    if (!showBackground) {
      setBackgroundStyle({backgroundColor: "#f4f4f4"})
      return
    }

    if (Date.now() - lastSetTime >= 3600000 || !lastSetTime) {
      loadSetBackground();
    }
  }, [showBackground]);


  return (
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{uri: showBackground ? bgUrl : "", priority: FastImage.priority.high}}
          force-cache="force-cache"
          style={styles.backgroundImage}
        >
          {props.children}
        </FastImage>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: "100%",
  }
})

export default Background
