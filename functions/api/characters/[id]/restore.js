// POST /api/characters/:id/restore — bring a character back from the trash.

import { json, error, nowSec } from "../../_lib/util.js";
import { getSession } from "../../_lib/auth.js";

export const onRequestPost = async ({ request, env, params }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");

  const upd = await env.DB.prepare(
    "UPDATE characters SET deleted_at = NULL, updated_at = ?1 WHERE id = ?2 AND user_id = ?3 AND deleted_at IS NOT NULL",
  )
    .bind(nowSec(), params.id, session.uid)
    .run();
  if (!upd.meta || upd.meta.changes !== 1) return error(404, "Rollpersonen finns inte i papperskorgen.");
  return json({ ok: true });
};
