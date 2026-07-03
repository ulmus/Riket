// POST /api/auth/qr/start  — begin a cross-device QR login (no session needed).
// Mints a request with two independent secrets:
//   - `id`   : the poll secret, returned only to this (logged-out) device.
//   - `code` : carried in the QR the device shows; another device that is
//              already logged in scans it and approves. Only its hash is stored.
// Keeping the poll channel (`id`) separate from the approval channel (`code`)
// means seeing the QR never lets anyone steal the resulting session.

import { json, error, randomToken, sha256Hex, nowSec } from "../../_lib/util.js";
import { QR_TTL, QR_APPROVE_PATH } from "../../_lib/qr.js";

export const onRequestPost = async ({ request, env }) => {
  if (!env.SESSION_SECRET) return error(500, "Servern saknar SESSION_SECRET.");

  const now = nowSec();
  // Housekeeping: drop expired/spent requests so the table stays tiny.
  await env.DB.prepare("DELETE FROM qr_logins WHERE expires_at < ?1 OR consumed_at IS NOT NULL")
    .bind(now)
    .run();

  const id = crypto.randomUUID();
  const code = randomToken(32);
  const codeHash = await sha256Hex(code);
  await env.DB.prepare(
    "INSERT INTO qr_logins (id, code_hash, created_at, expires_at) VALUES (?1, ?2, ?3, ?4)",
  )
    .bind(id, codeHash, now, now + QR_TTL)
    .run();

  const origin = new URL(request.url).origin;
  const url = `${origin}${QR_APPROVE_PATH}?c=${code}`;
  return json({ id, url, expiresIn: QR_TTL });
};
