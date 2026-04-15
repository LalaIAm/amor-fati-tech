import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpreads } from "../data/spreads.js";
import { setSpread } from "../store/readingSlice.js";

const spreads = getSpreads();

export default function SpreadSelector({ onConfirm }) {
  const dispatch = useDispatch();
  const selectedSpread = useSelector((state) => state.reading.selectedSpread);
  const [preview, setPreview] = useState(null); // spread being previewed

  function handleSelect(spread) {
    setPreview(spread);
    dispatch(setSpread(spread));
  }

  function handleConfirm() {
    if (selectedSpread && onConfirm) onConfirm(selectedSpread);
  }

  return (
    <section style={styles.container} aria-labelledby="spread-selector-title">
      <h2 id="spread-selector-title" style={styles.heading}>
        Choose a Spread
      </h2>
      <p style={styles.subtext}>
        Select a layout that fits your question or situation.
      </p>

      <div style={styles.grid} role="list">
        {spreads.map((spread) => {
          const isSelected = selectedSpread?.id === spread.id;
          return (
            <button
              key={spread.id}
              role="listitem"
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelect(spread)}
              style={{
                ...styles.card,
                ...(isSelected ? styles.cardSelected : {}),
              }}
            >
              <span style={styles.cardName}>{spread.name}</span>
              <span style={styles.cardMeta}>
                {spread.positions.length} card
                {spread.positions.length !== 1 ? "s" : ""}
              </span>
              <span style={styles.cardDesc}>{spread.description}</span>
            </button>
          );
        })}
      </div>

      {/* Position descriptions preview */}
      {preview && (
        <div style={styles.preview} aria-live="polite">
          <h3 style={styles.previewTitle}>{preview.name} — Positions</h3>
          <ol style={styles.positionList}>
            {preview.positions.map((pos) => (
              <li key={pos.index} style={styles.positionItem}>
                <strong style={styles.positionLabel}>{pos.label}</strong>
                <span style={styles.positionDesc}> — {pos.description}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <button
        type="button"
        disabled={!selectedSpread}
        onClick={handleConfirm}
        style={{
          ...styles.confirmBtn,
          ...(selectedSpread ? {} : styles.confirmBtnDisabled),
        }}
      >
        Continue with {selectedSpread ? selectedSpread.name : "a spread"}
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
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
    marginBottom: "24px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  cardSelected: {
    borderColor: "var(--accent)",
    boxShadow: "0 0 0 2px var(--accent-border)",
    background: "var(--accent-bg)",
  },
  cardName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  cardMeta: {
    fontSize: "12px",
    color: "var(--accent)",
    fontWeight: 500,
  },
  cardDesc: {
    fontSize: "13px",
    color: "var(--text)",
    lineHeight: "1.5",
  },
  preview: {
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--code-bg)",
    marginBottom: "24px",
  },
  previewTitle: {
    margin: "0 0 12px",
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-h)",
  },
  positionList: {
    margin: 0,
    padding: "0 0 0 20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  positionItem: {
    fontSize: "14px",
    color: "var(--text)",
    lineHeight: "1.5",
  },
  positionLabel: {
    color: "var(--text-h)",
  },
  positionDesc: {
    color: "var(--text)",
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
  confirmBtnDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
};
