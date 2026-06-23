# Deployment

The website for _I Rikets Tjänst_ is built with [Quartz 5](https://quartz.jzhao.xyz/)
and hosted on **Cloudflare Pages**. It is served publicly at
**<https://exostra.se/riket>**.

Because `exostra.se` already hosts other content, Riket lives on the `/riket`
path. Cloudflare Pages custom domains map to the _root_ of a project, so the
`/riket` prefix is provided by a small **Cloudflare Worker** on the `exostra.se`
zone that forwards `/riket/*` to the Pages project. Quartz emits relative asset
and link paths, so the build is fully relocatable under the prefix — the only
absolute-URL setting is `baseUrl: exostra.se/riket` in `quartz.config.yaml`
(used for canonical links, OG tags, RSS, and the sitemap).

```
visitor ─▶ https://exostra.se/riket/...        (exostra.se zone)
                 │
                 ▼  Worker: strip "/riket", forward
           https://riket.pages.dev/...          (Cloudflare Pages project)
```

## 1. Cloudflare Pages project (Git integration)

Create the project once in the Cloudflare dashboard
(**Workers & Pages → Create → Pages → Connect to Git**):

| Setting                | Value                                           |
| ---------------------- | ----------------------------------------------- |
| Project name           | `riket` (gives `riket.pages.dev`)               |
| Repository             | `ulmus/Riket`                                   |
| Production branch      | `main`                                          |
| Framework preset       | None                                            |
| Build command          | `npx quartz plugin install && npx quartz build` |
| Build output directory | `public`                                        |
| Root directory         | _(repository root)_                             |

Cloudflare installs dependencies automatically from `package-lock.json` before
running the build command. The Node version is pinned by the repo's
`.node-version` file (currently `v22.16.0`); if a build picks the wrong version,
set a `NODE_VERSION=22.16.0` environment variable and select the latest build
system image in the project's build settings.

After this, every push to `main` triggers a Cloudflare build and deploy, and
pull requests get automatic **preview deployments** at
`<deployment>.riket.pages.dev`. There is no GitHub Actions deploy workflow;
`.github/workflows/pr-build.yml` still builds each PR as an extra check.

> Verify the project itself at `https://riket.pages.dev/` — it serves the site
> at its own root. The `/riket` prefix is added by the Worker below.

## 2. Worker route for `exostra.se/riket`

The Worker that mounts the project under `/riket` lives in
[`cloudflare/riket-router/`](cloudflare/riket-router/). It strips the `/riket`
prefix before forwarding to `riket.pages.dev` and rewrites redirect `Location`
headers so the public hostname and prefix are preserved (e.g. when Cloudflare
normalises a directory URL to add a trailing slash).

Deploy it on the **`exostra.se` zone** (it must be the zone where `exostra.se`
DNS is managed in Cloudflare):

```sh
cd cloudflare/riket-router
npx wrangler deploy
```

`wrangler.toml` binds the Worker to the routes `exostra.se/riket` and
`exostra.se/riket/*`. You can also configure these under
**Workers & Pages → your Worker → Settings → Domains & Routes** in the
dashboard. If `riket.pages.dev` is not your project's URL, update `PAGES_HOST`
in `cloudflare/riket-router/worker.js`.

## 3. Decommission the old GitHub Pages site (optional)

The site previously deployed to GitHub Pages at `ulmus.github.io/Riket`. After
Cloudflare is live you can set **Settings → Pages → Source** to _None_ in the
GitHub repo to stop serving the stale copy.

## Local preview

```sh
npm install            # once
npx quartz plugin install
npx quartz build --serve
```

Local preview serves at the root (`http://localhost:8080/`), which is fine —
the `/riket` prefix only matters in production via the Worker.
