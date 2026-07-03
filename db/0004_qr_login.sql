-- Character vault — cross-device QR login migration (run once, after db/schema.sql).
--
--   npx wrangler d1 execute <DATABASE_NAME> --remote --file=./db/0004_qr_login.sql
--
-- Adds a short-lived table backing "log in with a QR code": a logged-out device
-- starts a request and shows a QR; a device already logged in scans it and
-- approves; the starting device polls and gets a session. Additive and safe —
-- rows are short-lived and self-cleaning, and nothing else depends on it.

CREATE TABLE IF NOT EXISTS qr_logins (
  id          TEXT PRIMARY KEY,       -- uuid; the poll secret, held only by the starting device
  code_hash   TEXT NOT NULL,          -- sha256(code) hex; the secret carried in the QR
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,
  approved_at INTEGER,                 -- NULL until approved on the logged-in device
  user_id     TEXT,                    -- who approved (set on approval)
  consumed_at INTEGER                  -- NULL until the starting device redeems the session
);
CREATE INDEX IF NOT EXISTS idx_qr_code ON qr_logins (code_hash);
