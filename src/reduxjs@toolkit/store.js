import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';
import thunk from 'redux-thunk';

import paperBillSlice from './paperBillSlice';
import settingsSlice from './settingsSlice';
import printSlice from './printSlice';

const rootReducer = combineReducers({
  paperBill: paperBillSlice,
  settings: settingsSlice,
  print: printSlice,
});
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['paperBill'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk].concat(
    createStateSyncMiddleware({
      blacklist: ['persist/PERSIST', 'persist/REHYDRATE'],
    }),
  ),
});
initMessageListener(store);
export const persistor = persistStore(store);
