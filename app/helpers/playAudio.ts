import {store} from "../store/store";
import {setCurrent} from "../store/features/tapesSlice";
import TrackPlayer from "react-native-track-player";
import RNFS from "react-native-fs";
import RNBackgroundDownloader from "react-native-background-downloader";


export const playAudio = async({part, partData, tapeName, set, tapeNum, totalParts}) => {
  const state = store.getState()

  const downloadData = state.tapes?.[set.name]?.[tapeNum]?.downloads
  const fileUrl = downloadData?.[part]

  const partArray = ["Part A", "Part B", "Part C"]

  const partName = totalParts >= 2 ? partArray[part] : ""

  const trackData = {
    url: `${RNBackgroundDownloader.directories.documents}/${fileUrl.location}`,
    title: tapeName + " " + partName,
    artist: 'Richard L. Johnson',
    album: set.name,
    artwork: require("../assets/icon.png"),
    genre: 'Sleep Meditation',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    duration: partData[part].time.split(':').reduce((acc, time) => (60 * acc) + +time)
  };

  store.dispatch(setCurrent({
    part,
    partData,
    tapeName,
    set,
    tapeNum,
    totalParts,
    artist: trackData.artist
  }))

  // TrackPlayer.reset()
  await TrackPlayer.add([trackData])
  await TrackPlayer.play();

  if (totalParts >= 2) {
    const otherPart = part >= totalParts - 1 ? part - 1 : part + 1
    const fileUrl = downloadData?.[otherPart]

    const partName = partArray[otherPart]

    const trackData = {
      url: `${RNBackgroundDownloader.directories.documents}/${fileUrl.location}`,
      title: tapeName + " " + partName,
      artist: 'Richard L. Johnson',
      album: set.name,
      artwork: require("../assets/icon.png"),
      genre: 'Sleep Meditation',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      duration: partData[otherPart].time.split(':').reduce((acc, time) => (60 * acc) + +time)
    };

    await TrackPlayer.add([trackData], otherPart < part ? 0 : undefined)
  }

  return
}
