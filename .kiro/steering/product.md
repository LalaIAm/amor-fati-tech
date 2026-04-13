---
inclusion: always
---

# Product: Tarot AI App

An AI-powered tarot card reading and journaling web app. Users draw from a standard 78-card deck, receive personalized GPT-4o interpretations based on their stated intention, and maintain a private journal of past readings.

## Core Concepts

- **Reading**: A session where the user selects a spread, optionally sets an intention, draws cards, and receives AI interpretations. Readings are auto-saved to the journal on completion.
- **Spread**: A named layout pattern defining how many cards are drawn and their positional meanings. Three built-in spreads: Single Card, Three-Card (Past/Present/Future), Celtic Cross (10 cards). Spread definitions live in `src/data/spreads.js` and seed rows in `supabase/seed.sql`.
- **Intention**: An optional user-provided question or theme (max 500 characters) passed to the AI to personalize the interpretation. Never required, always respected.
- **Journal**: A private, persistent log of all completed readings. Each entry stores the spread used, cards drawn (with positions and reversal state), AI interpretations, user notes, and journaling prompt responses. Isolated per user via RLS.
- **Pattern Insights**: AI-generated monthly summaries of recurring themes across a user's readings. Only triggered after the user has 5 or more readings. Displayed on the Dashboard.

## Key User Flows

1. Register / Login → Dashboard
2. Dashboard → New Reading → Select spread → (Optional) Set intention → Draw cards → View streaming AI interpretation → Auto-saved to journal
3. Dashboard / Journal → Open past entry → Add or edit notes → Respond to journaling prompts
4. Dashboard → View frequent cards widget and pattern insight summary

## Domain Rules

- The deck is always 78 cards (static, never fetched from DB). Card data lives in `src/data/deck.js`.
- Cards can be drawn upright or reversed. Reversal is assigned randomly by `src/engine/deck.js`.
- AI interpretation is requested only after all cards are drawn, never mid-spread.
- OpenAI is **never called from the client**. All AI calls go through the Supabase Edge Function `/interpret`, which validates the user's JWT before proxying to OpenAI.
- Journal entries belong exclusively to the authenticated user. No sharing or public access.
- Pattern Insights are only generated when the user has 5+ readings; do not surface the feature before that threshold.
- Intention input must be capped at 500 characters in both the UI and the Edge Function prompt construction.
