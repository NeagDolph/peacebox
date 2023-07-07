import React, {useState} from 'react';

import {Pressable, StyleSheet, Text, TextComponent, View} from 'react-native';
import {colors} from '../config/colors';
import {Surface} from 'react-native-paper';
import PropTypes from 'prop-types';
import IconIonicons from 'react-native-vector-icons/Ionicons';

const PromptOptional = props => {
  const [containerHeight, setContainerHeight] = useState(0);
  const containerLayout = ({nativeEvent}) => {
    setContainerHeight(nativeEvent.layout.height);
  };

  const confirm = () => {
    props.close();
    props.callback();
  };

  return (
    props.visible && (
      <View style={styles.container}>
        <View style={styles.prompt} onLayout={containerLayout}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.subtitle}>{props.subtitle}</Text>
          </View>

          <Pressable
            style={styles.exitButton}
            onPress={props.close}
            hitSlop={20}>
            <IconIonicons
              name="close-circle-outline"
              size={28}
              color={colors.primary}
            />
          </Pressable>
          <View style={styles.options}>
            <Pressable onPress={confirm} style={[styles.optionButton]}>
              <Text style={styles.optionText} numberOfLines={1}>
                Okay
              </Text>
            </Pressable>
            <Pressable onPress={props.close} style={[styles.optionButton]}>
              <Text style={styles.optionText} numberOfLines={1}>
                No Thanks
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
  );
};

PromptOptional.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  callback: PropTypes.func,
  visible: PropTypes.bool,
  close: PropTypes.func,
};

const styles = StyleSheet.create({
  titleContainer: {
    // height: ,
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: 'baloo 2',
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: 'baloo 2',
  },
  optionButton: {
    // paddingHorizontal: 30,
    width: 150,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    shadowColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: colors.background4,
    // width: 80,
    marginHorizontal: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    // width: "100%"
  },
  options: {
    flexDirection: 'row',

    // backgroundColor: colors.background4,

    top: 20,
    alignItems: 'center',
    // alignSelf: 'flex-end',
    justifyContent: 'center',
    width: '100%',

    // height: "100%"
    // justifyContent: "space-between",
  },
  exitButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  optionText: {
    color: colors.primary,
    fontSize: 19,
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'baloo 2',
  },
  container: {
    width: '100%',
    height: 280,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignContent: 'stretch',
    // paddingHorizontal: 40
  },
  prompt: {
    borderWidth: 1,
    width: '100%',
    borderColor: colors.text2,
    // backgroundColor: colors.background3,
    backgroundColor: colors.background2,
    // borderRadius: 8,
    paddingBottom: 20,
    height: '100%',
  },
});

export default PromptOptional;
