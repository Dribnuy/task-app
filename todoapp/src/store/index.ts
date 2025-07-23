import { configureStore } from "@reduxjs/toolkit";
import { todoApi } from "./api";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    [todoApi.reducerPath]: todoApi.reducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
