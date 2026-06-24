// Verifies a Cloudflare Turnstile token server-side.
//
// If TURNSTILE_SECRET is not configured, verification is skipped (returns true)
// so the vault can be used before Turnstile is set up. Set the secret (and the
// matching TURNSTILE_SITE_KEY for the widget) to enforce the bot check.

export async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true; // not configured yet
  if (!token) return false;

  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  if (!res.ok) return false;
  const data = await res.json().catch(() => null);
  return !!(data && data.success);
}
