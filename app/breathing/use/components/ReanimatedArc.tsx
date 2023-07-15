import * as React from "react";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import ReanimatedArcBase, { Props as ReanimatedArcBaseProps } from "./ReanimatedArcBase";

type Props = Omit<ReanimatedArcBaseProps, "arcSweepAngle" | "rotation"> & {
  arcSweepAngle: number;
  rotation: number;
  initialAnimation: boolean;
  animationDuration: number;
  easing: (value: number) => number;
};

const ReanimatedArc = ({
                         arcSweepAngle: arcSweepAngleProp,
                         rotation: rotationProp,
                         initialAnimation,
                         animationDuration,
                         easing = Easing.linear,
                         ...rest
                       }) => {
  const arcSweepAngle = useSharedValue(initialAnimation ? 0 : arcSweepAngleProp);
  const rotation = useSharedValue(initialAnimation ? 0 : rotationProp);

  React.useEffect(() => {
    if (initialAnimation) {
      arcSweepAngle.value = withTiming(arcSweepAngleProp, { duration: animationDuration, easing });
      rotation.value = withTiming(rotationProp, { duration: animationDuration, easing });
    } else {
      arcSweepAngle.value = arcSweepAngleProp;
      rotation.value = rotationProp;
    }
  }, [arcSweepAngleProp, rotationProp, initialAnimation, animationDuration, easing, arcSweepAngle, rotation]);

  return (
    <ReanimatedArcBase
      {...rest}
      arcSweepAngle={arcSweepAngle}
      initialAnimation={initialAnimation}
      rotation={rotation}
    />
  );
};

export default ReanimatedArc;
