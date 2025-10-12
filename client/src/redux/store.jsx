import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import orgReducer from "./slices/orgSlice";
import notificationsReducer from "./slices/notificationsSlice";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orgs: orgReducer,
    notifications: notificationsReducer,
    chat: chatReducer,
  },
});

export default store;
