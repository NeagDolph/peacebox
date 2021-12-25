import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from "react-redux";
import Tooltip from "react-native-walkthrough-tooltip";
import breathingGuide from "../guides/breathing-guide";
import haptic from "../helpers/haptic";
import {AppState, Text, TouchableWithoutFeedback, View} from "react-native"




function useSession() {
  const [pages, setPages] = useState(0)
  const [lastInactive, setLastInactive] = useState(Date.now())
  const addPage = () => {
    setPages(n => n + 1);
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState.match(/inactive/)) {
        setLastInactive(Date.now())
      }

      if (nextAppState.match(/active/)) {
        const timeSince = Date.now() - lastInactive;

        if (timeSince > 30000) resetSession()
      }
    });


    return () => {
      subscription.remove()
    }
  }, [])

  const resetSession = () => {
    setPages(0)
  }

  return {pages, addPage}
}


export default useSession
