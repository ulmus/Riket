// GET  /api/characters       — list the signed-in user's active characters
// POST /api/characters       — create a new character  { name?, data }

import { json, error, readJson, nowSec } from "../_lib/util.js";
import { getSession } from "../_lib/auth.js";
import { MAX_DATA_BYTES, validData, resolveName } from "../_lib/chardata.js";

export const onRequestGet = async ({ request, env }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");

  const { results } = await env.DB.prepare(
    "SELECT id, name, data, version, updated_at FROM characters WHERE user_id = ?1 AND deleted_at IS NULL ORDER BY updated_at DESC",
  )
    .bind(session.uid)
    .all();

  // Return compact cards: pull foto/expertis out of each blob server-side so the
  // gallery can render photos without downloading every full character.
  const characters = (results || []).map((r) => {
    let foto = "";
    let expertis = "";
    try {
      const f = (JSON.parse(r.data) || {}).fields || {};
      foto = String(f.foto || "");
      expertis = String(f.expertis || "");
    } catch {
      /* ignore malformed rows */
    }
    return { id: r.id, name: r.name, version: r.version, updated_at: r.updated_at, foto, expertis };
  });
  return json({ characters });
};

export const onRequestPost = async ({ request, env }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");

  const body = await readJson(request);
  if (!body || !validData(body.data)) return error(400, "Ogiltig rollperson.");
  const dataStr = JSON.stringify(body.data);
  if (dataStr.length > MAX_DATA_BYTES) return error(413, "Rollpersonen är för stor.");

  const name = resolveName(body.name, body.data);
  const now = nowSec();
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO characters (id, user_id, name, data, version, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, 1, ?5, ?5)",
  )
    .bind(id, session.uid, name, dataStr, now)
    .run();

  return json({ id, name, version: 1 }, { status: 201 });
};
