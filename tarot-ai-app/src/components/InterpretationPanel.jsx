import { useDispatch, useSelector } from "react-redux";
import { fetchInterpretation } from "../store/readingSlice.js";

/**
 * Displays the streaming AI interpretation for each card position,
 * a summary, and three journaling prompts once complete.
 * Shows a loading spinner while interpreting and an error + retry on failure.
 */
export default function InterpretationPanel({ onRetry }) {
  const dispatch = useDispatch();
  const {
    status,
    error,
    drawnCards,
    interpretations,
    summaryInterpretation,
    journalingPrompts,
    selectedSpread,
    intention,
  } = useSelector((state) => state.reading);

  const isInterpreting = status === "interpreting";
  const isDone = status === "done" || status === "saving";
  const isError = status === "error";

  function handleRetry() {
    if (onRetry) {
      onRetry();
    } else {
      dispatch(
        fetchInterpretation({
          spreadId: selectedSpread?.id,
          intention,
          drawnCards,
          previousInterpretationIds: [],
        }),
      );
    }
  }

  if (!isInterpreting && !isDone && !isError) return null;

  return (
    <section style={styles.container} aria-labelledby="interpretation-title">
      <h2 id="interpretation-title" style={styles.heading}>
        Your Reading
      </h2>

      {/* Loading state */}
      {isInterpreting && (
        <div style={styles.loadingWrapper} role="status" aria-live="polite">
          <span style={styles.spinner} aria-hidden="true">
            ✦
          </span>
          <p style={styles.loadingText}>Interpreting your cards…</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div style={styles.errorWrapper} role="alert">
          <p style={styles.errorText}>
            {error ||
              "Something went wrong while fetching your interpretation."}
          </p>
          <button type="button" onClick={handleRetry} style={styles.retryBtn}>
            Try again
          </button>
        </div>
      )}

      {/* Streaming / completed card interpretations */}
      {(isInterpreting || isDone) && interpretations.length > 0 && (
        <div style={styles.cardInterpretations}>
          {interpretations.map((interp) => {
            const drawnCard = drawnCards[interp.positionIndex];
            const positionLabel =
              drawnCard?.position?.label ??
              `Position ${interp.positionIndex + 1}`;
            const cardName = drawnCard?.card?.name ?? "";
            const reversed = drawnCard?.reversed;

            return (
              <article key={interp.positionIndex} style={styles.interpCard}>
                <header style={styles.interpCardHeader}>
                  <span style={styles.interpPosition}>{positionLabel}</span>
                  {cardName && (
                    <span style={styles.interpCardName}>
                      {cardName}
                      {reversed !== undefined && (
                        <span
                          style={{
                            ...styles.orientationBadge,
                            ...(reversed
                              ? styles.orientationReversed
                              : styles.orientationUpright),
                          }}
                        >
                          {reversed ? "Reversed" : "Upright"}
                        </span>
                      )}
                    </span>
                  )}
                </header>
                <p style={styles.interpText}>{interp.text}</p>
              </article>
            );
          })}
        </div>
      )}

      {/* Summary and journaling prompts — shown after streaming completes */}
      {isDone && summaryInterpretation && (
        <div style={styles.summaryWrapper}>
          <h3 style={styles.summaryTitle}>Overall Reading</h3>
          <p style={styles.summaryText}>{summaryInterpretation}</p>
        </div>
      )}

      {isDone && journalingPrompts && journalingPrompts.length > 0 && (
        <div style={styles.promptsWrapper}>
          <h3 style={styles.promptsTitle}>Journaling Prompts</h3>
          <ol style={styles.promptsList}>
            {journalingPrompts.map((prompt, i) => (
              <li key={i} style={styles.promptItem}>
                {prompt}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

const styles = {
  container: {
    padding: "32px 24px",
    maxWidth: "720px",
    margin: "0 auto",
    textAlign: "left",
  },
  heading: {
    margin: "0 0 24px",
    fontSize: "24px",
    color: "var(--text-h)",
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "40px 0",
  },
  spinner: {
    fontSize: "32px",
    color: "var(--accent)",
    display: "inline-block",
    animation: "spinPulse 1.4s ease-in-out infinite",
  },
  loadingText: {
    margin: 0,
    color: "var(--text)",
    fontSize: "15px",
  },
  errorWrapper: {
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid rgba(220,38,38,0.4)",
    background: "rgba(220,38,38,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "flex-start",
  },
  errorText: {
    margin: 0,
    color: "#dc2626",
    fontSize: "15px",
  },
  retryBtn: {
    padding: "9px 20px",
    borderRadius: "6px",
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  cardInterpretations: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "32px",
  },
  interpCard: {
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
  },
  interpCardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "12px",
  },
  interpPosition: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  interpCardName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-h)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  orientationBadge: {
    fontSize: "11px",
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: "999px",
    border: "1px solid",
  },
  orientationUpright: {
    color: "#16a34a",
    borderColor: "#16a34a",
    background: "rgba(22,163,74,0.08)",
  },
  orientationReversed: {
    color: "#dc2626",
    borderColor: "#dc2626",
    background: "rgba(220,38,38,0.08)",
  },
  interpText: {
    margin: 0,
    color: "var(--text)",
    fontSize: "15px",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
  },
  summaryWrapper: {
    padding: "24px",
    borderRadius: "10px",
    border: "1px solid var(--accent-border)",
    background: "var(--accent-bg)",
    marginBottom: "24px",
  },
  summaryTitle: {
    margin: "0 0 12px",
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  summaryText: {
    margin: 0,
    color: "var(--text)",
    fontSize: "15px",
    lineHeight: "1.7",
  },
  promptsWrapper: {
    padding: "24px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--code-bg)",
  },
  promptsTitle: {
    margin: "0 0 16px",
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  promptsList: {
    margin: 0,
    padding: "0 0 0 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  promptItem: {
    fontSize: "14px",
    color: "var(--text)",
    lineHeight: "1.6",
  },
};
