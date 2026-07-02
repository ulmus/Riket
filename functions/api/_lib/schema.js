// Automatic, idempotent schema bootstrap.
//
// Cloudflare Pages has no "run migrations on deploy" hook, so instead we apply
// the schema at runtime: the middleware calls ensureSchema() once per worker
// isolate (guarded by a module-level promise), on the first API request after a
// deploy. Every statement here is additive and idempotent — CREATE ... IF NOT
// EXISTS, plus column adds guarded by a PRAGMA check — so it is safe to run on a
// brand-new database, an up-to-date one, or one created before a feature landed.
//
// This mirrors db/schema.sql and the db/000N_*.sql migrations. Keep them in sync;
// the .sql files remain the source of truth for a manual `wrangler d1 execute`.
// Only additive migrations belong here — anything destructive or renaming must
// still be applied by hand.

// Tables and indexes, all IF NOT EXISTS (base columns only — columns added by
// later migrations are handled separately below so old databases get them too).
const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
     id TEXT PRIMARY KEY,
     email TEXT NOT NULL UNIQUE,
     created_at INTEGER NOT NULL,
     confirmed_at INTEGER
   )`,
  `CREATE TABLE IF NOT EXISTS magic_tokens (
     token_hash TEXT PRIMARY KEY,
     email TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     expires_at INTEGER NOT NULL,
     used_at INTEGER
   )`,
  `CREATE TABLE IF NOT EXISTS characters (
     id TEXT PRIMARY KEY,
     user_id TEXT NOT NULL,
     name TEXT NOT NULL,
     data TEXT NOT NULL,
     version INTEGER NOT NULL DEFAULT 1,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     deleted_at INTEGER,
     assigned_to TEXT,
     FOREIGN KEY (user_id) REFERENCES users (id)
   )`,
  `CREATE TABLE IF NOT EXISTS character_versions (
     id TEXT PRIMARY KEY,
     character_id TEXT NOT NULL,
     name TEXT NOT NULL,
     data TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     FOREIGN KEY (character_id) REFERENCES characters (id)
   )`,
  `CREATE TABLE IF NOT EXISTS vault_members (
     owner_id TEXT NOT NULL,
     member_id TEXT NOT NULL,
     invited_at INTEGER NOT NULL,
     PRIMARY KEY (owner_id, member_id)
   )`,
];

// Indexes are created after the column adds, so an index on a
// later-migration column (e.g. assigned_to) works on an old database too.
const INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_magic_email ON magic_tokens (email, created_at)",
  "CREATE INDEX IF NOT EXISTS idx_char_owner ON characters (user_id, deleted_at, updated_at)",
  "CREATE INDEX IF NOT EXISTS idx_char_assignee ON characters (assigned_to, deleted_at)",
  "CREATE INDEX IF NOT EXISTS idx_charver ON character_versions (character_id)",
  "CREATE INDEX IF NOT EXISTS idx_member_of ON vault_members (member_id)",
];

/** Add a column only if the table doesn't already have it. Returns true if added. */
async function addColumnIfMissing(env, table, column, definition) {
  const info = await env.DB.prepare(`PRAGMA table_info(${table})`).all();
  const exists = (info.results || []).some((c) => c.name === column);
  if (exists) return false;
  await env.DB.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
  return true;
}

async function apply(env) {
  for (const sql of TABLES) await env.DB.prepare(sql).run();

  // Columns from db/0002_sharing.sql, for databases created before it.
  const addedConfirmed = await addColumnIfMissing(env, "users", "confirmed_at", "INTEGER");
  if (addedConfirmed) {
    // Existing users predate the invite flow, so treat them as confirmed.
    await env.DB.prepare("UPDATE users SET confirmed_at = created_at WHERE confirmed_at IS NULL").run();
  }
  await addColumnIfMissing(env, "characters", "assigned_to", "TEXT");

  for (const sql of INDEXES) await env.DB.prepare(sql).run();
}

let ready = null;

/**
 * Ensure the schema exists, running the DDL at most once per worker isolate.
 * A failure is not cached, so the next request retries.
 */
export function ensureSchema(env) {
  if (!ready) {
    ready = apply(env).catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}
