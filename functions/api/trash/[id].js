// DELETE /api/trash/:id — permanently delete a single trashed character.

import { json, error } from "../_lib/util.js";

export const onRequestDelete = async ({ env, params, data: { session } }) => {
  // Drop the version snapshots first (guarded by ownership, so it only fires for
  // a trashed character this user owns). Explicit cleanup works whether or not
  // the FK's ON DELETE CASCADE is enforced, and covers pre-cascade databases.
  await env.DB.prepare(
    "DELETE FROM character_versions WHERE character_id IN " +
      "(SELECT id FROM characters WHERE id = ?1 AND user_id = ?2 AND deleted_at IS NOT NULL)",
  )
    .bind(params.id, session.uid)
    .run();
  const res = await env.DB.prepare(
    "DELETE FROM characters WHERE id = ?1 AND user_id = ?2 AND deleted_at IS NOT NULL",
  )
    .bind(params.id, session.uid)
    .run();
  if (!res.meta || res.meta.changes !== 1) return error(404, "Rollpersonen finns inte i papperskorgen.");
  return json({ ok: true });
};
