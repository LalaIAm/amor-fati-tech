import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./components/AuthProvider.jsx";
import AuthPage from "./components/AuthPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function ComingSoon({ page }) {
  return <p>Coming soon: {page}</p>;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ComingSoon page="Dashboard" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading/new"
          element={
            <ProtectedRoute>
              <ComingSoon page="New Reading" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <ComingSoon page="Journal" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal/:id"
          element={
            <ProtectedRoute>
              <ComingSoon page="Journal Entry" />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
