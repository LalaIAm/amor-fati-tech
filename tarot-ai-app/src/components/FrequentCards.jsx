import { useSelector } from "react-redux";
import { getFrequentCards } from "../store/dashboardSlice.js";

/**
 * FrequentCards — renders the top 3 most frequently drawn cards from dashboardSlice.
 * Each card shows name, draw count, and an image with proper alt text.
 * Requirements: 7.2, 10.5
 */
export default function FrequentCards() {
  const frequentCards = useSelector(getFrequentCards);

  if (!frequentCards || frequentCards.length === 0) {
    return null;
  }

  return (
    <section style={styles.section} aria-labelledby="frequent-cards-title">
      <h2 id="frequent-cards-title" style={styles.heading}>
        Most Drawn Cards
      </h2>
      <ul style={styles.list}>
        {frequentCards.map(({ card, count }, idx) => {
          const altText = card.imageDescription
            ? `${card.name} — ${card.imageDescription}`
            : card.name;

          return (
            <li key={card.id ?? idx} style={styles.item}>
              <div style={styles.imageWrapper}>
                <img src="" alt={altText} style={styles.cardImg} />
                {/* Visible fallback since no real card images exist */}
                <div style={styles.cardFallback} aria-hidden="true">
                  <span style={styles.cardSymbol}>✦</span>
                </div>
              </div>
              <div style={styles.info}>
                <span style={styles.cardName}>{card.name}</span>
                <span style={styles.count}>
                  {count} {count === 1 ? "draw" : "draws"}
                </span>
              </div>
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
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100px, 100%), 1fr))",
    gap: "16px",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--card-bg, var(--accent-bg))",
    textAlign: "center",
  },
  imageWrapper: {
    position: "relative",
    width: "72px",
    height: "114px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--accent-bg)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardFallback: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardSymbol: {
    fontSize: "22px",
    color: "var(--accent)",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  cardName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-h)",
    lineHeight: "1.3",
  },
  count: {
    fontSize: "12px",
    color: "var(--text-muted, #888)",
  },
};
