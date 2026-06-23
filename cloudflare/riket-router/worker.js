// Routes exostra.se/riket/* to the "riket" Cloudflare Pages project.
//
// exostra.se hosts other content, so Riket lives on the /riket path. Cloudflare
// Pages custom domains map to a project root, so this Worker (deployed on the
// exostra.se zone) provides the /riket prefix: it strips "/riket" before
// forwarding to the Pages origin and rewrites redirect Location headers so the
// public hostname and prefix are preserved. Quartz uses relative asset/link
// paths, so the stripped requests resolve correctly. See ../../DEPLOYMENT.md.

const PAGES_HOST = "riket.pages.dev"
const PREFIX = "/riket"

export default {
  async fetch(request) {
    const url = new URL(request.url)

    // Only handle the /riket subtree; anything else passes through untouched.
    const underPrefix = url.pathname === PREFIX || url.pathname.startsWith(PREFIX + "/")
    if (!underPrefix) {
      return fetch(request)
    }

    // Normalise the bare /riket to /riket/ so the home page's relative links resolve.
    if (url.pathname === PREFIX) {
      return Response.redirect(`${url.origin}${PREFIX}/${url.search}`, 308)
    }

    // exostra.se/riket/<path> -> riket.pages.dev/<path>
    const upstream = new URL(url)
    upstream.protocol = "https:"
    upstream.hostname = PAGES_HOST
    upstream.port = ""
    upstream.pathname = url.pathname.slice(PREFIX.length) || "/"

    const response = await fetch(new Request(upstream, request), { redirect: "manual" })

    // Re-mount same-origin redirects (e.g. trailing-slash normalisation) back
    // under exostra.se/riket so the pages.dev hostname never leaks to the client.
    const location = response.headers.get("location")
    if (location) {
      const dest = new URL(location, upstream)
      if (dest.hostname === PAGES_HOST) {
        const rewritten = new URL(url)
        rewritten.pathname = (PREFIX + dest.pathname).replace(/\/{2,}/g, "/")
        rewritten.search = dest.search
        const headers = new Headers(response.headers)
        headers.set("location", rewritten.toString())
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        })
      }
    }

    return response
  },
}
