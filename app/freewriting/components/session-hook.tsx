import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useSelector} from "react-redux";
import Tooltip from "react-native-walkthrough-tooltip";
import breathingGuide from "../guides/breathing-guide";
import haptic from "../helpers/haptic";
import {AppState, Text, TouchableWithoutFeedback, View} from "react-native"




function useSession() {
  const [pages, setPages] = useState(0)
  const lastClear = useRef(Date.now());
  const lastInactive = useRef(Date.now());

  const addPage = () => {
    const timeSince = Date.now() - lastClear.current
    if (timeSince > 2000) {
      setPages(n => n + 1);
      lastClear.current = Date.now()
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        lastInactive.current = Date.now();
      }

      if (nextAppState.match(/^active$/)) {
        const timeSince = Date.now() - lastInactive.current;
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
