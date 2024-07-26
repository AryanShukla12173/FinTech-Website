import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import authReducer from "./authSlice.js";
 
const persistConfig = {
  key: 'root',
  storage,
}
 
const persistedReducer = persistReducer(persistConfig, authReducer)

const store = configureStore({
    reducer: {
      auth: persistedReducer, // Ensure the reducer is set under the 'auth' key
    },
  });
const  persistor = persistStore(store)
export {persistor,store}