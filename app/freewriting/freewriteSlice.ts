import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const freewriteSlice = createSlice({
  name: 'freewriteStore',
  initialState: {height: 0, content: ""},
  reducers: {
    setHeight: (state, height) => {
      state.height = height.payload;
    },
    setContent: (state, content) => {
      state.content = content.payload
    }
  }
})

export const { setContent, setHeight } = freewriteSlice.actions
export default freewriteSlice.reducer
