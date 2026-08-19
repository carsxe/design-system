import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/components/code-block"
import { DocsPageHeader } from "@/components/docs-page-header"

export const Route = createFileRoute("/docs/theming")({
  component: Theming,
})

const markdown = `# Theming

Tokens, fonts, and dark mode live in the package CSS. Customize with CSS variables, not by forking components.

## Tokens

Semantic colors are defined on \`:root\` and \`.dark\`.

| Token | Light |
| --- | --- |
| \`--primary\` | \`#065774\` |
| \`--primary-hover\` | \`#00B6E5\` |
| \`--primary-disabled\` | \`#83BACC\` |
| \`--foreground\` | \`#3A3A3A\` |
| \`--muted-foreground\` | \`#A8A8A8\` |
| \`--border\` | \`#EBEBEB\` |
| \`--background\` | \`#F9F9F9\` |
| \`--success\` | \`#00A63E\` |
| \`--destructive\` | \`#DA373E\` |
| \`--warning\` | \`#F79008\` |
| \`--radius\` | \`0\` |

## Fonts

Manrope for UI, body, and inputs. DM Sans for headings. The CSS import loads the font files.

## Radius

\`--radius\` is \`0\`. Corners are sharp. Circular controls keep \`rounded-full\`.

## Dark mode

Use the theme toggle in the header, or add the \`dark\` class on an ancestor, usually \`<html>\`.

\`\`\`html
<html class="dark">
\`\`\`
`

function Theming() {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <DocsPageHeader
        title="Theming"
        description="Tokens, fonts, and dark mode live in the package CSS. Customize with CSS variables, not by forking components."
        markdown={markdown}
      />

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Tokens</h2>
        <p className="text-sm text-muted-foreground">
          Semantic colors are defined on{" "}
          <code className="font-mono">:root</code> and{" "}
          <code className="font-mono">.dark</code>.
        </p>
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Token</th>
                <th className="px-3 py-2 font-medium">Light</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["--primary", "#065774"],
                ["--primary-hover", "#00B6E5"],
                ["--primary-disabled", "#83BACC"],
                ["--foreground", "#3A3A3A"],
                ["--muted-foreground", "#A8A8A8"],
                ["--border", "#EBEBEB"],
                ["--background", "#F9F9F9"],
                ["--success", "#00A63E"],
                ["--destructive", "#DA373E"],
                ["--warning", "#F79008"],
                ["--radius", "0"],
              ].map(([token, value]) => (
                <tr
                  key={token}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-3 py-2 font-mono">{token}</td>
                  <td className="px-3 py-2 font-mono">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Fonts</h2>
        <p className="text-sm text-muted-foreground">
          Manrope for UI, body, and inputs. DM Sans for headings. The CSS
          import loads the font files.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Radius</h2>
        <p className="text-sm text-muted-foreground">
          <code className="font-mono">--radius</code> is{" "}
          <code className="font-mono">0</code>. Corners are sharp. Circular
          controls keep <code className="font-mono">rounded-full</code>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Dark mode</h2>
        <p className="text-sm text-muted-foreground">
          Use the theme toggle in the header, or add the{" "}
          <code className="font-mono">dark</code> class on an ancestor, usually{" "}
          <code className="font-mono">&lt;html&gt;</code>.
        </p>
        <CodeBlock code={`<html class="dark">`} lang="html" />
      </section>
    </article>
  )
}
