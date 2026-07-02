// Runs before every /api/* route. Two jobs:
//   1. Resolve the session once and hand it to handlers via `context.data.session`,
//      so each route no longer repeats the getSession + 401 dance. Auth is
//      enforced for everything except the public auth/config endpoints.
//   2. Wrap handlers in a JSON error boundary, so an unexpected throw returns a
//      JSON 500 instead of the platform's default HTML error page (which the
//      frontend can't parse).

import { error } from "./_lib/util.js";
import { getSession } from "./_lib/auth.js";
import { ensureSchema } from "./_lib/schema.js";

// Endpoints reachable while logged out. Everything else requires a session.
function isPublic(pathname) {
  return pathname === "/api/config" || pathname.startsWith("/api/auth/");
}

export const onRequest = async (context) => {
  const { request, env, next, data } = context;
  try {
    // Apply any additive schema changes once per isolate (auto-migrate on
    // deploy). Non-fatal: if it fails, log and carry on — the request may still
    // work against the existing schema, and the next request retries.
    try {
      await ensureSchema(env);
    } catch (e) {
      console.error("ensureSchema misslyckades:", (e && e.stack) || e);
    }
    data.session = await getSession(request, env);
    if (!data.session && !isPublic(new URL(request.url).pathname)) {
      return error(401, "Inte inloggad.");
    }
    return await next();
  } catch (e) {
    console.error("API-fel:", (e && e.stack) || e);
    return error(500, "Internt serverfel.");
  }
};
