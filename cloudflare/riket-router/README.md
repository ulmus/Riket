# exostra-riket-router

Cloudflare Worker that serves the [`riket` Cloudflare Pages
project](https://riket.pages.dev/) at **<https://exostra.se/riket>**.

`exostra.se` hosts other content, so this Worker provides the `/riket` path
prefix that a Pages custom domain cannot. It forwards `exostra.se/riket/*` to
`riket.pages.dev`, stripping the prefix and rewriting redirect `Location`
headers. See [`../../DEPLOYMENT.md`](../../DEPLOYMENT.md) for the full picture.

## Deploy

```sh
npx wrangler deploy
```

Run this on the Cloudflare account/zone where `exostra.se` DNS is managed. The
routes in `wrangler.toml` bind the Worker to `exostra.se/riket` and
`exostra.se/riket/*`.

## Configuration

- `PAGES_HOST` in `worker.js` — the Pages project hostname (default
  `riket.pages.dev`). Change it if your project URL differs.
- `PREFIX` in `worker.js` — the public path prefix (default `/riket`).
