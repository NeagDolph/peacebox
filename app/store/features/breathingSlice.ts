import { createSlice } from '@reduxjs/toolkit'
import {contrastColor} from 'contrast-color';

export const breathingSlice = createSlice({
  name: 'breathing',
  initialState: {
    currentDuration: 0,
    patterns: {}
  },
  reducers: {
    setDuration: (state, action) => {
      state.currentDuration = action.payload
    },
    setTotalDuration: (state, action) => {
      const {total, id} = action.payload
      state.patterns[id].totalDuration = total;
    },
    setDurationType: (state, action) => {
      const {type, id} = action.payload
      state.patterns[id].durationType = type;
    },
    addPattern: (state, action) => {
      state.patterns[action.payload.id] = action.payload
    },
    editPattern: (state, action) => {
      state.patterns[action.payload.id] = action.payload.new
    },
    removePattern: (state, action) => {
      delete state.patterns[action.payload]
    },
    setName: (state, action) => {
      const name = action.payload.name.length > 0 ? action.payload.name : "New Pattern"
      if (state.patterns[action.payload.id]) state.patterns[action.payload.id].name = name
    },
    setSetting: (state, action) => {
      const {id, setting, value} = action.payload;
      if (state.patterns[id]) state.patterns[id].settings[setting] = value;
    },
    setSequence: (state, action) => {
      const {id, sequence} = action.payload;
      if (state.patterns[id]) state.patterns[id].sequence = sequence;
    },
    setStart: (state, action) => {
      if (state.patterns[action.payload.id]) state.patterns[action.payload.id].startTime = action.payload.start;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addPattern, editPattern, removePattern, setName, setSetting, setSequence, setDuration, setTotalDuration, setDurationType, setStart} = breathingSlice.actions

export default breathingSlice.reducer
