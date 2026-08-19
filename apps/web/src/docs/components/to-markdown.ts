import type { ComponentDoc } from "./types"

function fence(lang: string, code: string) {
  return `\`\`\`${lang}\n${code.trim()}\n\`\`\``
}

export function componentDocToMarkdown(doc: ComponentDoc) {
  const install = `import { ${doc.importName} } from "${doc.importPath}"`

  const examples = doc.examples
    .map(
      (example) =>
        `## ${example.title}\n\n${fence("tsx", example.code)}`
    )
    .join("\n\n")

  const propsTable =
    doc.props.length === 0
      ? "Native element props are forwarded. There are no extra variant props."
      : [
          "| Prop | Type | Default |",
          "| --- | --- | --- |",
          ...doc.props.map(
            (row) =>
              `| \`${row.name}\` | ${row.type.replaceAll("|", "\\|")} | ${row.defaultValue ?? "—"} |`
          ),
        ].join("\n")

  return [
    `# ${doc.title}`,
    "",
    doc.description,
    "",
    "## Installation",
    "",
    "Import from the package. Do not run `shadcn add` in your app.",
    "",
    fence("tsx", install),
    "",
    "## Usage",
    "",
    fence("tsx", doc.usage),
    "",
    "## Preview",
    "",
    fence("tsx", doc.previewCode),
    examples ? `\n${examples}\n` : "",
    "## API Reference",
    "",
    propsTable,
    "",
  ].join("\n")
}
