// DELETE /api/vaults/:ownerId — leave a vault I'm a member of: remove my own
// membership from that owner's vault and unassign any of the owner's characters
// that were assigned to me. The owner-side counterpart is DELETE /api/members/:id
// (owner removes a member); here the member removes themselves.

import { json } from "../_lib/util.js";

export const onRequestDelete = async ({ env, params, data: { session } }) => {
  await env.DB.prepare("DELETE FROM vault_members WHERE owner_id = ?1 AND member_id = ?2")
    .bind(params.id, session.uid)
    .run();
  await env.DB.prepare("UPDATE characters SET assigned_to = NULL WHERE user_id = ?1 AND assigned_to = ?2")
    .bind(params.id, session.uid)
    .run();
  return json({ ok: true });
};
