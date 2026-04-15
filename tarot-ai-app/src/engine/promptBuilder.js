/**
 * Pure prompt-building logic for the AI interpretation request.
 * Shared between the Supabase Edge Function and property tests.
 */

const INTENTION_MAX_CHARS = 500;

/**
 * Builds the user prompt for the GPT-4o interpretation request.
 *
 * @param {Array<{cardName: string, reversed: boolean, positionLabel: string, positionDescription: string}>} drawnCards
 * @param {string|null|undefined} intention - User's intention; null/empty/whitespace = general reading
 * @param {string[]} [previousInterpretationIds] - IDs of prior interpretations to enforce distinctness
 * @returns {string}
 */
export function buildPrompt(
  drawnCards,
  intention,
  previousInterpretationIds = [],
) {
  const trimmedIntention =
    intention && typeof intention === "string" ? intention.trim() : "";

  const intentionText =
    trimmedIntention.length > 0
      ? `The querent's intention or question is: "${trimmedIntention.slice(0, INTENTION_MAX_CHARS)}"`
      : "This is a general reading with no specific intention. Provide broadly applicable guidance.";

  const cardLines = drawnCards
    .map(
      (c, i) =>
        `Card ${i + 1} — Position: "${c.positionLabel}" (${c.positionDescription})\n` +
        `  Card name: ${c.cardName}\n` +
        `  Orientation: ${c.reversed ? "Reversed" : "Upright"}`,
    )
    .join("\n\n");

  const distinctnessNote =
    previousInterpretationIds.length > 0
      ? `\n\nIMPORTANT: This reading has been requested before (prior interpretation IDs: ${previousInterpretationIds.join(", ")}). ` +
        `You MUST generate a meaningfully distinct interpretation that explores different themes, symbols, and insights than previous readings.`
      : "";

  return (
    `You are an expert tarot reader providing a thoughtful, personalized reading.\n\n` +
    `${intentionText}${distinctnessNote}\n\n` +
    `The following cards have been drawn:\n\n${cardLines}\n\n` +
    `For each card, write an interpretation of 100–400 words that references:\n` +
    `- The card's name\n` +
    `- Its orientation (upright or reversed) and how that affects the meaning\n` +
    `- Its position label and what that position represents\n` +
    `- The querent's intention (or general guidance if no intention was set)\n\n` +
    `After interpreting each card individually, write a summary interpretation synthesizing all cards in the context of the intention.\n\n` +
    `Finally, generate exactly 3 reflective journaling prompts tailored to the drawn cards and the intention.\n\n` +
    `Respond ONLY with a valid JSON object in this exact shape (no markdown, no extra text):\n` +
    `{\n` +
    `  "cardInterpretations": [\n` +
    `    { "positionIndex": 0, "text": "..." }\n` +
    `  ],\n` +
    `  "summaryInterpretation": "...",\n` +
    `  "journalingPrompts": ["prompt1", "prompt2", "prompt3"]\n` +
    `}`
  );
}
