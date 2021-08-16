import { configureStore, createSlice } from '@reduxjs/toolkit'

const freewriteSlice = createSlice({
  name: 'freewriteStore',
  initialState: {text: ""},
  reducers: {
    modifyText: (state, text: string) => {
      state.text = text;
    }
  }
})

export default configureStore({
  reducer: {
    freewrite: freewriteSlice.reducer
  }
})
