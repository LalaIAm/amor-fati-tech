// Feature: tarot-ai-app, Property 1: Deck integrity
// Feature: tarot-ai-app, Property 2: Shuffle is a permutation
// Feature: tarot-ai-app, Property 3: Reversed orientation distribution
// Feature: tarot-ai-app, Property 4: Draw count matches spread
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import deck from "./deck.js";
import { shuffle, assignReversed, draw } from "../engine/deck.js";

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

describe("Property 2: Shuffle is a permutation", () => {
  it("returns the same number of cards as the input", () => {
    fc.assert(
      fc.property(fc.constant(deck), (d) => {
        return shuffle(d).length === d.length;
      }),
      { numRuns: 100 },
    );
  });

  it("contains exactly the same card ids as the input (no additions or omissions)", () => {
    fc.assert(
      fc.property(fc.constant(deck), (d) => {
        const inputIds = d.map((c) => c.id).sort((a, b) => a - b);
        const outputIds = shuffle(d)
          .map((c) => c.id)
          .sort((a, b) => a - b);
        return JSON.stringify(inputIds) === JSON.stringify(outputIds);
      }),
      { numRuns: 100 },
    );
  });

  it("does not mutate the input array", () => {
    fc.assert(
      fc.property(fc.constant(deck), (d) => {
        const inputIdsBefore = d.map((c) => c.id);
        shuffle(d);
        const inputIdsAfter = d.map((c) => c.id);
        return JSON.stringify(inputIdsBefore) === JSON.stringify(inputIdsAfter);
      }),
      { numRuns: 100 },
    );
  });
});

// Feature: tarot-ai-app, Property 3: Reversed orientation distribution

describe("Property 3: Reversed orientation distribution", () => {
  it("proportion of reversed cards converges to 0.5 ± 0.05 over ≥1000 draws", () => {
    // Use a single run with a large sample size (10 000) so the proportion
    // reliably converges within ±0.05 (>6σ margin) without flaky multi-run failures.
    fc.assert(
      fc.property(fc.constant(null), () => {
        const SAMPLE_SIZE = 10_000;
        let reversedCount = 0;
        for (let i = 0; i < SAMPLE_SIZE; i++) {
          if (assignReversed({})) reversedCount++;
        }
        const proportion = reversedCount / SAMPLE_SIZE;
        return proportion >= 0.45 && proportion <= 0.55;
      }),
      { numRuns: 1 },
    );
  });
});

// Feature: tarot-ai-app, Property 4: Draw count matches spread

describe("Property 4: Draw count matches spread", () => {
  it("returns exactly N cards for arbitrary N (1–10)", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 }), (n) => {
        const positions = Array.from({ length: n }, (_, i) => ({
          index: i,
          label: `Position ${i + 1}`,
          description: `Description ${i + 1}`,
        }));
        const shuffled = shuffle(deck);
        const drawn = draw(shuffled, n, positions);
        return drawn.length === n;
      }),
      { numRuns: 100 },
    );
  });

  it("has no repeated card ids in a single draw", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 }), (n) => {
        const positions = Array.from({ length: n }, (_, i) => ({
          index: i,
          label: `Position ${i + 1}`,
          description: `Description ${i + 1}`,
        }));
        const shuffled = shuffle(deck);
        const drawn = draw(shuffled, n, positions);
        const ids = drawn.map((d) => d.card.id);
        return new Set(ids).size === ids.length;
      }),
      { numRuns: 100 },
    );
  });
});
