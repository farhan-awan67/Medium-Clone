import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/uiSlice.js";
import PostSlice from "../features/postSlice";
const store = configureStore({
  reducer: {
    ui: uiReducer,
    posts: PostSlice,
  },
});

export default store;
