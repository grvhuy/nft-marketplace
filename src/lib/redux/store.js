import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createWebStorage from 'redux-persist/es/storage/createWebStorage';
import cart from "./feature/slice/cart"

const rootReducer = combineReducers({
  // Add your reducers here
  cart: cart,
});

function createPersistStore() {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      },
    };
  }
  return createWebStorage("local");
}

const storage = typeof window !== "undefined"
  ? createWebStorage("local")
  : createPersistStore();

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
