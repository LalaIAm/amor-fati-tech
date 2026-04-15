import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthProvider from "./components/AuthProvider.jsx";
import AuthPage from "./components/AuthPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NewReadingPage from "./pages/NewReadingPage.jsx";
import JournalPage from "./pages/JournalPage.jsx";
import JournalEntryPage from "./pages/JournalEntryPage.jsx";
import { signOut } from "./store/authSlice.js";
import DeleteAccountButton from "./components/DeleteAccountButton.jsx";

/**
 * NavBar — minimal top navigation shown only when the user is authenticated.
 * Links: Dashboard, Journal. Action: Logout.
 * Requirements: 1.6, 10.1
 */
function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector((state) => state.auth.session);

  if (!session) return null;

  async function handleLogout() {
    await dispatch(signOut());
    navigate("/login", { replace: true });
  }

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      <div style={styles.navInner}>
        <span style={styles.brand} aria-hidden="true">
          ✦ Tarot
        </span>
        <div style={styles.navLinks}>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/journal"
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            })}
          >
            Journal
          </NavLink>
        </div>
        <DeleteAccountButton />
        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Log out"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}

/**
 * App — root component with AuthProvider, NavBar, and all routes.
 * Protected routes require an authenticated session.
 * Requirements: 1.6, 10.1
 */
function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading/new"
          element={
            <ProtectedRoute>
              <NewReadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal/:id"
          element={
            <ProtectedRoute>
              <JournalEntryPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  nav: {
    borderBottom: "1px solid var(--border)",
    background: "var(--bg)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navInner: {
    maxWidth: "1126px",
    margin: "0 auto",
    padding: "0 clamp(12px, 4vw, 24px)",
    height: "52px",
    display: "flex",
    alignItems: "center",
    gap: "clamp(8px, 2vw, 24px)",
  },
  brand: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--accent)",
    letterSpacing: "0.04em",
    marginRight: "8px",
    flexShrink: 0,
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flex: 1,
  },
  navLink: {
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text)",
    textDecoration: "none",
    transition: "background 0.15s, color 0.15s",
    minHeight: "44px",
    display: "inline-flex",
    alignItems: "center",
  },
  navLinkActive: {
    color: "var(--accent)",
    background: "var(--accent-bg)",
  },
  logoutBtn: {
    marginLeft: "auto",
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    flexShrink: 0,
    minHeight: "44px",
  },
};
