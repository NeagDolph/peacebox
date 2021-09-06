import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {},
  reducers: {
    setSetting: (state, {payload}) => {
      state[payload.setting] = payload.value
    },
    decrementSetting: (state, {payload}) => {
      if (state[payload.setting]) {
        state[payload.setting]--;
      } else state[payload.setting] = -1
    },
    incrementSetting: (state, {payload}) => {
      if (state[payload.setting]) {
        state[payload.setting]++;
      } else state[payload.setting] = 1
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSetting, decrementSetting, incrementSetting } = settingsSlice.actions

export default settingsSlice.reducer
