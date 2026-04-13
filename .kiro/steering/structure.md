# Project Structure

```
tarot-ai-app/
├── src/
│   ├── main.jsx                  # Entry point — wraps App in <Provider> and <BrowserRouter>
│   ├── App.jsx                   # Route definitions + AuthProvider at root
│   ├── supabaseClient.js         # Configured Supabase client (reads VITE_ env vars)
│   │
│   ├── store/
│   │   ├── index.js              # configureStore wiring all 4 reducers
│   │   ├── authSlice.js          # Auth state: session, user, status, error
│   │   ├── readingSlice.js       # Active reading state: spread, intention, drawnCards, interpretations
│   │   ├── journalSlice.js       # Journal entries list + selected entry
│   │   └── dashboardSlice.js     # Recent entries, frequent cards, pattern insight
│   │
│   ├── data/
│   │   ├── deck.js               # Static array of all 78 tarot cards (plain JS, no DB)
│   │   └── spreads.js            # Built-in spread definitions + getSpreads() / getSpreadById()
│   │
│   ├── engine/
│   │   └── deck.js               # Pure functions: createDeck, shuffle, draw, assignReversed
│   │
│   ├── components/
│   │   ├── AuthPage.jsx          # Login + registration forms
│   │   ├── AuthProvider.jsx      # Supabase auth state listener → dispatches to authSlice
│   │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users to /login
│   │   ├── SpreadSelector.jsx
│   │   ├── IntentionInput.jsx
│   │   ├── CardDrawDisplay.jsx
│   │   ├── InterpretationPanel.jsx
│   │   ├── JournalList.jsx
│   │   ├── NotesEditor.jsx
│   │   ├── JournalingPrompts.jsx
│   │   ├── RecentReadings.jsx
│   │   ├── FrequentCards.jsx
│   │   └── PatternInsight.jsx
│   │
│   └── pages/
│       ├── DashboardPage.jsx     # /dashboard
│       ├── NewReadingPage.jsx    # /reading/new
│       ├── JournalPage.jsx       # /journal
│       └── JournalEntryPage.jsx  # /journal/:id
│
├── supabase/
│   ├── functions/
│   │   └── interpret/
│   │       └── index.js          # Edge Function: JWT validation + OpenAI streaming proxy
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                  # Inserts the 3 built-in spread rows
│
├── vite.config.js                # Vitest config (jsdom env, jest-dom setup)
└── .env                          # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

## Conventions

- **Pages** (`src/pages/`) are route-level components that compose smaller `src/components/`
- **Engine** (`src/engine/`) contains pure functions with no side effects — fully unit/property testable without mocking
- **Static data** (`src/data/`) is plain JS modules; deck data never hits the database
- **All Redux async work** uses `createAsyncThunk`; component local state is only for ephemeral UI (e.g. input focus)
- **Supabase is the only backend**; no separate API server exists
- **OpenAI is never called from the client** — always via the `interpret` Edge Function
- **RLS policies** enforce data isolation at the DB level; no app-layer user filtering needed
- **Property tests** are tagged with comments: `// Feature: tarot-ai-app, Property N: <name>`
