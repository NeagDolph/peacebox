import React, {useCallback, useEffect, useState} from 'react';

import {Dimensions, Text, View} from 'react-native';
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";

const FadeGradient = (props) => {

  return (
    <MaskedView
      maskElement={<LinearGradient
        style={{width: "100%", height: "100%"}}
        colors={['transparent', 'black', "black", 'transparent']}
        locations={[0, props.top, 1 - props.bottom, 1]}
      />}>
      {props.children}
    </MaskedView>
  );
};

export default FadeGradient;
