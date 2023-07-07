import { createSlice } from "@reduxjs/toolkit";

export const backgroundSlice = createSlice({
  name: 'background',
  initialState: {
    lastSetTime: 0,
    credits: {
      name: "hello",
      link: ""
    },
    data: {}
  },
  reducers: {
    setBackgroundData: (state, action) => {
      state.data = action.payload
      state.credits = {
        link: action.payload.links.html + "?utm_source=stoical&utm_medium=referral",
        name: action.payload.user.name
      }
      state.lastSetTime = Date.now();
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUrl, setTime, setCredits, setColor, setBackgroundData } = backgroundSlice.actions

export default backgroundSlice.reducer
