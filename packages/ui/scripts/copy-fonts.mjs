// Copies the woff2 files that dist/styles.css references into dist/files/.
//
// styles.css is the prebuilt stylesheet for consumers that do not compile
// Tailwind themselves. The Tailwind CLI inlines our `@import "@fontsource..."`
// lines, and the @font-face rules it emits point at relative `./files/*.woff2`
// paths. Without those files present a consumer's bundler fails to resolve
// them and the build dies, so ship them alongside.
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(here, "..")
const require = createRequire(import.meta.url)

const dest = resolve(pkgRoot, "dist/files")
mkdirSync(dest, { recursive: true })

let copied = 0
for (const font of [
  "@fontsource-variable/manrope",
  "@fontsource-variable/dm-sans",
  "@fontsource/dm-mono",
]) {
  const fontRoot = dirname(require.resolve(`${font}/package.json`))
  const files = resolve(fontRoot, "files")
  if (!existsSync(files)) {
    throw new Error(`copy-fonts: ${font} has no files/ directory at ${files}`)
  }
  cpSync(files, dest, { recursive: true })
  copied += readdirSync(files).length
}

console.log(`copy-fonts: copied ${copied} font files into dist/files/`)
