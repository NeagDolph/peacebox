import React, { useEffect, useRef } from "react";
import { setBackgroundData } from "../store/features/backgroundSlice";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Dimensions, Pressable, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import PropTypes from "prop-types";
import { colors } from "../config/colors";
import { Blurhash } from "react-native-blurhash";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { setSetting } from "../store/features/settingsSlice";


const Background = (props) => {
  // const lastSetTime = useSelector((state: any) => state.background.lastSetTime)
  // const bgUrl = useSelector((state: any) => state.background.url)
  const background = useSelector((state: any) => state.background);

  const { showBackground, opacity, loaded, setLoaded, children } = props;

  const bgOld = useRef(showBackground);

  const dispatch = useDispatch();

  const brightness = (hex) => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
      return (r + g + b) / 3
  }

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(opacity.value, [0, 1], [1, 0])
    }
  })

  const setBackground = (value) => {
    dispatch(setSetting({page: "freewriting", setting: "showBackground", value}));
  }

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

    const url = `https://api.unsplash.com/photos/random?topics=nature&query=wallpaper&content_filter=high&orientation=portrait&client_id=3T3B_SA-ohORfg2VNrn0i09_31jonbG_DbSPaaGpcQY&count=20`
    // const url = `https://api.unsplash.com/photos/random?${new URLSearchParams(args).toString()}`;

    fetch(url)
      .then(async response => {
        const responseObj = await response.json();

        if (!responseObj || !Array.isArray(responseObj)) {
          console.log("Error loading background image", responseObj?.errors)
          dispatch(setSetting({page: "freewriting", setting: "showBackground", value: false}))
          return
        }

        //Filter images for images based on device appearance


        const sortedImages = responseObj.sort((a, b) => a.downloads - b.downloads).slice(0, 10)

        const brightImage = sortedImages.slice(1).reduce((o, el) => {
          const showImage = colors.dark ? brightness(o.color) > brightness(el.color) : brightness(el.color) > brightness(o.color) //Brightness difference

          return showImage ? el : o
        }, sortedImages[0])

        dispatch(setBackgroundData(brightImage));
      })
      .catch((err) => {
        //disabled background on error - will fix later
        Alert.alert(
          "Error",
          "Unable to load background",
          [
            { text: "Okay", onPress: () => setBackground(false)},
            { text: "Retry", onPress: loadSetBackground}
          ]
        );
      })
  }

  useEffect(() => {
    if (!bgOld.current && showBackground) {
      loadSetBackground();
    } else if (showBackground && (Date.now() - background.lastSetTime >= 3600000 || !background.lastSetTime)) {
      loadSetBackground();
    }

    bgOld.current = showBackground

  }, [showBackground]);


  const renderImage = () => {
    const imgUrl = background.data.urls?.raw || (background.data.urls?.full || background.data.urls?.regular)
    const image = <FastImage
      source={{ uri: imgUrl, priority: FastImage.priority.high }}
      force-cache="force-cache"
      style={styles.backgroundImage}
      resizeMode={FastImage.resizeMode.cover}
      onLoad={() => setLoaded(true)}
      onLoadStart={() => setLoaded(false)}
    />

    return (showBackground && imgUrl) ? <Pressable children={image} /> : <View style={styles.backgroundImage}></View>;
  }

  return (
    <View>
      <Animated.View style={opacityStyle}>
        {renderImage()}
        {(showBackground && !loaded) && <Blurhash
          blurhash={background.data.blur_hash}
          style={styles.blur}
        />}
      </Animated.View>
      {children}
    </View>
  )
}

Background.propTypes = {
  showBackground: PropTypes.bool.isRequired,
  setLoaded: PropTypes.func,
  loaded: PropTypes.bool,
  opacity: PropTypes.any,
  children: PropTypes.node
}

const styles = StyleSheet.create({
  blur: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 0,
    left: 0,
    // height: "100%",
  },
  backgroundImage: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 0,
    left: 0,
    // height: "100%",
  },
})

export default Background
