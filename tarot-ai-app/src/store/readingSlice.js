import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * @typedef {Object} ReadingState
 * @property {Object|null} selectedSpread
 * @property {string} intention
 * @property {Array} drawnCards
 * @property {Array<{positionIndex: number, text: string}>} interpretations
 * @property {string|null} summaryInterpretation
 * @property {string[]} journalingPrompts
 * @property {'idle'|'drawing'|'interpreting'|'saving'|'done'|'error'} status
 * @property {string|null} error
 */

const initialState = {
  selectedSpread: null,
  intention: "",
  drawnCards: [],
  interpretations: [],
  summaryInterpretation: null,
  journalingPrompts: [],
  status: "idle",
  error: null,
};

export const fetchInterpretation = createAsyncThunk(
  "reading/fetchInterpretation",
  async (
    { spreadId, intention, drawnCards },
    { dispatch, rejectWithValue },
  ) => {
    // TODO: calls Supabase Edge Function /interpret with streaming
  },
);

export const saveReading = createAsyncThunk(
  "reading/saveReading",
  async (_, { getState, rejectWithValue }) => {
    // TODO: reads readingSlice state, writes to Supabase journal_entries + drawn_cards
  },
);

const readingSlice = createSlice({
  name: "reading",
  initialState,
  reducers: {
    setSpread(state, action) {
      state.selectedSpread = action.payload;
    },
    setIntention(state, action) {
      const val = action.payload;
      state.intention = typeof val === "string" && val.trim() === "" ? "" : val;
    },
    setDrawnCards(state, action) {
      state.drawnCards = action.payload;
    },
    appendInterpretation(state, action) {
      const { positionIndex, text } = action.payload;
      const existing = state.interpretations.find(
        (i) => i.positionIndex === positionIndex,
      );
      if (existing) {
        existing.text += text;
      } else {
        state.interpretations.push({ positionIndex, text });
      }
    },
    resetReading() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // handle fetchInterpretation, saveReading lifecycle
  },
});

export const {
  setSpread,
  setIntention,
  setDrawnCards,
  appendInterpretation,
  resetReading,
} = readingSlice.actions;
export default readingSlice.reducer;
