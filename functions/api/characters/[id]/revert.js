// POST /api/characters/:id/revert  { version }  — set the current state to a
// past snapshot, keeping the full version stack (owner or assignee).
//
// The pre-revert state is already on the stack as the head, so nothing is lost;
// reverting copies the chosen snapshot onto a fresh head and bumps the
// concurrency version (so an open sheet elsewhere gets a 409 on its next save).

import { json, error, nowSec, readJson } from "../../_lib/util.js";
import { recordVersionSafe, backfillIfEmpty } from "../../_lib/versions.js";

export const onRequestPost = async ({ request, env, params, data: { session } }) => {
  const body = await readJson(request);
  const versionId = body && body.version != null ? String(body.version) : "";
  if (!versionId) return error(400, "Saknar version.");

  const row = await env.DB.prepare(
    "SELECT id, name, data, version, deleted_at FROM characters WHERE id = ?1 AND (user_id = ?2 OR assigned_to = ?2)",
  )
    .bind(params.id, session.uid)
    .first();
  if (!row || row.deleted_at) return error(404, "Rollpersonen hittades inte.");

  // Make sure the current state is on the stack before we move off it.
  await backfillIfEmpty(env, row.id, row.name, row.data);

  const target = await env.DB.prepare(
    "SELECT name, data FROM character_versions WHERE id = ?1 AND character_id = ?2",
  )
    .bind(versionId, row.id)
    .first();
  if (!target) return error(404, "Versionen hittades inte.");

  const now = nowSec();
  // Re-authorize in the write itself (owner or assignee), so access revoked
  // between the SELECT above and here can't slip through the race window.
  const upd = await env.DB.prepare(
    "UPDATE characters SET data = ?1, name = ?2, version = version + 1, updated_at = ?3 WHERE id = ?4 AND (user_id = ?5 OR assigned_to = ?5) AND deleted_at IS NULL",
  )
    .bind(target.data, target.name, now, row.id, session.uid)
    .run();
  if (!upd.meta || upd.meta.changes !== 1) return error(404, "Rollpersonen hittades inte.");

  // Keep the head equal to the current state: append the reverted content.
  // Best-effort — the revert above has already committed and is the truth.
  await recordVersionSafe(env, row.id, target.name, target.data, { coalesce: false });

  let data;
  try {
    data = JSON.parse(target.data);
  } catch {
    data = {};
  }
  return json({ id: row.id, name: target.name, version: row.version + 1, data });
};
