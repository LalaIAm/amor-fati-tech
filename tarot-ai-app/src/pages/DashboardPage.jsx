import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../store/dashboardSlice.js";
import RecentReadings from "../components/RecentReadings.jsx";
import FrequentCards from "../components/FrequentCards.jsx";
import PatternInsight from "../components/PatternInsight.jsx";

/**
 * DashboardPage — post-login landing page.
 * Dispatches fetchDashboard on mount, composes dashboard widgets,
 * and shows an empty-state prompt when the user has no readings.
 * Requirements: 10.1, 10.6, 10.7
 */
export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recentEntries, status, error } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const isEmpty = status === "succeeded" && recentEntries.length === 0;

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>Your Dashboard</h1>
        <button
          style={styles.newReadingBtn}
          onClick={() => navigate("/reading/new")}
          aria-label="Start a new tarot reading"
        >
          ✦ Start a New Reading
        </button>
      </header>

      {status === "loading" && (
        <p style={styles.statusMsg}>Loading your dashboard…</p>
      )}

      {status === "failed" && (
        <p style={styles.errorMsg}>Failed to load dashboard: {error}</p>
      )}

      {isEmpty && (
        <div style={styles.emptyState} role="status">
          <span style={styles.emptyIcon} aria-hidden="true">
            🌙
          </span>
          <p style={styles.emptyText}>
            You haven&apos;t done any readings yet. Begin your journey by
            starting your first reading!
          </p>
          <button
            style={styles.emptyBtn}
            onClick={() => navigate("/reading/new")}
          >
            Start Your First Reading
          </button>
        </div>
      )}

      {status === "succeeded" && !isEmpty && (
        <>
          <PatternInsight />
          <RecentReadings />
          <FrequentCards />
        </>
      )}
    </main>
  );
}

const styles = {
  main: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "32px 20px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "32px",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: "var(--text-h)",
  },
  newReadingBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "var(--btn-text)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  statusMsg: {
    color: "var(--text-muted, var(--text))",
    fontSize: "15px",
  },
  errorMsg: {
    color: "var(--error)",
    fontSize: "15px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "48px 24px",
    borderRadius: "12px",
    border: "1px dashed var(--border)",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "40px",
  },
  emptyText: {
    margin: 0,
    fontSize: "16px",
    color: "var(--text-body, var(--text))",
    maxWidth: "380px",
    lineHeight: "1.6",
  },
  emptyBtn: {
    padding: "10px 24px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "var(--btn-text)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
