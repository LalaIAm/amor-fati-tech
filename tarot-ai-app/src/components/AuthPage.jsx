import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn, signUp, signInWithOAuth } from "../store/authSlice.js";

const OAUTH_ENABLED = import.meta.env.VITE_OAUTH_ENABLED === "true";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, session } = useSelector((state) => state.auth);

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to dashboard on successful auth with a valid session
  useEffect(() => {
    if (status === "succeeded" && session) {
      navigate("/dashboard");
    }
  }, [status, session, navigate]);

  const isLoading = status === "loading";

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === "login") {
      dispatch(signIn({ email, password }));
    } else {
      dispatch(signUp({ email, password }));
    }
  }

  function handleOAuth() {
    dispatch(signInWithOAuth({ provider: "google" }));
  }

  function toggleMode() {
    setMode((m) => (m === "login" ? "register" : "login"));
  }

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✦ Tarot AI</h1>
        <h2 style={styles.subtitle}>
          {mode === "login" ? "Sign in to your account" : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <label style={styles.label} htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={styles.input}
          />

          <label style={styles.label} htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={styles.input}
          />

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{ ...styles.button, ...styles.primaryButton }}
          >
            {isLoading
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        {OAUTH_ENABLED && (
          <>
            <div style={styles.divider}>
              <span style={styles.dividerText}>or</span>
            </div>
            <button
              type="button"
              onClick={handleOAuth}
              disabled={isLoading}
              style={{ ...styles.button, ...styles.oauthButton }}
            >
              Continue with Google
            </button>
          </>
        )}

        <p style={styles.toggle}>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            disabled={isLoading}
            style={styles.toggleButton}
          >
            {mode === "login" ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100svh",
    padding: "24px 16px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "40px 32px",
    boxSizing: "border-box",
    boxShadow: "var(--shadow)",
    background: "var(--bg)",
  },
  title: {
    margin: "0 0 4px",
    fontSize: "28px",
    letterSpacing: "-0.5px",
    color: "var(--accent)",
  },
  subtitle: {
    margin: "0 0 28px",
    fontSize: "16px",
    fontWeight: 400,
    color: "var(--text)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-h)",
    textAlign: "left",
    marginTop: "8px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-h)",
    fontSize: "16px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  error: {
    margin: "4px 0 0",
    padding: "10px 12px",
    borderRadius: "6px",
    background: "var(--error-bg)",
    border: "1px solid var(--error-border)",
    color: "var(--error)",
    fontSize: "14px",
    textAlign: "left",
  },
  button: {
    padding: "11px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
    transition: "opacity 0.15s",
  },
  primaryButton: {
    background: "var(--accent)",
    color: "var(--btn-text)",
  },
  oauthButton: {
    background: "var(--social-bg)",
    color: "var(--text-h)",
    border: "1px solid var(--border)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0 0",
    gap: "12px",
  },
  dividerText: {
    color: "var(--text)",
    fontSize: "13px",
    flexShrink: 0,
    margin: "0 auto",
  },
  toggle: {
    marginTop: "24px",
    fontSize: "14px",
    color: "var(--text)",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    padding: 0,
    textDecoration: "underline",
  },
};
