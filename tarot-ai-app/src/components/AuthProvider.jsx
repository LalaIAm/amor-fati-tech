import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { setSession, clearSession } from "../store/authSlice.js";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Hydrate store with any existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setSession(session));
      }
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        dispatch(setSession(session));
      } else if (event === "SIGNED_OUT") {
        dispatch(clearSession());
        const currentPath = location.pathname;
        const isPublicRoute = currentPath === "/login";
        if (!isPublicRoute) {
          navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, {
            replace: true,
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
