import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * @typedef {Object} DashboardState
 * @property {Array} recentEntries - last 3
 * @property {Array} frequentCards - top 3
 * @property {string|null} patternInsight - null if <5 readings
 * @property {number} totalReadings
 * @property {'idle'|'loading'|'succeeded'|'failed'} status
 * @property {string|null} error
 */

const initialState = {
  recentEntries: [],
  frequentCards: [],
  patternInsight: null,
  totalReadings: 0,
  status: "idle",
  error: null,
};

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  async (_, { rejectWithValue }) => {
    // TODO: queries recent entries, aggregates card frequencies, fetches latest pattern insight
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // handle fetchDashboard lifecycle
  },
});

export default dashboardSlice.reducer;
