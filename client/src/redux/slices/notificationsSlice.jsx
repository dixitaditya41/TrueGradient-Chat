import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Fetch all notifications for current user
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/notifications");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.patch("/notifications/mark-all-read");
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark notifications as read");
    }
  }
);

// Mark specific notification as read
export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark notification as read");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { 
    items: [], 
    unreadCount: 0,
    loading: false,
    error: null
  },
  reducers: {
            addNotification(state, action) {
              state.items.unshift(action.payload);
              state.unreadCount += 1;
            },
    markAllReadLocal(state) {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    markReadLocal(state, action) {
      const id = action.payload;
      const note = state.items.find((n) => n._id === id);
      if (note && !note.read) {
        note.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    setNotifications(state, action) {
      state.items = action.payload;
      state.unreadCount = state.items.filter((n) => !n.read).length;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
              .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.unreadCount = action.payload.filter((n) => !n.read).length;
              })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.items.find((n) => n._id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  }
});

export const { addNotification, markAllReadLocal, markReadLocal, setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
