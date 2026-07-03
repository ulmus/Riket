// GET /api/auth/qr/status?id=... — the starting device polls this (no session).
// While the request is pending it returns {status:"pending"}. Once another
// (logged-in) device has approved it, the FIRST poll to arrive claims it
// atomically, mints this device's session cookie, and returns {status:"approved"}.
// Expired/unknown/already-claimed requests return {status:"expired"}.

import { json, error, nowSec } from "../../_lib/util.js";
import { makeSessionCookie } from "../../_lib/auth.js";

export const onRequestGet = async ({ request, env }) => {
  if (!env.SESSION_SECRET) return error(500, "Servern saknar SESSION_SECRET.");

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return error(400, "Ogiltig begäran.");

  const now = nowSec();
  const row = await env.DB.prepare(
    "SELECT expires_at, approved_at, user_id, consumed_at FROM qr_logins WHERE id = ?1",
  )
    .bind(id)
    .first();

  if (!row || row.consumed_at || row.expires_at < now) return json({ status: "expired" });
  if (!row.approved_at || !row.user_id) return json({ status: "pending" });

  // Approved: claim it once (single-use) and issue the session to THIS device.
  const claim = await env.DB.prepare(
    "UPDATE qr_logins SET consumed_at = ?1 WHERE id = ?2 AND consumed_at IS NULL",
  )
    .bind(now, id)
    .run();
  if (!claim.meta || claim.meta.changes !== 1) return json({ status: "expired" });

  const user = await env.DB.prepare("SELECT id, email FROM users WHERE id = ?1").bind(row.user_id).first();
  if (!user) return json({ status: "expired" });

  const cookieValue = await makeSessionCookie(env, user);
  return json({ status: "approved", email: user.email }, { headers: { "Set-Cookie": cookieValue } });
};
