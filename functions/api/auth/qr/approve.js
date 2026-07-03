// POST /api/auth/qr/approve  { code }  — approve a QR login for another device.
// Called by a device that is ALREADY logged in (it just scanned the QR). Even
// though /api/auth/* is public, this one requires a session: approving grants
// the waiting device a session as the approving user, so only that user may do
// it. Stamps the request approved; the starting device's next poll picks it up.

import { json, error, readJson, sha256Hex, nowSec } from "../../_lib/util.js";

export const onRequestPost = async ({ request, env, data }) => {
  if (!env.SESSION_SECRET) return error(500, "Servern saknar SESSION_SECRET.");
  if (!data.session) return error(401, "Inte inloggad.");

  const body = await readJson(request);
  const code = body && typeof body.code === "string" ? body.code : "";
  if (!code) return error(400, "Ogiltig begäran.");

  const now = nowSec();
  const codeHash = await sha256Hex(code);
  const row = await env.DB.prepare(
    "SELECT id, expires_at, approved_at, consumed_at FROM qr_logins WHERE code_hash = ?1",
  )
    .bind(codeHash)
    .first();

  if (!row || row.consumed_at || row.expires_at < now) {
    return error(410, "QR-koden är ogiltig eller har gått ut.");
  }
  if (row.approved_at) return json({ ok: true }); // idempotent re-approval

  await env.DB.prepare("UPDATE qr_logins SET approved_at = ?1, user_id = ?2 WHERE id = ?3")
    .bind(now, data.session.uid, row.id)
    .run();
  return json({ ok: true });
};
