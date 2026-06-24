// GET  /api/members          — list the members of my vault
// POST /api/members  {email} — invite someone to my vault (creates a pending
//                              account if needed) and email them a login link

import { json, error, readJson, randomToken, sha256Hex, nowSec } from "../_lib/util.js";
import { getSession } from "../_lib/auth.js";
import { sendInvite } from "../_lib/email.js";

const TOKEN_TTL = 60 * 15; // 15 minutes

function normalizeEmail(raw) {
  const email = String(raw || "").trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length <= 254 ? email : null;
}

export const onRequestGet = async ({ request, env }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");

  const { results } = await env.DB.prepare(
    "SELECT u.id, u.email, u.confirmed_at FROM vault_members vm JOIN users u ON u.id = vm.member_id WHERE vm.owner_id = ?1 ORDER BY u.email",
  )
    .bind(session.uid)
    .all();
  const members = (results || []).map((r) => ({ id: r.id, email: r.email, confirmed: !!r.confirmed_at }));
  return json({ members });
};

export const onRequestPost = async ({ request, env }) => {
  const session = await getSession(request, env);
  if (!session) return error(401, "Inte inloggad.");
  if (!env.SESSION_SECRET || !env.RESEND_API_KEY) return error(500, "Servern är inte fullständigt konfigurerad.");

  const body = await readJson(request);
  if (!body) return error(400, "Ogiltig begäran.");
  const email = normalizeEmail(body.email);
  if (!email) return error(400, "Ange en giltig e-postadress.");
  if (email === String(session.email || "").toLowerCase()) return error(400, "Du kan inte bjuda in dig själv.");

  const now = nowSec();

  // Find or create the invited user (pending — confirmed_at NULL — until login).
  let user = await env.DB.prepare("SELECT id, email, confirmed_at FROM users WHERE email = ?1").bind(email).first();
  if (!user) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, email, created_at) VALUES (?1, ?2, ?3)").bind(id, email, now).run();
    user = { id, email, confirmed_at: null };
  }

  // Add them to my vault (idempotent).
  await env.DB.prepare("INSERT OR IGNORE INTO vault_members (owner_id, member_id, invited_at) VALUES (?1, ?2, ?3)")
    .bind(session.uid, user.id, now)
    .run();

  // Issue a magic-link login token and email the invitation.
  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  await env.DB.prepare("INSERT INTO magic_tokens (token_hash, email, created_at, expires_at) VALUES (?1, ?2, ?3, ?4)")
    .bind(tokenHash, email, now, now + TOKEN_TTL)
    .run();
  const origin = new URL(request.url).origin;
  const link = `${origin}/api/auth/callback?token=${token}&next=${encodeURIComponent("/static/arkivet/index.html")}`;

  try {
    await sendInvite(env, email, link, session.email);
  } catch (e) {
    // The membership is saved; only the email failed. Report it but the member
    // is already added (they can log in via the normal login any time).
    return error(
      502,
      "Medlemmen lades till, men inbjudningsmejlet kunde inte skickas" + (e && e.status ? " (fel " + e.status + ")" : "") + ".",
    );
  }

  return json({ ok: true, member: { id: user.id, email, confirmed: !!user.confirmed_at } });
};
