# Tech Stack

## Frontend

- **Framework**: React (JavaScript, not TypeScript)
- **Build tool**: Vite
- **Routing**: React Router DOM
- **State management**: Redux Toolkit (RTK) — 4 slices: `auth`, `reading`, `journal`, `dashboard`
- **Styling**: CSS custom properties with `@media (prefers-color-scheme)` for dark/light mode

## Backend

- **Platform**: Supabase (managed)
  - Auth (email/password + OAuth)
  - PostgreSQL with Row-Level Security (RLS)
  - Edge Functions (Deno) — used as AI proxy to keep OpenAI key server-side

## AI

- **Model**: OpenAI GPT-4o via Chat Completions API (streaming)
- **Integration**: Called only from Supabase Edge Function `/interpret`; never from the client

## Testing

- **Unit/property tests**: Vitest + `@testing-library/react` + `@testing-library/jest-dom`
- **Property-based testing**: `fast-check` (minimum 100 iterations per property)
- **Test environment**: jsdom (configured in `vite.config.js`)

## Key Dependencies

```
@reduxjs/toolkit
react-redux
@supabase/supabase-js
react-router-dom
fast-check
vitest
@testing-library/react
@testing-library/jest-dom
```

## Environment Variables

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- OpenAI API key is set server-side in the Edge Function environment only

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests (single pass, no watch)
npx vitest --run

# Build for production
npm run build

# Deploy Edge Functions
supabase functions deploy interpret

# Apply database migrations
supabase db push

# Start local Supabase (for integration tests)
supabase start
```
