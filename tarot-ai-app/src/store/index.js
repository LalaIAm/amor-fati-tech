import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import readingReducer from "./readingSlice.js";
import journalReducer from "./journalSlice.js";
import dashboardReducer from "./dashboardSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reading: readingReducer,
    journal: journalReducer,
    dashboard: dashboardReducer,
  },
});
