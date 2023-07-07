import * as React from "react";
import { createRef } from "react";
import Svg, { Circle, Defs, G, RadialGradient, Stop } from "react-native-svg";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../config/colors";
import PropTypes from "prop-types";


const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedG = Animated.createAnimatedComponent(G);

class BreathingAnim extends React.Component {
  readonly canvasSize: number;
  readonly baseSize: number;
  private radius: any;
  private animationRadius: any;
  private animationRotation: any;
  private listener: any;
  private animation: any;
  private toSize: any;
  readonly color: any;
  readonly fullsize: number;

  constructor(props) {
    super(props);

    this.state = {
      toSize: 0,
    }

    this.canvasSize = props.canvasSize || 250
    this.baseSize = props.baseSize || 35
    this.color = props.color || colors.accent;
    this.fullsize = (this.canvasSize / 4) + (this.baseSize / 2);

    this.radius = new Animated.Value(this.baseSize);
    this.animationRadius = Animated.add(this.radius, -this.baseSize);
    this.animationRotation = new Animated.Value(0);

    this.animation = createRef();

    this.listener = this.radius.addListener((circleRadius) => {
      if (this.g) {
      // if (false) {
        const completion = ((circleRadius.value - this.baseSize) / this.fullsize) * 2;
        const baseColor = colors.dark ? [255, 255, 255] : [0, 0, 0]
        const flowerColor = colors.dark ? [75,138,225] : [35, 53, 222]
        // "rgb(95,168,255)"
        const color = this.interpolateColor(baseColor, flowerColor, completion);

        this.g.setNativeProps({
          fill: color
        });
      }

      for (let i = 1; i < 11; i++) {
        const xval = this.calcX(i, circleRadius.value);
        const yval = this.calcY(i, circleRadius.value)

        if (!this["circle" + i]) continue;
        this["circle" + i].setNativeProps({
          r: ((circleRadius.value - this.baseSize) / 2) + this.baseSize,
          cx: xval,
          cy: yval,
        });
      }
    });
  }

  interpolateColor = (color1, color2, fraction) => {
    const newR = (color2[0] - color1[0]) * fraction + color1[0]
    const newG = (color2[1] - color1[1]) * fraction + color1[1]
    const newB = (color2[2] - color1[2]) * fraction + color1[2]

    return "rgb(" + newR + "," + newG + "," + newB + ")"
  }

  componentDidMount = () => {
    this.animateSpin();
    this.open(this.props.sequenceTime);
  }

  shouldComponentUpdate = (nextProps: any, nextState: any, nextContext: any): boolean => {
    if (nextProps.currentTime >= 0 && (nextProps.currentTime < nextProps.sequenceTime)) {
      return true
    } else return false
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.currentIndex !== this.props.currentIndex || prevProps.title !== this.props.title) {
      if (this.props.currentIndex == 0) {
        this.open(this.props.sequenceTime);
      } else if (this.props.currentIndex == 2) {
        this.close(this.props.sequenceTime);
      }
    }

    if (prevProps.paused !== this.props.paused) {
      if (this.props.paused) {
        this.pauseAnimation();
      }
      else {
        this.setAnimation(this.props.sequenceTime - this.props.currentTime);
        this.resumeAnimation();

      }
    }
  }

  open = (time) => {
    this.toSize = this.fullsize
    this.setAnimation(time);
    this.resumeAnimation();
  }
  close = (time) => {
    this.toSize = this.baseSize
    this.setAnimation(time);
    this.resumeAnimation();
  }

  setAnimation = (time) => {
    this.animation.current = Animated.timing(this.radius, {
      toValue: this.toSize,
      useNativeDriver: true,
      duration: (time * 1060) + 100,
      easing: Easing.bezier(0.470, 0.205, 0.460, 0.555)
    })
  }

  resumeAnimation = () => this.props.settings.showAnimations ? this.animation.current.start() : null;

  pauseAnimation = () => {
    if (this.props.settings.showAnimations) {
      this.animation.current.stop();
    }
  }

  animateSpin = () => {
    if (this.props.settings.showAnimations) Animated.loop(Animated.timing(this.animationRotation, {
      toValue: 1,
      useNativeDriver: true,
      duration: 80000,
      easing: Easing.linear
    })).start();
  }

  private degreesToRadians = (deg) => (deg * Math.PI) / 180

  private calcX = (circle, radius) => {
    let angle = circle * 36;

    const xOffset = (radius - this.baseSize) * Math.cos(this.degreesToRadians(angle));

    return (this.canvasSize / 2) + xOffset
  }

  private calcY = (circle, radius) => {
    let angle = circle * 36;

    const yOffset = (radius - this.baseSize) * Math.sin(this.degreesToRadians(angle));

    return (this.canvasSize / 2) + yOffset
  }

  render() {
    return (
      <View style={{width: "100%", justifyContent: "center", alignItems: "center"}}>
        <AnimatedSvg
          width={this.canvasSize}
          height={this.canvasSize}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...this.props}
          style={{
            transform: [{
              rotate: this.animationRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }]
          }}
        >
          <Defs>
            <RadialGradient
              id="grad"
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize * 2}
              fx={this.canvasSize / 2}
              fy={this.canvasSize / 2}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={colors.black} stopOpacity="1"/>
              <Stop offset="1" stopColor={colors.black} stopOpacity="0.35"/>
            </RadialGradient>
          </Defs>
          <AnimatedG ref={ref => this.g = ref} fill="#000000" fillOpacity={0.35}>
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle1 = ref}
            />
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle2 = ref}
            />
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle3 = ref}
            />
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle4 = ref}
            />
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle5 = ref}
            />
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle6 = ref}
            />
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle7 = ref}
            />
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle8 = ref}
            />
            <Circle
              cx={this.canvasSize / 2}
              cy={this.canvasSize / 2}
              r={this.baseSize}
              ref={ref => this.circle9 = ref}
            />
            <Circle cx={this.canvasSize / 2} cy={this.canvasSize / 2} r={this.baseSize}
                    ref={ref => this.circle10 = ref}
            />
            <Circle cx={this.canvasSize / 2} cy={this.canvasSize / 2} r={this.baseSize} fill="url(#grad)"/>
          </AnimatedG>
        </AnimatedSvg>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{this.props.currentTime + 1}</Text>
          <Text style={styles.countText}>{this.props.title}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  completionCircle: {
    position: "absolute",
  },
  countText: {
    fontSize: 18,
    lineHeight: 20,
    fontFamily: "Avenir",
    color: colors.background4
  },
  count: {
    fontSize: 30,
    lineHeight: 35,
    color: colors.background2,
    fontFamily: "Avenir-Heavy",
    fontWeight: "bold"
  },
  countContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    alignItems: "center"
  }
})

BreathingAnim.propTypes = {
  canvasSize: PropTypes.number,
  baseSize: PropTypes.number,
  color: PropTypes.string,
  sequenceTime: PropTypes.any,
  currentIndex: PropTypes.any,
  currentTime: PropTypes.number,
  title: PropTypes.string,
  settings: PropTypes.object
}

export default BreathingAnim
