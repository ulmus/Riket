// Magic-link login helpers shared by the login (`auth/request-link`) and the
// vault invitation (`members`) flows: both validate an email, mint a single-use
// token, store only its hash, and build the callback URL.

import { randomToken, sha256Hex, nowSec } from "./util.js";

export const TOKEN_TTL = 60 * 15; // 15 minutes, seconds

/** Lowercased, trimmed email if it looks valid (and not too long), else null. */
export function normalizeEmail(raw) {
  const email = String(raw || "").trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length <= 254 ? email : null;
}

/**
 * Mint a single-use magic-link token for `email`, store its SHA-256 hash, and
 * return the callback URL to email out. `next` (optional) is carried through so
 * the callback can return the user to where they started; pass an already
 * validated same-origin arkivet path.
 */
export async function issueMagicLink(env, email, origin, next = "") {
  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  const now = nowSec();
  await env.DB.prepare(
    "INSERT INTO magic_tokens (token_hash, email, created_at, expires_at) VALUES (?1, ?2, ?3, ?4)",
  )
    .bind(tokenHash, email, now, now + TOKEN_TTL)
    .run();
  return `${origin}/api/auth/callback?token=${token}` + (next ? `&next=${encodeURIComponent(next)}` : "");
}
