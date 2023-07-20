import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Canvas from "react-native-canvas";
import PropTypes from "prop-types";

const AnimatedArc = (props) => {
  const canvasRef = useRef(null);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleCanvas = (canvas, previousValue, currentValue) => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const radius = props.diameter / 2;
    const startAngle = previousValue * 2 * Math.PI - Math.PI / 2;
    const endAngle = currentValue * 2 * Math.PI - Math.PI / 2;

    // No need to clear the canvas here
    ctx.beginPath();
    ctx.arc(radius * 2, radius * 2, radius, startAngle, endAngle, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = props.color;
    ctx.stroke();
  };


  useEffect(() => {
    let previousValue = 0;
    const listenerId = animatedValue.addListener(({ value }) => {
      const canvas = canvasRef.current;
      handleCanvas(canvas, previousValue, value);
      previousValue = value;
    });

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, []);


  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: props.value,
      duration: props.duration,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }, [props.value]);

  return (
    <View style={[props.style, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
      <Canvas ref={canvasRef} style={{ height: props.diameter * 2, width: props.diameter * 2 }} />
    </View>
  );
};

AnimatedArc.propTypes = {
  diameter: PropTypes.number,
  color: PropTypes.string,
  value: PropTypes.number,
  duration: PropTypes.number,
  style: PropTypes.object

};

export default AnimatedArc;
