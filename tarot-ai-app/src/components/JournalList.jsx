import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchJournalEntries } from "../store/journalSlice.js";

export default function JournalList() {
  const dispatch = useDispatch();
  const { entries, status, error } = useSelector((state) => state.journal);

  useEffect(() => {
    dispatch(fetchJournalEntries());
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading journal entries…</p>;
  }

  if (status === "failed") {
    return <p>Failed to load journal: {error}</p>;
  }

  if (entries.length === 0) {
    return <p>No journal entries yet. Start your first reading!</p>;
  }

  return (
    <ul className="journal-list">
      {entries.map((entry) => {
        const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <li key={entry.id} className="journal-list__item">
            <Link to={`/journal/${entry.id}`} className="journal-list__link">
              <span className="journal-list__date">{date}</span>
              <span className="journal-list__spread">{entry.spreadName}</span>
              <span className="journal-list__intention">
                {entry.intention?.trim() || "No intention set"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
