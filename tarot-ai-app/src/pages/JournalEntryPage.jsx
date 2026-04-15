import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CardGrid from "../components/CardGrid.jsx";
import InterpretationList from "../components/InterpretationList.jsx";
import JournalingPrompts from "../components/JournalingPrompts.jsx";
import NotesEditor from "../components/NotesEditor.jsx";
import {
  fetchJournalEntry,
  deleteJournalEntry,
} from "../store/journalSlice.js";

/**
 * JournalEntryPage — detail view for a single journal entry.
 *
 * - Fetches the entry by id on mount
 * - Composes CardGrid, InterpretationList, JournalingPrompts, NotesEditor
 * - Provides a delete button with confirmation; navigates to /journal after deletion
 *
 * Requirements: 6.3, 6.4, 6.5
 */
export default function JournalEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedEntry = useSelector((state) => state.journal.selectedEntry);
  const status = useSelector((state) => state.journal.status);
  const error = useSelector((state) => state.journal.error);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchJournalEntry(id));
    }
  }, [id, dispatch]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this journal entry? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    await dispatch(deleteJournalEntry(id));
    navigate("/journal");
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (status === "loading" && !selectedEntry) {
    return (
      <main style={styles.page}>
        <div style={styles.centered} role="status" aria-live="polite">
          <p style={styles.statusText}>Loading entry…</p>
        </div>
      </main>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (status === "failed" && !selectedEntry) {
    return (
      <main style={styles.page}>
        <div style={styles.centered} role="alert">
          <p style={styles.errorText}>
            {error ?? "Failed to load journal entry."}
          </p>
          <button
            style={styles.btnSecondary}
            onClick={() => navigate("/journal")}
          >
            Back to Journal
          </button>
        </div>
      </main>
    );
  }

  // ── No entry ───────────────────────────────────────────────────────────────

  if (!selectedEntry) return null;

  // ── Entry loaded ───────────────────────────────────────────────────────────

  const formattedDate = selectedEntry.createdAt
    ? new Date(selectedEntry.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/journal")}
            aria-label="Back to journal"
          >
            ← Journal
          </button>

          <div style={styles.headerMeta}>
            {formattedDate && (
              <time dateTime={selectedEntry.createdAt} style={styles.date}>
                {formattedDate}
              </time>
            )}
            {selectedEntry.spreadName && (
              <span style={styles.spreadName}>{selectedEntry.spreadName}</span>
            )}
          </div>

          {selectedEntry.intention && (
            <p style={styles.intention}>
              <span style={styles.intentionLabel}>Intention: </span>
              {selectedEntry.intention}
            </p>
          )}

          <button
            style={styles.btnDanger}
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete this journal entry"
          >
            {deleting ? "Deleting…" : "Delete Entry"}
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={styles.content}>
        <CardGrid drawnCards={selectedEntry.drawnCards} />
        <InterpretationList
          interpretations={selectedEntry.interpretations}
          summaryInterpretation={selectedEntry.summaryInterpretation}
        />
        <JournalingPrompts entryId={id} />
        <NotesEditor entryId={id} />
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
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: "16px",
    padding: "40px",
  },
  statusText: {
    margin: 0,
    color: "var(--text)",
    fontSize: "15px",
  },
  errorText: {
    margin: 0,
    color: "#dc2626",
    fontSize: "15px",
  },
  header: {
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
  },
  headerInner: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  backBtn: {
    alignSelf: "flex-start",
    background: "none",
    border: "none",
    padding: "4px 0",
    cursor: "pointer",
    color: "var(--accent)",
    fontSize: "14px",
    fontWeight: 500,
  },
  headerMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  date: {
    fontSize: "14px",
    color: "var(--text)",
  },
  spreadName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--accent)",
    padding: "2px 10px",
    borderRadius: "999px",
    border: "1px solid var(--accent)",
    background: "var(--accent-bg)",
  },
  intention: {
    margin: 0,
    fontSize: "15px",
    color: "var(--text)",
    lineHeight: "1.5",
  },
  intentionLabel: {
    fontWeight: 600,
    color: "var(--text-h)",
  },
  btnDanger: {
    alignSelf: "flex-start",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #dc2626",
    background: "transparent",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: "14px",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingBottom: "48px",
  },
};
