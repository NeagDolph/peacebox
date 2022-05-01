import { createSlice } from '@reduxjs/toolkit'

export const tapesSlice = createSlice({
  name: 'settings',
  initialState: {},
  reducers: {
    setViewed: (state, {payload: {set, tape, part, viewed=true}}) => {
      if (!state[set]) state[set] = Array(tape + 1).fill(undefined);
      if (!state[set][tape]) state[set][tape] = {}
      if (!state[set][tape].parts) state[set][tape].parts = [false, false, false, false]
      state[set][tape].parts[part] = viewed
    },
  },
})

// Action creators are generated for each case reducer function
export const { setViewed } = tapesSlice.actions

export default tapesSlice.reducer
