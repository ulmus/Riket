-- Character vault — version-history migration (run once, after db/schema.sql).
--
--   npx wrangler d1 execute <DATABASE_NAME> --remote --file=./db/0003_versions.sql
--
-- Adds an append-only stack of past snapshots per character, so a character can
-- be reverted to any earlier version while the full history is kept. Additive
-- and safe: existing characters simply have no snapshots until their next save
-- (the API backfills the current state as the first version on demand).

CREATE TABLE IF NOT EXISTS character_versions (
  id           TEXT PRIMARY KEY,       -- uuid
  character_id TEXT NOT NULL,          -- characters.id
  name         TEXT NOT NULL,          -- display name at snapshot time
  data         TEXT NOT NULL,          -- JSON snapshot (the character at this point)
  created_at   INTEGER NOT NULL,
  FOREIGN KEY (character_id) REFERENCES characters (id)
);
CREATE INDEX IF NOT EXISTS idx_charver ON character_versions (character_id);
