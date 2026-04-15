/**
 * InterpretationList — renders per-card interpretations and the summary.
 *
 * Props:
 *   interpretations: Array<{ positionIndex: number, text: string }>
 *   summaryInterpretation: string | null
 */
export default function InterpretationList({
  interpretations,
  summaryInterpretation,
}) {
  const hasInterpretations =
    Array.isArray(interpretations) && interpretations.length > 0;
  const hasSummary =
    summaryInterpretation && summaryInterpretation.trim().length > 0;

  if (!hasInterpretations && !hasSummary) return null;

  return (
    <section style={styles.container} aria-labelledby="interpretation-title">
      <h2 id="interpretation-title" style={styles.heading}>
        Interpretations
      </h2>

      {hasInterpretations && (
        <ul style={styles.list} aria-label="Card interpretations">
          {interpretations.map((item) => (
            <li key={item.positionIndex} style={styles.item}>
              <p style={styles.positionLabel}>Card {item.positionIndex + 1}</p>
              <p style={styles.text}>{item.text}</p>
            </li>
          ))}
        </ul>
      )}

      {hasSummary && (
        <div style={styles.summary} aria-labelledby="summary-title">
          <h3 id="summary-title" style={styles.summaryHeading}>
            Overall Reading
          </h3>
          <p style={styles.summaryText}>{summaryInterpretation}</p>
        </div>
      )}
    </section>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    margin: "0 0 20px",
    fontSize: "22px",
    color: "var(--text-h)",
  },
  list: {
    listStyle: "none",
    margin: "0 0 32px",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  item: {
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--accent-bg)",
  },
  positionLabel: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  text: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.6",
    color: "var(--text)",
  },
  summary: {
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--surface)",
  },
  summaryHeading: {
    margin: "0 0 12px",
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  summaryText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.7",
    color: "var(--text)",
  },
};
