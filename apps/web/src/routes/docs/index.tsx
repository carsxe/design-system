import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@carsxe/design-system/components/button"

import { CodeBlock } from "@carsxe/design-system/components/code-block"
import { DocsPageHeader } from "@/components/docs-page-header"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/docs/")({
  head: () =>
    seo({
      title: "Installation",
      description:
        "Install @carsxe/design-system, load the CSS, and import a component. Do not run shadcn add in your app.",
      path: "/docs",
      eyebrow: "Docs",
    }),
  component: GettingStarted,
})

const markdown = `# Installation

Install \`@carsxe/design-system\`, load the CSS, and import a component. Do not run \`shadcn add\` in your app.

## Install

\`\`\`bash
bun add @carsxe/design-system
\`\`\`

\`\`\`bash
npm install @carsxe/design-system
\`\`\`

\`\`\`bash
pnpm add @carsxe/design-system
\`\`\`

## Load CSS

If the app already uses Tailwind v4:

\`\`\`tsx
import "@carsxe/design-system/globals.css"
\`\`\`

Otherwise use the prebuilt stylesheet:

\`\`\`tsx
import "@carsxe/design-system/styles.css"
\`\`\`

## First button

\`\`\`tsx
import { Button } from "@carsxe/design-system/components/button"

export function Example() {
  return <Button>Get started</Button>
}
\`\`\`
`

function GettingStarted() {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <DocsPageHeader
        title="Installation"
        description={
          <>
            Install{" "}
            <code className="font-mono text-foreground">
              @carsxe/design-system
            </code>
            , load the CSS, and import a component. Do not run{" "}
            <code className="font-mono text-foreground">shadcn add</code> in
            your app.
          </>
        }
        markdown={markdown}
      />

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Install</h2>
        <CodeBlock code="bun add @carsxe/design-system" language="bash" />
        <CodeBlock code="npm install @carsxe/design-system" language="bash" />
        <CodeBlock code="pnpm add @carsxe/design-system" language="bash" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Load CSS</h2>
        <p className="text-sm text-muted-foreground">
          If the app already uses Tailwind v4:
        </p>
        <CodeBlock
          code={`import "@carsxe/design-system/globals.css"`}
          language="tsx"
        />
        <p className="text-sm text-muted-foreground">
          Otherwise use the prebuilt stylesheet:
        </p>
        <CodeBlock
          code={`import "@carsxe/design-system/styles.css"`}
          language="tsx"
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">First button</h2>
        <CodeBlock
          language="tsx"
          code={`import { Button } from "@carsxe/design-system/components/button"

export function Example() {
  return <Button>Get started</Button>
}`}
        />
        <Button className="w-fit">Get started</Button>
      </section>
    </article>
  )
}
