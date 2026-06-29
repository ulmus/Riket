// Inject the sv-SE locale into community plugins after they are installed.
//
// The quartz-community plugins bundle their own i18n translations and none of
// them include sv-SE, so with `locale: sv-SE` they all fall back to English
// (reading time, search, dark-mode toggle, backlinks, folder/tag pages, etc.).
// `.quartz/plugins` is gitignored and rebuilt on every install, so the only
// durable fix is to re-apply this after each install. It is wired into
// `quartz plugin install` (quartz/cli/plugin-git-handlers.js) and the
// `install-plugins` script, and can also be run directly:
//
//     node quartz/cli/patch-plugin-locales.mjs
//
// How it works: each plugin bundles a `var locales = { ... }` map and looks up
// `locales[locale] || en_US_default`. We add an "sv-SE" entry that is a DEEP
// MERGE of our Swedish strings OVER that plugin's own English default. The
// merge matters: a plugin may read i18n keys we have not translated (e.g.
// note-properties), and falling back to English for those is correct — whereas
// injecting a bare partial object would make `undefined.title` crash the build.
//
// Properties:
//   - Idempotent: skips any file already carrying our marker.
//   - Defensive: if a future plugin version changes its bundle shape so the
//     anchor/fallback can't be found, that plugin is skipped (its strings
//     revert to English) and the build still succeeds. It never throws fatally.
//   - Self-disabling: if upstream ships sv-SE itself, the lookup finds it first
//     and our merged copy is unused; this file can then be deleted.
//
// Must stay plain ESM (no TypeScript): the `quartz plugin install` CLI runs
// under plain Node, not tsx, so it cannot import a .ts file.

import fs from "fs"
import path from "path"
import { styleText } from "util"
import { pathToFileURL } from "url"

import svSE from "../i18n/plugin-sv-SE.mjs"

const LOCALE = "sv-SE"
const PLUGINS_DIR = path.join(process.cwd(), ".quartz", "plugins")
const MARKER = "__svSEPatch"

/** Serialize a value (including functions) to injectable JS source. */
function toLiteral(value) {
  if (typeof value === "function") return value.toString()
  if (value === null || value === undefined) return "null"
  if (Array.isArray(value)) return `[${value.map(toLiteral).join(",")}]`
  if (typeof value === "object") {
    const entries = Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}:${toLiteral(v)}`)
    return `{${entries.join(",")}}`
  }
  return JSON.stringify(value)
}

const SV_LITERAL = toLiteral(svSE)

// Runtime prelude injected just before a plugin's `locales` map. Deep-merges
// our Swedish strings over the plugin's own English default so untranslated
// keys keep working.
const PRELUDE =
  `var ${MARKER} = ${SV_LITERAL};\n` +
  `function __svSEMerge(base, over) {\n` +
  `  if (over === null || typeof over !== "object") return over;\n` +
  `  if (base === null || typeof base !== "object") return over;\n` +
  `  var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);\n` +
  `  for (var __k of Object.keys(over)) out[__k] = __svSEMerge(base[__k], over[__k]);\n` +
  `  return out;\n` +
  `}\n`

// Start of a bundled translations map, e.g. `var locales = {`.
const LOCALES_MAP_ANCHOR = /(\b(?:var|const|let)\s+locales\s*=\s*\{)/
// Captures the English fallback identifier in `return locales[locale] || NAME`.
const FALLBACK_RE = /return\s+locales\[locale\]\s*\|\|\s*([A-Za-z_$][\w$]*)/

/** Recursively collect *.js files under a directory. */
function collectJsFiles(dir) {
  const out = []
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue
      out.push(...collectJsFiles(full))
    } else if (entry.isFile() && full.endsWith(".js")) {
      out.push(full)
    }
  }
  return out
}

/**
 * content-index resolves its RSS strings from plugin options with English
 * defaults (and rssLimit defaults to 10, so the function-valued "Last N notes"
 * default is what's actually used — not expressible in YAML). The effective
 * values live in the bundle's `defaultOptions`; swap those for Swedish, and the
 * `??` fallbacks too in case a future version drops the defaults.
 */
function patchContentIndexDefaults(content) {
  let next = content
  next = next.replace(
    /rssRecentNotesText:\s*"Recent notes"/g,
    `rssRecentNotesText: "Senaste sidorna"`,
  )
  next = next.replace(
    /rssLastFewNotesText:\s*\(count\)\s*=>\s*`Last \$\{count\} notes`/g,
    `rssLastFewNotesText: (count) => \`Senaste \${count} sidorna\``,
  )
  next = next.replace(/\?\?\s*"Recent notes"/g, `?? "Senaste sidorna"`)
  next = next.replace(
    /\?\?\s*\(\(count\)\s*=>\s*`Last \$\{count\} notes`\)/g,
    `?? ((count) => \`Senaste \${count} sidorna\`)`,
  )
  // The " on <title>" connector is hardcoded (not i18n); make it Swedish too.
  next = next.replace(/\} on \$\{escapeHTML\(pageTitle\)\}/g, "} på ${escapeHTML(pageTitle)}")
  return next
}

/**
 * table-of-contents: the bundled IntersectionObserver toggles the `in-view`
 * highlight class on TOC entries as the matching headings scroll past, but it
 * never scrolls the (independently scrollable) TOC list itself. On a long page
 * the highlighted entry drifts out of the TOC's visible area. Append a small
 * companion script to the component's inline bundle that watches the `in-view`
 * class and keeps the active entry scrolled into view *within the TOC list*
 * (adjusting only `scrollTop`, never the page). Decoupled from the upstream
 * observer, so a future plugin version that reworks the observer keeps working.
 */
function patchTableOfContentsAutoScroll(content) {
  if (content.includes("__tocAutoScroll")) return content // idempotent
  // No single quotes / backslashes / newlines below, so it is safe to splice
  // verbatim into the single-quoted `toc_inline_default` string literal.
  const APPEND =
    ";function __tocAutoScroll(){" +
    'document.querySelectorAll("ul.toc-content").forEach(function(toc){' +
    "function sync(){" +
    'var links=toc.querySelectorAll("a.in-view");' +
    "var active=links[links.length-1];" +
    "if(!active)return;" +
    "var cr=toc.getBoundingClientRect(),lr=active.getBoundingClientRect();" +
    "if(lr.top<cr.top)toc.scrollTop-=cr.top-lr.top;" +
    "else if(lr.bottom>cr.bottom)toc.scrollTop+=lr.bottom-cr.bottom" +
    "}" +
    "var mo=new MutationObserver(sync);" +
    'mo.observe(toc,{subtree:true,attributes:true,attributeFilter:["class"]});' +
    "sync();" +
    "if(window.addCleanup)window.addCleanup(function(){mo.disconnect()})" +
    "})" +
    "}" +
    'document.addEventListener("nav",__tocAutoScroll);' +
    'document.addEventListener("render",__tocAutoScroll);'
  return content.replace(
    /(var toc_inline_default = ')((?:\\.|[^'])*)(';)/,
    (_m, open, body, close) => open + body + APPEND + close,
  )
}

/** Patch a single built file. Returns { changed, anchored }. */
function patchFile(file, pluginName) {
  let content
  try {
    content = fs.readFileSync(file, "utf-8")
  } catch {
    return { changed: false, anchored: false }
  }

  let next = content
  let changed = false

  // 1) Inject a deep-merged sv-SE entry into the bundled `locales` map.
  const hasMap = LOCALES_MAP_ANCHOR.test(next) && next.includes("locales[locale]")
  const anchored = hasMap
  if (hasMap && !next.includes(MARKER)) {
    const fallback = next.match(FALLBACK_RE)?.[1]
    if (fallback) {
      next = next.replace(
        LOCALES_MAP_ANCHOR,
        `${PRELUDE}$1\n  "${LOCALE}": __svSEMerge(${fallback}, ${MARKER}),`,
      )
      changed = changed || next !== content
    }
    // No identifiable fallback → leave it alone (falls back to English).
  }

  // 2) content-index: localize its RSS option fallbacks.
  if (pluginName === "content-index") {
    const swapped = patchContentIndexDefaults(next)
    if (swapped !== next) {
      next = swapped
      changed = true
    }
  }

  // 3) search: the magnifying-glass SVG <title> is hardcoded (not i18n).
  if (pluginName === "search") {
    const swapped = next.replace(/("title",\s*\{\s*children:\s*)"Search"(\s*\})/g, `$1"Sök"$2`)
    if (swapped !== next) {
      next = swapped
      changed = true
    }
  }

  // 4) table-of-contents: keep the highlighted entry scrolled into view.
  if (pluginName === "table-of-contents") {
    const swapped = patchTableOfContentsAutoScroll(next)
    if (swapped !== next) {
      next = swapped
      changed = true
    }
  }

  if (changed) fs.writeFileSync(file, next)
  return { changed, anchored }
}

/**
 * Inject the sv-SE locale into every installed plugin that needs it.
 * @param {{ verbose?: boolean }} [options]
 * @returns {{ patched: string[], skipped: string[] }}
 */
export function patchPluginLocales(options = {}) {
  const { verbose = false } = options
  const result = { patched: [], skipped: [] }

  if (!fs.existsSync(PLUGINS_DIR)) return result

  let pluginDirs
  try {
    pluginDirs = fs
      .readdirSync(PLUGINS_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  } catch {
    return result
  }

  for (const pluginName of pluginDirs) {
    try {
      const files = collectJsFiles(path.join(PLUGINS_DIR, pluginName, "dist"))
      let patchedAny = false
      let anchoredAny = pluginName === "content-index"
      for (const file of files) {
        const { changed, anchored } = patchFile(file, pluginName)
        if (changed) patchedAny = true
        if (anchored) anchoredAny = true
      }
      if (patchedAny) {
        result.patched.push(pluginName)
        if (verbose) console.log(styleText("green", `  ✓ ${pluginName}: injected ${LOCALE}`))
      } else if (anchoredAny) {
        result.skipped.push(pluginName) // already localized
      }
    } catch (err) {
      // Never break the build over a single plugin.
      console.log(
        styleText("yellow", `  ⚠ ${pluginName}: ${LOCALE} patch skipped (${err?.message ?? err})`),
      )
    }
  }

  return result
}

// Allow running directly: `node quartz/cli/patch-plugin-locales.mjs`
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { patched, skipped } = patchPluginLocales({ verbose: true })
  console.log(
    styleText(
      "cyan",
      `→ ${LOCALE} locale patch: ${patched.length} patched, ${skipped.length} already localized`,
    ),
  )
}
