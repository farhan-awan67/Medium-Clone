import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

// get unread notification when user login
export const getAllUnreadNotifications = createAsyncThunk(
  "user/unreadNotifications",
  async ({ _ }, { rejectWithValue }) => {
    try {
      console.log("inside unread notification thunk");
      const res = await api.get(`/api/notifications/unread`);
      return res.data.notifications;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// mark specific notification read
export const markNotificationRead = createAsyncThunk(
  "user/notifications",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("inside mark read notification thunk");
      const res = await api.get(`/api/notifications/${id}/read`);
      console.log(res.data);
      return res.data.success;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const initialState = {
  userNotifications: [],
  read: null,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.userNotifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUnreadNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUnreadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.userNotifications = action.payload;
      })
      .addCase(getAllUnreadNotifications.rejected, (state, action) => {
        state.error = action.payload;
      })

      //   mark notification read
      .addCase(markNotificationRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading = false;
        state.read = action.payload;
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
