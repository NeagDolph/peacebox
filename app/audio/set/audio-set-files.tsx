import React, {useEffect, useMemo, useState} from 'react';

import {StyleSheet, View} from 'react-native';
import {colors} from '../../config/colors';
import AudioSetFilesTape from './audio-set-files-tape';
import PropTypes from 'prop-types';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useForceUpdate} from '../../helpers/update';
import {useNavigation} from '@react-navigation/native';

const AudioSetFiles = props => {
  const [updateVal, forceUpdate] = useForceUpdate();
  const navigation = useNavigation();

  const viewedData = useSelector(
    state => state.tapes.downloadData[props.set.name],
  );
  const [checkmarkConts, setCheckmarkConts] = useState([]);

  const completedCalc = useMemo(() => {
    const completedVal =
      viewedData?.map(file => {
        return file.downloads.every(el => el.viewed === true);
      }) ?? [];

    return completedVal;
  }, [viewedData]);

  useEffect(() => {
    //Must be force updated on focus for use of inner context menus for tapes
    const focusListener = navigation.addListener('focus', () => {
      forceUpdate();
    });

    return () => {
      if (focusListener) focusListener();
    };
  }, []);

  const layoutCheckmarks = ({nativeEvent}, index) => {
    const checkmarkData = {
      x: nativeEvent.layout.x,
      y: nativeEvent.layout.y,
      height: nativeEvent.layout.height,
      index: index,
    };

    // Data for every checkmark element so progress bars between checkmarks can be correctly positioned
    setCheckmarkConts(state => [...state, checkmarkData]);
  };

  const renderProgress = () => {
    return checkmarkConts.map((checkmark, i) => {
      if (checkmark.index >= props.set.files.length - 1) return;

      const nextCheckmark = checkmarkConts.find(el => {
        return el.index == checkmark.index + 1;
      });

      const lineViewed = completedCalc
        ?.slice(0, checkmark.index + 2)
        .every(el => {
          return el === true;
        });

      const calcTop = checkmark.y + checkmark.height / 2 + 15;
      const lineHeight =
        nextCheckmark?.y + nextCheckmark?.height / 2 - 15 - calcTop;

      const checkmarkStyles = {
        top: calcTop,
        height: lineHeight || 50,
        backgroundColor: lineViewed ? colors.green : colors.accent,
      };

      return (
        <View key={i} style={[styles.progressBar, checkmarkStyles]}></View>
      );
    });
  };

  const renderCheckmark = completed => {
    return (
      <View style={styles.checkmarkContainer}>
        {completed ? (
          <IconMaterial
            name="check-circle"
            size={23}
            style={styles.checkMark}
            color={colors.green}
          />
        ) : (
          <View style={styles.uncheckMark}></View>
        )}
      </View>
    );
  };

  const renderTapes = () => {
    return (
      <View key={updateVal}>
        {props.set.files.map(file => {
          const allCompleted = completedCalc?.[file.episode];

          return (
            <View
              key={file.name}
              style={styles.tapeContainer}
              onLayout={e => layoutCheckmarks(e, file.episode)}>
              {renderCheckmark(allCompleted)}
              <AudioSetFilesTape
                file={file}
                set={props.set}
                downloadData={props.downloadData?.[file.episode]?.downloads}
              />
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderProgress()}
      {renderTapes()}
    </View>
  );
};

AudioSetFiles.propTypes = {
  set: PropTypes.object,
  downloadData: PropTypes.any,
  layout: PropTypes.fun,
};

const styles = StyleSheet.create({
  checkMark: {
    width: 23,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    borderWidth: 0,
    height: 23,
  },
  uncheckMark: {
    width: 19,
    height: 19,
    marginHorizontal: 2,
    borderRadius: 25,
    borderColor: colors.accent,
    borderWidth: 2.5,
  },
  checkmarkContainer: {
    // height: "100%",
    justifyContent:"center"',
    // width: 20,
    paddingRight: 1,
  },
  tapeContainer: {
    width: "100%",
    // flex: 1,
    flexDirection: "row",
    marginVertical: 15
    // height: 100
  },
  container: {
    // flexDirection: "row",
    width: "100%"
    // height: 200
    // flex: 1,
  },
  progressBar: {
    height: 60,
    width: 5,
    left: 9,
    borderRadius: 50,
    // flex: 1,z
    position: "absolute",
    backgroundColor: colors.accent
  }
});

export default AudioSetFiles;
