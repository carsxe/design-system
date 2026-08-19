import { createFileRoute } from "@tanstack/react-router"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@carsxe/design-system/components/alert"
import { Badge } from "@carsxe/design-system/components/badge"
import { Button } from "@carsxe/design-system/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@carsxe/design-system/components/card"
import { Checkbox } from "@carsxe/design-system/components/checkbox"
import { Input } from "@carsxe/design-system/components/input"
import { Label } from "@carsxe/design-system/components/label"
import { Progress, ProgressLabel, ProgressValue } from "@carsxe/design-system/components/progress"
import { RadioGroup, RadioGroupItem } from "@carsxe/design-system/components/radio-group"
import { Switch } from "@carsxe/design-system/components/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@carsxe/design-system/components/tabs"
import { Textarea } from "@carsxe/design-system/components/textarea"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <Badge className="w-fit">CARSXE</Badge>
        <h1 className="font-heading text-5xl font-semibold tracking-tight">
          Carsxe Design System
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          shadcn/ui components themed to the Carsxe brand. Import from{" "}
          <code className="font-mono text-foreground">@carsxe/design-system</code> and
          browse every state in Storybook.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Get Started</Button>
          <Button variant="outline">View Storybook</Button>
        </div>
      </header>

      <section className="grid gap-4">
        <h2 className="font-heading text-3xl font-medium">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Get Started</Button>
          <Button variant="outline">Get Started</Button>
          <Button variant="ghost">Get Started</Button>
          <Button variant="destructive">Delete</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-3xl font-medium">Inputs</h2>
        <div className="grid max-w-md gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="name@company.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Description</Label>
            <Textarea id="notes" placeholder="Write a short description..." />
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-3xl font-medium">Controls</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms">Accept terms</Label>
          </div>
          <RadioGroup defaultValue="pro" className="max-w-xs">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="free" id="free" />
              <Label htmlFor="free">Free</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="pro" id="pro" />
              <Label htmlFor="pro">Pro</Label>
            </div>
          </RadioGroup>
          <div className="flex items-center gap-2">
            <Switch id="alerts" defaultChecked />
            <Label htmlFor="alerts">Notifications</Label>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-3xl font-medium">Feedback</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>PRIMARY</Badge>
          <Badge variant="secondary">SECONDARY</Badge>
          <Badge variant="success">SUCCESS</Badge>
          <Badge variant="destructive">DANGER</Badge>
          <Badge variant="warning">WARNING</Badge>
          <Badge variant="outline">OUTLINED</Badge>
        </div>
        <div className="flex flex-col gap-3">
          <Alert>
            <InfoIcon />
            <AlertTitle>System Update Scheduled</AlertTitle>
            <AlertDescription>
              Maintenance window Saturday 02:00–04:00 UTC.
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <CircleCheckIcon />
            <AlertTitle>Configuration Exported Safely</AlertTitle>
            <AlertDescription>
              Environment variables were downloaded to your machine.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>Insecure API Keys Exposed</AlertTitle>
            <AlertDescription>
              Rotate development credentials immediately.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>API Endpoint Connection Failed</AlertTitle>
            <AlertDescription>
              Error 503 received during synchronization ping.
            </AlertDescription>
          </Alert>
        </div>
        <Progress value={45} className="max-w-md">
          <ProgressLabel>Syncing workspace</ProgressLabel>
          <ProgressValue />
        </Progress>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-3xl font-medium">Layout</h2>
        <Tabs defaultValue="overview" className="max-w-xl">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="bg-muted p-4">
            Workspace overview for the selected environment.
          </TabsContent>
          <TabsContent value="analytics" className="bg-muted p-4">
            Traffic and API usage for the last 30 days.
          </TabsContent>
          <TabsContent value="settings" className="bg-muted p-4">
            Members, keys, and billing.
          </TabsContent>
        </Tabs>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Workspace overview</CardTitle>
            <CardDescription>
              Track usage, seats, and billing for the current environment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Active seats are billed monthly.
          </CardContent>
          <CardFooter>
            <Button variant="ghost">Cancel</Button>
            <Button>Get Started</Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}
