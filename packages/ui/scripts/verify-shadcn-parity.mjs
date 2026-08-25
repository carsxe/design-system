import { existsSync, readFileSync, readdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = resolve(packageRoot, "../..")
const catalog = JSON.parse(
  readFileSync(join(packageRoot, "shadcn-catalog.json"), "utf8")
)
const indexSource = readFileSync(join(packageRoot, "src/index.ts"), "utf8")
const docsRoot = join(repoRoot, "apps/web/src/docs/components")
const storiesRoot = join(repoRoot, "apps/storybook/src/stories")
const docsSource = readSources(docsRoot)
const storiesSource = readSources(storiesRoot)
const manifest = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
)
const failures = []

for (const slug of [...catalog.components, ...catalog.legacyComponents]) {
  if (!existsSync(join(packageRoot, `src/components/${slug}.tsx`))) {
    failures.push(`${slug}: missing component source`)
  }
  if (!indexSource.includes(`./components/${slug}`)) {
    failures.push(`${slug}: missing package-root export`)
  }
  if (
    !docsSource.includes(`slug: "${slug}"`) &&
    !docsSource.includes(`"${slug}"`)
  ) {
    failures.push(`${slug}: missing documentation entry`)
  }
  const namedStory = slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")
  if (
    !existsSync(join(storiesRoot, `${slug}.stories.tsx`)) &&
    !storiesSource.includes(`export const ${namedStory}:`) &&
    !storiesSource.includes(`slug: "${slug}"`) &&
    !(slug === "sonner" && storiesSource.includes('from "sonner"'))
  ) {
    failures.push(`${slug}: missing Storybook story`)
  }
}

for (const slug of catalog.recipes) {
  if (!docsSource.includes(`slug: "${slug}"`)) {
    failures.push(`${slug}: missing recipe documentation`)
  }
}

if (!manifest.exports["./components/*"]) {
  failures.push("package exports: missing ./components/*")
}
if (!manifest.exports["./hooks/*"]) {
  failures.push("package exports: missing ./hooks/*")
}
if (!existsSync(join(packageRoot, "src/hooks/use-mobile.ts"))) {
  failures.push("sidebar: missing use-mobile hook")
}

if (failures.length) {
  console.error("verify-shadcn-parity FAILED:")
  failures.forEach((failure) => console.error(`  ${failure}`))
  process.exit(1)
}

console.log(
  `verify-shadcn-parity: OK — ${catalog.components.length} catalog components, ${catalog.recipes.length} recipes, ${catalog.legacyComponents.length} legacy component`
)

function readSources(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return readSources(path)
      return /\.(ts|tsx)$/.test(entry.name) ? readFileSync(path, "utf8") : ""
    })
    .join("\n")
}
