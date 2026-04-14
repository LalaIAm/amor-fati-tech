// Feature: tarot-ai-app, Property 12: Card frequency counts and top-3 display

import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import * as fc from "fast-check";
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
      dashboard: dashboardReducer,
    },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Compute expected top-3 from drawnCardRows.
 * Returns array of { cardId, count } sorted descending by count, max 3 entries.
 */
function computeExpectedTop3(drawnCardRows) {
  const counts = {};
  for (const row of drawnCardRows) {
    counts[row.card_id] = (counts[row.card_id] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cardId, count]) => ({ cardId: Number(cardId), count }));
}

describe("Property 12: Card frequency counts and top-3 display", () => {
  /**
   * Validates: Requirements 7.1, 7.2, 10.5
   *
   * For any arbitrary reading history (drawn_cards rows), the dashboard's
   * frequentCards SHALL have counts matching the actual card_id occurrences,
   * and SHALL contain at most 3 entries representing the highest-frequency cards.
   */
  it("frequency counts match drawn_cards rows and top-3 are correct", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({ card_id: fc.integer({ min: 0, max: 77 }) }), {
          minLength: 0,
          maxLength: 50,
        }),
        async (drawnCardRows) => {
          vi.clearAllMocks();

          const totalReadings = drawnCardRows.length;

          // Build the drawn_cards data with the nested journal_entries join
          const drawnDataWithJoin = drawnCardRows.map((r) => ({
            card_id: r.card_id,
            journal_entries: { user_id: "user-1" },
          }));

          // Mock supabase.from per table
          supabase.from.mockImplementation((table) => {
            if (table === "journal_entries") {
              return {
                // recent 3 entries query: .select(...).order(...).limit(3)
                select: vi.fn((cols, opts) => {
                  // count query uses { count: 'exact', head: true }
                  if (opts && opts.count === "exact") {
                    return {
                      count: totalReadings,
                      error: null,
                      // head:true queries resolve immediately (no chaining needed)
                      then: undefined,
                    };
                  }
                  // recent entries query: .select(...).order(...).limit(3)
                  return {
                    order: vi.fn(() => ({
                      limit: vi.fn(() =>
                        Promise.resolve({ data: [], error: null }),
                      ),
                    })),
                  };
                }),
              };
            }

            if (table === "drawn_cards") {
              return {
                select: vi.fn(() =>
                  Promise.resolve({ data: drawnDataWithJoin, error: null }),
                ),
              };
            }

            if (table === "pattern_insights") {
              return {
                select: vi.fn(() => ({
                  order: vi.fn(() => ({
                    limit: vi.fn(() => ({
                      single: vi.fn(() =>
                        Promise.resolve({ data: null, error: null }),
                      ),
                    })),
                  })),
                })),
              };
            }

            return {
              select: vi.fn(() => Promise.resolve({ data: null, error: null })),
            };
          });

          const store = makeStore();
          await store.dispatch(fetchDashboard());

          const { frequentCards, status } = store.getState().dashboard;

          expect(status).toBe("succeeded");

          // Property A: at most 3 entries
          expect(frequentCards.length).toBeLessThanOrEqual(3);

          // Property A: each count matches actual occurrences in drawnCardRows
          for (const entry of frequentCards) {
            const expectedCount = drawnCardRows.filter(
              (r) => r.card_id === Number(entry.card.id),
            ).length;
            expect(entry.count).toBe(expectedCount);
          }

          // Property B: top-3 are correct — no card with a higher count is excluded
          const expected = computeExpectedTop3(drawnCardRows);

          expect(frequentCards.length).toBe(expected.length);

          for (let i = 0; i < expected.length; i++) {
            expect(frequentCards[i].count).toBe(expected[i].count);
            expect(Number(frequentCards[i].card.id)).toBe(expected[i].cardId);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
