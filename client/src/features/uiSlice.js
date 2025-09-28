import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  authTab: "Login",
  showLogin: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleLogin(state) {
      state.showLogin = !state.showLogin;
    },
    setAuthTab(state, action) {
      state.authTab = action.payload;
    },
  },
});
