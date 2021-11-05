import { createSlice } from '@reduxjs/toolkit'
import {contrastColor} from 'contrast-color';
import {act} from "react-test-renderer";

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState: {
    currentTutorial: "",
    breathing: {
      restart: false,
      running: false,
      maxCompletion: 5,
      completion: 0,
      slideHistory: [],
      open: false
    }
  },
  reducers: {
    guideNext: (state, action) => {
      state[action.payload].completion = state[action.payload].completion + 1
    },
    guideSet: (state, action) => {
      state[action.payload.section].completion = action.payload.value
    },
    addSlide: (state, action) => {
      state[action.payload.section].slideHistory.push(action.payload.slide)
    },
    openedTutorial: (state, action) => {
      state[action.payload].open = true;

      state[action.payload].running = true;
    },
    startTutorial: (state, action) => {
      state[action.payload].open = false;
      state.currentTutorial = action.payload;
      state[action.payload].completion = 0;
      state[action.payload].running = true;
    },
    closedTutorial: (state, action) => {
      state[action.payload].open = false;

      state[action.payload].running = false;
    },
    pushRestart: (state, action) => {
      state[action.payload.section].restart = action.payload.value
    },
    exitTutorial: (state, action) => {
      state[action.payload].open = false;
      state[action.payload].running = false;
    }
  },
})

// Action creators are generated for each case reducer function
export const { guideNext, guideSet, addSlide, closedTutorial, openedTutorial, startTutorial, pushRestart, exitTutorial } = tutorialSlice.actions

export default tutorialSlice.reducer
