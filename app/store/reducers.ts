import { combineReducers } from '@reduxjs/toolkit'

import statsReducer from './features/statsSlice'
import settingsReducer from './features/settingsSlice'
import backgroundReducer from "./features/backgroundSlice";

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  stats: statsReducer,
  settings: settingsReducer,
  background: backgroundReducer
})

export default rootReducer
