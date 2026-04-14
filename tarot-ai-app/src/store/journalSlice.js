import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * @typedef {Object} JournalState
 * @property {Array} entries
 * @property {Object|null} selectedEntry
 * @property {'idle'|'loading'|'succeeded'|'failed'} status
 * @property {string|null} error
 */

const initialState = {
  entries: [],
  selectedEntry: null,
  status: "idle",
  error: null,
};

export const fetchJournalEntries = createAsyncThunk(
  "journal/fetchEntries",
  async (_, { rejectWithValue }) => {
    // TODO: queries Supabase journal_entries ordered by created_at DESC
  },
);

export const fetchJournalEntry = createAsyncThunk(
  "journal/fetchEntry",
  async (id, { rejectWithValue }) => {
    // TODO: queries single journal entry with drawn_cards join
  },
);

export const updateNotes = createAsyncThunk(
  "journal/updateNotes",
  async ({ id, notes }, { rejectWithValue }) => {
    // TODO: updates user_notes on journal_entries
  },
);

export const savePromptResponse = createAsyncThunk(
  "journal/savePromptResponse",
  async ({ id, promptIndex, response }, { rejectWithValue }) => {
    // TODO: merges into prompt_responses JSONB column
  },
);

export const deleteJournalEntry = createAsyncThunk(
  "journal/deleteEntry",
  async (id, { rejectWithValue }) => {
    // TODO: deletes from journal_entries (cascade removes drawn_cards)
  },
);

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    selectEntry(state, action) {
      state.selectedEntry = action.payload;
    },
  },
  extraReducers: (builder) => {
    // handle all async thunks
  },
});

export const { selectEntry } = journalSlice.actions;
export default journalSlice.reducer;
