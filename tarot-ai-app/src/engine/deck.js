import staticDeck from "../data/deck.js";

/**
 * @typedef {Object} TarotCard
 * @property {number} id - 0–77
 * @property {string} name
 * @property {'major'|'minor'} arcana
 * @property {'wands'|'cups'|'swords'|'pentacles'|undefined} suit
 * @property {string} imageDescription
 * @property {string[]} uprightKeywords
 * @property {string[]} reversedKeywords
 */

/**
 * @typedef {Object} SpreadPosition
 * @property {number} index
 * @property {string} label
 * @property {string} description
 */

/**
 * @typedef {Object} DrawnCard
 * @property {TarotCard} card
 * @property {boolean} reversed
 * @property {SpreadPosition} position
 */

/**
 * Creates a full 78-card tarot deck (copy of static data).
 * @returns {TarotCard[]}
 */
export function createDeck() {
  return [...staticDeck];
}

/**
 * Returns a new shuffled copy of the deck using Fisher-Yates.
 * Does not mutate the input array.
 * @param {TarotCard[]} deck
 * @returns {TarotCard[]}
 */
export function shuffle(deck) {
  const result = [...deck];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Assigns a reversed orientation to a card with 50% probability.
 * @param {TarotCard} _card - unused, present for API consistency
 * @returns {boolean}
 */
export function assignReversed(_card) {
  return Math.random() < 0.5;
}

/**
 * Draws `count` cards from a shuffled deck, assigning each a position and reversed orientation.
 * @param {TarotCard[]} shuffledDeck
 * @param {number} count
 * @param {SpreadPosition[]} positions
 * @returns {DrawnCard[]}
 */
export function draw(shuffledDeck, count, positions) {
  return shuffledDeck.slice(0, count).map((card, i) => ({
    card,
    reversed: assignReversed(card),
    position: positions[i],
  }));
}
