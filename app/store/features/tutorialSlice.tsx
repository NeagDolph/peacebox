import { createSlice } from '@reduxjs/toolkit'
import {contrastColor} from 'contrast-color';
import {act} from "react-test-renderer";

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState: {
    currentTutorial: "",
    breathing: {
      restart: false,
      running: false, //True when tooltip visible, false when not visible
      completion: 0,
      slideHistory: [],
      open: false, //True when tutorial starts, false when tutorial stops
      lastAction: Date.now(),
      createdPattern: undefined
    }

  },
  reducers: {
    guideNext: (state, action) => {
      state[action.payload].completion = state[action.payload].completion + 1;
      state[action.payload].lastAction = Date.now();
      state[action.payload].running = true;
    },
    guideSet: (state, action) => {
      state[action.payload.section].completion = action.payload.value
    },
    addSlide: (state, action) => {
      state[action.payload.section].slideHistory.push(action.payload.slide)
    },
    openedTutorial: (state, action) => {
      state[action.payload].running = true;
    },
    startTutorial: (state, action) => {
      state[action.payload].open = true;
      state.currentTutorial = action.payload;
      state[action.payload].completion = 0;
      state[action.payload].running = true;


      // state[action.payload].completion = 5;
      // state[action.payload].createdPattern = "7b08753a-665c-4da3-aa45-f61515098bd9";
    },
    closedTutorial: (state, action) => {
      state[action.payload].running = false;
    },
    pushRestart: (state, action) => {
      state[action.payload.section].restart = action.payload.value
    },
    exitTutorial: (state, action) => {
      state[action.payload].open = false;
      state[action.payload].running = false;
    },
    setCreatedPattern: (state, action) => {
      state.breathing.createdPattern = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { guideNext, guideSet, addSlide, closedTutorial, openedTutorial, startTutorial, pushRestart, exitTutorial, setCreatedPattern } = tutorialSlice.actions

export default tutorialSlice.reducer
