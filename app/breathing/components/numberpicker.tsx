import React from 'react';
import {colors} from "../../config/colors";
import styled from 'styled-components';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform, ListView, FlatList, MaskedViewIOS,
} from 'react-native';
import PropTypes from 'prop-types';
import ScrollViewPicker from "./scrollview-picker";
import FadeGradient from "../../components/fade-gradient";
import haptic from "../../helpers/haptic";

const NumberPicker = (props) => {
  return props.scrollView ?
      <ScrollViewPicker
        dataSource={Array(props.maxNumber + (props.includeZero ? 1 : 0)).fill("").map((el, i) => i + (props.includeZero ? 0 : 1))}
        selectedIndex={props.value - (props.includeZero ? 0 : 1)}
        onValueChange={(data) => props.setSequenceAmount(data, props.index)}
        wrapperHeight={46}
        wrapperWidth={41}
        listKey={props.listKey}
        wrapperStyle={props.style}
        wrapperBackground={'#FFFFFF'}
        itemHeight={27}
        borderRadius={6}
        highlightColor={'#d8d8d8'}
        highlightBorderWidth={2}
        activeItemColor={colors.primary}
        itemColor={colors.text2}
        itemTextStyle={{
          fontSize: 27,
          color: colors.text2,
        }}
        activeItemTextStyle={{
          color: colors.primary,
          fontSize: 27
        }}
      />
      :

      <ScrollPicker
        dataSource={Array(props.maxNumber + (props.includeZero ? 1 : 0)).fill("").map((el, i) => i + (props.includeZero ? 0 : 1))}
        selectedIndex={props.value - (props.includeZero ? 0 : 1)}
        onValueChange={(data) => props.setSequenceAmount(data, props.index)}
        wrapperHeight={46}
        wrapperWidth={41}
        listKey={props.listKey}
        wrapperStyle={props.style}
        wrapperBackground={'#FFFFFF'}
        itemHeight={27}
        borderRadius={6}
        highlightColor={'#d8d8d8'}
        highlightBorderWidth={2}
        activeItemColor={colors.primary}
        itemColor={colors.text2}
        itemTextStyle={{
          fontSize: 27,
          color: colors.text2,
        }}
        activeItemTextStyle={{
          color: colors.primary
        }}
      />
};

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
`;
export const HighLightView = styled.View`
position: absolute;
/*top: ${props => (props.wrapperHeight - props.itemHeight) / 2}px;*/
height: ${props => props.wrapperHeight}px;
width: ${props => props.wrapperWidth}px;
border-radius: ${props => props.borderRadius}px;
background: ${colors.background3};

`;
export const SelectedItem = styled.View`
justify-content: center;
align-items: center;
height: 27px;
color: ${colors.primary}
`;
const deviceWidth = Dimensions.get('window').width;

class ScrollPicker extends React.Component {
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
      this.scrollToIndex(this.props.selectedIndex);
      this.currentIndex = this.props.selectedIndex
    }

    if (prevState.selectedIndex !== this.state.selectedIndex) {
      // onValueChange
      if (this.props.onValueChange) {
        const selectedValue = this.props.dataSource[this.state.selectedIndex];
        this.props.onValueChange(selectedValue, this.state.selectedIndex);
      }
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
          <FlatList
            ref={(sview) => this.sview = sview}
            bounces={false}
            data={this.props.dataSource}
            nestedScrollEnabled={true}
            ListHeaderComponent={header}
            listKey={this.props.listKey}
            ListFooterComponent={footer}
            renderItem={({item, index}) => this.renderItem(item, index)}
            showsVerticalScrollIndicator={false}
            onTouchStart={this.props.onTouchStart}
            getItemLayout={(data, index) => (
              {length: this.props.itemHeight, offset: this.props.itemHeight * index, index}
            )}
            keyExtractor={(obj, id) => obj}
            onMomentumScrollBegin={this.onMomentumScrollBegin}
            onMomentumScrollEnd={this.onMomentumScrollEnd}
            onScrollBeginDrag={this.onScrollBeginDrag}
            onScrollEndDrag={this.onScrollEndDrag}
            scrollEventThrottle={5}
            maxToRenderPerBatch={3}
            updateCellsBatchingPeriod={100}
            initialNumToRender={10}
            windowSize={5}
            onScroll={this.onScroll}
          >
          </FlatList>
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
    const item = <Text style={[this.props.itemTextStyle, isSelected && this.props.activeItemTextStyle]}>{data}</Text>;

    return (
      <SelectedItem key={index} itemHeight={27}>
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
        this.scrollToIndex(selectedIndex, false);
      }
    }
    if (this.state.selectedIndex === selectedIndex) {
      return;
    }
    this.setState({
      selectedIndex,
    });
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
// const y = this.props.itemHeight * ind;

    setTimeout(() => {
      if (this.sview) {
        this.sview.scrollToIndex({index: ind >= 0 ? ind : 0, animated: !firstLoad});
      }
    }, 0);
  }
}

ScrollPicker.propTypes = {
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
  listKey: PropTypes.any,
  value: PropTypes.number
};
ScrollPicker.defaultProps = {
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


NumberPicker.propTypes = {
  maxNumber: PropTypes.number,
  style: PropTypes.object,
  index: PropTypes.number,
  includeZero: PropTypes.bool,
  setSequenceAmount: PropTypes.func,
  listKey: PropTypes.any,
  scrollView: PropTypes.bool,
  value: PropTypes.number
}


export default NumberPicker
