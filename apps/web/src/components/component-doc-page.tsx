import { CodeBlock } from "@carsxe/design-system/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { DocsPageHeader } from "@/components/docs-page-header"
import { PropsTable } from "@/components/props-table"
import { componentDocToMarkdown } from "@/docs/components/to-markdown"
import type { ComponentDoc } from "@/docs/components/types"

export function ComponentDocPage({ doc }: { doc: ComponentDoc }) {
  return (
    <article className="flex max-w-3xl min-w-0 flex-col gap-10">
      <DocsPageHeader
        title={doc.title}
        description={doc.description}
        markdown={componentDocToMarkdown(doc)}
      />

      <ComponentPreview preview={doc.preview} code={doc.previewCode} />

      {doc.importName && doc.importPath ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-2xl font-medium">Installation</h2>
          <p className="text-sm text-muted-foreground">
            Import from the package. Do not run{" "}
            <code className="font-mono text-foreground">shadcn add</code> in
            your app.
          </p>
          <CodeBlock
            language="tsx"
            code={`import { ${doc.importName} } from "${doc.importPath}"`}
          />
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Usage</h2>
        <CodeBlock code={doc.usage} language="tsx" />
      </section>

      {doc.examples.map((example) => (
        <section key={example.title} className="flex flex-col gap-3">
          <h2 className="font-heading text-2xl font-medium">{example.title}</h2>
          <ComponentPreview preview={example.preview} code={example.code} />
        </section>
      ))}

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">API Reference</h2>
        <PropsTable rows={doc.props} />
      </section>
    </article>
  )
}
