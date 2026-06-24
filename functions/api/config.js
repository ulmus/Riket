// Public, non-secret client config. Lets the frontend render the Turnstile
// widget only when a site key is configured (the secret stays server-side).

import { json } from "./_lib/util.js";

export const onRequestGet = ({ env }) =>
  json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY || null });
