// GET /api/characters/:id/versions — the character's version history
//                                    (owner or its assignee).

import { json, error } from "../../_lib/util.js";
import { listVersions, backfillIfEmpty } from "../../_lib/versions.js";

export const onRequestGet = async ({ env, params, data: { session } }) => {
  const row = await env.DB.prepare(
    "SELECT id, name, data, version, deleted_at FROM characters WHERE id = ?1 AND (user_id = ?2 OR assigned_to = ?2)",
  )
    .bind(params.id, session.uid)
    .first();
  if (!row || row.deleted_at) return error(404, "Rollpersonen hittades inte.");

  await backfillIfEmpty(env, row.id, row.name, row.data);
  const versions = await listVersions(env, row.id);
  return json({ id: row.id, version: row.version, versions });
};
