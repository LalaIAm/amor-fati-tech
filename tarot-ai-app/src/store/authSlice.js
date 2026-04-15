import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient.js";

/**
 * @typedef {Object} AuthState
 * @property {Object|null} session - Supabase session object
 * @property {Object|null} user - Supabase user object
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return rejectWithValue(error.message);
    return data;
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return rejectWithValue(error.message);
    return data;
  },
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) return rejectWithValue(error.message);
  },
);

export const signInWithOAuth = createAsyncThunk(
  "auth/signInWithOAuth",
  async ({ provider }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) return rejectWithValue(error.message);
    return data;
  },
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { dispatch, rejectWithValue }) => {
    const { error } = await supabase.rpc("delete_user");
    if (error) return rejectWithValue(error.message);
    dispatch(clearSession());
  },
);

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
    // signIn
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.session = action.payload.session;
        state.user = action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // signUp
    builder
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.session = action.payload.session;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // signOut
    builder
      .addCase(signOut.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = "succeeded";
        state.session = null;
        state.user = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // signInWithOAuth
    builder
      .addCase(signInWithOAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInWithOAuth.fulfilled, (state) => {
        // OAuth redirects the browser; session is set later via setSession
        state.status = "succeeded";
      })
      .addCase(signInWithOAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // deleteAccount
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = "succeeded";
        state.session = null;
        state.user = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
