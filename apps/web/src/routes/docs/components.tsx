import { createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/components/code-block"

export const Route = createFileRoute("/docs/components")({
  component: Components,
})

const components = [
  "accordion",
  "alert",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "card",
  "checkbox",
  "dialog",
  "dropdown-menu",
  "input",
  "label",
  "navigation-menu",
  "pagination",
  "progress",
  "radio-group",
  "select",
  "separator",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "tooltip",
]

function Components() {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Components
        </h1>
        <p className="text-muted-foreground">
          Shipped primitives. Import from the path below, or from the package
          root.
        </p>
      </header>

      <CodeBlock
        code={`import { Button } from "@carsxe/design-system/components/button"`}
      />

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Component</th>
              <th className="px-3 py-2 font-medium">Import</th>
            </tr>
          </thead>
          <tbody>
            {components.map((name) => (
              <tr key={name} className="border-b border-border last:border-0">
                <td className="px-3 py-2 capitalize">
                  {name.replaceAll("-", " ")}
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  @carsxe/design-system/components/{name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
