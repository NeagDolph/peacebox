import { createSlice } from "@reduxjs/toolkit";

export const tapesSlice = createSlice({
  name: "settings",
  initialState: {
    queue: [],
    lastViewed: {},
    favorites: [],
    audioData: {},
    currentlyPlaying: {},
    downloadData: {}
  },
  reducers: {
    setCurrent: (state, { payload }) => {
      state.currentlyPlaying = payload;
    },
    setAudioData: (state, { payload: { audioData } }) => {
      state.audioData = audioData;
    },
    setViewed: (state, { payload: { set, tape, part, viewed = true } }) => {
      // if (!state[set]) state[set] = Array(tape + 1).fill(undefined);
      // if (!state[set][tape]) state[set][tape] = {};
      // if (!state[set][tape].parts) state[set][tape].parts = [false, false];
      state.downloadData[set][tape].downloads[part].viewed = viewed;

      state.lastViewed = { set, tape, part, timestamp: Date.now() };
    },
    setDownload: (state, { payload: { set, tape, part, location, downloadState, progress } }) => {
      // if (!state[set]) state[set] = Array(tape + 1).fill(undefined);
      // if (!state[set][tape]) state[set][tape] = {};
      // if (!state[set][tape].downloads) state[set][tape].downloads = Array(2).fill({
      //   location: "",
      //   downloadState: 0,
      //   progress: 0
      // });
      state.downloadData[set][tape].downloads[part] = {
        ...state.downloadData[set][tape].downloads[part],
        location,
        downloadState,
        progress
      };
    },
    setProgress: (state, { payload: { set, tape, part, progress } }) => {
      state.downloadData[set][tape].downloads[part].progress = progress;
    },
    setDownloaded: (state, { payload: { set, tape, part } }) => {
      state.downloadData[set][tape].downloads[part].downloadState = 3;
      state.downloadData[set][tape].downloads[part].progress = 100;
    },
    deleteTape: (state, { payload: { tape, set } }) => {
      for (let i in state.downloadData[set][tape].downloads) {
        state.downloadData[set][tape].downloads[i].downloadState = 0;
        state.downloadData[set][tape].downloads[i].progress = 0;
      }
    },
    setFavorite: (state, { payload: { set, favorite } }) => {
      const favoriteIndex = state.favorites.indexOf(set);
      if (favoriteIndex === -1 && favorite) {
        state.favorites.push(set);
      }

      if (favoriteIndex > -1 && !favorite) {
        state.favorites.splice(favoriteIndex, 1);
      }
    },
    queueDownload: (state, { payload: { set, tape } }) => {
      state.queue.push({
        set,
        tape
      });
    },
    shiftDownload: (state, { payload: { amount } }) => {
      state.queue.splice(0, amount ?? 1);
    },
    removeFromQueue: (state, { payload: { set, tape } }) => {
      if (tape) {
        state.queue = state.queue.filter(el => !(el.set.name === set && el.tape === tape));
      } else {
        state.queue = state.queue.filter(el => el.set.name !== set);
      }
    },
    setTapeData: (state, { payload }) => {
      state.downloadData = payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setViewed,
  setDownload,
  setProgress,
  setTapeData,
  setDownloaded,
  deleteTape,
  setAudioData,
  setCurrent,
  setFavorite,
  queueDownload,
  shiftDownload,
  removeFromQueue
} = tapesSlice.actions;

export default tapesSlice.reducer;
