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

## Local preview

```sh
npm install            # once
npx quartz plugin install
npx quartz build --serve
```

Local preview serves at the root (`http://localhost:8080/`); `--serve` forces an
empty base path, so navigation works the same as in production.
