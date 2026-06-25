// DELETE /api/trash/:id — permanently delete a single trashed character.

import { json, error } from "../_lib/util.js";

export const onRequestDelete = async ({ env, params, data: { session } }) => {
  const res = await env.DB.prepare(
    "DELETE FROM characters WHERE id = ?1 AND user_id = ?2 AND deleted_at IS NOT NULL",
  )
    .bind(params.id, session.uid)
    .run();
  if (!res.meta || res.meta.changes !== 1) return error(404, "Rollpersonen finns inte i papperskorgen.");
  return json({ ok: true });
};
