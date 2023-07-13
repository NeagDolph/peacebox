import { createStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import { PersistPartial } from "redux-persist/es/persistReducer";

import rootReducer from "./reducers";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: ["tutorial"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
