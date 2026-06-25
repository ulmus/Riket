// POST /api/auth/request-link  { email, turnstileToken? }
// Issues a single-use magic link and emails it. Always reports success once the
// input is valid, so the endpoint can't be used to probe which emails exist.

import { json, error, readJson, nowSec } from "../_lib/util.js";
import { normalizeEmail, issueMagicLink } from "../_lib/magic.js";
import { verifyTurnstile } from "../_lib/turnstile.js";
import { sendMagicLink } from "../_lib/email.js";

const RESEND_THROTTLE = 60; // min seconds between links per email

export const onRequestPost = async ({ request, env }) => {
  if (!env.SESSION_SECRET) return error(500, "Servern saknar SESSION_SECRET.");
  if (!env.RESEND_API_KEY) return error(500, "Servern saknar RESEND_API_KEY.");

  const body = await readJson(request);
  if (!body) return error(400, "Ogiltig begäran.");
  const email = normalizeEmail(body.email);
  if (!email) return error(400, "Ange en giltig e-postadress.");

  const ip = request.headers.get("CF-Connecting-IP");
  if (!(await verifyTurnstile(env, body.turnstileToken, ip))) {
    return error(403, "Robotkontrollen misslyckades. Ladda om sidan och försök igen.");
  }

  const now = nowSec();

  // Housekeeping: drop this address's spent/expired tokens so the table stays
  // small (uses the (email, created_at) index). Live tokens are kept, so the
  // throttle below still sees a recent unused one.
  await env.DB.prepare(
    "DELETE FROM magic_tokens WHERE email = ?1 AND (used_at IS NOT NULL OR expires_at < ?2)",
  )
    .bind(email, now)
    .run();

  // Throttle repeated requests for the same address (silently — don't reveal it).
  const recent = await env.DB.prepare(
    "SELECT created_at FROM magic_tokens WHERE email = ?1 ORDER BY created_at DESC LIMIT 1",
  )
    .bind(email)
    .first();
  if (recent && now - recent.created_at < RESEND_THROTTLE) {
    return json({ ok: true });
  }

  const origin = new URL(request.url).origin;
  // Carry the page the user logged in from, so the callback can return there
  // (validated to a same-origin arkivet path; ignored otherwise).
  const rawNext = typeof body.next === "string" ? body.next : "";
  const next =
    rawNext.indexOf("//") === -1 && /^\/static\/arkivet\/[A-Za-z0-9._/-]*$/.test(rawNext) ? rawNext : "";
  const link = await issueMagicLink(env, email, origin, next);
  try {
    await sendMagicLink(env, email, link);
  } catch (e) {
    console.error("request-link: kunde inte skicka e-post:", (e && e.message) || e);
    const code = e && e.status ? " (fel " + e.status + ")" : "";
    return error(502, "Kunde inte skicka e-post just nu" + code + ". Försök igen om en stund.");
  }
  return json({ ok: true });
};
