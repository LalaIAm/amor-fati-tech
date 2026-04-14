// Feature: tarot-ai-app, Property 5: Auth round-trip

import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import * as fc from "fast-check";
import authReducer, { signUp, signIn } from "./authSlice.js";

// Mock the supabase client
vi.mock("../supabaseClient.js", () => {
  const mockSignUp = vi.fn();
  const mockSignInWithPassword = vi.fn();
  return {
    supabase: {
      auth: {
        signUp: mockSignUp,
        signInWithPassword: mockSignInWithPassword,
        signOut: vi.fn(),
        signInWithOAuth: vi.fn(),
      },
    },
  };
});

// Import the mocked supabase after vi.mock is hoisted
import { supabase } from "../supabaseClient.js";

function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
}

describe("Property 5: Auth round-trip", () => {
  /**
   * Validates: Requirements 1.2, 1.4
   *
   * For any valid email and password ≥8 chars, registering then signing in
   * SHALL produce a non-null session and user in authSlice.
   */
  it("registers then signs in and produces non-null session and user", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 8 }),
        async (email, password) => {
          const mockUser = { id: "user-123", email };
          const mockSession = { access_token: "token-abc", user: mockUser };

          // Reset mocks for each iteration
          supabase.auth.signUp.mockResolvedValue({
            data: { session: mockSession, user: mockUser },
            error: null,
          });
          supabase.auth.signInWithPassword.mockResolvedValue({
            data: { session: mockSession, user: mockUser },
            error: null,
          });

          const store = makeStore();

          await store.dispatch(signUp({ email, password }));
          await store.dispatch(signIn({ email, password }));

          const state = store.getState().auth;

          expect(state.session).not.toBeNull();
          expect(state.user).not.toBeNull();
          expect(state.status).toBe("succeeded");
        },
      ),
      { numRuns: 100 },
    );
  });
});
