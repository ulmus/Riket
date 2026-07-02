// Version history for cloud characters (the append-only snapshot stack).
//
// Invariant: the most recent row (highest rowid) for a character always mirrors
// `characters.data` — the "head" is the current state. That keeps listing and
// reverting simple: the head is "Nuvarande", and reverting just copies a chosen
// snapshot onto a new head, so the full stack is preserved.

import { nowSec } from "./util.js";
import { cardFields } from "./chardata.js";

// Rapid autosaves within this window collapse into one evolving snapshot, so an
// editing burst becomes a single version instead of dozens.
export const COALESCE_WINDOW_SEC = 120;
// Keep at most this many snapshots per character; oldest beyond it are pruned.
export const MAX_VERSIONS = 30;

/** The newest snapshot (head) for a character, or null. */
async function head(env, charId) {
  return env.DB.prepare(
    "SELECT id, created_at FROM character_versions WHERE character_id = ?1 ORDER BY rowid DESC LIMIT 1",
  )
    .bind(charId)
    .first();
}

async function insertVersion(env, charId, name, dataStr, now) {
  await env.DB.prepare(
    "INSERT INTO character_versions (id, character_id, name, data, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
  )
    .bind(crypto.randomUUID(), charId, name, dataStr, now)
    .run();
  // Prune anything older than the newest MAX_VERSIONS snapshots.
  await env.DB.prepare(
    "DELETE FROM character_versions WHERE character_id = ?1 AND rowid NOT IN " +
      "(SELECT rowid FROM character_versions WHERE character_id = ?1 ORDER BY rowid DESC LIMIT ?2)",
  )
    .bind(charId, MAX_VERSIONS)
    .run();
}

/**
 * Record the character's current state as a snapshot (the new head).
 * With `coalesce`, a head written within COALESCE_WINDOW_SEC is updated in place
 * instead of appending, so a run of autosaves stays a single version.
 */
export async function recordVersion(env, charId, name, dataStr, { coalesce } = {}) {
  const now = nowSec();
  if (coalesce) {
    const h = await head(env, charId);
    if (h && now - h.created_at <= COALESCE_WINDOW_SEC) {
      await env.DB.prepare("UPDATE character_versions SET name = ?1, data = ?2, created_at = ?3 WHERE id = ?4")
        .bind(name, dataStr, now, h.id)
        .run();
      return;
    }
  }
  await insertVersion(env, charId, name, dataStr, now);
}

/**
 * Record a version without ever failing the caller. The character mutation
 * (create/save/revert) is the source of truth and has already committed by the
 * time this runs; the snapshot is best-effort bookkeeping. If it threw and
 * propagated, an already-successful save would return a misleading 500 — the
 * client would think it failed and retry with a stale version, hitting a
 * spurious 409. So log and swallow: the head-is-current invariant self-heals on
 * the next successful save (a coalescing write updates the head in place).
 */
export async function recordVersionSafe(env, charId, name, dataStr, opts) {
  try {
    await recordVersion(env, charId, name, dataStr, opts);
  } catch (e) {
    console.error("recordVersion misslyckades (rollpersonen sparades ändå):", (e && e.stack) || e);
  }
}

/**
 * Ensure a character has at least one snapshot. Characters created before
 * versioning landed have none until their next save; this backfills the current
 * state as the first version so the head-is-current invariant holds.
 */
export async function backfillIfEmpty(env, charId, name, dataStr) {
  if (await head(env, charId)) return;
  await insertVersion(env, charId, name, dataStr, nowSec());
}

/**
 * The snapshot stack, oldest first as absolute version numbers, returned newest
 * first for display. The newest (head) is flagged `isCurrent`. Data blobs are
 * left out; only the card fields (foto, expertis) are surfaced.
 */
export async function listVersions(env, charId) {
  const { results } = await env.DB.prepare(
    "SELECT id, name, data, created_at FROM character_versions WHERE character_id = ?1 ORDER BY rowid ASC",
  )
    .bind(charId)
    .all();
  const rows = results || [];
  const list = rows.map((r, i) => {
    const { foto, expertis } = cardFields(r.data);
    return {
      id: r.id,
      number: i + 1,
      name: r.name,
      created_at: r.created_at,
      foto,
      expertis,
      isCurrent: i === rows.length - 1,
    };
  });
  return list.reverse();
}
