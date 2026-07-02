# Personalakts-arkivet — character library + cloud vault

A character **library** ("Personalakts-arkivet") with two storage backends,
browsed from a gallery (`quartz/static/arkivet/index.html`, served at
`/static/arkivet/`) and edited one at a time in the sheet — a *personalakt* —
(`personalakt.html`, served at `/static/arkivet/personalakt`):

- **local** — "**Skrivbordet**": characters kept in this browser's
  `localStorage`. No login, works offline.
- **cloud** — "**Arkivskåpet**": characters kept in the vault (Cloudflare D1),
  available once you log in (passwordless **magic link**) and reachable from any
  device.

(`local`/`cloud` stay the internal backend identifiers; **Skrivbordet** and
**Arkivskåpet** are only the Swedish display names shown to players.)

Logged out you see and edit your local characters and can import the pre-gens.
Logged in you also see your cloud characters, and can move a local character to
the cloud. Each character carries its origin, so opening one never overwrites
another, and edits propagate back to wherever it came from.

The cloud side runs entirely on Cloudflare alongside the Pages site: a small
[Pages Functions](https://developers.cloudflare.com/pages/functions/) API under
`/api/*` backed by a [D1](https://developers.cloudflare.com/d1/) database. No
separate Worker or pipeline — pushing to `main` deploys the Functions with the
site.

## How it works

- **Auth:** passwordless. Enter an email; the API stores a single-use, 15-minute
  token (only its SHA-256 hash) and emails a link via [Resend](https://resend.com).
  Clicking it sets a signed, HttpOnly session cookie and returns you to the page
  you logged in from. No passwords anywhere.
- **A character is one self-contained JSON blob** (the sheet's `serialize()`
  output) — including its photo, which is uploaded, auto-cropped to a portrait
  and stored inline as a `data:` URI. That keeps a character portable across
  local and cloud with no external files.
- **Editing & autosave:** opening a character writes it to the sheet's working
  buffer (`localStorage['irt-rt1-v1']`) and records its origin in `irt-open`.
  On every edit the sheet autosaves the buffer, and `store.js` routes it: local
  characters save instantly to the local library (`irt-chars`); cloud characters
  push to the vault automatically ~1.5 s after you stop typing.
- **Cloud save (last-write-wins + rename-on-conflict):** every cloud character
  carries a `version`. A save sends the loaded version; the API does a
  conditional `UPDATE … WHERE version = ?`. If the server copy moved on, the save
  returns **409** and the sheet offers to save a **renamed copy** instead of
  clobbering. Otherwise the last save wins.
- **Version history & revert:** every cloud character keeps an append-only stack
  of past snapshots (`character_versions`). The most recent snapshot (the "head")
  always mirrors the character's current `data`, so the head is "Nuvarande". A
  snapshot is recorded on create and on every save, but consecutive autosaves
  within a short window (`COALESCE_WINDOW_SEC`, 120 s) collapse into one evolving
  snapshot so an editing burst is a single version, not dozens; only the newest
  `MAX_VERSIONS` (30) are kept. **Reverting** (`POST /api/characters/:id/revert`)
  copies a chosen snapshot onto a fresh head and bumps the concurrency `version`,
  so the current becomes that version while the **full stack is preserved** —
  nothing is lost and you can always go back. Reverting also invalidates any
  in-progress edit elsewhere via the same 409 concurrency check. Owners and
  assignees can both view history and revert. In the UI, cloud cards (and the
  sheet's status chip while editing a cloud character) get a **Versioner** button
  that lists the snapshots and reverts to one; reverting the open character
  reloads the sheet onto the reverted state.
- **Trash bin:** deleting a cloud character is a soft delete (`deleted_at`); the
  gallery shows a Trash section to restore from, delete single items permanently,
  or empty it. Items are also purged ~30 days after deletion (lazily when the
  trash is listed, since Pages Functions have no cron). Deleting a local
  character removes it immediately.
- **Sharing:** a vault owner can invite others by email (`vault_members`).
  Inviting **creates a pending account** (`users.confirmed_at` NULL until their
  first login) if needed and **emails an invitation/login link either way**. The
  owner assigns characters to members (`characters.assigned_to`); a member sees
  and edits **only** the characters assigned to them. The gallery shows a section
  per vault you're in (your own + each you've been invited to). Either side can
  end a membership: the owner removes a member (`DELETE /api/members/:id`), or a
  member leaves a vault they were invited to (`DELETE /api/vaults/:ownerId`, the
  "Lämna" button on each shared-vault section in the gallery). Both paths
  unassign the characters that were assigned to that member. Access is enforced
  server-side: read/edit require owner-or-assignee; delete, assign and invite are
  owner-only; leaving only affects your own membership.

## Files

| Path | Purpose |
| --- | --- |
| `db/schema.sql` | D1 tables (`users`, `magic_tokens`, `characters`, `character_versions`, `vault_members`) |
| `functions/api/_lib/*.js` | Shared helpers (JSON, session cookie, hashing, email, Turnstile, version stack) |
| `functions/api/characters/[id]/versions.js` · `revert.js` | List version history / revert to a version |
| `functions/api/config.js` | Public client config (Turnstile site key) |
| `functions/api/auth/*.js` | `request-link`, `callback` (honours `next`), `logout`, `me` |
| `functions/api/characters/*.js` | List (with foto/expertis), create, get/save/delete, restore |
| `functions/api/trash/index.js` | Trash listing + lazy purge |
| `quartz/static/arkivet/store.js` | Storage layer (local+cloud), gallery, login, sheet autosave routing, photo upload |
| `quartz/static/arkivet/index.html` | The library gallery page |
| `quartz/static/arkivet/personalakt.html` | The character sheet editor (served at `/static/arkivet/personalakt`) |

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

**Migrations.** When new features add columns/tables, apply the numbered
migration files in order (each is additive and safe to run once). For the
sharing feature (members + character assignment):

```sh
npx wrangler d1 execute <DATABASE_NAME> --remote --file=./db/0002_sharing.sql
```

For the version-history feature (per-character snapshot stack + revert):

```sh
npx wrangler d1 execute <DATABASE_NAME> --remote --file=./db/0003_versions.sql
```

A brand-new database created from `db/schema.sql` already includes everything,
so the migrations are only for databases created before a feature landed.

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
| `POST /api/auth/request-link` | `{email, turnstileToken?, next?}` | `{ok}` (always, if input valid) |
| `GET /api/auth/callback?token=&next=` | — | 302 redirect to `next` (same-origin arkivet path), sets cookie |
| `POST /api/auth/logout` | — | clears cookie |
| `GET /api/auth/me` | — | `{authenticated, email?}` |
| `GET /api/config` | — | `{turnstileSiteKey}` |
| `GET /api/characters` | — | my vault: `[{id,name,version,updated_at,foto,expertis,assignedTo,assigneeEmail}]` |
| `GET /api/characters?owner=:id` | — | a vault I'm in: characters assigned to me there |
| `POST /api/characters` | `{name?, data}` | `{id,name,version}` (201) — created in my vault |
| `GET /api/characters/:id` | — | `{id,name,version,updated_at,data}` (owner or assignee) |
| `PUT /api/characters/:id` | `{name?, data, version}` | `{id,name,version}` or **409** (owner or assignee) |
| `GET /api/characters/:id/versions` | — | `{id,version,versions:[{id,number,name,created_at,foto,expertis,isCurrent}]}` (owner or assignee) |
| `POST /api/characters/:id/revert` | `{version}` (a version's `id`) | `{id,name,version,data}` — current set to that snapshot, stack kept (owner or assignee) |
| `PUT /api/characters/:id/assign` | `{memberId\|null}` | `{ok,assignedTo,assigneeEmail}` (owner only) |
| `DELETE /api/characters/:id` | — | `{ok}` (soft delete; owner only) |
| `POST /api/characters/:id/restore` | — | `{ok}` |
| `GET /api/trash` | — | `{characters, purgeAfterDays}` |
| `DELETE /api/trash/:id` · `DELETE /api/trash` | — | purge one / empty all |
| `GET /api/members` · `POST /api/members` | `{email}` | list members / invite (creates pending user + emails link) |
| `DELETE /api/members/:id` | — | remove member (and unassign their characters) |
| `GET /api/vaults` | — | `{vaults: [{ownerId, ownerEmail}]}` — vaults I'm a member of |
| `DELETE /api/vaults/:ownerId` | — | `{ok}` — leave that vault (removes my membership, unassigns my characters there) |
