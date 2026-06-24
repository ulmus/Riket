-- Character Vault — Cloudflare D1 schema (SQLite).
--
-- Apply once to the bound D1 database (binding name `DB`). With Wrangler:
--   npx wrangler d1 execute <DATABASE_NAME> --remote --file=./db/schema.sql
-- or paste it into the D1 console in the Cloudflare dashboard.
--
-- All timestamps are Unix epoch seconds (INTEGER).

-- Registered users. Identity is the verified email; there are no passwords.
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,      -- uuid
  email        TEXT NOT NULL UNIQUE,  -- lowercased, verified via magic link
  created_at   INTEGER NOT NULL,
  confirmed_at INTEGER                -- first login; NULL = invited, not logged in yet
);

-- Single-use, short-lived magic-link tokens. Only the SHA-256 hash is stored,
-- so a database leak does not expose a usable login link.
CREATE TABLE IF NOT EXISTS magic_tokens (
  token_hash TEXT PRIMARY KEY,        -- sha256(token) hex
  email      TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at    INTEGER                  -- NULL until redeemed (then single-use)
);
CREATE INDEX IF NOT EXISTS idx_magic_email ON magic_tokens (email, created_at);

-- Saved characters. `data` is the sheet's serialize() JSON blob verbatim.
-- `version` drives optimistic concurrency (rename-to-save on conflict);
-- `deleted_at` drives the trash bin (NULL = active).
CREATE TABLE IF NOT EXISTS characters (
  id          TEXT PRIMARY KEY,       -- uuid
  user_id     TEXT NOT NULL,          -- vault owner
  name        TEXT NOT NULL,          -- display name (kodnamn/namn at save time)
  data        TEXT NOT NULL,          -- JSON (the character snapshot)
  version     INTEGER NOT NULL DEFAULT 1,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL,
  deleted_at  INTEGER,                -- NULL = active, else moved to trash
  assigned_to TEXT,                   -- member this character is assigned to (NULL = none)
  FOREIGN KEY (user_id) REFERENCES users (id)
);
CREATE INDEX IF NOT EXISTS idx_char_owner ON characters (user_id, deleted_at, updated_at);
CREATE INDEX IF NOT EXISTS idx_char_assignee ON characters (assigned_to, deleted_at);

-- Membership of each owner's (personal) vault: who the owner has invited.
CREATE TABLE IF NOT EXISTS vault_members (
  owner_id   TEXT NOT NULL,           -- vault owner (users.id)
  member_id  TEXT NOT NULL,           -- invited member (users.id)
  invited_at INTEGER NOT NULL,
  PRIMARY KEY (owner_id, member_id)
);
CREATE INDEX IF NOT EXISTS idx_member_of ON vault_members (member_id);
