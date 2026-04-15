import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SpreadSelector from "../components/SpreadSelector.jsx";
import IntentionInput from "../components/IntentionInput.jsx";
import CardDrawDisplay from "../components/CardDrawDisplay.jsx";
import InterpretationPanel from "../components/InterpretationPanel.jsx";
import {
  setDrawnCards,
  fetchInterpretation,
  saveReading,
  resetReading,
} from "../store/readingSlice.js";
import { createDeck, shuffle, draw } from "../engine/deck.js";

/**
 * Step order for the new reading flow:
 *   1. spread   — choose a spread
 *   2. intention — optionally set an intention
 *   3. cards    — cards are drawn and displayed
 *   4. done     — interpretation complete, auto-save then navigate to journal entry
 */

export default function NewReadingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedSpread, drawnCards, status, savedEntryId } = useSelector(
    (state) => state.reading,
  );

  // Derive current step from state
  const step = deriveStep(selectedSpread, drawnCards, status);

  // When saving completes, navigate to the journal entry
  useEffect(() => {
    if (status === "done" && savedEntryId) {
      navigate(`/journal/${savedEntryId}`);
    }
  }, [status, savedEntryId, navigate]);

  // Auto-save once interpretation is done (status transitions to 'done' from fetchInterpretation)
  useEffect(() => {
    if (status === "done" && !savedEntryId) {
      dispatch(saveReading());
    }
  }, [status, savedEntryId, dispatch]);

  // Reset reading state when the page unmounts
  useEffect(() => {
    return () => {
      dispatch(resetReading());
    };
  }, [dispatch]);

  // ── Step handlers ──────────────────────────────────────────────────────────

  function handleSpreadConfirmed(spread) {
    // Spread already dispatched inside SpreadSelector; just advance step
    // (step is derived from state, so selecting a spread moves us forward automatically)
    void spread;
  }

  function handleIntentionConfirmed(intention) {
    // Draw cards using the deck engine
    const deck = createDeck();
    const shuffled = shuffle(deck);
    const drawn = draw(
      shuffled,
      selectedSpread.positions.length,
      selectedSpread.positions,
    );
    dispatch(setDrawnCards(drawn));

    // Kick off AI interpretation
    dispatch(
      fetchInterpretation({
        spreadId: selectedSpread.id,
        intention: intention || null,
        drawnCards: drawn,
        previousInterpretationIds: [],
      }),
    );
  }

  function handleRetry() {
    const { intention } = window.__readingRetryState || {};
    dispatch(
      fetchInterpretation({
        spreadId: selectedSpread?.id,
        intention: intention || null,
        drawnCards,
        previousInterpretationIds: [],
      }),
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main style={styles.page}>
      <StepIndicator step={step} />

      {step === "spread" && (
        <SpreadSelector onConfirm={handleSpreadConfirmed} />
      )}

      {step === "intention" && (
        <IntentionInput onConfirm={handleIntentionConfirmed} />
      )}

      {(step === "cards" || step === "interpreting" || step === "error") && (
        <>
          <CardDrawDisplay />
          <InterpretationPanel onRetry={handleRetry} />
        </>
      )}

      {step === "saving" && (
        <div style={styles.savingWrapper} role="status" aria-live="polite">
          <p style={styles.savingText}>Saving your reading…</p>
        </div>
      )}
    </main>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function deriveStep(selectedSpread, drawnCards, status) {
  if (!selectedSpread) return "spread";
  if (!drawnCards || drawnCards.length === 0) return "intention";
  if (status === "saving") return "saving";
  if (status === "error") return "error";
  if (status === "interpreting") return "interpreting";
  return "cards";
}

// ── Step indicator ────────────────────────────────────────────────────────────

const STEPS = [
  { key: "spread", label: "Spread" },
  { key: "intention", label: "Intention" },
  { key: "cards", label: "Reading" },
];

function StepIndicator({ step }) {
  const activeIndex = STEPS.findIndex(
    (s) =>
      s.key === step ||
      (step === "interpreting" && s.key === "cards") ||
      (step === "error" && s.key === "cards") ||
      (step === "saving" && s.key === "cards"),
  );

  return (
    <nav style={styles.stepNav} aria-label="Reading progress">
      <ol style={styles.stepList}>
        {STEPS.map((s, i) => (
          <li
            key={s.key}
            style={{
              ...styles.stepItem,
              ...(i === activeIndex ? styles.stepItemActive : {}),
              ...(i < activeIndex ? styles.stepItemDone : {}),
            }}
            aria-current={i === activeIndex ? "step" : undefined}
          >
            <span style={styles.stepDot}>{i < activeIndex ? "✓" : i + 1}</span>
            <span style={styles.stepLabel}>{s.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100svh",
    display: "flex",
    flexDirection: "column",
  },
  stepNav: {
    padding: "20px 24px 0",
    maxWidth: "720px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  stepList: {
    display: "flex",
    gap: "0",
    listStyle: "none",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "var(--text)",
    flex: 1,
    position: "relative",
  },
  stepItemActive: {
    color: "var(--accent)",
    fontWeight: 600,
  },
  stepItemDone: {
    color: "var(--success)",
  },
  stepDot: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    border: "1px solid currentColor",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 600,
    flexShrink: 0,
  },
  stepLabel: {
    fontSize: "13px",
  },
  savingWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "40px",
  },
  savingText: {
    margin: 0,
    color: "var(--text)",
    fontSize: "15px",
  },
};
