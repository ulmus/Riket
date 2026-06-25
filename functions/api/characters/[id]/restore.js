// POST /api/characters/:id/restore — bring a character back from the trash.

import { json, error, nowSec } from "../../_lib/util.js";

export const onRequestPost = async ({ env, params, data: { session } }) => {
  const upd = await env.DB.prepare(
    "UPDATE characters SET deleted_at = NULL, updated_at = ?1 WHERE id = ?2 AND user_id = ?3 AND deleted_at IS NOT NULL",
  )
    .bind(nowSec(), params.id, session.uid)
    .run();
  if (!upd.meta || upd.meta.changes !== 1) return error(404, "Rollpersonen finns inte i papperskorgen.");
  return json({ ok: true });
};
