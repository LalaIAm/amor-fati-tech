# Tarot AI App

An AI-powered tarot card reading and journaling web app built with React, Vite, Redux Toolkit, and Supabase.

## State Management

The app uses Redux Toolkit with four slices in `src/store/`:

### `authSlice` (`src/store/authSlice.js`)

Manages authentication state with the following shape:

```js
{
  session: null,   // Supabase session object or null
  user: null,      // Supabase user object or null
  status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null      // error message string or null
}
```

**Async thunks** (backed by Supabase Auth):

- `signIn({ email, password })` — signs in with email/password
- `signUp({ email, password })` — registers a new user
- `signOut()` — signs out the current user

**Synchronous reducers:**

- `setSession(session)` — sets session and derives `user` from it; used by `AuthProvider` on auth state changes
- `clearSession()` — clears session and user; used on sign-out and session expiry

---

## Testing

Property-based tests use [fast-check](https://fast-check.dev/) with a minimum of 100 iterations per property.

### Property 1: Deck integrity (`src/data/deck.test.js`)

Validates the static deck data against these invariants:

- Exactly 78 cards total
- Exactly 22 Major Arcana
- Exactly 56 Minor Arcana
- No duplicate card ids
- All required fields (`id`, `name`, `arcana`, `imageDescription`, `uprightKeywords`, `reversedKeywords`) are present and non-empty on every card

Run tests with:

```bash
npx vitest --run
```

---

## Static Deck Data (`src/data/deck.js`)

The full 78-card tarot deck is defined as a static JS array — never fetched from the database.

**Card shape:**

```js
{
  id: number,              // 0–77
  name: string,
  arcana: 'major' | 'minor',
  suit: string | undefined, // undefined for Major Arcana
  imageDescription: string,
  uprightKeywords: string[],
  reversedKeywords: string[],
}
```

**Composition:**

| Group                    | IDs   | Count    |
| ------------------------ | ----- | -------- |
| Major Arcana             | 0–21  | 22 cards |
| Minor Arcana — Wands     | 22–35 | 14 cards |
| Minor Arcana — Cups      | 36–49 | 14 cards |
| Minor Arcana — Swords    | 50–63 | 14 cards |
| Minor Arcana — Pentacles | 64–77 | 14 cards |

The deck engine (`src/engine/deck.js`) consumes this data via `createDeck()`, which returns a copy of the array for shuffling and drawing.

---

## Deck Engine (`src/engine/deck.js`)

Pure functions for deck manipulation — no side effects, fully testable without mocking.

### `createDeck()`

Returns a shallow copy of the static 78-card deck array.

```js
const deck = createDeck(); // TarotCard[]
```

### `shuffle(deck)`

Returns a new array with cards in random order using Fisher-Yates. Does not mutate the input.

```js
const shuffled = shuffle(deck); // TarotCard[]
```

### `assignReversed(card)`

Returns `true` (reversed) or `false` (upright) with 50% probability each. The `card` argument is accepted for API consistency but not used.

```js
const isReversed = assignReversed(card); // boolean
```

### `draw(shuffledDeck, count, positions)`

Takes the first `count` cards from a shuffled deck and pairs each with a spread position and a randomly assigned reversal.

```js
const drawnCards = draw(shuffled, 3, positions);
// DrawnCard[] — each: { card: TarotCard, reversed: boolean, position: SpreadPosition }
```

**Types:**

```js
// SpreadPosition
{ index: number, label: string, description: string }

// DrawnCard
{ card: TarotCard, reversed: boolean, position: SpreadPosition }
```

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
