import { createStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from "@react-native-async-storage/async-storage";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'

import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
