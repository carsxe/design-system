import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@carsxe/design-system/components/button"

import { CodeBlock } from "@/components/code-block"

export const Route = createFileRoute("/docs/")({
  component: GettingStarted,
})

function GettingStarted() {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Getting started
        </h1>
        <p className="text-muted-foreground">
          Install{" "}
          <code className="font-mono text-foreground">
            @carsxe/design-system
          </code>
          , load the CSS, and import a component. Do not run{" "}
          <code className="font-mono text-foreground">shadcn add</code> in your
          app.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Install</h2>
        <CodeBlock code="bun add @carsxe/design-system" />
        <CodeBlock code="npm install @carsxe/design-system" />
        <CodeBlock code="pnpm add @carsxe/design-system" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Load CSS</h2>
        <p className="text-sm text-muted-foreground">
          If the app already uses Tailwind v4:
        </p>
        <CodeBlock code={`import "@carsxe/design-system/globals.css"`} />
        <p className="text-sm text-muted-foreground">
          Otherwise use the prebuilt stylesheet:
        </p>
        <CodeBlock code={`import "@carsxe/design-system/styles.css"`} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">First button</h2>
        <CodeBlock
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
