// GET    /api/characters/:id  — load one character (owner or its assignee)
// PUT    /api/characters/:id  — save  { name?, data, version }  (owner or assignee)
// DELETE /api/characters/:id  — move to trash (soft delete; owner only)

import { json, error, readJson, nowSec } from "../_lib/util.js";
import { MAX_DATA_BYTES, validData, resolveName } from "../_lib/chardata.js";
import { recordVersionSafe } from "../_lib/versions.js";

export const onRequestGet = async ({ env, params, data: { session } }) => {
  const row = await env.DB.prepare(
    "SELECT id, name, data, version, updated_at, deleted_at FROM characters WHERE id = ?1 AND (user_id = ?2 OR assigned_to = ?2)",
  )
    .bind(params.id, session.uid)
    .first();
  if (!row || row.deleted_at) return error(404, "Rollpersonen hittades inte.");

  let data;
  try {
    data = JSON.parse(row.data);
  } catch {
    data = {};
  }
  return json({ id: row.id, name: row.name, version: row.version, updated_at: row.updated_at, data });
};

export const onRequestPut = async ({ request, env, params, data: { session } }) => {
  const body = await readJson(request);
  if (!body || !validData(body.data)) return error(400, "Ogiltig rollperson.");
  const baseVersion = Number(body.version);
  if (!Number.isInteger(baseVersion) || baseVersion < 1) return error(400, "Saknar versionsnummer.");
  const dataStr = JSON.stringify(body.data);
  if (dataStr.length > MAX_DATA_BYTES) return error(413, "Rollpersonen är för stor.");

  const name = resolveName(body.name, body.data);
  const now = nowSec();

  // Optimistic update: only succeeds if the row is still at baseVersion.
  const upd = await env.DB.prepare(
    "UPDATE characters SET data = ?1, name = ?2, version = version + 1, updated_at = ?3 WHERE id = ?4 AND (user_id = ?5 OR assigned_to = ?5) AND deleted_at IS NULL AND version = ?6",
  )
    .bind(dataStr, name, now, params.id, session.uid, baseVersion)
    .run();

  if (upd.meta && upd.meta.changes === 1) {
    await recordVersionSafe(env, params.id, name, dataStr, { coalesce: true });
    return json({ id: params.id, name, version: baseVersion + 1 });
  }

  // Nothing updated — figure out whether it's a conflict (newer version on the
  // server) or the row is simply gone/trashed.
  const row = await env.DB.prepare(
    "SELECT version, name, deleted_at FROM characters WHERE id = ?1 AND (user_id = ?2 OR assigned_to = ?2)",
  )
    .bind(params.id, session.uid)
    .first();
  if (!row || row.deleted_at) return error(404, "Rollpersonen hittades inte.");
  return json(
    { error: "conflict", serverVersion: row.version, serverName: row.name },
    { status: 409 },
  );
};

export const onRequestDelete = async ({ env, params, data: { session } }) => {
  const upd = await env.DB.prepare(
    "UPDATE characters SET deleted_at = ?1 WHERE id = ?2 AND user_id = ?3 AND deleted_at IS NULL",
  )
    .bind(nowSec(), params.id, session.uid)
    .run();
  if (!upd.meta || upd.meta.changes !== 1) return error(404, "Rollpersonen hittades inte.");
  return json({ ok: true });
};
