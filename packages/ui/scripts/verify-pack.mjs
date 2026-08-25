// Packs the tarball and resolves every public entry point against it.
//
// 0.0.2 shipped with an exports map pointing at ./src while `files` shipped only
// ./dist, so every documented import was a build error for consumers even though
// the package built and tested fine in-repo. Checking the workspace cannot catch
// that; only the packed artifact can.
import { execFileSync } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const tmp = mkdtempSync(join(tmpdir(), "ds-verify-"))

try {
  const out = execFileSync(
    "npm",
    ["pack", "--pack-destination", tmp, "--silent"],
    {
      cwd: pkgRoot,
      encoding: "utf8",
    }
  )
  const tarball = join(tmp, out.trim().split("\n").pop().trim())
  execFileSync("tar", ["xzf", tarball, "-C", tmp])

  const root = join(tmp, "package")
  const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
  const catalog = JSON.parse(
    readFileSync(join(pkgRoot, "shadcn-catalog.json"), "utf8")
  )

  const entries = [
    ".",
    "./globals.css",
    "./styles.css",
    "./lib/utils",
    ...[...catalog.components, ...catalog.legacyComponents].map(
      (slug) => `./components/${slug}`
    ),
    "./hooks/use-mobile",
  ]

  const failures = []
  for (const entry of ["./globals.css", "./styles.css"]) {
    const spec = manifest.exports[entry]
    if (
      typeof spec !== "object" ||
      typeof spec.style !== "string" ||
      typeof spec.default !== "string"
    ) {
      failures.push(`${entry} — expected style and default export conditions`)
    }
  }

  for (const entry of entries) {
    const spec =
      manifest.exports[entry] ?? matchWildcard(manifest.exports, entry)
    if (!spec) {
      failures.push(`${entry} — no exports entry`)
      continue
    }
    for (const rel of targetsOf(spec, entry)) {
      if (!existsSync(join(root, rel)))
        failures.push(`${entry} -> ${rel} (missing)`)
    }
  }

  // styles.css references ./files/*.woff2; make sure they shipped.
  const styles = join(root, "dist/styles.css")
  if (existsSync(styles)) {
    const css = readFileSync(styles, "utf8")
    for (const m of new Set(
      [...css.matchAll(/url\(\.\/(files\/[^)"']+)\)/g)].map((x) => x[1])
    )) {
      if (!existsSync(join(root, "dist", m)))
        failures.push(`dist/styles.css -> ${m} (missing)`)
    }
  }

  if (failures.length) {
    console.error("verify-pack FAILED:")
    for (const f of failures) console.error(`  ${f}`)
    process.exit(1)
  }
  console.log(
    `verify-pack: OK — ${entries.length} entry points resolve inside the tarball`
  )
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

function matchWildcard(exports, entry) {
  for (const [key, value] of Object.entries(exports)) {
    if (!key.includes("*")) continue
    const [pre, post] = key.split("*")
    if (entry.startsWith(pre) && entry.endsWith(post)) {
      const star = entry.slice(pre.length, entry.length - (post.length || 0))
      return JSON.parse(JSON.stringify(value).replaceAll("*", star))
    }
  }
  return null
}

function targetsOf(spec, entry) {
  if (typeof spec === "string") return [spec.replace(/^\.\//, "")]
  return Object.values(spec).map((v) => v.replace(/^\.\//, ""))
}
