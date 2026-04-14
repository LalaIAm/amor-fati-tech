/**
 * Built-in tarot spread definitions.
 * Each spread defines an id, name, description, and an array of positions.
 *
 * @typedef {Object} SpreadPosition
 * @property {number} index - 0-based position index
 * @property {string} label - Short position name
 * @property {string} description - What this position represents in the reading
 *
 * @typedef {Object} Spread
 * @property {string} id - Unique identifier ('single', 'three-card', 'celtic-cross')
 * @property {string} name - Display name
 * @property {string} description - Overview of the spread's purpose
 * @property {SpreadPosition[]} positions - Ordered list of card positions
 */

/** @type {Spread[]} */
const spreads = [
  {
    id: "single",
    name: "Single Card",
    description:
      "A focused one-card draw that offers a clear message or reflection for the present moment.",
    positions: [
      {
        index: 0,
        label: "Present",
        description:
          "The energy, situation, or guidance most relevant to you right now.",
      },
    ],
  },
  {
    id: "three-card",
    name: "Three Card",
    description:
      "A classic three-card spread exploring the past influences, present circumstances, and future possibilities surrounding your question.",
    positions: [
      {
        index: 0,
        label: "Past",
        description:
          "Past events or influences that have shaped the current situation.",
      },
      {
        index: 1,
        label: "Present",
        description: "The current state of affairs or the heart of the matter.",
      },
      {
        index: 2,
        label: "Future",
        description:
          "The likely outcome or direction if the current path continues.",
      },
    ],
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    description:
      "A comprehensive ten-card spread that provides deep insight into a situation, exploring its roots, influences, hopes, fears, and ultimate outcome.",
    positions: [
      {
        index: 0,
        label: "The Present",
        description:
          "The central issue or the querent's current situation — the heart of the matter.",
      },
      {
        index: 1,
        label: "The Challenge",
        description:
          "The immediate obstacle or crossing influence that complicates the present situation.",
      },
      {
        index: 2,
        label: "The Foundation",
        description:
          "The root cause or subconscious basis underlying the situation.",
      },
      {
        index: 3,
        label: "The Recent Past",
        description:
          "Events or influences that have recently passed and are fading from the situation.",
      },
      {
        index: 4,
        label: "The Crown",
        description:
          "The best possible outcome or the querent's conscious goal in this situation.",
      },
      {
        index: 5,
        label: "The Near Future",
        description:
          "What is likely to unfold in the near term as events develop.",
      },
      {
        index: 6,
        label: "The Self",
        description:
          "The querent's attitude, feelings, or position within the situation.",
      },
      {
        index: 7,
        label: "External Influences",
        description:
          "How others or the environment around the querent are affecting the situation.",
      },
      {
        index: 8,
        label: "Hopes and Fears",
        description:
          "The querent's inner hopes or fears — often two sides of the same coin.",
      },
      {
        index: 9,
        label: "The Outcome",
        description:
          "The final result or resolution if the current trajectory continues.",
      },
    ],
  },
];

/**
 * Returns all built-in spreads.
 * @returns {Spread[]}
 */
export function getSpreads() {
  return spreads;
}

/**
 * Returns a spread by its id, or undefined if not found.
 * @param {string} id
 * @returns {Spread|undefined}
 */
export function getSpreadById(id) {
  return spreads.find((spread) => spread.id === id);
}
