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
    "SELECT id, name, version, deleted_at FROM characters WHERE user_id = ?1 AND deleted_at IS NOT NULL ORDER BY deleted_at DESC",
  )
    .bind(session.uid)
    .all();
  return json({ characters: results || [], purgeAfterDays: PURGE_AFTER_DAYS });
};
