// Feature: tarot-ai-app, Property 13: Journal entry summary fields

import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import JournalList from "./JournalList.jsx";

// ---------------------------------------------------------------------------
// Mock supabase so journalSlice can be imported without real env vars
// ---------------------------------------------------------------------------
vi.mock("../supabaseClient.js", () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

import journalReducer from "../store/journalSlice.js";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Non-empty string with at least one visible character */
const visibleString = fc
  .string({ minLength: 1, maxLength: 60 })
  .filter((s) => s.trim().length > 0);

/** Arbitrary ISO timestamp between 2020 and 2030 */
const isoTimestampArb = fc
  .integer({ min: 1577836800000, max: 1893456000000 }) // 2020-01-01 to 2030-01-01
  .map((ms) => new Date(ms).toISOString());

/** Arbitrary journal entry matching the shape produced by journalSlice */
const journalEntryArb = fc.record({
  id: fc.uuid(),
  createdAt: isoTimestampArb,
  spreadName: visibleString,
  intention: fc.option(visibleString, { nil: null }),
});

/** 1–10 journal entries with unique ids */
const journalEntriesArb = fc
  .array(journalEntryArb, { minLength: 1, maxLength: 10 })
  .map((entries) =>
    entries.map((e, i) => ({
      ...e,
      id: `entry-${i}-${e.id}`,
    })),
  );

// ---------------------------------------------------------------------------
// Helper: render JournalList with pre-seeded journal state
// ---------------------------------------------------------------------------

function renderWithEntries(entries) {
  const store = configureStore({
    reducer: { journal: journalReducer },
    preloadedState: {
      journal: {
        entries,
        selectedEntry: null,
        status: "succeeded",
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <JournalList />
      </MemoryRouter>
    </Provider>,
  );
}

// ---------------------------------------------------------------------------
// Property 13: Journal entry summary fields
// ---------------------------------------------------------------------------

describe("Property 13: Journal entry summary fields", () => {
  /**
   * Validates: Requirements 7.4, 10.2
   *
   * For any set of journal entries rendered in JournalList,
   * each row SHALL display the formatted date, spread name,
   * and either the intention text or an empty-intention indicator.
   */
  it(
    "each row displays date, spread name, and intention or empty-intention indicator",
    { timeout: 60000 },
    () => {
      fc.assert(
        fc.property(journalEntriesArb, (entries) => {
          const { container, unmount } = renderWithEntries(entries);

          const items = container.querySelectorAll(".journal-list__item");
          expect(items.length).toBe(entries.length);

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const entry = entries[i];

            // --- Date is visible ---
            const expectedDate = new Date(entry.createdAt).toLocaleDateString(
              undefined,
              { year: "numeric", month: "long", day: "numeric" },
            );
            const dateEl = item.querySelector(".journal-list__date");
            expect(dateEl).not.toBeNull();
            expect(dateEl.textContent).toBe(expectedDate);

            // --- Spread name is visible ---
            const spreadEl = item.querySelector(".journal-list__spread");
            expect(spreadEl).not.toBeNull();
            expect(spreadEl.textContent).toBe(entry.spreadName);

            // --- Intention or empty-intention indicator is visible ---
            const intentionEl = item.querySelector(".journal-list__intention");
            expect(intentionEl).not.toBeNull();

            const hasIntention =
              entry.intention !== null && entry.intention.trim().length > 0;

            if (hasIntention) {
              expect(intentionEl.textContent).toBe(entry.intention);
            } else {
              expect(intentionEl.textContent).toBe("No intention set");
            }
          }

          unmount();
        }),
        { numRuns: 100 },
      );
    },
  );

  it("shows empty-state message when entries list is empty", () => {
    const store = configureStore({
      reducer: { journal: journalReducer },
      preloadedState: {
        journal: {
          entries: [],
          selectedEntry: null,
          status: "succeeded",
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <JournalList />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText(/No journal entries yet/i)).toBeInTheDocument();
  });

  it("shows loading state when status is loading", () => {
    const store = configureStore({
      reducer: { journal: journalReducer },
      preloadedState: {
        journal: {
          entries: [],
          selectedEntry: null,
          status: "loading",
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <JournalList />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText(/Loading journal entries/i)).toBeInTheDocument();
  });
});
