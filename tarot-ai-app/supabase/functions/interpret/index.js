// Supabase Edge Function: /interpret
// Validates caller JWT, builds GPT-4o prompt, streams interpretation back to client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const TIMEOUT_MS = 30_000;
const INTENTION_MAX_CHARS = 500;

/**
 * Builds the system prompt for the GPT-4o interpretation request.
 * @param {Array} drawnCards - Array of { cardName, reversed, positionLabel, positionDescription }
 * @param {string|null} intention - User's intention (null/empty = general reading)
 * @param {string[]} previousInterpretationIds - IDs of prior interpretations to ensure distinctness
 * @returns {string}
 */
export function buildPrompt(drawnCards, intention, previousInterpretationIds) {
  const intentionText =
    intention && intention.trim().length > 0
      ? `The querent's intention or question is: "${intention.trim().slice(0, INTENTION_MAX_CHARS)}"`
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
    previousInterpretationIds && previousInterpretationIds.length > 0
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

/**
 * Validates the request body shape.
 * @param {any} body
 * @returns {{ valid: boolean, error?: string }}
 */
function validateBody(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  if (!Array.isArray(body.drawnCards) || body.drawnCards.length === 0) {
    return { valid: false, error: "drawnCards must be a non-empty array" };
  }
  for (const card of body.drawnCards) {
    if (
      typeof card.cardName !== "string" ||
      typeof card.reversed !== "boolean" ||
      typeof card.positionLabel !== "string" ||
      typeof card.positionDescription !== "string"
    ) {
      return {
        valid: false,
        error:
          "Each drawnCard must have cardName (string), reversed (boolean), positionLabel (string), positionDescription (string)",
      };
    }
  }
  return { valid: true };
}

/**
 * Main Edge Function handler.
 */
Deno.serve(async (req) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- JWT validation ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Authorization header" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- Parse and validate body ---
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { valid, error: validationError } = validateBody(body);
  if (!valid) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { drawnCards, intention, previousInterpretationIds = [] } = body;

  // --- Build prompt ---
  const userPrompt = buildPrompt(
    drawnCards,
    intention,
    previousInterpretationIds,
  );

  // --- Call OpenAI with timeout ---
  const openAiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openAiKey) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let openAiResponse;
  try {
    openAiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert tarot reader. Always respond with valid JSON only — no markdown, no extra text.",
          },
          { role: "user", content: userPrompt },
        ],
        stream: true,
        temperature: 0.8,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === "AbortError";
    return new Response(
      JSON.stringify({
        error: isTimeout
          ? "Interpretation timed out. Please try again."
          : "Failed to reach AI service. Please try again.",
      }),
      {
        status: isTimeout ? 504 : 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  clearTimeout(timeoutId);

  if (!openAiResponse.ok) {
    const errText = await openAiResponse.text().catch(() => "Unknown error");
    return new Response(
      JSON.stringify({
        error: `OpenAI error: ${openAiResponse.status} — ${errText}`,
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // --- Stream response back as newline-delimited JSON chunks ---
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    const reader = openAiResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;
          if (!trimmed.startsWith("data: ")) continue;

          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const delta = parsed.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              fullContent += delta;
              // Stream each delta chunk as a newline-delimited JSON line
              await writer.write(
                encoder.encode(JSON.stringify({ chunk: delta }) + "\n"),
              );
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      // Parse the complete accumulated JSON and emit the final structured response
      let parsed;
      try {
        // Extract JSON from the full content (GPT sometimes wraps in ```json blocks)
        const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : fullContent);
      } catch {
        await writer.write(
          encoder.encode(
            JSON.stringify({ error: "Failed to parse AI response as JSON" }) +
              "\n",
          ),
        );
        await writer.close();
        return;
      }

      const { cardInterpretations, summaryInterpretation, journalingPrompts } =
        parsed;

      // Validate structure
      if (
        !Array.isArray(cardInterpretations) ||
        typeof summaryInterpretation !== "string" ||
        !summaryInterpretation.trim() ||
        !Array.isArray(journalingPrompts) ||
        journalingPrompts.length !== 3
      ) {
        await writer.write(
          encoder.encode(
            JSON.stringify({
              error: "AI response did not match expected structure",
            }) + "\n",
          ),
        );
        await writer.close();
        return;
      }

      // Emit the final complete response
      await writer.write(
        encoder.encode(
          JSON.stringify({
            done: true,
            cardInterpretations,
            summaryInterpretation,
            journalingPrompts,
          }) + "\n",
        ),
      );
    } catch (err) {
      await writer.write(
        encoder.encode(
          JSON.stringify({ error: err.message ?? "Streaming error" }) + "\n",
        ),
      );
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
    },
  });
});
