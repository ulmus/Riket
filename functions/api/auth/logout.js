// POST /api/auth/logout — clears the session cookie.

import { clearSessionCookie } from "../_lib/auth.js";

export const onRequestPost = async () => {
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  headers.append("Set-Cookie", clearSessionCookie());
  return new Response(JSON.stringify({ ok: true }), { headers });
};
