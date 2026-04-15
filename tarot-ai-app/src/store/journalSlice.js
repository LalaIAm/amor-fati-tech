import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient.js";

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

/** Map a raw DB row (list view) to a camelCase JournalEntry */
function mapRowToEntry(row) {
  return {
    id: row.id,
    userId: row.user_id,
    spreadId: row.spread_id,
    spreadName: row.spreads?.name ?? null,
    intention: row.intention ?? null,
    summaryInterpretation: row.summary_interpretation,
    journalingPrompts: row.journaling_prompts ?? [],
    userNotes: row.user_notes ?? null,
    promptResponses: row.prompt_responses ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Map a raw DB row (detail view) to a full JournalEntry with drawnCards */
function mapRowToFullEntry(row) {
  const entry = mapRowToEntry(row);
  entry.drawnCards = (row.drawn_cards ?? []).map((dc) => ({
    id: dc.id,
    cardId: dc.card_id,
    position: dc.position,
    positionLabel: dc.position_label,
    isReversed: dc.is_reversed,
    interpretation: dc.interpretation,
  }));
  return entry;
}

export const fetchJournalEntries = createAsyncThunk(
  "journal/fetchEntries",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*, spreads(name)")
      .order("created_at", { ascending: false });

    if (error) return rejectWithValue(error.message);
    return data.map(mapRowToEntry);
  },
);

export const fetchJournalEntry = createAsyncThunk(
  "journal/fetchEntry",
  async (id, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*, spreads(name), drawn_cards(*)")
      .eq("id", id)
      .single();

    if (error) return rejectWithValue(error.message);
    return mapRowToFullEntry(data);
  },
);

export const updateNotes = createAsyncThunk(
  "journal/updateNotes",
  async ({ id, notes }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .update({ user_notes: notes, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return { id, notes, updatedAt: data.updated_at };
  },
);

export const savePromptResponse = createAsyncThunk(
  "journal/savePromptResponse",
  async ({ id, promptIndex, response }, { rejectWithValue }) => {
    // Fetch current prompt_responses first, then merge
    const { data: current, error: fetchError } = await supabase
      .from("journal_entries")
      .select("prompt_responses")
      .eq("id", id)
      .single();

    if (fetchError) return rejectWithValue(fetchError.message);

    const merged = {
      ...(current.prompt_responses ?? {}),
      [promptIndex]: response,
    };

    const { data, error } = await supabase
      .from("journal_entries")
      .update({
        prompt_responses: merged,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return { id, promptResponses: merged, updatedAt: data.updated_at };
  },
);

export const deleteJournalEntry = createAsyncThunk(
  "journal/deleteEntry",
  async (id, { rejectWithValue }) => {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    return id;
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
    // fetchJournalEntries
    builder
      .addCase(fetchJournalEntries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries = [...action.payload].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // fetchJournalEntry
    builder
      .addCase(fetchJournalEntry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJournalEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedEntry = action.payload;
      })
      .addCase(fetchJournalEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // updateNotes
    builder
      .addCase(updateNotes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, notes, updatedAt } = action.payload;
        if (state.selectedEntry?.id === id) {
          state.selectedEntry.userNotes = notes;
          state.selectedEntry.updatedAt = updatedAt;
        }
        const entry = state.entries.find((e) => e.id === id);
        if (entry) {
          entry.userNotes = notes;
          entry.updatedAt = updatedAt;
        }
      })
      .addCase(updateNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // savePromptResponse
    builder
      .addCase(savePromptResponse.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(savePromptResponse.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, promptResponses, updatedAt } = action.payload;
        if (state.selectedEntry?.id === id) {
          state.selectedEntry.promptResponses = promptResponses;
          state.selectedEntry.updatedAt = updatedAt;
        }
      })
      .addCase(savePromptResponse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // deleteJournalEntry
    builder
      .addCase(deleteJournalEntry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        const id = action.payload;
        state.entries = state.entries.filter((e) => e.id !== id);
        if (state.selectedEntry?.id === id) {
          state.selectedEntry = null;
        }
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { selectEntry } = journalSlice.actions;
export default journalSlice.reducer;
