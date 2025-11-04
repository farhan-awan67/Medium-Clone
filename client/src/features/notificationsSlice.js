import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

// get unread notification when user login
export const getAllUnreadNotifications = createAsyncThunk(
  "user/unreadNotifications",
  async (_, { rejectWithValue }) => {
    try {
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
      const res = await api.get(`/api/notifications/${id}/read`);
      return { id, read: res.data.success };
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// mark all notification as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "user/notification",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/notifications/mark-all-read`);
      return res.data;
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
        const { id, read } = action.payload;
        state.userNotifications = state.userNotifications.map((notifi) =>
          notifi._id === id ? { ...notifi, read: true } : notifi
        );
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // mark all notification as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.loading = false;
        // mark all notifications in Redux as read
        state.userNotifications = state.userNotifications.map((n) => ({
          ...n,
          read: true,
        }));
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
