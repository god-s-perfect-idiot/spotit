import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';

// Create persisted reducer
const persistedAuthReducer = persistReducer(
  {
    key: 'auth',
    storage,
    whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these fields
  },
  authReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore Firestore Timestamp fields in user data
        ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt', 'auth.user.birthdate', 'auth.user.lastPeriodStart'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

