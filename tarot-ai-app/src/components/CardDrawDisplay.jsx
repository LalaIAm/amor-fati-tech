import { useSelector } from "react-redux";

/**
 * Displays drawn cards in their spread positions.
 * Respects prefers-reduced-motion for card flip animation.
 * Each card image has alt text containing name + imageDescription (Req 11.3).
 */
export default function CardDrawDisplay() {
  const drawnCards = useSelector((state) => state.reading.drawnCards);

  if (!drawnCards || drawnCards.length === 0) return null;

  return (
    <section style={styles.container} aria-labelledby="card-draw-title">
      <h2 id="card-draw-title" style={styles.heading}>
        Your Cards
      </h2>
      <div style={styles.grid}>
        {drawnCards.map((drawnCard, idx) => (
          <CardSlot key={idx} drawnCard={drawnCard} />
        ))}
      </div>
    </section>
  );
}

function CardSlot({ drawnCard }) {
  const { card, reversed, position } = drawnCard;
  const altText = `${card.name} — ${card.imageDescription}`;

  return (
    <article style={styles.slot} aria-label={`${position.label}: ${card.name}`}>
      <p style={styles.positionLabel}>{position.label}</p>
      <p style={styles.positionDesc}>{position.description}</p>

      {/* Card face — uses CSS class for animation so prefers-reduced-motion can suppress it */}
      <div
        className={`card-face${reversed ? " card-reversed" : ""}`}
        style={{
          ...styles.cardFace,
          ...(reversed ? styles.cardFaceReversed : {}),
        }}
        aria-label={altText}
      >
        {/* Placeholder image — real imagery would use card.id to load an asset */}
        <img
          src={`/cards/${card.id}.svg`}
          alt={altText}
          style={styles.cardImg}
          onError={(e) => {
            // Fallback: hide broken image, show text card
            e.currentTarget.style.display = "none";
          }}
        />
        <div style={styles.cardTextFallback} aria-hidden="true">
          <span style={styles.cardSymbol}>✦</span>
          <span style={styles.cardName}>{card.name}</span>
        </div>
      </div>

      <div style={styles.badges}>
        <span
          style={{
            ...styles.badge,
            ...(reversed ? styles.badgeReversed : styles.badgeUpright),
          }}
        >
          {reversed ? "Reversed" : "Upright"}
        </span>
      </div>

      <p style={styles.cardNameLabel}>{card.name}</p>
    </article>
  );
}

const styles = {
  container: {
    padding: "32px 24px",
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "left",
  },
  heading: {
    margin: "0 0 24px",
    fontSize: "24px",
    color: "var(--text-h)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "20px",
  },
  slot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
  },
  positionLabel: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  positionDesc: {
    margin: 0,
    fontSize: "11px",
    color: "var(--text)",
    lineHeight: "1.4",
    minHeight: "32px",
  },
  cardFace: {
    position: "relative",
    width: "100px",
    height: "160px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--accent-bg)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    /* Animation applied via CSS class; suppressed by prefers-reduced-motion */
    animationName: "cardFlipIn",
    animationDuration: "0.5s",
    animationFillMode: "both",
  },
  cardFaceReversed: {
    transform: "rotate(180deg)",
  },
  cardImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardTextFallback: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
  },
  cardSymbol: {
    fontSize: "28px",
    color: "var(--accent)",
  },
  cardName: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-h)",
    lineHeight: "1.3",
    textAlign: "center",
  },
  badges: {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    fontSize: "11px",
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: "999px",
    border: "1px solid",
  },
  badgeUpright: {
    color: "#16a34a",
    borderColor: "#16a34a",
    background: "rgba(22,163,74,0.08)",
  },
  badgeReversed: {
    color: "#dc2626",
    borderColor: "#dc2626",
    background: "rgba(220,38,38,0.08)",
  },
  cardNameLabel: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-h)",
    lineHeight: "1.3",
  },
};
