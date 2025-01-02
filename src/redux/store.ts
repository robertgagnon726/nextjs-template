import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import { appReducer } from './slices/app-slice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';

// Configuration for Redux Persist
const persistConfig = {
  key: 'root', // Key for localStorage
  version: 1, // Version for state migrations (if needed)
  storage, // Use localStorage
};

const rootReducer = combineReducers({
  app: appReducer, // Add roles reducer to root
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Redux Store
export const store = configureStore({
  reducer: persistedReducer, // Use persisted reducer
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore these redux-persist actions
      },
    }),
});

// Persistor for Redux Persist
export const persistor = persistStore(store);

// Hooks for useDispatch and useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
