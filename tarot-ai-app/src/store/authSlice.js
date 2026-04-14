import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * @typedef {Object} AuthState
 * @property {Object|null} session
 * @property {Object|null} user
 * @property {'idle'|'loading'|'succeeded'|'failed'} status
 * @property {string|null} error
 */

const initialState = {
  session: null,
  user: null,
  status: "idle",
  error: null,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    // TODO: calls supabase.auth.signInWithPassword(...)
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }, { rejectWithValue }) => {
    // TODO: calls supabase.auth.signUp(...)
  },
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  // TODO: calls supabase.auth.signOut()
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
    },
    clearSession(state) {
      state.session = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // handle pending/fulfilled/rejected for signIn, signUp, signOut
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
