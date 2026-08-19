import { Link, createFileRoute } from "@tanstack/react-router"

import { Badge } from "@carsxe/design-system/components/badge"
import { Button } from "@carsxe/design-system/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@carsxe/design-system/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@carsxe/design-system/components/tabs"

import { CodeBlock } from "@/components/code-block"
import { Logo } from "@/components/logo"
import { AGENT_PROMPT } from "@/lib/agent-prompt"
import { SITE_DESCRIPTION, seo } from "@/lib/seo"

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "Carsxe UI, as a package",
      description: SITE_DESCRIPTION,
      path: "/",
      suffix: false,
      eyebrow: "Design system",
    }),
  component: Home,
})

const installCommands = {
  bun: "bun add @carsxe/design-system",
  npm: "npm install @carsxe/design-system",
  pnpm: "pnpm add @carsxe/design-system",
} as const

function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="flex max-w-2xl flex-col gap-4">
        <Logo className="h-10" />
        <Badge className="w-fit">Design system</Badge>
        <h1 className="font-heading text-5xl font-semibold tracking-tight">
          Carsxe UI, as a package
        </h1>
        <p className="text-lg text-muted-foreground">
          Import themed shadcn components from{" "}
          <code className="font-mono text-foreground">
            @carsxe/design-system
          </code>
          . Do not copy them into your app.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link to="/docs" />}>
            Get started
          </Button>
        </div>
      </section>

      <section id="install" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Install</CardTitle>
            <CardDescription>
              Add the package, then import components and CSS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bun">
              <TabsList variant="line">
                <TabsTrigger value="bun">bun</TabsTrigger>
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
              </TabsList>
              {Object.entries(installCommands).map(([manager, command]) => (
                <TabsContent key={manager} value={manager} className="mt-3">
                  <CodeBlock code={command} lang="bash" />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For agents</CardTitle>
            <CardDescription>
              Paste this prompt, or copy a full skill file from the catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <CodeBlock code={AGENT_PROMPT} lang="plaintext" />
            <Link
              to="/docs/skills"
              className="text-sm text-primary hover:underline"
            >
              Copy full skill files
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl font-medium">Components</h2>
        <ul className="grid gap-px border border-border sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["button", "Button"],
              ["input", "Input"],
              ["dialog", "Dialog"],
              ["select", "Select"],
              ["tabs", "Tabs"],
              ["card", "Card"],
              ["badge", "Badge"],
              ["alert", "Alert"],
            ] as const
          ).map(([slug, title]) => (
            <li key={slug} className="border-b border-border sm:border-r">
              <Link
                to="/docs/components/$slug"
                params={{ slug }}
                className="block p-4 text-sm font-medium hover:bg-muted"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/docs/components"
          className="text-sm text-primary hover:underline"
        >
          Browse all components
        </Link>
      </section>
    </main>
  )
}
