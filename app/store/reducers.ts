import { combineReducers } from '@reduxjs/toolkit'

import statsReducer from './features/statsSlice'
import settingsReducer from './features/settingsSlice'
import backgroundReducer from "./features/backgroundSlice";
import breathingSlice from "./features/breathingSlice";
import tutorialSlice from "./features/tutorialSlice";
import tapesSlice from "./features/tapesSlice";

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  stats: statsReducer,
  settings: settingsReducer,
  background: backgroundReducer,
  breathing: breathingSlice,
  tutorial: tutorialSlice,
  tapes: tapesSlice
})

export default rootReducer
