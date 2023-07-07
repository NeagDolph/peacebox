import {combineReducers} from '@reduxjs/toolkit';

import statsReducer from './features/statsSlice';
import settingsReducer from './features/settingsSlice';
import backgroundReducer from './features/backgroundSlice';
import breathingSlice from './features/breathingSlice';
import tutorialSlice from './features/tutorialSlice';
import tapesSlice from './features/tapesSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const tapesPersistConfig = {
  key: 'tapes',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['queue'],
};

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  stats: statsReducer,
  settings: settingsReducer,
  background: backgroundReducer,
  breathing: breathingSlice,
  tutorial: tutorialSlice,
  tapes: tapesSlice,
  // tapes: persistReducer(tapesPersistConfig, tapesSlice)
});

export default rootReducer;
