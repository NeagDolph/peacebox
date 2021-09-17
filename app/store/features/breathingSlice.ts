import { createSlice } from '@reduxjs/toolkit'
import {contrastColor} from 'contrast-color';

export const breathingSlice = createSlice({
  name: 'breathing',
  initialState: {
    patterns: {}
  },
  reducers: {
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
      if (state.patterns[action.payload.id]) state.patterns[action.payload.id].settings[action.payload.setting] = action.payload.value
    },
    setSequence: (state, action) => {
      if (state.patterns[action.payload.id]) state.patterns[action.payload.id].sequence = action.payload.sequence;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addPattern, editPattern, removePattern, setName, setSetting, setSequence } = breathingSlice.actions

export default breathingSlice.reducer
