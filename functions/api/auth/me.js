// GET /api/auth/me — current session status (200 either way).

import { json } from "../_lib/util.js";
import { getSession } from "../_lib/auth.js";

export const onRequestGet = async ({ request, env }) => {
  const session = await getSession(request, env);
  return session
    ? json({ authenticated: true, email: session.email })
    : json({ authenticated: false });
};
