import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import JournalList from "../components/JournalList.jsx";

/**
 * PatternInsightBanner — renders only when totalReadings >= 5 and patternInsight is set.
 * Reads from state.dashboard (dashboardSlice).
 *
 * Requirements: 7.3
 */
function PatternInsightBanner() {
  const patternInsight = useSelector((state) => state.dashboard.patternInsight);
  const totalReadings = useSelector((state) => state.dashboard.totalReadings);

  if (totalReadings < 5 || !patternInsight) return null;

  return (
    <aside style={styles.banner} role="note" aria-label="Pattern insight">
      <span style={styles.bannerIcon} aria-hidden="true">
        ✦
      </span>
      <p style={styles.bannerText}>{patternInsight}</p>
    </aside>
  );
}

/**
 * JournalPage — lists all journal entries and surfaces the pattern insight banner.
 *
 * Requirements: 6.2, 7.3
 */
export default function JournalPage() {
  return (
    <main style={styles.page}>
      <div style={styles.inner}>
        <header style={styles.header}>
          <h1 style={styles.heading}>My Journal</h1>
          <Link to="/reading/new" style={styles.newReadingBtn}>
            New Reading
          </Link>
        </header>

        <PatternInsightBanner />

        <JournalList />
      </div>
    </main>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100svh",
    display: "flex",
    flexDirection: "column",
  },
  inner: {
    maxWidth: "720px",
    margin: "0 auto",
    width: "100%",
    padding: "32px 24px 48px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  heading: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    color: "var(--text-h)",
  },
  newReadingBtn: {
    padding: "8px 18px",
    borderRadius: "6px",
    background: "var(--accent)",
    color: "var(--btn-text)",
    fontWeight: 600,
    fontSize: "14px",
    textDecoration: "none",
    flexShrink: 0,
  },
  banner: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "14px 18px",
    borderRadius: "8px",
    border: "1px solid var(--accent)",
    background: "var(--accent-bg)",
  },
  bannerIcon: {
    fontSize: "16px",
    color: "var(--accent)",
    flexShrink: 0,
    marginTop: "2px",
  },
  bannerText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "var(--text)",
  },
};
