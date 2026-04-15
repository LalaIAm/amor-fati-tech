-- Migration: 002_delete_user_function
-- Provides a server-side RPC that deletes the calling user's auth.users record.
-- All associated rows in journal_entries, drawn_cards, and pattern_insights are
-- removed automatically via ON DELETE CASCADE (defined in 001_initial_schema.sql).
-- Requirements: 9.4

CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Only authenticated users may call this function.
REVOKE ALL ON FUNCTION delete_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
