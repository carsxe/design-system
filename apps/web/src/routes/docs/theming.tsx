import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/components/code-block"

export const Route = createFileRoute("/docs/theming")({
  component: Theming,
})

function Theming() {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Theming
        </h1>
        <p className="text-muted-foreground">
          Tokens, fonts, and dark mode live in the package CSS. Customize with
          CSS variables, not by forking components.
        </p>
      </header>

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
          Manrope for UI, Darker Grotesque for headings, Inter for body and
          inputs. The CSS import loads the font files.
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
          Add the <code className="font-mono">dark</code> class on an ancestor,
          usually <code className="font-mono">&lt;html&gt;</code>.
        </p>
        <CodeBlock code={`<html class="dark">`} />
      </section>
    </article>
  )
}
