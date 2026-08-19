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
import { Input } from "@carsxe/design-system/components/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@carsxe/design-system/components/tabs"

import { CopyButton } from "@/components/copy-button"
import { AGENT_PROMPT } from "@/lib/agent-prompt"

export const Route = createFileRoute("/")({ component: Home })

const installCommands = {
  bun: "bun add @carsxe/design-system",
  npm: "npm install @carsxe/design-system",
  pnpm: "pnpm add @carsxe/design-system",
} as const

function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="flex max-w-2xl flex-col gap-4">
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
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/docs" />}
          >
            View docs
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
                <TabsContent
                  key={manager}
                  value={manager}
                  className="relative mt-3 border border-border bg-muted"
                >
                  <div className="absolute top-2 right-2">
                    <CopyButton text={command} />
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-sm">
                    {command}
                  </pre>
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
            <div className="relative border border-border bg-muted">
              <div className="absolute top-2 right-2">
                <CopyButton text={AGENT_PROMPT} />
              </div>
              <pre className="overflow-x-auto p-4 pr-24 font-mono text-xs whitespace-pre-wrap">
                {AGENT_PROMPT}
              </pre>
            </div>
            <Link
              to="/docs/skills"
              className="text-sm text-primary hover:underline"
            >
              Copy full skill files
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-wrap items-center gap-3 border border-border bg-card p-4">
        <Button>Get started</Button>
        <Button variant="outline">Outline</Button>
        <Badge>Live</Badge>
        <Input className="max-w-xs" placeholder="Email address" />
      </section>
    </main>
  )
}
