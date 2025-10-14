import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/uiSlice.js";
import PostSlice from "../features/postSlice";
import AuthSlice from "../features/authSlice.js";
const store = configureStore({
  reducer: {
    ui: uiReducer,
    posts: PostSlice,
    auth: AuthSlice,
  },
});

export default store;
