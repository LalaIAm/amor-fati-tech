# Product: Tarot AI App

An AI-powered tarot card reading and journaling web app. Users draw from a standard 78-card deck, receive personalized GPT-4o interpretations based on their stated intention, and maintain a private journal of past readings.

## Core Concepts

- **Reading**: A session where the user selects a spread, optionally sets an intention, draws cards, and receives AI interpretations
- **Spread**: A layout pattern (single card, three-card past/present/future, Celtic Cross 10-card)
- **Intention**: An optional question or theme (up to 500 chars) that personalizes the AI interpretation
- **Journal**: A private, persistent log of all readings with user notes and journaling prompt responses
- **Pattern Insights**: AI-generated monthly summaries of recurring themes (triggered after 5+ readings)

## Key User Flows

1. Register/login → Dashboard
2. Dashboard → Start new reading → Select spread → Set intention → Draw cards → View AI interpretation → Auto-saved to journal
3. Dashboard / Journal → View past entries → Add notes / respond to journaling prompts
4. Dashboard → View frequent cards and pattern insights
