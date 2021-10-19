import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {Animated, Text, View} from 'react-native';

const Fade = (props) => {
  let visibility = useRef(new Animated.Value(props.visible ? 1 : 0)).current
  let [visible, setVisible] = useState(props.visible);

  useEffect(() => {
    if (props.visible) setVisible(true)
    Animated.timing(visibility, {
      toValue: props.visible ? 1 : 0,
      duration: props.duration ?? 200,
      useNativeDriver: true
    }).start(() => setVisible(props.visible));
  }, [props])


  return (
    <Animated.View style={[props.style, {opacity: visibility}]}>
      {(visible || props.disableMount) && props.children}
    </Animated.View>
  );
};

Fade.propTypes = {
  visible: PropTypes.bool,
  duration: PropTypes.number,
  children: PropTypes.element,
  style: PropTypes.object,
  disableMount: PropTypes.bool
}


export default Fade;
