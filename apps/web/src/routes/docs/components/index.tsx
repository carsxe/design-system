import { Link, createFileRoute } from "@tanstack/react-router"

import { ComponentStatusBadge } from "@/components/component-status-badge"
import { DocsPageHeader } from "@/components/docs-page-header"
import { componentDocs } from "@/docs/components"
import { getComponentStatus } from "@/docs/components/status"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/docs/components/")({
  head: () =>
    seo({
      title: "Components",
      description:
        "Import primitives from @carsxe/design-system. Each page has a live preview, usage, and API.",
      path: "/docs/components",
      eyebrow: "Components",
    }),
  component: ComponentsIndex,
})

function componentsIndexMarkdown() {
  const list = componentDocs
    .map(
      (doc) =>
        `- [${doc.title}](/docs/components/${doc.slug}) — ${doc.description}`
    )
    .join("\n")

  return `# Components

Import primitives from \`@carsxe/design-system\`. Each page has a live preview, usage, and API.

${list}
`
}

function ComponentsIndex() {
  return (
    <article className="flex max-w-3xl flex-col gap-8">
      <DocsPageHeader
        title="Components"
        description={
          <>
            Import primitives from{" "}
            <code className="font-mono text-foreground">
              @carsxe/design-system
            </code>
            . Each page has a live preview, usage, and API.
          </>
        }
        markdown={componentsIndexMarkdown()}
      />

      <ul className="grid gap-px border border-border sm:grid-cols-2">
        {componentDocs.map((doc) => {
          const status = getComponentStatus(doc)
          return (
            <li
              key={doc.slug}
              className="border-b border-border last:border-0 sm:odd:border-r"
            >
              <Link
                to="/docs/components/$slug"
                params={{ slug: doc.slug }}
                className="flex flex-col gap-1 p-4 hover:bg-muted"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  {doc.title}
                  {status ? (
                    <ComponentStatusBadge status={status} compact />
                  ) : null}
                </span>
                <span className="text-sm text-muted-foreground">
                  {doc.description}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
