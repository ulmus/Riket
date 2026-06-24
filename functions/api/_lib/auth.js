// Stateless, signed session cookie. The cookie carries the user id + email
// plus an expiry, signed with SESSION_SECRET (HMAC-SHA256). No server-side
// session store, so "log out" simply clears the cookie. Trade-off: a cookie
// stays valid until it expires; rotate SESSION_SECRET to invalidate everyone.

import {
  SESSION_COOKIE,
  SESSION_TTL,
  b64urlEncode,
  b64urlDecode,
  hmacSign,
  hmacVerify,
  nowSec,
} from "./util.js";

const enc = new TextEncoder();
const dec = new TextDecoder();

function cookie(name, value, maxAge) {
  return [`${name}=${value}`, "Path=/", "HttpOnly", "Secure", "SameSite=Lax", `Max-Age=${maxAge}`].join("; ");
}

/** Build a signed Set-Cookie value establishing a session for `user`. */
export async function makeSessionCookie(env, user) {
  const exp = nowSec() + SESSION_TTL;
  const payload = b64urlEncode(enc.encode(JSON.stringify({ uid: user.id, email: user.email, exp })));
  const sig = await hmacSign(env.SESSION_SECRET, payload);
  return cookie(SESSION_COOKIE, `${payload}.${sig}`, SESSION_TTL);
}

/** Set-Cookie value that immediately expires the session cookie. */
export function clearSessionCookie() {
  return cookie(SESSION_COOKIE, "", 0);
}

/** Return { uid, email } from a valid session cookie, or null. */
export async function getSession(request, env) {
  if (!env.SESSION_SECRET) return null;
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp("(?:^|;\\s*)" + SESSION_COOKIE + "=([^;]+)"));
  if (!match) return null;

  const raw = match[1];
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!(await hmacVerify(env.SESSION_SECRET, payload, sig))) return null;

  let data;
  try {
    data = JSON.parse(dec.decode(b64urlDecode(payload)));
  } catch {
    return null;
  }
  if (!data || !data.uid || !data.exp || data.exp < nowSec()) return null;
  return { uid: data.uid, email: data.email };
}
