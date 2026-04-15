import { useSelector } from "react-redux";

/**
 * PatternInsight — renders the AI-generated monthly pattern insight.
 * Only visible when totalReadings >= 5 and a patternInsight exists.
 * Requirements: 7.3, 10.4
 */
export default function PatternInsight() {
  const { patternInsight, totalReadings } = useSelector(
    (state) => state.dashboard,
  );

  if (totalReadings < 5 || !patternInsight) {
    return null;
  }

  return (
    <section style={styles.section} aria-labelledby="pattern-insight-title">
      <h2 id="pattern-insight-title" style={styles.heading}>
        Monthly Pattern Insight
      </h2>
      <div style={styles.card} role="note">
        <span style={styles.icon} aria-hidden="true">
          🔮
        </span>
        <p style={styles.text}>{patternInsight}</p>
      </div>
    </section>
  );
}

const styles = {
  section: {
    marginBottom: "32px",
  },
  heading: {
    margin: "0 0 16px",
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  card: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    padding: "18px 20px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--accent-bg)",
  },
  icon: {
    fontSize: "22px",
    flexShrink: 0,
    marginTop: "2px",
  },
  text: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.6",
    color: "var(--text-body, #444)",
  },
};
