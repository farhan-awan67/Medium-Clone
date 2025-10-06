import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  authTab: "Login",
  showLogin: false,
};

// Create the slice
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

// Export actions correctly
export const { toggleLogin, setAuthTab } = uiSlice.actions;

// Export reducer as default
export default uiSlice.reducer;
