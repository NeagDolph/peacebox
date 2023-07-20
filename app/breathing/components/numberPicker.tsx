import { colors } from "../../config/colors";
import { Dimensions, Platform, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import haptic from "../../helpers/haptic";
import { ScrollView } from "react-native-gesture-handler";

const options = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false
};

// @ts-ignore
const Container = styled.View`
  height: ${props => props.wrapperHeight}px;
  display: flex;
  overflow: hidden;
  align-self: center;
  width: ${props => props.wrapperWidth}px;
`;

// @ts-ignore
export const HighLightView = styled.View`
  position: absolute;
  height: ${props => props.wrapperHeight}px;
  width: 40px;
  border-radius: 6px;
  background: ${colors.background3};
  z-index: -1;
`;

// @ts-ignore
export const SelectedItem = styled.View`
  justify-content: center;
  align-items: center;
  height: 27px;
  color: ${colors.primary}
`;

const itemTextStyle = {
  fontSize: 27,
  color: colors.text2,
  [Platform.OS === "android" && "height"]: 30
};


const activeItemTextStyle = {
  color: colors.primary,
  fontSize: 27,
  [Platform.OS === "android" && "height"]: 30
};

const wrapperWidth = 41;
const wrapperHeight = 46;

const itemHeight = 27;

const deviceWidth = Dimensions.get("window").width;
let paddingSize;

const NumberPicker = ({
                        selectedIndex,
                        includeZero = true,
                        max,
                        onValueChange
                      }) => {
    const currentIndex = useRef(1);
    const sview = useRef(null);
    const dragStarted = useRef(false);
    const momentumStarted = useRef(false);
    const isScrollTo = useRef(false);
    const timer = useRef(null);

    const [dataSource, setDataSource] = useState([0]);

    const [selectedStateIndex, setSelectedStateIndex] = useState(selectedIndex || 1);

    const getScrollValues: (number, boolean) => any[] = (max: number, includeZero: boolean) => {
      return Array(max + (includeZero ? 1 : 0)).fill("").map((el, i) => i + (includeZero ? 0 : 1));
    };

    useEffect(() => {
      setDataSource(getScrollValues(max, true));
    }, []);


    useEffect(() => {
      if (typeof selectedStateIndex !== "undefined") {
        scrollToIndex(selectedStateIndex, true);
      }
      return () => {
        if (timer.current) {
          clearTimeout(timer.current);
        }
      };
    }, [selectedStateIndex]);

    useEffect(() => {
      if (selectedIndex !== selectedStateIndex) {
        scrollToIndex(selectedIndex, false);
        setSelectedStateIndex(selectedIndex);
      }
    }, [selectedIndex]);

    const onScroll = ({ nativeEvent }) => {
      const totalHeight = nativeEvent.contentOffset.y - paddingSize;
      const itemIndex = Math.floor(totalHeight / itemHeight);

      if (itemIndex !== currentIndex.current) {
        currentIndex.current = itemIndex;
        haptic(0);
      }
    };

    const renderHeader = () => {
      const height = (wrapperHeight - itemHeight) / 3;
      paddingSize = height;
      const header = <View style={{ height, flex: 1 }}></View>;
      return header;
    };

    const renderFooter = () => {
      const height = (wrapperHeight - itemHeight) / 2;
      const footer = <View style={{ height: height + 5, flex: 1 }}></View>;
      return footer;
    };

    const renderEachItem = (data, index) => {
      const isSelected = index === selectedStateIndex;
      const item = <Text style={isSelected ? activeItemTextStyle : itemTextStyle}>{data}</Text>;

      return (
        <SelectedItem key={index} itemHeight={itemHeight}>
          {item}
        </SelectedItem>
      );
    };

    const scrollFix = (verticalY: number) => {
      const h = itemHeight;
      const selectedItem = Math.round(verticalY / h);
      const verticalElem = selectedItem * h;

      if (selectedStateIndex === selectedItem) {
        scrollToIndex(selectedItem, false);
        return;
      }

      setSelectedStateIndex(selectedItem);
      scrollToIndex(selectedItem, false);

      if (onValueChange) {
        onValueChange(selectedItem);
      }
    };

    const onScrollBeginDrag = () => {
      dragStarted.current = true;
      if (Platform.OS === "ios") {
        isScrollTo.current = false;
      }
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };

    const handleScrollEndDrag = (e) => {
      // onScrollEndDragCustom();
      dragStarted.current = false;
      const y = e.nativeEvent.contentOffset.y;

      if (!momentumStarted.current && !dragStarted.current) {
        scrollFix(y);
      }
    };

    const onMomentumScrollBegin = () => {
      momentumStarted.current = true;
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };

    const handleMomentumScrollEnd = (e) => {
      // onMomentumScrollEndCustom();
      scrollFix(e.nativeEvent.contentOffset.y);
    };

    const scrollToIndex = (ind, firstLoad) => {
      currentIndex.current = ind;
      setSelectedStateIndex(ind);
      const y = itemHeight * ind;
      setTimeout(() => {
        if (sview.current) {
          sview.current.scrollTo({ y, animated: !firstLoad });
        }
      }, 0);
    };


    return (
      <Container wrapperWidth={wrapperWidth} wrapperHeight={wrapperHeight}>
        <ScrollView
          ref={sview}
          bounces={false}
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={handleScrollEndDrag}
          onScroll={onScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollBeginDrag={onScrollBeginDrag}
          onMomentumScrollBegin={onMomentumScrollBegin}
        >
          {renderHeader()}
          {dataSource.map(renderEachItem)}
          {renderFooter()}
        </ScrollView>
        <HighLightView
          style={{ "zIndex": -1 }}
          wrapperHeight={wrapperHeight || itemHeight}
          highlightWidth={wrapperWidth}
          itemHeight={itemHeight || 60}
        />
      </Container>
    );
  }
;

NumberPicker.propTypes = {
  style: PropTypes.object,
  dataSource: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number,
  onValueChange: PropTypes.func,
  renderItem: PropTypes.func,
  highlightColor: PropTypes.string,
  itemHeight: PropTypes.number,
  wrapperBackground: PropTypes.string,
  wrapperWidth: PropTypes.number,
  wrapperHeight: PropTypes.number,
  highlightWidth: PropTypes.number,
  highlightBorderWidth: PropTypes.number,
  itemTextStyle: PropTypes.object,
  activeItemTextStyle: PropTypes.object,
  onMomentumScrollEnd: PropTypes.func,
  onScrollEndDrag: PropTypes.func,
  listKey: PropTypes.number
};

NumberPicker.defaultProps = {
  dataSource: [""],
  wrapperBackground: "#FFF",
  itemHeight: 60,
  highlightColor: "#333",
  highlightBorderWidth: 2,
  wrapperHeight: 180,
  wrapperWidth: deviceWidth * 0.4,
  itemTextStyle: { fontSize: 20, lineHeight: 26, color: "#333", textAlign: "center" },
  activeItemTextStyle: { fontSize: 20, lineHeight: 26, color: "#333", textAlign: "center" }
};

export default NumberPicker;
