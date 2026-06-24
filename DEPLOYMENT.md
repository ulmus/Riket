# Deployment

The website for _I Rikets Tjänst_ is built with [Quartz 5](https://quartz.jzhao.xyz/)
and hosted on **Cloudflare Pages**. It is served publicly at
**<https://riket.exostra.se>**.

`riket.exostra.se` is a subdomain, so the Cloudflare Pages custom domain maps
directly to the project root — no path prefix and no routing Worker. The only
host-specific setting is `baseUrl: riket.exostra.se` in `quartz.config.yaml`.

> **Why `baseUrl` must have no path.** Quartz injects `baseUrl`'s path
> component as `data-basepath` on `<body>`, and the client-rendered navigation
> (explorer, search, graph) prepends it to every link. A subdomain root has an
> empty path, so `baseUrl: riket.exostra.se` yields an empty base and links like
> `/regler/grundregler` resolve correctly. A value with a path (e.g.
> `exostra.se/riket`) would make those links `/riket/...` and 404 at the root.

## 1. Cloudflare Pages project (Git integration)

Create the project once in the Cloudflare dashboard
(**Workers & Pages → Create → Pages → Connect to Git**):

| Setting                | Value                             |
| ---------------------- | --------------------------------- |
| Project name           | `riket` (gives `riket.pages.dev`) |
| Repository             | `ulmus/Riket`                     |
| Production branch      | `main`                            |
| Framework preset       | None                              |
| Build command          | `npx quartz build`                |
| Build output directory | `public`                          |
| Root directory         | _(repository root)_               |

Cloudflare installs dependencies automatically from `package-lock.json` before
running the build command. The Node version is pinned by the repo's
`.node-version` file (currently `v22.16.0`); if a build picks the wrong version,
set a `NODE_VERSION=22.16.0` environment variable and select the latest build
system image in the project's build settings.

> **The build command is just `npx quartz build` — no `plugin install`.** The
> enabled plugins are vendored into the repo (see [Plugins are
> vendored](#plugins-are-vendored) below), so Cloudflare must **not** re-clone
> and recompile them on every deploy. If you ever see the build command set to
> `npx quartz plugin install && npx quartz build`, change it back: the install
> step is what made deploys slow.

After this, every push to `main` triggers a Cloudflare build and deploy, and
pull requests get automatic **preview deployments** at
`<deployment>.riket.pages.dev`. Cloudflare handles all builds; the repo has no
GitHub Actions workflows.

## 2. Custom domain

In the Pages project: **Custom domains → Set up a custom domain →
`riket.exostra.se`**. Because `exostra.se` is managed in Cloudflare, the
required `CNAME` DNS record (`riket` → `riket.pages.dev`) is created
automatically and TLS is provisioned for you. Once active, the site is live at
<https://riket.exostra.se>.

## 3. Decommission the old GitHub Pages site (optional)

The site previously deployed to GitHub Pages at `ulmus.github.io/Riket`. After
Cloudflare is live you can set **Settings → Pages → Source** to _None_ in the
GitHub repo to stop serving the stale copy.

## Plugins are vendored

Quartz pulls its features from ~29 community plugins, each a separate Git repo.
By default `npx quartz plugin install` **clones and then `npm install` +
`npm run build`s every one of them**, and because Cloudflare builds in a fresh
container with `.quartz/` gitignored, that whole clone-and-compile ran on every
single deploy — the dominant cost of the build.

To avoid it, the **built output of the enabled plugins is committed to the
repo** under `.quartz/plugins/<name>/dist` (plus each `package.json` and the
generated `index.ts`). `.gitignore` is configured to track exactly those files
and nothing else — no `node_modules`, no `.git`. Each plugin's `dist/` bundle
includes everything except the shared externals (preact, unified, sharp,
`@quartz-community/*`, …), which resolve to the repo's own `node_modules` (which
Cloudflare installs from `package-lock.json` before building). The deploy build
is therefore just `npx quartz build`.

The plugin loader (`quartz/plugins/loader/gitLoader.ts`) treats a plugin
directory that has a committed `dist/` but no `.git` as already installed, so
the build neither re-clones nor recompiles it — this is what makes the vendored
output count instead of being deleted and re-fetched on every build.

### Updating plugins

Whenever you **add, remove, enable, disable, or update** a plugin, re-vendor and
commit — run this locally, where GitHub is reachable:

```sh
# 1. register any brand-new plugin in the lockfile first (skips updates/toggles)
npx quartz plugin add github:quartz-community/<name>

# 2. rebuild and re-vendor the enabled set, then commit the result
npm run vendor:plugins
git add .quartz/plugins
git commit -m "Re-vendor Quartz plugins"
```

`npm run vendor:plugins` reads the enabled plugins from `quartz.config.yaml`,
clones + builds them, strips `node_modules`/`.git`, and leaves only what the
build needs. To bump a plugin to its latest commit, run
`npx quartz plugin install --latest <name>` first, then re-vendor.

## Local preview

A fresh clone already contains the built plugins, so no install step is needed:

```sh
npm install            # once
npx quartz build --serve
```

Local preview serves at the root (`http://localhost:8080/`); `--serve` forces an
empty base path, so navigation works the same as in production. (If you change
which plugins are enabled, run `npm run vendor:plugins` to refresh
`.quartz/plugins` before previewing.)
