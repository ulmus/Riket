// GET /api/auth/me — current session status (200 either way).

import { json } from "../_lib/util.js";

export const onRequestGet = ({ data: { session } }) =>
  session
    ? json({ authenticated: true, email: session.email })
    : json({ authenticated: false });
