import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async ({ authTab, credentials }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/auth/${authTab}`, credentials);
      if (res.data.success) {
        const { user, token } = res.data; // ✅ Only return user object
        // ✅ Store token in localStorage for persistence
        if (token) {
          localStorage.setItem("token", token);
        }

        return { user, token };
      } else {
        return rejectWithValue("Authentication failed");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/auth/profile"); // endpoint must exist
      return res.data.user;
    } catch (err) {
      return rejectWithValue("Failed to fetch current user");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "update/userProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/profile", formData); // endpoint must exist
      return res.data.user;
    } catch (err) {
      return rejectWithValue("Failed to fetch current user");
    }
  }
);

const initialState = {
  user: {},
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: "",
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {};
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = "loading..";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token; // store token in redux state as well
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // get user profile
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = "loading..";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        // state.token = action.payload.token; // store token in redux state as well
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = "loading..";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        // state.token = action.payload.token; // store token in redux state as well
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
