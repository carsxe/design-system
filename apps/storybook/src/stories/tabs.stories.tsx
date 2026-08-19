import type { Meta, StoryObj } from "@storybook/react-vite"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@carsxe/design-system/components/tabs"

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="max-w-xl">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="bg-muted p-4">
        Workspace overview metrics and recent activity for the selected
        environment.
      </TabsContent>
      <TabsContent value="analytics" className="bg-muted p-4">
        Traffic, conversion, and API usage for the last 30 days.
      </TabsContent>
      <TabsContent value="reports" className="bg-muted p-4">
        Export scheduled reports or download a CSV snapshot.
      </TabsContent>
      <TabsContent value="settings" className="bg-muted p-4">
        Manage members, keys, and billing preferences.
      </TabsContent>
    </Tabs>
  ),
}

export const Pill: Story = {
  render: () => (
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
}
