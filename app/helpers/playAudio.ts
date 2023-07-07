import { store } from "../store/store";
import { setCurrent } from "../store/features/tapesSlice";
import TrackPlayer, { Capability } from "react-native-track-player";
import RNBackgroundDownloader from "react-native-background-downloader";


export const playAudio = async ({ part, partData, tapeName, set, tapeNum, totalParts }) => {
  const state = store.getState();

  const downloadData = state.tapes.downloadData[set.name][tapeNum].downloads;
  const fileUrl = downloadData?.[part];

  await TrackPlayer.updateOptions({
    // Media controls capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToPrevious,
      Capability.Stop,
      Capability.SeekTo
    ]
  });

  const partArray = ["Part A", "Part B", "Part C"];

  const partName = totalParts >= 2 ? partArray[part] : "";

  const trackData = {
    url: `${RNBackgroundDownloader.directories.documents}/${fileUrl.location}`,
    title: tapeName + " " + partName,
    artist: "Richard L. Johnson",
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

  await TrackPlayer.reset();
  await TrackPlayer.add([trackData]);
  await TrackPlayer.play();


}
