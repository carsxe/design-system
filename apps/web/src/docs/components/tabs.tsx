import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@carsxe/design-system/components/tabs"

import type { ComponentDoc } from "./types"

export const tabs: ComponentDoc = {
  slug: "tabs",
  title: "Tabs",
  description:
    "A set of layered sections of content — known as tab panels — that are displayed one at a time.",
  importName: "Tabs, TabsList, TabsTrigger, TabsContent",
  importPath: "@carsxe/design-system/components/tabs",
  usage: `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@carsxe/design-system/components/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account panel</TabsContent>
  <TabsContent value="password">Password panel</TabsContent>
</Tabs>`,
  preview: (
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
  ),
  previewCode: `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@carsxe/design-system/components/tabs"

<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview panel</TabsContent>
  <TabsContent value="analytics">Analytics panel</TabsContent>
</Tabs>`,
  examples: [
    {
      title: "Default",
      preview: (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview content</TabsContent>
          <TabsContent value="analytics">Analytics content</TabsContent>
          <TabsContent value="reports">Reports content</TabsContent>
        </Tabs>
      ),
      code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
</Tabs>`,
    },
  ],
  props: [
    {
      name: "variant",
      type: '"default" | "line" (TabsList)',
      defaultValue: '"default"',
    },
    {
      name: "defaultValue",
      type: "string (Tabs)",
    },
  ],
}
