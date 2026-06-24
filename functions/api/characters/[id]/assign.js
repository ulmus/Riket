// PUT /api/characters/:id/assign  {memberId|null}
// The vault owner assigns one of their characters to a member (or unassigns it).

import { json, error, readJson } from "../../_lib/util.js";
import { getSession } from "../../_lib/auth.js";

export const onRequestPut = async ({ request, env, params }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");

  const body = await readJson(request);
  if (!body) return error(400, "Ogiltig begäran.");
  const memberId = body.memberId == null || body.memberId === "" ? null : String(body.memberId);

  // The character must be one I own.
  const row = await env.DB.prepare(
    "SELECT id FROM characters WHERE id = ?1 AND user_id = ?2 AND deleted_at IS NULL",
  )
    .bind(params.id, session.uid)
    .first();
  if (!row) return error(404, "Rollpersonen hittades inte.");

  // If assigning (not clearing), the target must be a member of my vault.
  let assigneeEmail = null;
  if (memberId) {
    const m = await env.DB.prepare(
      "SELECT u.email FROM vault_members vm JOIN users u ON u.id = vm.member_id WHERE vm.owner_id = ?1 AND vm.member_id = ?2",
    )
      .bind(session.uid, memberId)
      .first();
    if (!m) return error(400, "Mottagaren är inte medlem i ditt valv.");
    assigneeEmail = m.email;
  }

  await env.DB.prepare("UPDATE characters SET assigned_to = ?1 WHERE id = ?2 AND user_id = ?3")
    .bind(memberId, params.id, session.uid)
    .run();
  return json({ ok: true, assignedTo: memberId, assigneeEmail });
};
