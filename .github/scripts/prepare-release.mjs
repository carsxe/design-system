import { appendFileSync, readFileSync, writeFileSync } from "node:fs"

const tag = process.env.RELEASE_TAG ?? ""
// npm versions cannot contain build metadata. Accept v1.2.3 or 1.2.3,
// with optional SemVer prerelease identifiers (e.g. v1.2.3-beta.1).
const number = "(?:0|[1-9]\\d*)"
const identifier = `(?:${number}|[\\da-zA-Z-]*[a-zA-Z-][\\da-zA-Z-]*)`
const semver = new RegExp(
  `^v?(${number}\\.${number}\\.${number})(?:-(${identifier}(?:\\.${identifier})*))?$`
)
const match = semver.exec(tag)
if (!match) {
  throw new Error(`Invalid release tag ${JSON.stringify(tag)}. Use v1.2.3 or v1.2.3-beta.1.`)
}

const prerelease = Boolean(match[2])
if ((process.env.RELEASE_PRERELEASE === "true") !== prerelease) {
  throw new Error("GitHub's prerelease checkbox must match whether the tag has a prerelease suffix.")
}

const version = tag.replace(/^v/, "")
const manifestPath = new URL("../../packages/ui/package.json", import.meta.url)
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
manifest.version = version
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

const npmTag = prerelease ? "next" : "latest"
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `npm-tag=${npmTag}\n`)
}
console.log(`Prepared ${manifest.name}@${version} for npm tag ${npmTag}`)
