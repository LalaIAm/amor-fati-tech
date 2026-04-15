import { useDispatch, useSelector } from "react-redux";
import { setIntention } from "../store/readingSlice.js";

const MAX_LENGTH = 500;

export default function IntentionInput({ onConfirm }) {
  const dispatch = useDispatch();
  const intention = useSelector((state) => state.reading.intention);

  function handleChange(e) {
    const val = e.target.value;
    // Normalize whitespace-only to ""
    dispatch(setIntention(val.trim() === "" ? "" : val));
  }

  function handleConfirm() {
    if (onConfirm) onConfirm(intention);
  }

  const remaining = MAX_LENGTH - intention.length;
  const isNearLimit = remaining <= 50;

  return (
    <section style={styles.container} aria-labelledby="intention-input-title">
      <h2 id="intention-input-title" style={styles.heading}>
        Set Your Intention
      </h2>
      <p style={styles.subtext}>
        Optionally share a question or theme to personalise your reading. You
        can leave this blank for a general reading.
      </p>

      <div style={styles.textareaWrapper}>
        <label htmlFor="intention-textarea" style={styles.label}>
          Your intention (optional)
        </label>
        <textarea
          id="intention-textarea"
          value={intention}
          onChange={handleChange}
          maxLength={MAX_LENGTH}
          rows={4}
          placeholder="e.g. What should I focus on in my career right now?"
          style={styles.textarea}
          aria-describedby="intention-counter"
        />
        <span
          id="intention-counter"
          style={{
            ...styles.counter,
            ...(isNearLimit ? styles.counterNearLimit : {}),
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {remaining} character{remaining !== 1 ? "s" : ""} remaining
        </span>
      </div>

      <button type="button" onClick={handleConfirm} style={styles.confirmBtn}>
        {intention.trim()
          ? "Continue with intention"
          : "Continue without intention"}
      </button>
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
    margin: "0 0 8px",
    fontSize: "24px",
    color: "var(--text-h)",
  },
  subtext: {
    margin: "0 0 24px",
    color: "var(--text)",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  textareaWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "24px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-h)",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-h)",
    fontSize: "15px",
    lineHeight: "1.6",
    resize: "vertical",
    outline: "none",
    fontFamily: "var(--sans)",
    width: "100%",
    boxSizing: "border-box",
  },
  counter: {
    fontSize: "12px",
    color: "var(--text)",
    textAlign: "right",
  },
  counterNearLimit: {
    color: "#dc2626",
    fontWeight: 500,
  },
  confirmBtn: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
    transition: "opacity 0.15s",
  },
};
