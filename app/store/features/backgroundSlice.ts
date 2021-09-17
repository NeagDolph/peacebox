import { createSlice } from '@reduxjs/toolkit'
import {contrastColor} from 'contrast-color';

export const backgroundSlice = createSlice({
  name: 'background',
  initialState: {
    url: false,
    lastSetTime: 0,
    credits: {
      name: "hello",
      link: ""
    },
    color: "#FFFFFF",
    textColor: "#000000"
  },
  reducers: {
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setTime: (state, action) => {
      state.lastSetTime = action.payload
    },
    setCredits: (state, action) => {
      state.credits = {
        link: action.payload.html + "?utm_source=stoical&utm_medium=referral",
        name: action.payload.name
      }
    },
    setColor: (state, action) => {
      state.color = action.payload
    },
    setBackgroundData: (state, action) => {
      state.color = action.payload.color;
      state.url = action.payload.urls.raw;
      state.credits = {
        link: action.payload.links.html + "?utm_source=stoical&utm_medium=referral",
        name: action.payload.user.name
      };
      state.textColor = contrastColor({ bgColor: action.payload.color });
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUrl, setTime, setCredits, setColor, setBackgroundData } = backgroundSlice.actions

export default backgroundSlice.reducer
