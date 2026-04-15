/**
 * CardGrid — renders drawn cards in a responsive grid layout.
 *
 * Each card shows:
 *   - Position label
 *   - Card image with alt text: "${card.name} — ${card.imageDescription}" (Req 11.3)
 *   - Card name
 *   - Orientation badge (Upright / Reversed)
 *
 * Props:
 *   drawnCards: Array<{ card: { id, name, imageDescription, ... }, reversed: boolean, position: { index, label, description } }>
 */
export default function CardGrid({ drawnCards }) {
  if (!drawnCards || drawnCards.length === 0) return null;

  return (
    <section style={styles.container} aria-labelledby="card-grid-title">
      <h2 id="card-grid-title" style={styles.heading}>
        Your Cards
      </h2>
      <div style={styles.grid}>
        {drawnCards.map((drawnCard, idx) => (
          <CardItem key={idx} drawnCard={drawnCard} />
        ))}
      </div>
    </section>
  );
}

function CardItem({ drawnCard }) {
  const { card, reversed, position } = drawnCard;
  const altText = `${card.name} — ${card.imageDescription}`;

  return (
    <article style={styles.card} aria-label={`${position.label}: ${card.name}`}>
      <p style={styles.positionLabel}>{position.label}</p>

      <div
        style={{
          ...styles.imageWrapper,
          ...(reversed ? styles.imageWrapperReversed : {}),
        }}
      >
        <img src="" alt={altText} style={styles.cardImg} />
        {/* Visible fallback since no real card images exist */}
        <div style={styles.cardFallback} aria-hidden="true">
          <span style={styles.cardSymbol}>✦</span>
          <span style={styles.cardName}>{card.name}</span>
        </div>
      </div>

      <p style={styles.cardNameLabel}>{card.name}</p>

      <span
        style={{
          ...styles.badge,
          ...(reversed ? styles.badgeReversed : styles.badgeUpright),
        }}
      >
        {reversed ? "Reversed" : "Upright"}
      </span>
    </article>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    margin: "0 0 20px",
    fontSize: "22px",
    color: "var(--text-h)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
  },
  positionLabel: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  imageWrapper: {
    position: "relative",
    width: "96px",
    height: "152px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--accent-bg)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapperReversed: {
    transform: "rotate(180deg)",
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
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "8px",
  },
  cardSymbol: {
    fontSize: "26px",
    color: "var(--accent)",
  },
  cardName: {
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--text-h)",
    lineHeight: "1.3",
  },
  cardNameLabel: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-h)",
    lineHeight: "1.3",
  },
  badge: {
    fontSize: "11px",
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: "999px",
    border: "1px solid",
  },
  badgeUpright: {
    color: "var(--success)",
    borderColor: "var(--success-border)",
    background: "var(--success-bg)",
  },
  badgeReversed: {
    color: "var(--error)",
    borderColor: "var(--error)",
    background: "var(--error-bg)",
  },
};
