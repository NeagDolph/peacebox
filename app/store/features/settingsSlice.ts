import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    freewriting: {
      used: false,
      showBackground: true,
      showAnimations: true
    },
    breathing: {
      used: false,
      narrate: true,
      showAnimations: true
    },
    general: {
      used: false
    }
  },
  reducers: {
    setUsed: (state, {payload}) => {
      state[payload].used = true
    },
    setSetting: (state, {payload}) => {
      state[payload.page][payload.setting] = payload.value
    },
    decrementSetting: (state, {payload}) => {
      const settingList = payload.setting.split(".")

      if (state[settingList[0]][settingList[1]]) {
        state[settingList[0]][settingList[1]]--;
      } else state[settingList[0]][settingList[1]] = -1
    },
    incrementSetting: (state, {payload}) => {
      const settingList = payload.setting.split(".")
      if (state[settingList[0]][settingList[1]]) {
        state[settingList[0]][settingList[1]]++;
      } else state[settingList[0]][settingList[1]] = 1
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSetting, decrementSetting, incrementSetting, setUsed } = settingsSlice.actions

export default settingsSlice.reducer
