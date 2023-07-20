import TrackPlayer, { Capability, Event, RepeatMode } from "react-native-track-player";
import { store } from "../store/store";
import { playAudio } from "../helpers/playAudio";


module.exports = async function() {
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext().catch(console.log);

    const tapeData = store.getState().tapes;

    const currentData = tapeData.currentlyPlaying;
    const nextPart = Math.min(currentData.part + 1, currentData.totalParts - 1);

    playAudio({ ...currentData, part: nextPart });
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.play().then(() => {
      TrackPlayer.seekTo(0);
    });

  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    TrackPlayer.seekTo(position);
  });


  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.destroy());

  await TrackPlayer.setRepeatMode(RepeatMode.Off);

  await TrackPlayer.updateOptions({
    // Media controls capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToPrevious,
      Capability.Stop,
      Capability.SeekTo
    ],
  })
}
