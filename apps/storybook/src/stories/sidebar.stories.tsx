import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@carsxe/design-system/components/button"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@carsxe/design-system/components/sidebar"
import { SidebarDemo } from "../../../web/src/docs/components/sidebar"

const meta = {
  title: "Components/Sidebar",
  component: SidebarDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SidebarDemo>

export default meta
type Story = StoryObj<typeof meta>

export const IconCollapse: Story = {}
export const OffCanvas: Story = { args: { collapsible: "offcanvas" } }
export const Floating: Story = { args: { variant: "floating" } }
export const Inset: Story = { args: { variant: "inset" } }
export const RightSide: Story = { args: { side: "right" } }
export const RightToLeft: Story = { args: { side: "right", dir: "rtl" } }
export const NonCollapsible: Story = { args: { collapsible: "none" } }

function ControlledSidebar() {
  const [open, setOpen] = React.useState(true)
  return (
    <div className="grid gap-4">
      <p data-testid="sidebar-state" className="text-sm">
        {open ? "Expanded" : "Collapsed"}
      </p>
      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        className="relative min-h-80 overflow-hidden border"
      >
        <Sidebar collapsible="icon" className="absolute h-full">
          <SidebarContent />
        </Sidebar>
        <SidebarInset className="min-h-80 p-4">
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
      <Button className="w-fit" onClick={() => setOpen((value) => !value)}>
        Toggle externally
      </Button>
    </div>
  )
}

export const Controlled: Story = { render: () => <ControlledSidebar /> }
export const Mobile: Story = {
  args: { collapsible: "offcanvas" },
  parameters: { viewport: { defaultViewport: "mobile1" } },
}
