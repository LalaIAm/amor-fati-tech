import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient.js";

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
    // 1. Query recent 3 journal entries
    const { data: entriesData, error: entriesError } = await supabase
      .from("journal_entries")
      .select("id, spread_id, intention, created_at, spreads(name)")
      .order("created_at", { ascending: false })
      .limit(3);

    if (entriesError) return rejectWithValue(entriesError.message);

    const recentEntries = entriesData.map((row) => ({
      id: row.id,
      spreadId: row.spread_id,
      spreadName: row.spreads?.name ?? null,
      intention: row.intention ?? null,
      createdAt: row.created_at,
    }));

    // 2. Query total reading count
    const { count, error: countError } = await supabase
      .from("journal_entries")
      .select("id", { count: "exact", head: true });

    if (countError) return rejectWithValue(countError.message);

    const totalReadings = count ?? 0;

    // 3. Query all drawn_cards to compute card frequencies
    const { data: drawnData, error: drawnError } = await supabase
      .from("drawn_cards")
      .select("card_id, journal_entries!inner(user_id)");

    if (drawnError) return rejectWithValue(drawnError.message);

    const cardCounts = {};
    for (const row of drawnData) {
      const id = row.card_id;
      cardCounts[id] = (cardCounts[id] ?? 0) + 1;
    }

    const frequentCards = Object.entries(cardCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cardId, count]) => ({
        card: { id: cardId, name: "Card " + cardId },
        count,
      }));

    // 4. Fetch latest pattern insight if totalReadings >= 5
    let patternInsight = null;
    if (totalReadings >= 5) {
      const { data: insightData } = await supabase
        .from("pattern_insights")
        .select("insight_text")
        .order("generated_at", { ascending: false })
        .limit(1)
        .single();

      patternInsight = insightData?.insight_text ?? null;
    }

    return { recentEntries, frequentCards, patternInsight, totalReadings };
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recentEntries = action.payload.recentEntries;
        state.frequentCards = action.payload.frequentCards;
        state.patternInsight = action.payload.patternInsight;
        state.totalReadings = action.payload.totalReadings;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export function getRecentEntries(state) {
  return state.dashboard.recentEntries;
}

export function getFrequentCards(state) {
  return state.dashboard.frequentCards;
}

export default dashboardSlice.reducer;
