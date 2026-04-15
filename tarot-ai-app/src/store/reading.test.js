// Feature: tarot-ai-app, Property 17: Whitespace intention treated as absent

import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import * as fc from "fast-check";
import readingReducer, { setIntention } from "./readingSlice.js";

function makeStore() {
  return configureStore({
    reducer: {
      reading: readingReducer,
    },
  });
}

describe("Property 17: Whitespace intention treated as absent", () => {
  /**
   * Validates: Requirements 4.1, 4.3
   *
   * For any whitespace-only string dispatched via setIntention,
   * readingSlice.intention SHALL be normalized to "".
   */
  it("normalizes whitespace-only intention strings to empty string", () => {
    fc.assert(
      fc.property(
        fc
          .array(fc.constantFrom(" ", "\t", "\n", "\r"), { minLength: 1 })
          .map((chars) => chars.join("")),
        (whitespaceStr) => {
          const store = makeStore();
          store.dispatch(setIntention(whitespaceStr));
          expect(store.getState().reading.intention).toBe("");
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 4.1, 4.3
   *
   * For any string containing at least one non-whitespace character,
   * readingSlice.intention SHALL be preserved as-is (not normalized).
   */
  it("preserves non-whitespace intention strings without modification", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (nonWhitespaceStr) => {
          const store = makeStore();
          store.dispatch(setIntention(nonWhitespaceStr));
          expect(store.getState().reading.intention).toBe(nonWhitespaceStr);
        },
      ),
      { numRuns: 100 },
    );
  });
});
