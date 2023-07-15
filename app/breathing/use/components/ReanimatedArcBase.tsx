import * as React from "react";
import { Platform, StyleProp, View, ViewStyle } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle } from "react-native-reanimated";
import { colors } from "../../../config/colors";

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export type Props = {
  diameter: number;
  width: number;
  arcSweepAngle: SharedValue<number>;
  rotation: SharedValue<number>;
  initialAnimation: boolean;
  color: string;
  lineCap: "round" | "butt" | "square";
  hideSmallAngle: boolean;
  style?: StyleProp<ViewStyle>;
};

export const defaultProps = {
  color: colors.black,
  rotation: 0,
  lineCap: 'round',
  arcSweepAngle: 360,
  hideSmallAngle: true,
};

const AnimatedArc = (props) => {
  const { diameter, width, lineCap, style } = props;
  const outerRadius = diameter / 2;
  const innerRadius = diameter / 2 - width / 2;


  const animatedProps = useAnimatedProps(() => {
    const startAngle = 0;
    const endAngle = props.arcSweepAngle.value;

    const largeArcFlag = endAngle <= 180 ? "0" : "1";
    const hideSmallAngle = (props.hideSmallAngle && endAngle - startAngle <= 1);

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    };

    const start = polarToCartesian(outerRadius, outerRadius, innerRadius, endAngle * 0.9999);
    const end = polarToCartesian(outerRadius, outerRadius, innerRadius, startAngle);

    const d = hideSmallAngle
      ? ""
      : `M ${start.x} ${start.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

    return {
      d,
      stroke: props.color,
      strokeWidth: width,
      strokeLinecap: lineCap,
      fill: "transparent"
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${props.rotation.value}deg` }
      ]
    };
  });

  const offsetAndroid = Platform.OS === "android" ? outerRadius : 0;
  const pivot = outerRadius;


  return (
    <View>
      <Svg width={diameter} height={diameter} viewBox={`${-pivot} ${-pivot} ${diameter} ${diameter}`}>
        <AnimatedG animatedProps={animatedProps}>
          <AnimatedPath animatedProps={animatedProps} transform={`translate(${-pivot} ${-pivot})`} />
        </AnimatedG>
      </Svg>
    </View>
  );
};

export default AnimatedArc;
