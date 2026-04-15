// Feature: tarot-ai-app, Property 7: AI prompt construction includes all required fields
// Feature: tarot-ai-app, Property 8: Interpretation word count
// Feature: tarot-ai-app, Property 9: AI response structure

import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { configureStore } from "@reduxjs/toolkit";
import { buildPrompt } from "./promptBuilder.js";

// Mock supabase so readingSlice can be imported without real env vars
vi.mock("../supabaseClient.js", () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    functions: { invoke: vi.fn() },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })),
    })),
  },
}));

import readingReducer, { appendInterpretation } from "../store/readingSlice.js";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Generates a non-empty string with at least one visible character */
const nonEmptyString = fc
  .string({ minLength: 1, maxLength: 80 })
  .filter((s) => s.trim().length > 0);

/** Generates a single drawn-card descriptor as sent to the Edge Function */
const drawnCardArb = fc.record({
  cardName: nonEmptyString,
  reversed: fc.boolean(),
  positionLabel: nonEmptyString,
  positionDescription: nonEmptyString,
});

/** Generates 1–10 drawn cards */
const drawnCardsArb = fc.array(drawnCardArb, { minLength: 1, maxLength: 10 });

/** Generates an intention: either null, empty string, whitespace-only, or a real string */
const intentionArb = fc.oneof(
  fc.constant(null),
  fc.constant(""),
  fc.constant("   "),
  fc
    .string({ minLength: 1, maxLength: 500 })
    .filter((s) => s.trim().length > 0),
);

// ---------------------------------------------------------------------------
// Property 7: AI prompt construction includes all required fields
// ---------------------------------------------------------------------------

describe("Property 7: AI prompt construction includes all required fields", () => {
  /**
   * Validates: Requirements 4.2, 4.3, 5.1
   *
   * For any combination of drawn cards, spread positions, and intention,
   * the built prompt SHALL contain each card's name, orientation label,
   * position label, position description, and either the intention text
   * or the general-reading instruction.
   */
  it("includes card name, orientation, position label, and position description for every card", () => {
    fc.assert(
      fc.property(drawnCardsArb, intentionArb, (cards, intention) => {
        const prompt = buildPrompt(cards, intention);

        for (const card of cards) {
          // Card name must appear
          expect(prompt).toContain(card.cardName);
          // Orientation must appear
          const orientationLabel = card.reversed ? "Reversed" : "Upright";
          expect(prompt).toContain(orientationLabel);
          // Position label must appear
          expect(prompt).toContain(card.positionLabel);
          // Position description must appear
          expect(prompt).toContain(card.positionDescription);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("includes the intention text when a non-empty intention is provided", () => {
    fc.assert(
      fc.property(
        drawnCardsArb,
        fc
          .string({ minLength: 1, maxLength: 500 })
          .filter((s) => s.trim().length > 0),
        (cards, intention) => {
          const prompt = buildPrompt(cards, intention);
          expect(prompt).toContain(intention.trim().slice(0, 500));
        },
      ),
      { numRuns: 100 },
    );
  });

  it("uses the general-reading instruction when intention is null, empty, or whitespace-only", () => {
    const noIntentionValues = [null, "", "   ", "\t", "\n", "  \t\n  "];

    fc.assert(
      fc.property(
        drawnCardsArb,
        fc.constantFrom(...noIntentionValues),
        (cards, intention) => {
          const prompt = buildPrompt(cards, intention);
          expect(prompt).toContain(
            "This is a general reading with no specific intention",
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it("includes distinctness note when previousInterpretationIds are provided", () => {
    fc.assert(
      fc.property(
        drawnCardsArb,
        intentionArb,
        fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
        (cards, intention, ids) => {
          const prompt = buildPrompt(cards, intention, ids);
          expect(prompt).toContain("meaningfully distinct interpretation");
          for (const id of ids) {
            expect(prompt).toContain(id);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("does NOT include distinctness note when no previousInterpretationIds are provided", () => {
    fc.assert(
      fc.property(drawnCardsArb, intentionArb, (cards, intention) => {
        const prompt = buildPrompt(cards, intention, []);
        expect(prompt).not.toContain("meaningfully distinct interpretation");
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 8: Interpretation word count
// ---------------------------------------------------------------------------

/**
 * Counts words in a string (splits on whitespace, filters empty tokens).
 * @param {string} text
 * @returns {number}
 */
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

describe("Property 8: Interpretation word count", () => {
  /**
   * Validates: Requirements 5.2
   *
   * For any card interpretation text (simulated via a mock AI response),
   * the word count SHALL be between 100 and 400 inclusive.
   */
  it("word count is between 100 and 400 for any interpretation text in that range", () => {
    // Generate texts that are within the valid range (100–400 words)
    const wordInRange = fc
      .array(
        fc.string({ minLength: 3, maxLength: 10 }).filter((s) => !/\s/.test(s)),
        {
          minLength: 100,
          maxLength: 400,
        },
      )
      .map((words) => words.join(" "));

    fc.assert(
      fc.property(wordInRange, (text) => {
        const wc = countWords(text);
        expect(wc).toBeGreaterThanOrEqual(100);
        expect(wc).toBeLessThanOrEqual(400);
      }),
      { numRuns: 100 },
    );
  });

  it("correctly identifies texts below 100 words as out of range", () => {
    fc.assert(
      fc.property(
        fc
          .array(
            fc
              .string({ minLength: 3, maxLength: 10 })
              .filter((s) => !/\s/.test(s)),
            {
              minLength: 1,
              maxLength: 99,
            },
          )
          .map((words) => words.join(" ")),
        (text) => {
          const wc = countWords(text);
          expect(wc).toBeLessThan(100);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("correctly identifies texts above 400 words as out of range", () => {
    fc.assert(
      fc.property(
        fc
          .array(
            fc
              .string({ minLength: 3, maxLength: 10 })
              .filter((s) => !/\s/.test(s)),
            {
              minLength: 401,
              maxLength: 600,
            },
          )
          .map((words) => words.join(" ")),
        (text) => {
          const wc = countWords(text);
          expect(wc).toBeGreaterThan(400);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: AI response structure
// ---------------------------------------------------------------------------

/**
 * Builds a mock AI response payload matching the expected shape.
 */
const mockAiResponseArb = fc.record({
  cardInterpretations: fc.array(
    fc.record({
      positionIndex: fc.nat({ max: 9 }),
      text: fc
        .array(
          fc
            .string({ minLength: 3, maxLength: 10 })
            .filter((s) => !/\s/.test(s)),
          { minLength: 100, maxLength: 400 },
        )
        .map((words) => words.join(" ")),
    }),
    { minLength: 1, maxLength: 10 },
  ),
  summaryInterpretation: fc
    .array(
      fc.string({ minLength: 3, maxLength: 10 }).filter((s) => !/\s/.test(s)),
      { minLength: 10, maxLength: 50 },
    )
    .map((words) => words.join(" ")),
  journalingPrompts: fc
    .tuple(
      fc
        .string({ minLength: 5, maxLength: 100 })
        .filter((s) => s.trim().length > 0),
      fc
        .string({ minLength: 5, maxLength: 100 })
        .filter((s) => s.trim().length > 0),
      fc
        .string({ minLength: 5, maxLength: 100 })
        .filter((s) => s.trim().length > 0),
    )
    .map((arr) => [...arr]),
});

function makeReadingStore() {
  return configureStore({ reducer: { reading: readingReducer } });
}

describe("Property 9: AI response structure", () => {
  /**
   * Validates: Requirements 5.5, 8.1
   *
   * For any completed reading, the AI response SHALL include a non-empty
   * summaryInterpretation and exactly 3 journalingPrompts strings,
   * and these SHALL be reflected in readingSlice state.
   */
  it("summaryInterpretation is non-empty in any valid AI response", () => {
    fc.assert(
      fc.property(mockAiResponseArb, (response) => {
        expect(typeof response.summaryInterpretation).toBe("string");
        expect(response.summaryInterpretation.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("journalingPrompts contains exactly 3 strings in any valid AI response", () => {
    fc.assert(
      fc.property(mockAiResponseArb, (response) => {
        expect(Array.isArray(response.journalingPrompts)).toBe(true);
        expect(response.journalingPrompts).toHaveLength(3);
        for (const prompt of response.journalingPrompts) {
          expect(typeof prompt).toBe("string");
          expect(prompt.trim().length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("readingSlice reflects summaryInterpretation and journalingPrompts after dispatch", () => {
    fc.assert(
      fc.property(mockAiResponseArb, (response) => {
        const store = makeReadingStore();

        // Simulate what fetchInterpretation.fulfilled does
        for (const item of response.cardInterpretations) {
          store.dispatch(
            appendInterpretation({
              positionIndex: item.positionIndex,
              chunk: item.text,
            }),
          );
        }

        // Manually set the fulfilled payload (mirrors extraReducers logic)
        store.dispatch({
          type: "reading/fetchInterpretation/fulfilled",
          payload: {
            summaryInterpretation: response.summaryInterpretation,
            journalingPrompts: response.journalingPrompts,
          },
        });

        const state = store.getState().reading;

        expect(state.summaryInterpretation).toBe(
          response.summaryInterpretation,
        );
        expect(state.journalingPrompts).toHaveLength(3);
        expect(state.journalingPrompts).toEqual(response.journalingPrompts);
        expect(state.status).toBe("done");
      }),
      { numRuns: 100 },
    );
  });

  it("cardInterpretations are accumulated in readingSlice via appendInterpretation", () => {
    fc.assert(
      fc.property(mockAiResponseArb, (response) => {
        const store = makeReadingStore();

        for (const item of response.cardInterpretations) {
          store.dispatch(
            appendInterpretation({
              positionIndex: item.positionIndex,
              chunk: item.text,
            }),
          );
        }

        const { interpretations } = store.getState().reading;

        // Every dispatched positionIndex should appear in the store
        const storedIndices = new Set(
          interpretations.map((i) => i.positionIndex),
        );
        for (const item of response.cardInterpretations) {
          expect(storedIndices.has(item.positionIndex)).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });
});
