// Feature: tarot-ai-app, Property 1: Deck integrity
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import deck from "./deck.js";

describe("Property 1: Deck integrity", () => {
  it("contains exactly 78 cards", () => {
    fc.assert(
      fc.property(fc.constant(deck), (d) => {
        return d.length === 78;
      }),
      { numRuns: 100 },
    );
  });

  it("contains exactly 22 Major Arcana", () => {
    fc.assert(
      fc.property(fc.constant(deck), (d) => {
        return d.filter((c) => c.arcana === "major").length === 22;
      }),
      { numRuns: 100 },
    );
  });

  it("contains exactly 56 Minor Arcana", () => {
    fc.assert(
      fc.property(fc.constant(deck), (d) => {
        return d.filter((c) => c.arcana === "minor").length === 56;
      }),
      { numRuns: 100 },
    );
  });

  it("has no duplicate card ids", () => {
    fc.assert(
      fc.property(fc.constant(deck), (d) => {
        const ids = d.map((c) => c.id);
        return new Set(ids).size === ids.length;
      }),
      { numRuns: 100 },
    );
  });

  it("has all required fields non-empty on every card", () => {
    fc.assert(
      fc.property(fc.constant(deck), (d) => {
        return d.every(
          (c) =>
            typeof c.id === "number" &&
            typeof c.name === "string" &&
            c.name.length > 0 &&
            (c.arcana === "major" || c.arcana === "minor") &&
            typeof c.imageDescription === "string" &&
            c.imageDescription.length > 0 &&
            Array.isArray(c.uprightKeywords) &&
            c.uprightKeywords.length > 0 &&
            Array.isArray(c.reversedKeywords) &&
            c.reversedKeywords.length > 0,
        );
      }),
      { numRuns: 100 },
    );
  });
});
