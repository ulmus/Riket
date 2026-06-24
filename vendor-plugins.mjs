#!/usr/bin/env node
/**
 * Vendor the ENABLED community plugins' built output into the repository.
 *
 * Why: Cloudflare Pages builds in a fresh container every deploy and
 * `.quartz/` is otherwise gitignored, so `npx quartz plugin install` re-clones
 * AND re-`npm install`s + re-`npm run build`s every plugin on every build —
 * which is the bulk of the build time. By committing each plugin's built
 * `dist/` (plus its `package.json` and the generated `index.ts`), the deploy
 * build becomes simply `npx quartz build`: no clones, no per-plugin compiles.
 *
 * Run this LOCALLY (where GitHub is reachable) whenever you add, remove, enable,
 * disable, or update a plugin, then commit the result:
 *
 *     npm run vendor:plugins
 *     git add .quartz/plugins          # .gitignore keeps it to dist + package.json
 *     git commit -m "Re-vendor Quartz plugins"
 *
 * What it does:
 *   1. Reads the enabled plugins from quartz.config.yaml.
 *   2. Wipes .quartz/plugins for a clean, reproducible regeneration.
 *   3. Runs `npx quartz plugin install <enabled...>` (clone + build) for them.
 *   4. Strips each plugin's node_modules and .git. The built dist/ already
 *      bundles everything except the shared externals (preact, unified, sharp,
 *      @quartz-community/*, ...), which resolve to the repo's own node_modules
 *      at build time — so only dist/ + package.json need to be committed.
 *
 * New plugins must first be registered in the lockfile with
 * `npx quartz plugin add github:quartz-community/<name>` before they can be
 * vendored here.
 */
import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { parse } from "yaml"

const ROOT = process.cwd()
const CONFIG_PATH = path.join(ROOT, "quartz.config.yaml")
const PLUGINS_DIR = path.join(ROOT, ".quartz", "plugins")

function pluginName(source) {
  if (source && typeof source === "object") {
    return source.name ?? source.repo?.split("/").pop()
  }
  return String(source)
    .replace(/^github:/, "")
    .split("#")[0]
    .split("/")
    .pop()
}

function enabledPluginNames() {
  const cfg = parse(fs.readFileSync(CONFIG_PATH, "utf-8"))
  return (cfg.plugins ?? [])
    .filter((p) => p.enabled !== false) // enabled by default unless explicitly false
    .map((p) => pluginName(p.source))
    .filter(Boolean)
}

const enabled = enabledPluginNames()
if (enabled.length === 0) {
  console.error("No enabled plugins found in quartz.config.yaml — nothing to vendor.")
  process.exit(1)
}

console.log(`Vendoring ${enabled.length} enabled plugin(s):`)
console.log(enabled.map((n) => `  • ${n}`).join("\n"))
console.log()

// 2. Clean slate so the vendored tree always matches the current config.
fs.rmSync(PLUGINS_DIR, { recursive: true, force: true })

// 3. Clone + build only the enabled plugins (reads pinned commits from quartz.lock.json).
execSync(`npx quartz plugin install ${enabled.join(" ")}`, { cwd: ROOT, stdio: "inherit" })

// 4. Strip everything the deploy build does not need.
let ok = 0
const failed = []
for (const name of enabled) {
  const dir = path.join(PLUGINS_DIR, name)
  if (!fs.existsSync(dir)) {
    failed.push(`${name} (not installed — clone/build failed?)`)
    continue
  }
  for (const junk of ["node_modules", ".git"]) {
    fs.rmSync(path.join(dir, junk), { recursive: true, force: true })
  }
  if (fs.existsSync(path.join(dir, "dist"))) {
    ok++
  } else {
    failed.push(`${name} (no dist/ produced)`)
  }
}

console.log()
console.log(`✓ Vendored ${ok}/${enabled.length} plugin(s) under .quartz/plugins`)
if (failed.length > 0) {
  console.error(`✗ Problems with:\n${failed.map((f) => `  • ${f}`).join("\n")}`)
}
console.log()
console.log("Next:")
console.log('  git add .quartz/plugins && git commit -m "Re-vendor Quartz plugins"')
console.log("  (then ensure the Cloudflare build command is just `npx quartz build`)")

if (failed.length > 0) process.exit(1)
