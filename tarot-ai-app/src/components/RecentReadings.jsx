import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRecentEntries } from "../store/dashboardSlice.js";

/**
 * RecentReadings — renders the last 3 journal entry summaries from dashboardSlice.
 * Each entry shows date, spread type, and intention; clicking navigates to /journal/:id.
 * Requirements: 10.2, 10.3
 */
export default function RecentReadings() {
  const recentEntries = useSelector(getRecentEntries);

  if (!recentEntries || recentEntries.length === 0) {
    return null;
  }

  return (
    <section style={styles.section} aria-labelledby="recent-readings-title">
      <h2 id="recent-readings-title" style={styles.heading}>
        Recent Readings
      </h2>
      <ul style={styles.list}>
        {recentEntries.map((entry) => {
          const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <li key={entry.id} style={styles.item}>
              <Link
                to={`/journal/${entry.id}`}
                style={styles.link}
                aria-label={`Reading on ${date}: ${entry.spreadName ?? "Unknown spread"}`}
              >
                <span style={styles.date}>{date}</span>
                <span style={styles.spread}>{entry.spreadName ?? "—"}</span>
                <span style={styles.intention}>
                  {entry.intention?.trim() || (
                    <em style={styles.noIntention}>No intention set</em>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
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
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  item: {
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--card-bg, var(--accent-bg))",
    overflow: "hidden",
  },
  link: {
    display: "grid",
    gridTemplateColumns: "160px 1fr 1fr",
    gap: "12px",
    padding: "14px 16px",
    textDecoration: "none",
    color: "inherit",
    alignItems: "center",
    transition: "background 0.15s",
  },
  date: {
    fontSize: "13px",
    color: "var(--text-muted, #888)",
    whiteSpace: "nowrap",
  },
  spread: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-h)",
  },
  intention: {
    fontSize: "13px",
    color: "var(--text-body, #555)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  noIntention: {
    fontStyle: "italic",
    color: "var(--text-muted, #888)",
  },
};
