import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/uiSlice.js";
import PostSlice from "../features/postSlice";
import AuthSlice from "../features/authSlice.js";
import interactions from "../features/interactions.js";
import notifications from "../features/notificationsSlice.js";
const store = configureStore({
  reducer: {
    ui: uiReducer,
    posts: PostSlice,
    auth: AuthSlice,
    interactions: interactions,
    notifications: notifications,
  },
});

export default store;
