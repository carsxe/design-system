// Builds dist/globals.css — the stylesheet Tailwind v4 consumers import.
//
// src/styles/globals.css is authored for THIS package's layout, so it cannot be
// copied verbatim into dist/. Two things have to change:
//
//   1. `@import "shadcn/tailwind.css"` is inlined. It is 600-odd lines of pure
//      CSS (@custom-variant / @utility / @theme), so inlining it means consumers
//      do not need the shadcn CLI in their dependency tree just to compile our
//      stylesheet.
//   2. The `@source` globs are rewritten to `./`. Tailwind resolves @source
//      relative to the file that declares it; in dist/ our compiled components
//      sit alongside globals.css, so `./` is what makes a consumer's Tailwind
//      build actually emit our utilities rather than just our tokens.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(here, "..")
const require = createRequire(import.meta.url)

const src = readFileSync(resolve(pkgRoot, "src/styles/globals.css"), "utf8")

const shadcnCss = readFileSync(require.resolve("shadcn/tailwind.css"), "utf8")

// Drop the @import, then re-insert its contents *after* the last remaining
// @import. CSS requires @import to precede all other rules, so inlining in
// place would strand the @fontsource imports behind 600 lines of CSS and they
// would be dropped.
const shadcnImportRe = /^@import\s+["']shadcn\/tailwind\.css["'];[ \t]*\r?\n/m
if (!shadcnImportRe.test(src)) {
  throw new Error(
    'build-globals: did not find the `@import "shadcn/tailwind.css"` line to inline.',
  )
}

let withoutShadcn = src.replace(shadcnImportRe, "")

// Drop the @fontsource imports. Tailwind inlines them but does not rebase the
// url()s, so a consumer compiling this file ends up with @font-face rules
// pointing at ./files/*.woff2 relative to *their* output — which does not
// exist. Consumers import the font packages from JS instead, where the bundler
// resolves and fingerprints them properly. (dist/styles.css, built from src,
// keeps the fonts inlined and ships dist/files alongside, so the standalone
// path stays self-contained.)
const fontImportRe = /^@import\s+["']@fontsource-variable\/[^"']+["'];[ \t]*\r?\n/gm
const fontImports = withoutShadcn.match(fontImportRe)
if (!fontImports) {
  throw new Error("build-globals: expected @fontsource imports to strip.")
}
withoutShadcn = withoutShadcn.replace(
  fontImportRe,
  "",
)

const imports = [...withoutShadcn.matchAll(/^@import\s+[^;]+;[ \t]*\r?\n/gm)]
if (imports.length === 0) {
  throw new Error("build-globals: expected at least one @import to anchor the inline after.")
}
const last = imports[imports.length - 1]
const cut = last.index + last[0].length

const inlined =
  `\n/* --- inlined from shadcn/tailwind.css (build-globals.mjs) --- */\n` +
  `${shadcnCss}\n/* --- end shadcn/tailwind.css --- */\n`

const fontNote =
  `\n/*\n * Fonts are NOT imported here on purpose — see build-globals.mjs.\n` +
  ` * Install them in your app entry so your bundler resolves the woff2 files:\n` +
  fontImports.map((i) => ` *   import ${i.trim().replace(/^@import\s+/, "").replace(/;$/, "")}\n`).join("") +
  ` * Or map --font-sans / --font-heading to your own loader (e.g. next/font).\n */\n`

let out = withoutShadcn.slice(0, cut) + fontNote + inlined + withoutShadcn.slice(cut)

const sourceRe = /^@source\s+[^;]+;\s*$/gm
if (!sourceRe.test(out)) {
  throw new Error("build-globals: found no @source directives to rewrite.")
}
let first = true
out = out.replace(sourceRe, () => {
  if (!first) return ""
  first = false
  return '@source "./";'
})

mkdirSync(resolve(pkgRoot, "dist"), { recursive: true })
writeFileSync(resolve(pkgRoot, "dist/globals.css"), out)
console.log("build-globals: wrote dist/globals.css")
