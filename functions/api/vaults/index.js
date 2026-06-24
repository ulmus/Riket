// GET /api/vaults — the other vaults I'm a member of (for the per-vault sections
// in the gallery). My own vault is implicit.

import { json, error } from "../_lib/util.js";
import { getSession } from "../_lib/auth.js";

export const onRequestGet = async ({ request, env }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");

  const { results } = await env.DB.prepare(
    "SELECT vm.owner_id, u.email FROM vault_members vm JOIN users u ON u.id = vm.owner_id WHERE vm.member_id = ?1 ORDER BY u.email",
  )
    .bind(session.uid)
    .all();
  const vaults = (results || []).map((r) => ({ ownerId: r.owner_id, ownerEmail: r.email }));
  return json({ vaults });
};
