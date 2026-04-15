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

- `signIn({ email, password })` — signs in with email/password via `supabase.auth.signInWithPassword`
- `signUp({ email, password })` — registers a new user via `supabase.auth.signUp`
- `signOut()` — signs out the current user via `supabase.auth.signOut`; clears `session` and `user` on fulfillment
- `signInWithOAuth({ provider })` — initiates OAuth sign-in via `supabase.auth.signInWithOAuth`; redirects the browser, so the session is set later via `setSession` from `AuthProvider`

All thunks handle `pending` (sets `status: 'loading'`, clears `error`), `fulfilled`, and `rejected` (sets `status: 'failed'`, sets `error` to the Supabase error message).

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

### Property 2: Shuffle is a permutation (`src/data/deck.test.js`)

Validates that `shuffle()` from `src/engine/deck.js` is a true permutation:

- Output length equals input length
- Output contains exactly the same card ids as the input (no additions or omissions)
- Input array is not mutated

### Property 3: Reversed orientation distribution (`src/data/deck.test.js`)

Validates that `assignReversed()` from `src/engine/deck.js` produces a statistically fair coin flip:

- Over a single sample of 10,000 draws, the proportion of reversed cards must fall within 0.5 ± 0.05 (i.e. between 0.45 and 0.55)
- Uses a large sample size (10,000) rather than many smaller runs to ensure reliable convergence (>6σ margin) without flaky failures

### Property 4: Draw count matches spread (`src/data/deck.test.js`)

Validates that `draw()` from `src/engine/deck.js` returns the correct number of cards for any spread size:

- For any arbitrary count N (1–10), `draw()` returns exactly N cards
- No card id is repeated in the drawn set

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

## Spread Definitions (`src/data/spreads.js`)

Built-in spread definitions as plain JS objects. Never fetched from the database.

**Spread shape:**

```js
{
  id: string,              // 'single' | 'three-card' | 'celtic-cross'
  name: string,
  description: string,
  positions: SpreadPosition[],
}

// SpreadPosition
{ index: number, label: string, description: string }
```

**Built-in spreads:**

| ID             | Name         | Card Count |
| -------------- | ------------ | ---------- |
| `single`       | Single Card  | 1          |
| `three-card`   | Three Card   | 3          |
| `celtic-cross` | Celtic Cross | 10         |

**Helpers:**

- `getSpreads()` — returns all three spreads
- `getSpreadById(id)` — returns a spread by id, or `undefined` if not found

---

## Components

### `SpreadSelector` (`src/components/SpreadSelector.jsx`)

Renders the spread selection step of the new reading flow. Displays all three built-in spreads as selectable cards, shows a position-by-position preview for the selected spread, and emits a confirmation callback when the user proceeds.

**Props:**

| Prop        | Type       | Description                                                    |
| ----------- | ---------- | -------------------------------------------------------------- |
| `onConfirm` | `function` | Called with the selected spread object when the user confirms. |

**Behavior:**

- Reads `state.reading.selectedSpread` from Redux to track the active selection
- Dispatches `setSpread(spread)` from `readingSlice` on card click
- Shows an `aria-live` position preview panel below the spread grid when a spread is selected
- The "Continue" button is disabled until a spread is selected; enabled state dispatches `onConfirm(selectedSpread)`

---

### `JournalList` (`src/components/JournalList.jsx`)

Renders the user's journal entries in reverse-chronological order (most recent first).

**Behavior:**

- Dispatches `fetchJournalEntries()` from `journalSlice` on mount
- Shows a loading message while `status === 'loading'`
- Shows an error message (including the error string) when `status === 'failed'`
- Shows an empty-state prompt when there are no entries
- Each entry renders as a `<Link>` to `/journal/:id` displaying:
  - Formatted date (`month day, year`)
  - Spread name
  - Intention text, or `"No intention set"` when absent/whitespace-only

**CSS classes:** `journal-list`, `journal-list__item`, `journal-list__link`, `journal-list__date`, `journal-list__spread`, `journal-list__intention`

### `RecentReadings` (`src/components/RecentReadings.jsx`)

Renders the last 3 journal entry summaries from `dashboardSlice.recentEntries` on the Dashboard.

**Behavior:**

- Reads `state.dashboard.recentEntries` via the `getRecentEntries` selector
- Returns `null` (renders nothing) when the entries list is empty or undefined
- Each entry renders as a `<Link>` to `/journal/:id` displaying:
  - Formatted date (`month day, year`)
  - Spread name (falls back to `"—"` if absent)
  - Intention text, or `"No intention set"` (italicised) when absent/whitespace-only
- Each link has an `aria-label` summarising the date and spread name for screen readers
- Layout uses a 3-column CSS Grid: date (160 px fixed) / spread name / intention

---

## Routing & App Shell (`src/App.jsx`)

The root `App` component wires together authentication, navigation, and all routes.

**Routes:**

| Path           | Component                 | Protected |
| -------------- | ------------------------- | --------- |
| `/login`       | `AuthPage`                | No        |
| `/dashboard`   | `DashboardPage`           | Yes       |
| `/reading/new` | `NewReadingPage`          | Yes       |
| `/journal`     | `JournalPage`             | Yes       |
| `/journal/:id` | `JournalEntryPage`        | Yes       |
| `/` (fallback) | Redirects to `/dashboard` | —         |

Protected routes are wrapped with `ProtectedRoute`, which redirects unauthenticated users to `/login`.

**`NavBar`**

A sticky top navigation bar rendered only when a session is active (`state.auth.session` is non-null).

- Links to `/dashboard` and `/journal` using React Router `NavLink` (active link styled with `--accent` color)
- "Log out" button dispatches `signOut()` from `authSlice` then redirects to `/login`
- Hidden entirely on the login page (no session)

**`AuthProvider`**

Wraps the entire app to subscribe to Supabase auth state changes and keep `authSlice` in sync. Dispatches `setSession` on login and `clearSession` on sign-out or session expiry.

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
