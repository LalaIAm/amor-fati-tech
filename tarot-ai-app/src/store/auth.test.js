// Feature: tarot-ai-app, Property 5: Auth round-trip
// Feature: tarot-ai-app, Property 6: Auth error conditions

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

beforeEach(() => {
  vi.clearAllMocks();
});

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

describe("Property 6: Auth error conditions", () => {
  /**
   * Validates: Requirements 1.3, 1.5
   *
   * For any valid email/password, when signUp returns a duplicate-email error,
   * dispatching signUp SHALL result in authSlice.status === 'failed' and
   * authSlice.session === null.
   */
  it("duplicate email registration sets status to failed and session remains null", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 8 }),
        async (email, password) => {
          supabase.auth.signUp.mockResolvedValue({
            data: null,
            error: { message: "User already registered" },
          });

          const store = makeStore();
          await store.dispatch(signUp({ email, password }));

          const state = store.getState().auth;
          expect(state.status).toBe("failed");
          expect(state.session).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 1.3, 1.5
   *
   * For any email/password combo where signInWithPassword returns an error,
   * dispatching signIn SHALL result in authSlice.status === 'failed' and
   * authSlice.session === null.
   */
  it("invalid credentials do not set a session and status is failed", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 8 }),
        async (email, password) => {
          supabase.auth.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: "Invalid login credentials" },
          });

          const store = makeStore();
          await store.dispatch(signIn({ email, password }));

          const state = store.getState().auth;
          expect(state.status).toBe("failed");
          expect(state.session).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });
});
