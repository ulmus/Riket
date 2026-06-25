// GET  /api/characters       — list the signed-in user's active characters
// POST /api/characters       — create a new character  { name?, data }

import { json, error, readJson, nowSec } from "../_lib/util.js";
import { MAX_DATA_BYTES, validData, resolveName, cardFields } from "../_lib/chardata.js";

// Compact card: pull foto/expertis out of the blob server-side so the gallery
// can render photos without downloading every full character.
function toCard(r) {
  const { foto, expertis } = cardFields(r.data);
  return { id: r.id, name: r.name, version: r.version, updated_at: r.updated_at, foto, expertis };
}

export const onRequestGet = async ({ request, env, data: { session } }) => {
  const owner = new URL(request.url).searchParams.get("owner");

  if (owner && owner !== session.uid) {
    // A vault I'm a member of: only the characters assigned to me there.
    const member = await env.DB.prepare("SELECT 1 FROM vault_members WHERE owner_id = ?1 AND member_id = ?2")
      .bind(owner, session.uid)
      .first();
    if (!member) return error(403, "Du har inte tillgång till det valvet.");
    const { results } = await env.DB.prepare(
      "SELECT id, name, data, version, updated_at FROM characters WHERE user_id = ?1 AND assigned_to = ?2 AND deleted_at IS NULL ORDER BY updated_at DESC",
    )
      .bind(owner, session.uid)
      .all();
    return json({ characters: (results || []).map(toCard) });
  }

  // My own vault: all my active characters, each with its assignee (if any).
  const { results } = await env.DB.prepare(
    "SELECT c.id, c.name, c.data, c.version, c.updated_at, c.assigned_to, u.email AS assignee_email " +
      "FROM characters c LEFT JOIN users u ON u.id = c.assigned_to " +
      "WHERE c.user_id = ?1 AND c.deleted_at IS NULL ORDER BY c.updated_at DESC",
  )
    .bind(session.uid)
    .all();
  const characters = (results || []).map((r) => {
    const c = toCard(r);
    c.assignedTo = r.assigned_to || null;
    c.assigneeEmail = r.assignee_email || null;
    return c;
  });
  return json({ characters });
};

export const onRequestPost = async ({ request, env, data: { session } }) => {
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
