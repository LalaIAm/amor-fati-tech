-- Migration: 001_initial_schema
-- Users managed by Supabase Auth (auth.users)

CREATE TABLE spreads (
  id          TEXT PRIMARY KEY,          -- 'single', 'three-card', 'celtic-cross'
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  position_count INT NOT NULL
);

CREATE TABLE journal_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spread_id       TEXT NOT NULL REFERENCES spreads(id),
  intention       TEXT,                  -- nullable, max 500 chars
  summary_interpretation TEXT,
  journaling_prompts JSONB,              -- string[]
  user_notes      TEXT,
  prompt_responses JSONB,               -- { [promptIndex]: responseText }
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE drawn_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  card_id         INT NOT NULL,          -- 0–77, references static deck data
  position_index  INT NOT NULL,
  reversed        BOOLEAN NOT NULL,
  interpretation  TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pattern_insights (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_text    TEXT NOT NULL,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  month           DATE NOT NULL          -- first day of the month
);

-- Indexes
CREATE INDEX idx_journal_entries_user_created
  ON journal_entries(user_id, created_at DESC);

CREATE INDEX idx_drawn_cards_entry
  ON drawn_cards(journal_entry_id);

CREATE INDEX idx_drawn_cards_user_card
  ON drawn_cards(journal_entry_id, card_id);

-- Row-Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawn_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_entries" ON journal_entries
  USING (user_id = auth.uid());

CREATE POLICY "users_own_drawn_cards" ON drawn_cards
  USING (
    journal_entry_id IN (
      SELECT id FROM journal_entries WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_own_insights" ON pattern_insights
  USING (user_id = auth.uid());
