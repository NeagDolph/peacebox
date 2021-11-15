import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from "react-redux";
import Tooltip from "react-native-walkthrough-tooltip";
import breathingGuide from "../guides/breathing-guide";
import haptic from "../helpers/haptic";
import {Text, TouchableWithoutFeedback, View} from "react-native"




function useTooltip() {
  const breathingIndex = useSelector(state => state.tutorial.breathing.completion);
  const open = useSelector(state => state.tutorial.breathing.open);
  const running = useSelector(state => state.tutorial.breathing.running);
  const lastAction = useSelector(state => state.tutorial.breathing.lastAction);

  const currentTooltip = useCallback(() => {
    return breathingGuide[breathingIndex];
  }, [breathingGuide, breathingIndex])


  const craftTooltip = (inner, index, key) => {
    const props = currentTooltip() && currentTooltip().tooltipProps

    const onClose = () => {
      const timeDiff = Date.now() - lastAction
      if (timeDiff > 600 && props.onClose) props.onClose()
    }

    const showTooltip = () => currentTooltip() && open && breathingIndex === index && running

    return showTooltip() ? (
        <Tooltip content={currentTooltip().content} isVisible={true} {...{...currentTooltip().tooltipProps, onClose}} key={key}>
          {inner}
        </Tooltip>) :
      <View key={key}>{inner}</View>;
  }

  useEffect(() => {
    return () => {
      haptic(1)
    }

  }, []);

  return (children, index, key?) => craftTooltip(children, index, key ?? 0);
}


export default useTooltip
