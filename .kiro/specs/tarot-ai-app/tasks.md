# Implementation Plan: Tarot AI App

## Overview

Implement the Tarot AI App as a React + JavaScript SPA using Vite, Redux Toolkit (4 slices), Supabase (Auth, PostgreSQL, RLS, Edge Functions), and OpenAI GPT-4o. Tasks are ordered to build incrementally: project scaffold → deck engine → auth → reading flow → journal → dashboard → accessibility/polish.

## Tasks

- [x] 1. Scaffold project and configure tooling
  - Initialize Vite + React project with JavaScript
  - Install dependencies: `@reduxjs/toolkit react-redux @supabase/supabase-js react-router-dom fast-check vitest @testing-library/react @testing-library/jest-dom`
  - Create `src/store/index.js` with `configureStore` wiring all four reducers (stubs for now)
  - Create `src/supabaseClient.js` exporting the configured Supabase client (reads env vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
  - Wrap `<App>` in `<Provider store={store}>` and `<BrowserRouter>` in `src/main.jsx`
  - Configure Vitest in `vite.config.js` with jsdom environment and `@testing-library/jest-dom` setup file
  - _Requirements: 1.1, 9.2_

- [ ] 2. Implement static deck data and deck engine
  - [x] 2.1 Create `src/data/deck.js` with all 78 tarot cards as a plain JS array
    - Each card object: `{ id, name, arcana, suit, imageDescription, uprightKeywords, reversedKeywords }`
    - 22 Major Arcana (id 0–21), 56 Minor Arcana (id 22–77) across four suits
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Write property test for deck integrity (Property 1)
    - **Property 1: Deck integrity**
    - **Validates: Requirements 2.1, 2.2**
    - Tag comment: `// Feature: tarot-ai-app, Property 1: Deck integrity`
    - Assert exactly 78 cards, 22 Major Arcana, 56 Minor Arcana, no duplicate ids, all required fields non-empty

  - [x] 2.3 Create `src/engine/deck.js` with `createDeck`, `shuffle`, `draw`, `assignReversed`
    - `createDeck()` returns a copy of the static deck array
    - `shuffle(deck)` implements Fisher-Yates, returns a new array (does not mutate input)
    - `draw(shuffledDeck, count, positions)` returns `DrawnCard[]` with `assignReversed` applied to each
    - `assignReversed(card)` returns `true` with 50% probability
    - _Requirements: 2.3, 2.4_

  - [x] 2.4 Write property test for shuffle permutation (Property 2)
    - **Property 2: Shuffle is a permutation**
    - **Validates: Requirements 2.3**
    - Tag comment: `// Feature: tarot-ai-app, Property 2: Shuffle is a permutation`
    - Assert output contains same card ids as input, same length, no additions or omissions

  - [x] 2.5 Write property test for reversed orientation distribution (Property 3)
    - **Property 3: Reversed orientation distribution**
    - **Validates: Requirements 2.4**
    - Tag comment: `// Feature: tarot-ai-app, Property 3: Reversed orientation distribution`
    - Draw ≥1000 cards, assert proportion reversed is 0.5 ± 0.05

  - [x] 2.6 Write property test for draw count matches spread (Property 4)
    - **Property 4: Draw count matches spread**
    - **Validates: Requirements 2.3, 3.3**
    - Tag comment: `// Feature: tarot-ai-app, Property 4: Draw count matches spread`
    - For arbitrary N (1–10), assert `draw` returns exactly N cards with no repeated card ids

- [x] 3. Implement spread definitions
  - Create `src/data/spreads.js` defining the three built-in spreads as plain JS objects
    - `single`: 1 position ("Present")
    - `three-card`: 3 positions (Past / Present / Future)
    - `celtic-cross`: 10 positions with labels and descriptions
  - Export a `getSpreads()` helper returning all three and a `getSpreadById(id)` helper
  - _Requirements: 3.1, 3.2_

- [x] 4. Implement Redux store slices
  - [x] 4.1 Implement `src/store/authSlice.js`
    - `signIn`, `signUp`, `signOut` async thunks calling Supabase Auth
    - `signInWithOAuth` async thunk calling `supabase.auth.signInWithOAuth` for third-party providers
    - `setSession` and `clearSession` synchronous reducers
    - Handle `pending/fulfilled/rejected` for all thunks; set `status` and `error` fields
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 4.2 Write property test for auth round-trip (Property 5)
    - **Property 5: Auth round-trip**
    - **Validates: Requirements 1.2, 1.4**
    - Tag comment: `// Feature: tarot-ai-app, Property 5: Auth round-trip`
    - For any valid email and password ≥8 chars, registering then signing in SHALL produce a non-null session and user in `authSlice`

  - [x] 4.3 Write property test for auth error conditions (Property 6)
    - **Property 6: Auth error conditions**
    - **Validates: Requirements 1.3, 1.5**
    - Tag comment: `// Feature: tarot-ai-app, Property 6: Auth error conditions`
    - Duplicate email registration SHALL set `authSlice.status` to `'failed'`; invalid credentials SHALL NOT set a session

  - [x] 4.4 Implement `src/store/readingSlice.js`
    - `setSpread`, `setIntention` (normalize whitespace-only to `""`), `setDrawnCards`, `appendInterpretation`, `resetReading` reducers
    - `fetchInterpretation` async thunk: calls Supabase Edge Function `/interpret` with streaming, dispatches `appendInterpretation` per chunk; passes `previousInterpretationIds` to enforce distinct interpretations
    - `saveReading` async thunk: writes `journal_entries` + `drawn_cards` rows to Supabase
    - Status transitions: `idle → drawing → interpreting → saving → done | error`
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.3, 5.4, 5.5, 5.6_

  - [x] 4.5 Write property test for whitespace intention normalization (Property 17)
    - **Property 17: Whitespace intention treated as absent**
    - **Validates: Requirements 4.1, 4.3**
    - Tag comment: `// Feature: tarot-ai-app, Property 17: Whitespace intention treated as absent`
    - Generate arbitrary whitespace-only strings; assert `readingSlice.intention` is normalized to `""`

  - [x] 4.6 Implement `src/store/journalSlice.js`
    - `fetchJournalEntries`, `fetchJournalEntry`, `updateNotes`, `savePromptResponse`, `deleteJournalEntry` async thunks
    - `selectEntry` synchronous reducer
    - Handle all thunk lifecycle states
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 8.4_

  - [x] 4.7 Write property test for journal entry round-trip (Property 10)
    - **Property 10: Journal entry round-trip**
    - **Validates: Requirements 4.4, 6.1, 6.3**
    - Tag comment: `// Feature: tarot-ai-app, Property 10: Journal entry round-trip`
    - For any completed reading, saving then retrieving the journal entry SHALL return identical spread id, card ids, orientations, interpretation texts, and intention

  - [x] 4.8 Write property test for prompt response round-trip (Property 14)
    - **Property 14: Prompt response round-trip**
    - **Validates: Requirements 8.4**
    - Tag comment: `// Feature: tarot-ai-app, Property 14: Prompt response round-trip`
    - For any user response to a journaling prompt, saving then retrieving the entry SHALL return the same response text at the same prompt index in `journalSlice.selectedEntry.promptResponses`

  - [x] 4.9 Implement `src/store/dashboardSlice.js`
    - `fetchDashboard` async thunk: queries recent 3 entries, aggregates card frequencies (top 3), fetches latest pattern insight
    - Expose `getFrequentCards()` and `getRecentEntries()` selector helpers
    - _Requirements: 7.1, 7.2, 10.1, 10.2, 10.4, 10.5, 10.6_

  - [x] 4.10 Write property test for card frequency counts and top-3 display (Property 12)
    - **Property 12: Card frequency counts and top-3 display**
    - **Validates: Requirements 7.1, 7.2, 10.5**
    - Tag comment: `// Feature: tarot-ai-app, Property 12: Card frequency counts and top-3 display`
    - Generate arbitrary reading histories; assert frequency counts match drawn_cards rows and top-3 are correct

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Supabase database schema and RLS
  - [x] 6.1 Create `supabase/migrations/001_initial_schema.sql`
    - Tables: `spreads`, `journal_entries`, `drawn_cards`, `pattern_insights` per design schema
    - All indexes from design document
    - Enable RLS on `journal_entries`, `drawn_cards`, `pattern_insights`
    - Add the three RLS policies from the design document
    - _Requirements: 9.1, 9.3_

  - [x] 6.2 Write property test for user data isolation (Property 15)
    - **Property 15: User data isolation**
    - **Validates: Requirements 9.3**
    - Tag comment: `// Feature: tarot-ai-app, Property 15: User data isolation`
    - For any two distinct authenticated users A and B, all queries in user A's session SHALL return zero rows belonging to user B; use Supabase local emulator with two test users

  - [x] 6.3 Seed `spreads` table with the three built-in spread rows
    - Create `supabase/seed.sql` inserting `single`, `three-card`, `celtic-cross` rows
    - _Requirements: 3.1_

- [-] 7. Implement Supabase Edge Function for AI interpretation
  - [-] 7.1 Create `supabase/functions/interpret/index.js`
    - Validate the caller's JWT using Supabase Auth before processing
    - Build the GPT-4o prompt including each card's name, orientation, position label/description, and intention (or general-reading instruction when intention is null/empty); enforce 500-char cap on intention
    - Pass `previousInterpretationIds` in the prompt context to ensure distinct interpretations per Req 5.6
    - Call OpenAI Chat Completions API with streaming enabled
    - Stream response back to the client as newline-delimited JSON chunks
    - Return `{ cardInterpretations, summaryInterpretation, journalingPrompts }` shape with exactly 3 prompts
    - Handle OpenAI errors; return structured error response for timeout (>30s) / failure
    - _Requirements: 4.2, 4.3, 5.1, 5.2, 5.5, 5.6, 8.1, 9.2_

  - [ ] 7.2 Write property test for AI prompt construction (Property 7)
    - **Property 7: AI prompt construction includes all required fields**
    - **Validates: Requirements 4.2, 4.3, 5.1**
    - Tag comment: `// Feature: tarot-ai-app, Property 7: AI prompt construction includes all required fields`
    - Generate arbitrary card/spread/intention combinations; assert prompt string contains card name, orientation, position label, position description, and intention or general-reading instruction

  - [ ] 7.3 Write property test for interpretation word count (Property 8)
    - **Property 8: Interpretation word count**
    - **Validates: Requirements 5.2**
    - Tag comment: `// Feature: tarot-ai-app, Property 8: Interpretation word count`
    - For any card interpretation text returned by the AI engine or its mock, assert word count is between 100 and 400 inclusive

  - [ ] 7.4 Write property test for AI response structure (Property 9)
    - **Property 9: AI response structure**
    - **Validates: Requirements 5.5, 8.1**
    - Tag comment: `// Feature: tarot-ai-app, Property 9: AI response structure`
    - For any completed reading, assert the AI response includes a non-empty `summaryInterpretation` and exactly 3 `journalingPrompts` strings, reflected in `readingSlice` state

- [ ] 8. Implement authentication UI
  - [ ] 8.1 Create `src/components/AuthPage.jsx`
    - Login form (email + password) dispatching `signIn`
    - Registration form dispatching `signUp`
    - OAuth button dispatching `signInWithOAuth` (e.g. Google) when third-party auth is enabled
    - Toggle between login and registration views
    - Display inline error messages from `authSlice.error` (duplicate email, invalid credentials)
    - Redirect to `/dashboard` on successful auth
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7_

  - [ ] 8.2 Create `src/components/AuthProvider.jsx`
    - Subscribe to `supabase.auth.onAuthStateChange`
    - Dispatch `setSession` on session change; dispatch `clearSession` on sign-out
    - Redirect to `/login` when session expires, preserving intended destination
    - _Requirements: 1.4, 1.6_

  - [ ] 8.3 Add protected route wrapper
    - Create `src/components/ProtectedRoute.jsx` that redirects unauthenticated users to `/login`
    - Wrap `/dashboard`, `/reading/new`, `/journal`, `/journal/:id` routes
    - _Requirements: 1.4, 9.3_

- [ ] 9. Implement new reading flow UI
  - [ ] 9.1 Create `src/components/SpreadSelector.jsx`
    - Display all three spreads with name and description
    - On selection dispatch `setSpread`; show position descriptions before reading begins
    - _Requirements: 3.1, 3.2_

  - [ ] 9.2 Create `src/components/IntentionInput.jsx`
    - Textarea with `maxLength={500}` character counter
    - On change dispatch `setIntention` (trim whitespace-only to `""`)
    - _Requirements: 4.1_

  - [ ] 9.3 Create `src/components/CardDrawDisplay.jsx`
    - Read `drawnCards` from `readingSlice`
    - Render each card in its spread position with name, orientation badge, and `alt` text containing name + imageDescription
    - Respect `prefers-reduced-motion` for card flip animation
    - _Requirements: 2.5, 3.4, 11.3, 11.4_

  - [ ] 9.4 Write property test for card alt text present (Property 16)
    - **Property 16: Card alt text present**
    - **Validates: Requirements 11.3**
    - Tag comment: `// Feature: tarot-ai-app, Property 16: Card alt text present`
    - Generate arbitrary card data; render `CardDrawDisplay`; assert every `<img>` has non-empty `alt` containing card name and imageDescription

  - [ ] 9.5 Create `src/components/InterpretationPanel.jsx`
    - Display streaming interpretation text per card position as chunks arrive via `appendInterpretation`
    - Show loading spinner while `readingSlice.status === 'interpreting'`
    - Display summary interpretation and three journaling prompts after streaming completes
    - Show error message + retry button when `readingSlice.status === 'error'`
    - _Requirements: 5.3, 5.4, 5.5, 8.1, 8.2_

  - [ ] 9.6 Create `src/pages/NewReadingPage.jsx`
    - Compose `SpreadSelector → IntentionInput → CardDrawDisplay → InterpretationPanel` in sequence
    - On spread + intention confirmed: dispatch `setDrawnCards` (using deck engine), then dispatch `fetchInterpretation`
    - On interpretation complete: dispatch `saveReading`, then navigate to `/journal/:id`
    - _Requirements: 3.3, 5.1, 6.1_

- [ ] 10. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement journal UI
  - [ ] 11.1 Create `src/components/JournalList.jsx`
    - Dispatch `fetchJournalEntries` on mount
    - Render chronological list (most recent first) showing date, spread name, and intention per entry
    - Each entry links to `/journal/:id`
    - _Requirements: 6.2, 7.4_

  - [ ] 11.2 Write property test for journal chronological ordering (Property 11)
    - **Property 11: Journal chronological ordering**
    - **Validates: Requirements 6.2**
    - Tag comment: `// Feature: tarot-ai-app, Property 11: Journal chronological ordering`
    - Generate arbitrary sets of journal entries with random `created_at` timestamps; assert `journalSlice.entries` is sorted descending

  - [ ] 11.3 Write property test for journal entry summary fields (Property 13)
    - **Property 13: Journal entry summary fields**
    - **Validates: Requirements 7.4, 10.2**
    - Tag comment: `// Feature: tarot-ai-app, Property 13: Journal entry summary fields`
    - Generate arbitrary journal entries; render list; assert each row displays date, spread name, and intention or empty-intention indicator

  - [ ] 11.4 Create `src/components/NotesEditor.jsx`
    - Textarea bound to `selectedEntry.userNotes`
    - Auto-save on blur dispatching `updateNotes`
    - _Requirements: 6.4_

  - [ ] 11.5 Create `src/components/JournalingPrompts.jsx`
    - Display three prompts from `selectedEntry.journalingPrompts`
    - On prompt click: expand inline textarea pre-populated with prompt text
    - On blur: dispatch `savePromptResponse`
    - _Requirements: 8.2, 8.3, 8.4_

  - [ ] 11.6 Create `src/components/CardGrid.jsx` and `src/components/InterpretationList.jsx`
    - `CardGrid`: renders drawn cards in a grid layout with name, orientation badge, and position label; each card image has `alt` text with name and imageDescription
    - `InterpretationList`: renders the per-card interpretation texts and the summary interpretation
    - _Requirements: 2.5, 3.4, 5.5, 11.3_

  - [ ] 11.7 Create `src/pages/JournalEntryPage.jsx`
    - Dispatch `fetchJournalEntry(id)` on mount
    - Compose `CardGrid`, `InterpretationList`, `JournalingPrompts`, `NotesEditor`
    - Show delete button with confirmation dialog; on confirm dispatch `deleteJournalEntry` then navigate to `/journal`
    - _Requirements: 6.3, 6.4, 6.5_

  - [ ] 11.8 Create `src/pages/JournalPage.jsx`
    - Render `JournalList` and `PatternInsightBanner` (reads from `dashboardSlice.patternInsight`)
    - _Requirements: 6.2, 7.3_

- [ ] 12. Implement dashboard UI
  - [ ] 12.1 Create `src/components/RecentReadings.jsx`
    - Render last 3 journal entry summaries from `dashboardSlice.recentEntries`
    - Each entry shows date, spread type, intention; clicking navigates to `/journal/:id`
    - _Requirements: 10.2, 10.3_

  - [ ] 12.2 Create `src/components/FrequentCards.jsx`
    - Render top 3 cards from `dashboardSlice.frequentCards` with card name and draw count
    - Each card includes `alt` text with name and imageDescription
    - _Requirements: 7.2, 10.5_

  - [ ] 12.3 Create `src/components/PatternInsight.jsx`
    - Render `dashboardSlice.patternInsight` text when `totalReadings >= 5`
    - Hidden when fewer than 5 readings
    - _Requirements: 7.3, 10.4_

  - [ ] 12.4 Create `src/pages/DashboardPage.jsx`
    - Dispatch `fetchDashboard` on mount
    - Compose `RecentReadings`, `FrequentCards`, `PatternInsight`, and a "Start a New Reading" button navigating to `/reading/new`
    - Show empty-state prompt when `recentEntries` is empty
    - _Requirements: 10.1, 10.6, 10.7_

- [ ] 13. Implement routing and app shell
  - Create `src/App.jsx` with React Router routes: `/login`, `/dashboard`, `/reading/new`, `/journal`, `/journal/:id`
  - Wrap protected routes with `ProtectedRoute`
  - Include `AuthProvider` at the root so session changes propagate to the store
  - Add a minimal nav bar with links to Dashboard, Journal, and a logout button dispatching `signOut`
  - _Requirements: 1.6, 10.1_

- [ ] 14. Implement account deletion
  - Add a "Delete Account" action in user settings or profile area
  - On confirm: call Supabase to delete the auth user, which cascades to all `journal_entries`, `drawn_cards`, and `pattern_insights` rows via `ON DELETE CASCADE`
  - Dispatch `clearSession` and redirect to `/login` after deletion
  - _Requirements: 9.4_

- [ ] 15. Implement accessibility and responsive layout
  - [ ] 15.1 Add keyboard navigation to all interactive elements (spread cards, journal entries, prompts)
    - Ensure all clickable non-button elements have `role`, `tabIndex`, and `onKeyDown` handlers
    - _Requirements: 11.2_

  - [ ] 15.2 Add `prefers-color-scheme` dark/light mode support
    - Use CSS custom properties for theme tokens; apply `@media (prefers-color-scheme: dark)` overrides
    - _Requirements: 11.5_

  - [ ] 15.3 Add responsive CSS ensuring layout works from 320px to 2560px
    - Use CSS Grid/Flexbox; test breakpoints at 320px, 768px, 1280px, 2560px
    - _Requirements: 11.1_

  - [ ] 15.4 Add `prefers-reduced-motion` media query to disable card animations
    - Wrap all CSS animation/transition rules with `@media (prefers-reduced-motion: no-preference)`
    - _Requirements: 11.4_

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests (fast-check) validate universal correctness properties; unit tests validate specific examples and edge cases
- The Edge Function keeps the OpenAI API key server-side; never expose it to the client
- RLS policies enforce data isolation at the database level — no application-layer filtering needed
- All 17 correctness properties from the design document are covered by property test sub-tasks
