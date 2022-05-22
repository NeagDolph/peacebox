import TrackPlayer, { Capability, RepeatMode } from "react-native-track-player";
import { store } from "../store/store";
import { playAudio } from "../helpers/playAudio";


module.exports = async function() {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section


  TrackPlayer.addEventListener("remote-next", () => {
    TrackPlayer.skipToNext().catch(console.log);

    const state = store.getState()
    // @ts-ignore
    const currentData = state.tapes.currentlyPlaying;
    const nextPart = Math.min(currentData.part + 1, currentData.totalParts - 1)

    playAudio({...currentData, part: nextPart})
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    TrackPlayer.play().then(() => {
      TrackPlayer.seekTo(0);
    });

  });

  TrackPlayer.addEventListener('remote-seek', ({position}) => {
    TrackPlayer.seekTo(position)
  })


  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
  TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());

  await TrackPlayer.setRepeatMode(RepeatMode.Off)

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
