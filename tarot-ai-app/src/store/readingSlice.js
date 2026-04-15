import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient.js";

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
 * @property {string|null} savedEntryId
 */

const initialState = {
  selectedSpread: null, // { id, name, description, positions[] }
  intention: "", // empty string = no intention
  drawnCards: [], // DrawnCard[]
  interpretations: [], // [{ positionIndex, text }]
  summaryInterpretation: null,
  journalingPrompts: [], // string[] (exactly 3 after AI response)
  status: "idle", // 'idle' | 'drawing' | 'interpreting' | 'saving' | 'done' | 'error'
  error: null,
  savedEntryId: null, // UUID of saved journal_entry
};

// Async thunk: call Supabase Edge Function /interpret
export const fetchInterpretation = createAsyncThunk(
  "reading/fetchInterpretation",
  async (
    { spreadId, intention, drawnCards, previousInterpretationIds },
    { dispatch, rejectWithValue },
  ) => {
    const TIMEOUT_MS = 30_000;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Interpretation timed out")),
        TIMEOUT_MS,
      ),
    );

    const invokePromise = supabase.functions.invoke("interpret", {
      body: {
        spreadId,
        intention,
        drawnCards: drawnCards.map((dc) => ({
          cardName: dc.card.name,
          reversed: dc.reversed,
          positionLabel: dc.position.label,
          positionDescription: dc.position.description,
        })),
        previousInterpretationIds,
      },
    });

    let result;
    try {
      result = await Promise.race([invokePromise, timeoutPromise]);
    } catch (err) {
      return rejectWithValue(err.message || "Interpretation failed");
    }

    const { data, error } = result;

    if (error) {
      return rejectWithValue(error.message || "Interpretation failed");
    }

    const { cardInterpretations, summaryInterpretation, journalingPrompts } =
      data;

    // Dispatch appendInterpretation for each card interpretation
    if (Array.isArray(cardInterpretations)) {
      for (const item of cardInterpretations) {
        dispatch(
          appendInterpretation({
            positionIndex: item.positionIndex,
            chunk: item.text,
          }),
        );
      }
    }

    return { summaryInterpretation, journalingPrompts };
  },
);

// Async thunk: save reading to Supabase
export const saveReading = createAsyncThunk(
  "reading/saveReading",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().reading;
    const {
      selectedSpread,
      intention,
      drawnCards,
      interpretations,
      summaryInterpretation,
      journalingPrompts,
    } = state;

    // Insert journal_entry row
    const { data: entryData, error: entryError } = await supabase
      .from("journal_entries")
      .insert({
        spread_id: selectedSpread?.id ?? null,
        intention: intention || null,
        summary_interpretation: summaryInterpretation,
        journaling_prompts: journalingPrompts,
        user_notes: null,
        prompt_responses: {},
      })
      .select()
      .single();

    if (entryError) {
      return rejectWithValue(
        entryError.message || "Failed to save journal entry",
      );
    }

    const journalEntryId = entryData.id;

    // Insert drawn_cards rows
    const drawnCardRows = drawnCards.map((dc, i) => ({
      journal_entry_id: journalEntryId,
      card_id: dc.card.id,
      position_index: dc.position.index,
      reversed: dc.reversed,
      interpretation: interpretations[i]?.text ?? null,
    }));

    const { error: cardsError } = await supabase
      .from("drawn_cards")
      .insert(drawnCardRows);

    if (cardsError) {
      return rejectWithValue(
        cardsError.message || "Failed to save drawn cards",
      );
    }

    return { id: journalEntryId };
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
      state.status = "drawing";
    },
    appendInterpretation(state, action) {
      const { positionIndex, chunk } = action.payload;
      const existing = state.interpretations.find(
        (i) => i.positionIndex === positionIndex,
      );
      if (existing) {
        existing.text += chunk;
      } else {
        state.interpretations.push({ positionIndex, text: chunk });
      }
    },
    resetReading() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // fetchInterpretation lifecycle
    builder
      .addCase(fetchInterpretation.pending, (state) => {
        state.status = "interpreting";
        state.error = null;
      })
      .addCase(fetchInterpretation.fulfilled, (state, action) => {
        state.summaryInterpretation = action.payload.summaryInterpretation;
        state.journalingPrompts = action.payload.journalingPrompts ?? [];
        state.status = "done";
      })
      .addCase(fetchInterpretation.rejected, (state, action) => {
        state.status = "error";
        state.error =
          action.payload ?? action.error?.message ?? "Unknown error";
      });

    // saveReading lifecycle
    builder
      .addCase(saveReading.pending, (state) => {
        state.status = "saving";
        state.error = null;
      })
      .addCase(saveReading.fulfilled, (state, action) => {
        state.savedEntryId = action.payload.id;
        state.status = "done";
      })
      .addCase(saveReading.rejected, (state, action) => {
        state.status = "error";
        state.error =
          action.payload ?? action.error?.message ?? "Unknown error";
      });
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
