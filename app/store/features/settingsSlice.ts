import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    freewriting: {
      showBackground: {
        name: "Show Background",
        value: false
      },
      showAnimations: {
        name: "Show Animations",
        value: true
      }
    },
    breathing: {

    },
    general: {

    }
  },
  reducers: {
    setSetting: (state, {payload}) => {
      state[payload.page][payload.setting].value = payload.value
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
export const { setSetting, decrementSetting, incrementSetting } = settingsSlice.actions

export default settingsSlice.reducer
