import React, {useMemo, useRef, useState} from 'react';

import {Pressable, SectionList, StyleSheet, Text, View} from 'react-native';
import PageHeader from '../components/header';
import {colors} from '../config/colors';
import AudioSet from './set/audio-set';
import {useDispatch, useSelector} from 'react-redux';
import DisclaimerModal from './components/disclaimer-modal';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import AudioSetFilesTape from './set/audio-set-files-tape';
import {useNavigation} from '@react-navigation/native';

const AudioPage = () => {
  const audioData = useSelector(state => state.tapes.audioData);
  const favorites = useSelector(state => state.tapes.favorites);
  const lastViewed = useSelector(state => state.tapes.lastViewed);
  const downloads = useSelector(
    state => state.tapes.downloadData[lastViewed.set],
  );

  const scrollRef = useRef(0);

  const [currentOpen, setCurrentOpen] = useState('');

  const dispatch = useDispatch();

  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  const navigation = useNavigation();

  const favoriteSets = useMemo(() => {
    return audioData.filter(el => favorites.includes(el.name));
  }, [favorites, audioData]);

  const renderNextTape = () => {
    const {set, tape, part, timestamp} = lastViewed;
    const timeSinceView = Date.now() - timestamp;

    let nextTape, nextPart;

    const maxLastTimeout = 172800000; //2 days

    if (timeSinceView > maxLastTimeout) return [];

    const audioSet = audioData?.find(el => el.name === set);
    const totalParts = audioSet?.files?.[tape]?.parts;
    const totalTapes = audioSet?.files;

    if (!totalParts || !totalTapes || !audioSet) return;

    if (part >= totalParts.length - 1) {
      //Final part of tape
      nextPart = 0;
      nextTape = tape + 1;

      if (nextTape >= totalTapes - 1) return;
    } else {
      //Next part of tape
      nextPart = part + 1;
      nextTape = tape;
    }

    const tapeItem = (
      <View style={styles.nextContainer}>
        <Text style={styles.sectionTitle}>Keep Listening</Text>
        <View style={styles.nextTitleContainer}>
          <IconIonicons
            name={'caret-forw"caret-forward-circle"   color={audioSet.icon}
            size={25}
          />
          <Text style={styles.nextTitle}>{set}</Text>
        </View>
        <AudioSetFilesTape
          set={audioSet}
          file={audioSet.files[nextTape]}
          downloadData={downloads?.[nextTape]?.downloads}
        />
      </View>
    );

    return tapeItem;
  };

  const renderDisclaimer = () => {
    return (
      <Pressable
        style={styles.disclaimerButtonContainer}
        onPress={() => setDisclaimerVisible(true)}>
        <View style={styles.disclaimerButton}>
          <IconMaterial
            name="alert-box-outline"
            size={25}
            color={colors.primary}
          />
          <Text style={styles.disclaimerButtonText}>Disclaimer</Text>
        </View>
      </Pressable>
    );
  };

  const renderHeader = () => {
    return (
      <>
        {renderDisclaimer()}

        {/* Implement advanced next tape algorithm next update */}
        {/*{renderNextTape()}*/}
      </>
    );
  };

  const renderItem = ({item, index, separators, section}) => {
    return (
      <View style={{marginVertical: 10}}>
        <AudioSet
          set={item}
          scrollRef={scrollRef}
          currentOpen={currentOpen}
          renderId={`${section.title}${index}`}
          setCurrentOpen={setCurrentOpen}
        />
      </View>
    );
  };

  const renderTitle = ({section}) => {
    return (
      section.data.length >= 1 && (
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )
    );
  };

  return (
    <>
      <PageHeader title={"Audio"} settingsButton={false} />
      <SectionList
        style={styles.container}
        ref={scrollRef}
        // contentContainerStyle={{height: '100%'}}
        renderItem={renderItem}
        sections={[
          {
            title: "Favorites",
            data: favoriteSets ?? []
          },
          {
            title: "All Audio-sets",
            data: audioData ?? []
          }
        ]}
        ListHeaderComponent={renderHeader()}
        renderSectionHeader={renderTitle}
        renderSectionFooter={({section: {data}}) =>
          data.length >= 1 && <View style={{marginBottom: 60}} />
        }
      />
      <DisclaimerModal
        disclaimerVisible={disclaimerVisible}
        setDisclaimerVisible={setDisclaimerVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  nextContainer: {
    marginBottom: 40,
    maxWidth: 290,
  },
  nextTitleContainer: {
    flexDirection: "row",
    alignContent: "center",

    marginTop: 12,
    marginBottom: 5,
  },
  nextTitle: {
    color: colors.primary,
    fontSize: 20,
    lineHeight: 30,
    marginLeft: 5,

    fontFamily: "baloo 2",
  },
  titleContainer: {
    width: "100%",
    backgroundColor: colors.background,
    paddingBottom: 6,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 30,
    marginLeft: 0,
    lineHeight: 40,
    color: colors.primary,
    fontFamily: "avenir",
  },
  disclaimerButtonContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 30,
    paddingTop: 10,
  },
  disclaimerButton: {
    flexDirection: "row",
    borderRadius: 5,
    paddingVertical: 4,
    width: "auto",
    marginTop: 20,
    paddingHorizontal: 10,
    right: 0,
    backgroundColor: colors.background3,
  },
  disclaimerButtonText: {
    fontSize: 19,
    lineHeight: 28,
    marginLeft: 4,
    fontFamily: "baloo 2",
    color: colors.primary,
  },
  loadingText: {
    fontSize: 20,
    color: colors.primary,
    textAlign: "center",
    width: "100%",
  },
  container: {
    zIndex: -1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 24,
    paddingTop: 0,
  },
});

export default AudioPage;
