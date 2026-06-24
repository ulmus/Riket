-- Character vault — sharing migration (run once, after db/schema.sql).
--
--   npx wrangler d1 execute <DATABASE_NAME> --remote --file=./db/0002_sharing.sql
--
-- Adds vault membership and per-character assignment so a vault owner can invite
-- others and assign characters to them. Additive and safe: existing characters
-- stay owner-only (assigned_to NULL) and existing users are marked confirmed.

-- Whether a user has ever logged in (confirmed their email).
-- NULL = an invited user who hasn't logged in yet.
ALTER TABLE users ADD COLUMN confirmed_at INTEGER;
UPDATE users SET confirmed_at = created_at WHERE confirmed_at IS NULL;

-- A character may be assigned to one member of its owner's vault (NULL = none).
ALTER TABLE characters ADD COLUMN assigned_to TEXT;
CREATE INDEX IF NOT EXISTS idx_char_assignee ON characters (assigned_to, deleted_at);

-- Membership of each owner's (personal) vault.
CREATE TABLE IF NOT EXISTS vault_members (
  owner_id   TEXT NOT NULL,  -- vault owner (users.id)
  member_id  TEXT NOT NULL,  -- invited member (users.id)
  invited_at INTEGER NOT NULL,
  PRIMARY KEY (owner_id, member_id)
);
CREATE INDEX IF NOT EXISTS idx_member_of ON vault_members (member_id);
