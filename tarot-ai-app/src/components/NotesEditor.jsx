import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNotes } from "../store/journalSlice.js";

/**
 * NotesEditor — textarea bound to selectedEntry.userNotes.
 * Auto-saves on blur by dispatching updateNotes({ id, notes }).
 * Shows a subtle "Saving..." indicator while journalSlice.status === 'loading'.
 *
 * Requirements: 6.4
 */
export default function NotesEditor({ entryId }) {
  const dispatch = useDispatch();
  const selectedEntry = useSelector((state) => state.journal.selectedEntry);
  const status = useSelector((state) => state.journal.status);

  const [localValue, setLocalValue] = useState(selectedEntry?.userNotes ?? "");

  // Sync local value when selectedEntry changes (e.g. navigating to a different entry)
  useEffect(() => {
    setLocalValue(selectedEntry?.userNotes ?? "");
  }, [selectedEntry?.id, selectedEntry?.userNotes]);

  function handleBlur() {
    if (!entryId) return;
    dispatch(updateNotes({ id: entryId, notes: localValue }));
  }

  return (
    <div className="notes-editor">
      <label htmlFor="notes-textarea" className="notes-editor__label">
        Personal Notes
      </label>
      <textarea
        id="notes-textarea"
        className="notes-editor__textarea"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add your personal reflections here…"
        rows={6}
        aria-label="Personal notes"
      />
      {status === "loading" && (
        <span className="notes-editor__saving" aria-live="polite">
          Saving…
        </span>
      )}
    </div>
  );
}
