// Feature: tarot-ai-app, Property 10: Journal entry round-trip

import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import * as fc from "fast-check";
import readingReducer, {
  setSpread,
  setDrawnCards,
  appendInterpretation,
  saveReading,
} from "./readingSlice.js";
import journalReducer, { fetchJournalEntry } from "./journalSlice.js";

// Mock the supabase client
vi.mock("../supabaseClient.js", () => {
  const mockSingle = vi.fn();
  const mockSelect = vi.fn(() => ({
    eq: vi.fn(() => ({ single: mockSingle })),
  }));
  const mockInsert = vi.fn(() => ({
    select: vi.fn(() => ({ single: mockSingle })),
  }));
  const mockFrom = vi.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
    update: vi.fn(),
    delete: vi.fn(),
  }));
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
      reading: readingReducer,
      journal: journalReducer,
    },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Property 10: Journal entry round-trip", () => {
  /**
   * Validates: Requirements 4.4, 6.1, 6.3
   *
   * For any completed reading, saving then retrieving the journal entry SHALL
   * return identical spread id, card ids, orientations, interpretation texts,
   * and intention.
   */
  it("saving then retrieving a journal entry returns identical data", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("single", "three-card", "celtic-cross"),
        fc.option(
          fc
            .string({ minLength: 1, maxLength: 500 })
            .filter((s) => s.trim().length > 0),
          { nil: null },
        ),
        fc.array(
          fc.record({
            cardId: fc.integer({ min: 0, max: 77 }),
            positionIndex: fc.nat(),
            reversed: fc.boolean(),
            interpretationText: fc.string({ minLength: 1 }),
          }),
          { minLength: 1, maxLength: 10 },
        ),
        async (spreadId, intention, cards) => {
          // Reset mocks per iteration
          vi.clearAllMocks();

          // Rebuild fresh chainable mocks each iteration
          const mockSingle = vi.fn();
          const mockEq = vi.fn(() => ({ single: mockSingle }));
          const mockSelectChain = vi.fn(() => ({ eq: mockEq }));
          const mockInsertSelectSingle = vi.fn();
          const mockInsertSelect = vi.fn(() => ({
            single: mockInsertSelectSingle,
          }));
          const mockInsert = vi.fn(() => ({ select: mockInsertSelect }));
          const mockFrom = vi.fn((table) => ({
            insert: mockInsert,
            select: mockSelectChain,
            update: vi.fn(),
            delete: vi.fn(),
          }));

          supabase.from.mockImplementation(mockFrom);

          const entryId = "entry-123";

          // Build the saved entry data that Supabase would return
          const savedEntryData = {
            id: entryId,
            spread_id: spreadId,
            intention: intention,
            summary_interpretation: null,
            journaling_prompts: [],
            user_notes: null,
            prompt_responses: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Mock journal_entries insert → returns saved entry
          mockInsertSelectSingle.mockResolvedValue({
            data: savedEntryData,
            error: null,
          });

          // Mock drawn_cards insert → returns no error
          // (second call to insert on drawn_cards table)
          // We track calls by table name via mockFrom
          let journalInsertCalled = false;
          mockFrom.mockImplementation((table) => {
            if (table === "journal_entries") {
              return {
                insert: vi.fn(() => ({
                  select: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({
                      data: savedEntryData,
                      error: null,
                    }),
                  })),
                })),
                select: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({
                      data: {
                        ...savedEntryData,
                        spreads: null,
                        drawn_cards: cards.map((c, i) => ({
                          id: `dc-${i}`,
                          card_id: c.cardId,
                          position: c.positionIndex,
                          position_label: `Position ${c.positionIndex}`,
                          is_reversed: c.reversed,
                          interpretation: c.interpretationText,
                        })),
                      },
                      error: null,
                    }),
                  })),
                })),
                update: vi.fn(),
                delete: vi.fn(),
              };
            }
            // drawn_cards table
            return {
              insert: vi.fn().mockResolvedValue({ data: null, error: null }),
              select: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
            };
          });

          const store = makeStore();

          // Set up reading state
          store.dispatch(
            setSpread({
              id: spreadId,
              name: spreadId,
              description: "",
              positions: cards.map((c) => ({
                index: c.positionIndex,
                label: `Position ${c.positionIndex}`,
                description: "",
              })),
            }),
          );

          store.dispatch(
            setDrawnCards(
              cards.map((c) => ({
                card: { id: c.cardId, name: `Card ${c.cardId}` },
                position: {
                  index: c.positionIndex,
                  label: `Position ${c.positionIndex}`,
                  description: "",
                },
                reversed: c.reversed,
              })),
            ),
          );

          // Set interpretations
          for (const c of cards) {
            store.dispatch(
              appendInterpretation({
                positionIndex: c.positionIndex,
                chunk: c.interpretationText,
              }),
            );
          }

          // Set intention directly via readingSlice (use setIntention if needed)
          // We set it via the store's reading state by dispatching setIntention
          const { setIntention } = await import("./readingSlice.js");
          store.dispatch(setIntention(intention ?? ""));

          // Save the reading
          await store.dispatch(saveReading());

          // Fetch the journal entry
          await store.dispatch(fetchJournalEntry(entryId));

          const selectedEntry = store.getState().journal.selectedEntry;

          // Assert the entry was retrieved
          expect(selectedEntry).not.toBeNull();

          // Assert spread id matches
          expect(selectedEntry.spreadId).toBe(spreadId);

          // Assert intention matches
          expect(selectedEntry.intention).toBe(intention);

          // Assert drawn cards match
          expect(selectedEntry.drawnCards).toHaveLength(cards.length);

          for (let i = 0; i < cards.length; i++) {
            const original = cards[i];
            const retrieved = selectedEntry.drawnCards[i];

            expect(retrieved.cardId).toBe(original.cardId);
            expect(retrieved.isReversed).toBe(original.reversed);
            expect(retrieved.interpretation).toBe(original.interpretationText);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: tarot-ai-app, Property 14: Prompt response round-trip
import { selectEntry, savePromptResponse } from "./journalSlice.js";

describe("Property 14: Prompt response round-trip", () => {
  /**
   * Validates: Requirements 8.4
   *
   * For any user response to a journaling prompt, saving the response and then
   * retrieving the journal entry SHALL return the same response text at the
   * same prompt index in journalSlice.selectedEntry.promptResponses.
   */
  it("saving a prompt response returns the same text at the same index", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.integer({ min: 0, max: 2 }),
        fc.string({ minLength: 1, maxLength: 1000 }),
        async (entryId, promptIndex, responseText) => {
          vi.clearAllMocks();

          // Build per-iteration mocks
          const selectSingleMock = vi.fn().mockResolvedValue({
            data: { prompt_responses: {} },
            error: null,
          });

          const updatedAt = new Date().toISOString();
          const updateSingleMock = vi.fn().mockResolvedValue({
            data: {
              id: entryId,
              prompt_responses: { [promptIndex]: responseText },
              updated_at: updatedAt,
            },
            error: null,
          });

          supabase.from.mockImplementation((table) => {
            if (table === "journal_entries") {
              return {
                select: vi.fn(() => ({
                  eq: vi.fn(() => ({ single: selectSingleMock })),
                })),
                update: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    select: vi.fn(() => ({ single: updateSingleMock })),
                  })),
                })),
                insert: vi.fn(),
                delete: vi.fn(),
              };
            }
            return {
              select: vi.fn(),
              update: vi.fn(),
              insert: vi.fn(),
              delete: vi.fn(),
            };
          });

          const store = makeStore();

          // Pre-populate selectedEntry
          store.dispatch(selectEntry({ id: entryId, promptResponses: {} }));

          // Save the prompt response
          await store.dispatch(
            savePromptResponse({
              id: entryId,
              promptIndex,
              response: responseText,
            }),
          );

          const state = store.getState().journal;
          expect(state.selectedEntry).not.toBeNull();
          expect(state.selectedEntry.promptResponses[promptIndex]).toBe(
            responseText,
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: tarot-ai-app, Property 11: Journal chronological ordering
import journalReducerOnly, { fetchJournalEntries } from "./journalSlice.js";

describe("Property 11: Journal chronological ordering", () => {
  /**
   * Validates: Requirements 6.2
   *
   * For any arbitrary set of journal entries with random createdAt timestamps,
   * dispatching fetchJournalEntries.fulfilled SHALL result in journalSlice.entries
   * being sorted by createdAt descending (most recent first).
   */
  it("entries are sorted by createdAt descending after fetchJournalEntries.fulfilled", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            createdAt: fc
              .integer({ min: 946684800000, max: 1924905600000 }) // 2000-01-01 to 2031-01-01
              .map((ms) => new Date(ms).toISOString()),
            spreadId: fc.constantFrom("single", "three-card", "celtic-cross"),
            intention: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
              nil: null,
            }),
          }),
          { minLength: 0, maxLength: 20 },
        ),
        (entries) => {
          // Shuffle entries into arbitrary order before dispatching
          const shuffled = [...entries].sort(() => Math.random() - 0.5);

          const action = fetchJournalEntries.fulfilled(
            shuffled,
            "req-id",
            undefined,
          );
          const state = journalReducerOnly(undefined, action);

          // Assert sorted descending by createdAt
          for (let i = 0; i < state.entries.length - 1; i++) {
            const a = new Date(state.entries[i].createdAt).getTime();
            const b = new Date(state.entries[i + 1].createdAt).getTime();
            expect(a).toBeGreaterThanOrEqual(b);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
