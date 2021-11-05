import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from "react-redux";
import Tooltip from "react-native-walkthrough-tooltip";
import breathingGuide from "../../guides/breathing-guide";
import haptic from "../../helpers/haptic";




function useTooltip() {
  const breathingIndex = useSelector(state => state.tutorial.breathing.completion);
  const running = useSelector(state => state.tutorial.breathing.running);

  const currentTooltip = useCallback(() => {
    return breathingGuide[breathingIndex];
  }, [breathingGuide, breathingIndex])


  const craftTooltip = (inner, index) => {
    return currentTooltip() && running && breathingIndex === index ? (
        <Tooltip content={currentTooltip().content}
                 isVisible={running && breathingIndex === index} {...currentTooltip().tooltipProps} key={0}>
          {inner}
        </Tooltip>) :
      <>{inner}</>;
  }

  useEffect(() => {
    return () => {
      haptic(1)
    }

  });

  return (children, index) => craftTooltip(children, index);
}


export default useTooltip
