// GET /api/trash — list the user's trashed characters.
//
// Lazy purge: since Pages Functions have no cron, each visit to the trash also
// permanently removes this user's items deleted more than PURGE_AFTER_DAYS ago.

import { json, error, nowSec } from "../_lib/util.js";
import { getSession } from "../_lib/auth.js";

const PURGE_AFTER_DAYS = 30;

export const onRequestGet = async ({ request, env }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");

  const cutoff = nowSec() - PURGE_AFTER_DAYS * 24 * 60 * 60;
  await env.DB.prepare(
    "DELETE FROM characters WHERE user_id = ?1 AND deleted_at IS NOT NULL AND deleted_at < ?2",
  )
    .bind(session.uid, cutoff)
    .run();

  const { results } = await env.DB.prepare(
    "SELECT id, name, data, version, deleted_at FROM characters WHERE user_id = ?1 AND deleted_at IS NOT NULL ORDER BY deleted_at DESC",
  )
    .bind(session.uid)
    .all();
  const characters = (results || []).map((r) => {
    let foto = "";
    try {
      foto = String(((JSON.parse(r.data) || {}).fields || {}).foto || "");
    } catch {
      /* ignore malformed rows */
    }
    return { id: r.id, name: r.name, version: r.version, deleted_at: r.deleted_at, foto };
  });
  return json({ characters, purgeAfterDays: PURGE_AFTER_DAYS });
};

// DELETE /api/trash — permanently empty this user's trash.
export const onRequestDelete = async ({ request, env }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");
  const res = await env.DB.prepare(
    "DELETE FROM characters WHERE user_id = ?1 AND deleted_at IS NOT NULL",
  )
    .bind(session.uid)
    .run();
  return json({ ok: true, deleted: (res.meta && res.meta.changes) || 0 });
};
