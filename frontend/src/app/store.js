import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../redux/authSlice";

const persisted = persistReducer({ key: "jobportal", storage }, authReducer);

export const store = configureStore({
  reducer: { auth: persisted },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);
