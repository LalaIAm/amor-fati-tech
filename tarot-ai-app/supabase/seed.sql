-- Seed: built-in spread rows
-- Safe to run multiple times (idempotent)

INSERT INTO spreads (id, name, description, position_count) VALUES
  (
    'single',
    'Single Card',
    'A focused one-card draw that offers a clear message or reflection for the present moment.',
    1
  ),
  (
    'three-card',
    'Three Card',
    'A classic three-card spread exploring the past influences, present circumstances, and future possibilities surrounding your question.',
    3
  ),
  (
    'celtic-cross',
    'Celtic Cross',
    'A comprehensive ten-card spread that provides deep insight into a situation, exploring its roots, influences, hopes, fears, and ultimate outcome.',
    10
  )
ON CONFLICT (id) DO NOTHING;
