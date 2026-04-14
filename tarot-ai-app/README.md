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

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
