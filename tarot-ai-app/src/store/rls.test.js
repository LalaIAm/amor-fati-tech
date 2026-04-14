// Feature: tarot-ai-app, Property 15: User data isolation

import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import * as fc from "fast-check";
import journalReducer, { fetchJournalEntries } from "./journalSlice.js";
import dashboardReducer, { fetchDashboard } from "./dashboardSlice.js";

// Mock the supabase client
vi.mock("../supabaseClient.js", () => {
  const mockFrom = vi.fn();
  return {
    supabase: {
      from: mockFrom,
    },
  };
});

import { supabase } from "../supabaseClient.js";

function makeStore() {
  return configureStore({
    reducer: {
      journal: journalReducer,
      dashboard: dashboardReducer,
    },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Build a mock supabase.from implementation that simulates RLS:
 * only rows where user_id === authenticatedUserId are returned.
 *
 * @param {string} authenticatedUserId - the currently authenticated user
 * @param {Array}  allJournalRows      - full set of journal_entries rows across all users
 * @param {Array}  allDrawnCardRows    - full set of drawn_cards rows across all users
 * @param {Array}  allInsightRows      - full set of pattern_insights rows across all users
 */
function buildRlsMock(
  authenticatedUserId,
  allJournalRows,
  allDrawnCardRows,
  allInsightRows,
) {
  // RLS-filtered views
  const visibleJournalRows = allJournalRows.filter(
    (r) => r.user_id === authenticatedUserId,
  );
  const visibleDrawnCardRows = allDrawnCardRows.filter((r) =>
    visibleJournalRows.some((j) => j.id === r.journal_entry_id),
  );
  const visibleInsightRows = allInsightRows.filter(
    (r) => r.user_id === authenticatedUserId,
  );

  const totalReadings = visibleJournalRows.length;

  supabase.from.mockImplementation((table) => {
    if (table === "journal_entries") {
      return {
        // fetchJournalEntries: .select("*, spreads(name)").order(...) → array
        select: vi.fn((cols, opts) => {
          // count query: { count: "exact", head: true }
          if (opts && opts.count === "exact") {
            return Promise.resolve({ count: totalReadings, error: null });
          }
          // list query (fetchJournalEntries): .select(...).order(...)
          return {
            order: vi.fn(() =>
              Promise.resolve({
                data: visibleJournalRows.map((r) => ({
                  ...r,
                  spreads: null,
                })),
                error: null,
              }),
            ),
            // dashboard recent entries: .select(...).order(...).limit(3)
            limit: vi.fn(() =>
              Promise.resolve({
                data: visibleJournalRows.slice(0, 3).map((r) => ({
                  ...r,
                  spreads: null,
                })),
                error: null,
              }),
            ),
          };
        }),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      };
    }

    if (table === "drawn_cards") {
      return {
        select: vi.fn(() =>
          Promise.resolve({
            data: visibleDrawnCardRows.map((r) => ({
              card_id: r.card_id,
              journal_entries: { user_id: authenticatedUserId },
            })),
            error: null,
          }),
        ),
      };
    }

    if (table === "pattern_insights") {
      const latest = visibleInsightRows[0] ?? null;
      return {
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(() =>
                Promise.resolve({
                  data: latest ? { insight_text: latest.insight_text } : null,
                  error: null,
                }),
              ),
            })),
          })),
        })),
      };
    }

    return {
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
  });
}

describe("Property 15: User data isolation", () => {
  /**
   * Validates: Requirements 9.3
   *
   * For any two distinct authenticated users A and B, all queries in user A's
   * session SHALL return zero rows belonging to user B, and vice versa.
   * The Supabase mock simulates RLS by only returning rows whose user_id
   * matches the authenticated user. The journalSlice and dashboardSlice must
   * never surface rows from another user.
   */
  it("journal entries fetched by user A contain no rows belonging to user B", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Two distinct user IDs
        fc.tuple(fc.uuid(), fc.uuid()).filter(([a, b]) => a !== b),
        // Journal entries for user A (1–5 rows)
        fc.array(
          fc.record({
            id: fc.uuid(),
            spread_id: fc.constantFrom("single", "three-card", "celtic-cross"),
            intention: fc.option(fc.string({ maxLength: 100 }), { nil: null }),
            summary_interpretation: fc.constant(null),
            journaling_prompts: fc.constant([]),
            user_notes: fc.constant(null),
            prompt_responses: fc.constant({}),
            created_at: fc.constant(new Date().toISOString()),
            updated_at: fc.constant(new Date().toISOString()),
          }),
          { minLength: 1, maxLength: 5 },
        ),
        // Journal entries for user B (1–5 rows)
        fc.array(
          fc.record({
            id: fc.uuid(),
            spread_id: fc.constantFrom("single", "three-card", "celtic-cross"),
            intention: fc.option(fc.string({ maxLength: 100 }), { nil: null }),
            summary_interpretation: fc.constant(null),
            journaling_prompts: fc.constant([]),
            user_notes: fc.constant(null),
            prompt_responses: fc.constant({}),
            created_at: fc.constant(new Date().toISOString()),
            updated_at: fc.constant(new Date().toISOString()),
          }),
          { minLength: 1, maxLength: 5 },
        ),
        async ([userA, userB], entriesA, entriesB) => {
          vi.clearAllMocks();

          // Tag each entry with its owner's user_id
          const rowsA = entriesA.map((e) => ({ ...e, user_id: userA }));
          const rowsB = entriesB.map((e) => ({ ...e, user_id: userB }));
          const allRows = [...rowsA, ...rowsB];

          // --- User A's session ---
          buildRlsMock(userA, allRows, [], []);
          const storeA = makeStore();
          await storeA.dispatch(fetchJournalEntries());

          const entriesInA = storeA.getState().journal.entries;

          // All returned entries must belong to user A
          for (const entry of entriesInA) {
            expect(entry.userId).toBe(userA);
          }

          // No entry from user B should appear
          const leakedBinA = entriesInA.filter((e) => e.userId === userB);
          expect(leakedBinA).toHaveLength(0);

          // --- User B's session ---
          vi.clearAllMocks();
          buildRlsMock(userB, allRows, [], []);
          const storeB = makeStore();
          await storeB.dispatch(fetchJournalEntries());

          const entriesInB = storeB.getState().journal.entries;

          // All returned entries must belong to user B
          for (const entry of entriesInB) {
            expect(entry.userId).toBe(userB);
          }

          // No entry from user A should appear
          const leakedAinB = entriesInB.filter((e) => e.userId === userA);
          expect(leakedAinB).toHaveLength(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("dashboard data fetched by user A contains no drawn_cards rows belonging to user B", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Two distinct user IDs
        fc.tuple(fc.uuid(), fc.uuid()).filter(([a, b]) => a !== b),
        // Journal entries for user A
        fc.array(
          fc.record({
            id: fc.uuid(),
            spread_id: fc.constant("single"),
            intention: fc.constant(null),
            summary_interpretation: fc.constant(null),
            journaling_prompts: fc.constant([]),
            user_notes: fc.constant(null),
            prompt_responses: fc.constant({}),
            created_at: fc.constant(new Date().toISOString()),
            updated_at: fc.constant(new Date().toISOString()),
          }),
          { minLength: 1, maxLength: 5 },
        ),
        // Journal entries for user B
        fc.array(
          fc.record({
            id: fc.uuid(),
            spread_id: fc.constant("single"),
            intention: fc.constant(null),
            summary_interpretation: fc.constant(null),
            journaling_prompts: fc.constant([]),
            user_notes: fc.constant(null),
            prompt_responses: fc.constant({}),
            created_at: fc.constant(new Date().toISOString()),
            updated_at: fc.constant(new Date().toISOString()),
          }),
          { minLength: 1, maxLength: 5 },
        ),
        async ([userA, userB], entriesA, entriesB) => {
          vi.clearAllMocks();

          const rowsA = entriesA.map((e) => ({ ...e, user_id: userA }));
          const rowsB = entriesB.map((e) => ({ ...e, user_id: userB }));
          const allRows = [...rowsA, ...rowsB];

          // Drawn cards: one card per journal entry, tagged by journal_entry_id
          const drawnA = rowsA.map((e, i) => ({
            id: `dc-a-${i}`,
            journal_entry_id: e.id,
            card_id: i,
          }));
          const drawnB = rowsB.map((e, i) => ({
            id: `dc-b-${i}`,
            journal_entry_id: e.id,
            card_id: i + 50,
          }));
          const allDrawn = [...drawnA, ...drawnB];

          // --- User A's dashboard session ---
          buildRlsMock(userA, allRows, allDrawn, []);
          const storeA = makeStore();
          await storeA.dispatch(fetchDashboard());

          const dashA = storeA.getState().dashboard;
          expect(dashA.status).toBe("succeeded");

          // frequentCards are derived from drawn_cards visible to user A only.
          // Card IDs for user A are 0..entriesA.length-1 (< 50).
          // Card IDs for user B are 50..50+entriesB.length-1 (>= 50).
          for (const fc_entry of dashA.frequentCards) {
            expect(Number(fc_entry.card.id)).toBeLessThan(50);
          }

          // --- User B's dashboard session ---
          vi.clearAllMocks();
          buildRlsMock(userB, allRows, allDrawn, []);
          const storeB = makeStore();
          await storeB.dispatch(fetchDashboard());

          const dashB = storeB.getState().dashboard;
          expect(dashB.status).toBe("succeeded");

          // Card IDs for user B are >= 50; none from user A (< 50) should appear
          for (const fc_entry of dashB.frequentCards) {
            expect(Number(fc_entry.card.id)).toBeGreaterThanOrEqual(50);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
