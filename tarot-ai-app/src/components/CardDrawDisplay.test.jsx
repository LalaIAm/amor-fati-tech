// Feature: tarot-ai-app, Property 16: Card alt text present

import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CardDrawDisplay from "./CardDrawDisplay.jsx";

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

import readingReducer from "../store/readingSlice.js";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Non-empty string with at least one visible character */
const visibleString = fc
  .string({ minLength: 1, maxLength: 60 })
  .filter((s) => s.trim().length > 0);

/** Arbitrary tarot card */
const cardArb = fc.record({
  id: fc.integer({ min: 0, max: 77 }),
  name: visibleString,
  arcana: fc.constantFrom("major", "minor"),
  suit: fc.option(fc.constantFrom("wands", "cups", "swords", "pentacles"), {
    nil: undefined,
  }),
  imageDescription: visibleString,
  uprightKeywords: fc.array(visibleString, { minLength: 1, maxLength: 4 }),
  reversedKeywords: fc.array(visibleString, { minLength: 1, maxLength: 4 }),
});

/** Arbitrary spread position */
const positionArb = fc.record({
  index: fc.nat({ max: 9 }),
  label: visibleString,
  description: visibleString,
});

/** Arbitrary drawn card */
const drawnCardArb = fc.record({
  card: cardArb,
  reversed: fc.boolean(),
  position: positionArb,
});

/** 1–10 drawn cards with unique position indices */
const drawnCardsArb = fc
  .array(drawnCardArb, { minLength: 1, maxLength: 10 })
  .map((cards) =>
    cards.map((dc, i) => ({
      ...dc,
      position: { ...dc.position, index: i },
    })),
  );

// ---------------------------------------------------------------------------
// Helper: render CardDrawDisplay with a pre-loaded store
// ---------------------------------------------------------------------------

function renderWithCards(drawnCards) {
  const store = configureStore({
    reducer: { reading: readingReducer },
    preloadedState: {
      reading: {
        selectedSpread: null,
        intention: "",
        drawnCards,
        interpretations: [],
        summaryInterpretation: null,
        journalingPrompts: [],
        status: "drawing",
        error: null,
        savedEntryId: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <CardDrawDisplay />
    </Provider>,
  );
}

// ---------------------------------------------------------------------------
// Property 16: Card alt text present
// ---------------------------------------------------------------------------

describe("Property 16: Card alt text present", () => {
  /**
   * Validates: Requirements 11.3
   *
   * For any set of drawn cards rendered in CardDrawDisplay,
   * every <img> element SHALL have a non-empty alt attribute
   * containing the card's name and imageDescription.
   */
  it(
    "every <img> has a non-empty alt containing card name and imageDescription",
    { timeout: 30000 },
    () => {
      fc.assert(
        fc.property(drawnCardsArb, (drawnCards) => {
          const { container, unmount } = renderWithCards(drawnCards);

          const imgs = container.querySelectorAll("img");

          // There should be one img per drawn card
          expect(imgs.length).toBe(drawnCards.length);

          for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i];
            const alt = img.getAttribute("alt");

            // alt must be non-empty
            expect(alt).toBeTruthy();
            expect(alt.trim().length).toBeGreaterThan(0);

            // alt must contain the card name
            expect(alt).toContain(drawnCards[i].card.name);

            // alt must contain the imageDescription
            expect(alt).toContain(drawnCards[i].card.imageDescription);
          }

          unmount();
        }),
        { numRuns: 25 },
      );
    },
  );

  it("renders no <img> elements when drawnCards is empty", () => {
    const { container } = renderWithCards([]);
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBe(0);
  });

  it(
    "alt text format is '<name> — <imageDescription>'",
    { timeout: 30000 },
    () => {
      fc.assert(
        fc.property(drawnCardsArb, (drawnCards) => {
          const { container, unmount } = renderWithCards(drawnCards);
          const imgs = container.querySelectorAll("img");

          for (let i = 0; i < imgs.length; i++) {
            const { name, imageDescription } = drawnCards[i].card;
            const expectedAlt = `${name} — ${imageDescription}`;
            expect(imgs[i].getAttribute("alt")).toBe(expectedAlt);
          }

          unmount();
        }),
        { numRuns: 25 },
      );
    },
  );
});
