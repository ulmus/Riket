// GET /api/auth/callback?token=...
// Redeems a magic link: validates the (single-use, unexpired) token, finds or
// creates the user, sets the session cookie, and redirects back to the sheet.
// Always redirects (with a ?login=<status>) rather than returning JSON, since
// this URL is opened directly from the email.

import { sha256Hex, nowSec } from "../_lib/util.js";
import { makeSessionCookie } from "../_lib/auth.js";

const APP_PATH = "/static/charsheet/sheet.html";

function redirect(location, cookieValue) {
  const headers = new Headers({ Location: location });
  if (cookieValue) headers.append("Set-Cookie", cookieValue);
  return new Response(null, { status: 302, headers });
}

const fail = (origin, reason) => redirect(`${origin}${APP_PATH}?login=${reason}`);

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const token = url.searchParams.get("token");

  if (!env.SESSION_SECRET) return fail(origin, "config");
  if (!token) return fail(origin, "invalid");

  const tokenHash = await sha256Hex(token);
  const now = nowSec();

  const row = await env.DB.prepare(
    "SELECT email, expires_at, used_at FROM magic_tokens WHERE token_hash = ?1",
  )
    .bind(tokenHash)
    .first();
  if (!row || row.used_at || row.expires_at < now) return fail(origin, "expired");

  // Claim the token atomically (single-use guard).
  const claim = await env.DB.prepare(
    "UPDATE magic_tokens SET used_at = ?1 WHERE token_hash = ?2 AND used_at IS NULL",
  )
    .bind(now, tokenHash)
    .run();
  if (!claim.meta || claim.meta.changes !== 1) return fail(origin, "expired");

  // Find or create the user.
  let user = await env.DB.prepare("SELECT id, email FROM users WHERE email = ?1").bind(row.email).first();
  if (!user) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, email, created_at) VALUES (?1, ?2, ?3)")
      .bind(id, row.email, now)
      .run();
    user = { id, email: row.email };
  }

  const cookieValue = await makeSessionCookie(env, user);
  return redirect(`${origin}${APP_PATH}?login=ok`, cookieValue);
};
