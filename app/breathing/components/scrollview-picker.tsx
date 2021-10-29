import {colors} from "../../config/colors";
import {Dimensions, FlatList, Platform, ScrollView, Text, View} from "react-native";
import React from "react";
import PropTypes from "prop-types";
import styled from 'styled-components';
import FadeGradient from "../../components/fade-gradient";
import haptic from "../../helpers/haptic";

const options = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false
};

const Container = styled.View`
  height: ${props => props.wrapperHeight}px;
  display: flex;
  overflow: hidden;
  align-self: center;
  width: ${props => props.wrapperWidth}px;
  background-color: ${props => props.wrapperBackground};
`;
export const HighLightView = styled.View`
  position: absolute;
  /*top: ${props => (props.wrapperHeight - props.itemHeight) / 2}px;*/
  height: ${props => props.wrapperHeight}px;
  width: ${props => props.wrapperWidth}px;
  border-radius: ${props => props.borderRadius}px;
  background: ${colors.background2};
  
`;
export const SelectedItem = styled.View`
  justify-content: center;
  align-items: center;
  height: 27px;
  color: ${colors.primary}
`;
const deviceWidth = Dimensions.get('window').width;

class ScrollViewPicker extends React.Component {
  private currentIndex: number;
  private paddingSize: number;

  constructor() {
    super();
    this.onMomentumScrollBegin = this.onMomentumScrollBegin.bind(this);
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
    this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
    this.onScrollEndDrag = this.onScrollEndDrag.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.renderItem = this.renderItem.bind(this)
    this.currentIndex = 1;
    this.state = {
      selectedIndex: 1,
    }
  }

  componentDidMount() {
    if (typeof this.props.selectedIndex !== 'undefined') {
      this.scrollToIndex(this.props.selectedIndex, true);
      this.currentIndex = this.props.selectedIndex
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selectedIndex !== this.state.selectedIndex || nextProps.selectedIndex !== this.props.selectedIndex;
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.selectedIndex !== this.props.selectedIndex) {
      this.scrollToIndex(this.props.selectedIndex, false);
      this.currentIndex = this.props.selectedIndex
    }
  }

  render() {
    const header = this.renderHeader();
    const footer = this.renderFooter();
    return (
      <Container
        style={[{overflow: "hidden"}, this.props.wrapperStyle]}
        wrapperHeight={this.props.wrapperHeight}
        wrapperWidth={this.props.wrapperWidth}
        wrapperBackground={this.props.wrapperBackground}
      >
        <HighLightView
          highlightColor={this.props.highlightColor}
          highlightWidth={this.props.highlightWidth}
          wrapperHeight={this.props.wrapperHeight}
          wrapperWidth={this.props?.wrapperStyle?.width || this.props.wrapperWidth}
          itemHeight={this.props.itemHeight}
          highlightBorderWidth={this.props.highlightBorderWidth}
          borderRadius={this.props.borderRadius || 10}
        />
        <FadeGradient top={0.1} bottom={0.1}>
          <ScrollView
            ref={(sview) => {
              this.sview = sview;
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}
            onTouchStart={this.props.onTouchStart}
            onMomentumScrollBegin={this.onMomentumScrollBegin}
            onMomentumScrollEnd={this.onMomentumScrollEnd}
            onScrollBeginDrag={this.onScrollBeginDrag}
            onScrollEndDrag={this.onScrollEndDrag}
            onScroll={this.onScroll}
            scrollEventThrottle={33}
          >
            {header}
            {this.props.dataSource.map(this.renderItem.bind(this))}
            {footer}
          </ScrollView>
        </FadeGradient>
      </Container>
    );
  }

  onScroll({nativeEvent}) {
    const totalHeight = nativeEvent.contentOffset.y - this.paddingSize;
    const itemHeight = Math.floor(totalHeight / this.props.itemHeight);

    if (itemHeight !== this.currentIndex) {
      this.currentIndex = itemHeight;
      haptic(0);
    }
  }

  renderHeader() {
    const height = (this.props.wrapperHeight - this.props.itemHeight) / 3;
    this.paddingSize = height;
    const header = <View style={{height, flex: 1}}></View>;
    return header;
  }

  renderFooter() {
    const height = (this.props.wrapperHeight - this.props.itemHeight) / 2;
    const footer = <View style={{height: height + 5, flex: 1}}></View>;
    return footer;
  }

  renderItem(data, index) {
    const isSelected = index === this.state.selectedIndex;
    const item = <Text style={isSelected ? this.props.activeItemTextStyle : this.props.itemTextStyle}>{data}</Text>;

    return (
      <SelectedItem key={index} itemHeight={this.props.itemHeight}>
        {item}
      </SelectedItem>
    );
  }

  scrollFix(e) {
    let verticalY = 0;
    const h = this.props.itemHeight;
    if (e.nativeEvent.contentOffset) {
      verticalY = e.nativeEvent.contentOffset.y;
    }
    const selectedIndex = Math.round(verticalY / h);
    const verticalElem = selectedIndex * h;
    if (verticalElem !== verticalY) {
      // using scrollTo in ios, onMomentumScrollEnd will be invoked
      if (Platform.OS === 'ios') {
        this.isScrollTo = true;
      }
      if (this.sview) {
        this.sview.scrollTo({y: verticalElem, animated: true});
      }
    }
    if (this.state.selectedIndex === selectedIndex) {
      return;
    }
    this.setState({
      selectedIndex,
    });
    // onValueChange
    if (this.props.onValueChange) {
      const selectedValue = this.props.dataSource[selectedIndex];
      this.props.onValueChange(selectedValue, selectedIndex);
    }
  }

  onScrollBeginDrag() {
    this.dragStarted = true;
    if (Platform.OS === 'ios') {
      this.isScrollTo = false;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onScrollEndDrag(e) {
    this.props.onScrollEndDrag();
    this.dragStarted = false;
    // if not used, event will be garbaged
    const element = {
      nativeEvent: {
        contentOffset: {
          y: e.nativeEvent.contentOffset.y,
        },
      },
    };
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(
      () => {
        if (!this.momentumStarted && !this.dragStarted) {
          this.scrollFix(element, 'timeout');
        }
      },
      10,
    );
  }

  onMomentumScrollBegin() {
    this.momentumStarted = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onMomentumScrollEnd(e) {
    this.props.onMomentumScrollEnd();
    this.momentumStarted = false;
    if (!this.isScrollTo && !this.momentumStarted && !this.dragStarted) {
      this.scrollFix(e);
    }
  }

  scrollToIndex(ind, firstLoad) {
    this.setState({
      selectedIndex: ind,
    });
    const y = this.props.itemHeight * ind;
    setTimeout(() => {
      if (this.sview) {
        this.sview.scrollTo({y, animated: !firstLoad});
      }
    }, 0);
  }
}

ScrollViewPicker.propTypes = {
  style: PropTypes.object,
  dataSource: PropTypes.array,
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
  listKey: PropTypes.any
};

ScrollViewPicker.defaultProps = {
  dataSource: [1, 2, 3],
  itemHeight: 60,
  wrapperBackground: '#FFFFFF',
  wrapperHeight: 180,
  wrapperWidth: 150,
  highlightWidth: deviceWidth,
  highlightBorderWidth: 2,
  highlightColor: '#333',
  onMomentumScrollEnd: () => {
  },
  onScrollEndDrag: () => {
  },
  itemTextStyle: {fontSize: 20, lineHeight: 26, textAlign: 'center', color: '#B4B4B4'},
  activeItemTextStyle: {fontSize: 20, lineHeight: 26, textAlign: 'center', color: '#222121'}
};

export default ScrollViewPicker
