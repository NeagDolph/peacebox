import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {State} from "react-native-paper/lib/typescript/components/TextInput/types";
import {AppState} from "react-native";
import freewriteReducer from "./freewriting/freewriteSlice"


export default configureStore({
  reducer: {
    freewriteHeight: freewriteReducer
  }
})
