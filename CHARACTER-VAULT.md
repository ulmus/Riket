# Rollpersonsvalvet (Character Vault)

Optional server-side storage for the character sheet
(`quartz/static/charsheet/sheet.html`). Players log in with a passwordless
**magic link** and can save, edit, delete and restore characters from any
device. The sheet works exactly as before without logging in — the vault is
purely additive.

It runs entirely on Cloudflare, alongside the existing Pages site: a small
[Pages Functions](https://developers.cloudflare.com/pages/functions/) API under
`/api/*` backed by a [D1](https://developers.cloudflare.com/d1/) database. There
is no separate Worker or deploy pipeline — pushing to `main` deploys the
Functions with the rest of the site.

## How it works

- **Auth:** passwordless. The user enters an email; the API stores a single-use,
  15-minute token (only its SHA-256 hash) and emails a link via
  [Resend](https://resend.com). Clicking it sets a signed, HttpOnly session
  cookie. There are no passwords anywhere.
- **Storage:** each character is the sheet's `serialize()` JSON blob plus
  metadata (owner, name, version, timestamps). The frontend loads a character by
  writing it to the sheet's localStorage slot and reloading — the same mechanism
  as Import.
- **Save (last-write-wins + rename-on-conflict):** every character carries a
  `version`. A save sends the version it loaded; the API does a conditional
  `UPDATE … WHERE version = ?`. If the server copy moved on since you loaded it,
  the save returns **409** and the UI makes you save a **renamed copy** instead
  of clobbering. Otherwise the last save wins.
- **Trash bin:** delete is a soft delete (`deleted_at`); the Trash tab lists
  deleted characters and can restore them. Items are purged ~30 days after
  deletion (done lazily when the Trash is opened, since Pages Functions have no
  cron).

## Files

| Path | Purpose |
| --- | --- |
| `db/schema.sql` | D1 tables (`users`, `magic_tokens`, `characters`) |
| `functions/api/_lib/*.js` | Shared helpers (JSON, session cookie, hashing, email, Turnstile) |
| `functions/api/config.js` | Public client config (Turnstile site key) |
| `functions/api/auth/*.js` | `request-link`, `callback`, `logout`, `me` |
| `functions/api/characters/*.js` | List/create, get/save/delete, restore |
| `functions/api/trash/index.js` | Trash listing + lazy purge |
| `quartz/static/charsheet/vault.js` | The vault UI injected into the sheet |

## Cloudflare setup

Everything below is configured **in the `riket` Pages project** (the same
project that serves the site). Bindings and variables should be added to **both
Production and Preview** environments, and a **new deployment** is required after
changing them.

> **Do not commit a `wrangler.toml`.** If one exists, Pages ignores the
> dashboard bindings/variables entirely and uses the file instead. This project
> keeps its configuration in the dashboard.

### 1. D1 database binding — _done_

The D1 database is bound to the project. The binding **variable name must be
`DB`** (the code reads `env.DB`). If you named it something else, rename the
binding (Pages → Settings → Functions → D1 database bindings) or it won't work.

Apply the schema once (you only need to do this a single time):

```sh
npx wrangler login                 # once, in a browser
npx wrangler d1 execute <DATABASE_NAME> --remote --file=./db/schema.sql
```

`<DATABASE_NAME>` is the D1 database's name (not the `DB` binding name). You can
instead paste `db/schema.sql` into the D1 **Console** in the dashboard.

### 2. Environment variables

Pages → Settings → **Environment variables**. Mark the three secrets as
encrypted.

| Variable | Required | Kind | Notes |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | yes | secret | _done_ — your Resend API key |
| `SESSION_SECRET` | **yes** | secret | Signs the session cookie. See below |
| `MAIL_FROM` | recommended | plaintext | Sender, e.g. `I Rikets Tjänst <noreply@exostra.se>`. Must be on a domain you verified in Resend. Defaults to `noreply@exostra.se` |
| `TURNSTILE_SITE_KEY` | optional | plaintext | Enables the bot-check widget. See below |
| `TURNSTILE_SECRET` | optional | secret | Enforces the bot check server-side |

#### Generate `SESSION_SECRET`

Any long, random, secret string. Pick one:

```sh
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Copy the output into `SESSION_SECRET` (Production **and** Preview), then
redeploy. Treat it like a password — if you rotate it, all existing sessions are
invalidated (everyone is logged out), which is the way to force a global logout.

#### Email sending (Resend) and the `from` domain

The `MAIL_FROM` address must be on a domain you have **verified in Resend**
(Resend → Domains). The default is `noreply@exostra.se`, so verifying `exostra.se`
is enough; sending from an unverified domain (e.g. the `riket.exostra.se`
subdomain if only the apex is verified) makes Resend reject the request, which
surfaces in the UI as _"Kunde inte skicka e-post just nu (fel 403)…"_.

- Verify a domain you control (e.g. `exostra.se`) by adding the DNS records
  Resend shows you — quick, since DNS for `exostra.se` is already in Cloudflare —
  then set `MAIL_FROM` to a sender on it, e.g. `I Rikets Tjänst <noreply@exostra.se>`.
- For a quick test before verifying a domain, set `MAIL_FROM=onboarding@resend.dev`
  (Resend's shared sender). It only delivers to your own Resend account email and
  is rate-limited, but it confirms the wiring works.

The exact provider response is logged by the function (`Resend send failed: HTTP
… — …`); view it under **Workers & Pages → riket →** the deployment **→
Functions → Begin log stream**, or with `npx wrangler pages deployment tail
--project-name riket`.

#### Set up Turnstile (bot protection)

Turnstile is optional but recommended once the vault is public. **Until both
`TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET` are set, sign-up is open and the
server skips the bot check** — so you can test first and lock it down after.

1. Cloudflare dashboard → **Turnstile** → **Add widget**.
2. Name it (e.g. `riket-vault`) and add the hostnames it will run on:
   - `riket.exostra.se` (production)
   - `riket.pages.dev` (preview deployments)
   - `localhost` and `127.0.0.1` (only if you test locally)
3. Widget mode: **Managed** (recommended).
4. Create it. You get a **Site Key** (public) and a **Secret Key**.
5. In Pages → Environment variables, set:
   - `TURNSTILE_SITE_KEY` = the Site Key (plaintext)
   - `TURNSTILE_SECRET` = the Secret Key (secret/encrypted)
6. Redeploy. The login form now shows the Turnstile widget and the API rejects
   requests that fail verification.

The frontend fetches the site key from `/api/config`, so no HTML edit is needed
when you add or remove Turnstile.

## Local development

`npx quartz build --serve` does **not** run the Functions. To exercise the API
locally, build the site and serve it with Wrangler:

```sh
npx quartz plugin install && npx quartz build      # produces public/
npx wrangler pages dev public --d1 DB=<DATABASE_NAME>
```

Put local secrets in a **`.dev.vars`** file at the repo root (gitignored):

```
SESSION_SECRET=some-local-dev-secret
RESEND_API_KEY=your-resend-key
MAIL_FROM=I Rikets Tjänst <onboarding@resend.dev>
```

Leave `TURNSTILE_*` unset locally to skip the bot check. Use Resend's
`onboarding@resend.dev` sender for local testing if you haven't verified a domain
yet.

## API reference

All routes are same-origin and use the session cookie. JSON in, JSON out.

| Method & path | Body | Result |
| --- | --- | --- |
| `POST /api/auth/request-link` | `{email, turnstileToken?}` | `{ok}` (always, if input valid) |
| `GET /api/auth/callback?token=` | — | 302 redirect to the sheet, sets cookie |
| `POST /api/auth/logout` | — | clears cookie |
| `GET /api/auth/me` | — | `{authenticated, email?}` |
| `GET /api/config` | — | `{turnstileSiteKey}` |
| `GET /api/characters` | — | `{characters: [{id,name,version,updated_at}]}` |
| `POST /api/characters` | `{name?, data}` | `{id,name,version}` (201) |
| `GET /api/characters/:id` | — | `{id,name,version,updated_at,data}` |
| `PUT /api/characters/:id` | `{name?, data, version}` | `{id,name,version}` or **409** `{serverVersion,serverName}` |
| `DELETE /api/characters/:id` | — | `{ok}` (soft delete) |
| `POST /api/characters/:id/restore` | — | `{ok}` |
| `GET /api/trash` | — | `{characters, purgeAfterDays}` |
