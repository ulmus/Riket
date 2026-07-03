import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    for (const fp of fps) {
      const src = joinSegments(staticPath, fp) as FilePath
      const dest = joinSegments(outputStaticPath, fp) as FilePath
      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }

    // Root passthrough: files under quartz/static-root are copied to the deploy
    // ROOT (not under /static), for host config that must live there — e.g. the
    // Cloudflare Pages `_headers` file. Optional: skipped if the dir is absent.
    const rootPath = joinSegments(QUARTZ, "static-root")
    if (fs.existsSync(rootPath)) {
      const rootFps = await glob("**", rootPath, cfg.configuration.ignorePatterns)
      for (const fp of rootFps) {
        const src = joinSegments(rootPath, fp) as FilePath
        const dest = joinSegments(argv.output, fp) as FilePath
        await fs.promises.mkdir(dirname(dest), { recursive: true })
        await fs.promises.copyFile(src, dest)
        yield dest
      }
    }
  },
  async *partialEmit() {},
})
