import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../store/authSlice.js";

/**
 * DeleteAccountButton — prompts the user to confirm, then permanently deletes
 * their account via the `delete_user` RPC. On success dispatches clearSession
 * (handled inside the thunk) and redirects to /login.
 * Requirements: 9.4
 */
export default function DeleteAccountButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const [error, setError] = useState(null);

  const isLoading = status === "loading";

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? " +
        "All your readings, journal entries, and data will be removed and cannot be recovered.",
    );
    if (!confirmed) return;

    setError(null);
    const result = await dispatch(deleteAccount());
    if (deleteAccount.fulfilled.match(result)) {
      navigate("/login", { replace: true });
    } else {
      setError(result.payload ?? "Failed to delete account. Please try again.");
    }
  }

  return (
    <div style={styles.wrapper}>
      {error && (
        <span style={styles.error} role="alert">
          {error}
        </span>
      )}
      <button
        style={styles.btn}
        onClick={handleDelete}
        disabled={isLoading}
        aria-label="Delete account"
      >
        {isLoading ? "Deleting…" : "Delete Account"}
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  btn: {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1px solid var(--error, #c0392b)",
    background: "transparent",
    color: "var(--error, #c0392b)",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    flexShrink: 0,
  },
  error: {
    fontSize: "12px",
    color: "var(--error, #c0392b)",
  },
};
