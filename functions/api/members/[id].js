// DELETE /api/members/:id — remove a member from my vault and unassign any of
// my characters that were assigned to them.

import { json, error } from "../_lib/util.js";
import { getSession } from "../_lib/auth.js";

export const onRequestDelete = async ({ request, env, params }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");

  await env.DB.prepare("DELETE FROM vault_members WHERE owner_id = ?1 AND member_id = ?2")
    .bind(session.uid, params.id)
    .run();
  await env.DB.prepare("UPDATE characters SET assigned_to = NULL WHERE user_id = ?1 AND assigned_to = ?2")
    .bind(session.uid, params.id)
    .run();
  return json({ ok: true });
};
