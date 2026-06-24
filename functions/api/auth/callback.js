// GET /api/auth/callback?token=...&next=/static/charsheet/...
// Redeems a magic link: validates the (single-use, unexpired) token, finds or
// creates the user, sets the session cookie, and redirects back to the page the
// login was started from (`next`, validated to a same-origin charsheet path).
// Always redirects (with a ?login=<status>) rather than returning JSON, since
// this URL is opened directly from the email.

import { sha256Hex, nowSec } from "../_lib/util.js";
import { makeSessionCookie } from "../_lib/auth.js";

const DEFAULT_PATH = "/static/charsheet/index.html";

// Only allow redirecting back to a same-origin path inside the charsheet dir.
function safeNext(raw) {
  if (typeof raw !== "string" || raw.indexOf("//") !== -1) return DEFAULT_PATH;
  return /^\/static\/charsheet\/[A-Za-z0-9._/-]*$/.test(raw) ? raw : DEFAULT_PATH;
}

function redirect(location, cookieValue) {
  const headers = new Headers({ Location: location });
  if (cookieValue) headers.append("Set-Cookie", cookieValue);
  return new Response(null, { status: 302, headers });
}

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const dest = safeNext(url.searchParams.get("next"));
  const token = url.searchParams.get("token");
  const fail = (reason) => redirect(`${origin}${dest}?login=${reason}`);

  if (!env.SESSION_SECRET) return fail("config");
  if (!token) return fail("invalid");

  const tokenHash = await sha256Hex(token);
  const now = nowSec();

  const row = await env.DB.prepare(
    "SELECT email, expires_at, used_at FROM magic_tokens WHERE token_hash = ?1",
  )
    .bind(tokenHash)
    .first();
  if (!row || row.used_at || row.expires_at < now) return fail("expired");

  // Claim the token atomically (single-use guard).
  const claim = await env.DB.prepare(
    "UPDATE magic_tokens SET used_at = ?1 WHERE token_hash = ?2 AND used_at IS NULL",
  )
    .bind(now, tokenHash)
    .run();
  if (!claim.meta || claim.meta.changes !== 1) return fail("expired");

  // Find or create the user. Logging in confirms the email — set confirmed_at
  // (it may have been NULL for a user created by an invite).
  let user = await env.DB.prepare("SELECT id, email FROM users WHERE email = ?1").bind(row.email).first();
  if (!user) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, email, created_at, confirmed_at) VALUES (?1, ?2, ?3, ?3)")
      .bind(id, row.email, now)
      .run();
    user = { id, email: row.email };
  } else {
    await env.DB.prepare("UPDATE users SET confirmed_at = ?1 WHERE id = ?2 AND confirmed_at IS NULL")
      .bind(now, user.id)
      .run();
  }

  const cookieValue = await makeSessionCookie(env, user);
  return redirect(`${origin}${dest}?login=ok`, cookieValue);
};
