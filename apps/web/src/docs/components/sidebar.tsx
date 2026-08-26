import {
  BarChart3Icon,
  CarFrontIcon,
  FileCheck2Icon,
  Settings2Icon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@carsxe/design-system/components/sidebar"

import type { ComponentDoc } from "./types"

type SidebarDemoProps = {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  dir?: "ltr" | "rtl"
}

const navigation = [
  { label: "Inventory", icon: CarFrontIcon, badge: "128" },
  { label: "Reports", icon: FileCheck2Icon, badge: "12" },
  { label: "Analytics", icon: BarChart3Icon },
]

function SidebarDemo({
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  dir = "ltr",
}: SidebarDemoProps) {
  return (
    <div dir={dir} className="w-full">
      <SidebarProvider
        defaultOpen
        className="relative min-h-80 overflow-hidden border border-border"
        style={{ "--sidebar-width": "13rem" } as React.CSSProperties}
      >
        <Sidebar
          side={side}
          variant={variant}
          collapsible={collapsible}
          className="absolute h-full"
        >
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex h-9 items-center gap-2 px-2 font-heading text-sm font-semibold">
              <span className="grid size-6 place-items-center bg-sidebar-primary text-sidebar-primary-foreground">
                CX
              </span>
              <span>Vehicle ops</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item, index) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={index === 0}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings2Icon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-h-80 bg-background p-4">
          <header className="flex items-center gap-3 border-b border-border pb-4">
            <SidebarTrigger />
            <div>
              <p className="font-heading text-sm font-medium">Inventory</p>
              <p className="text-xs text-muted-foreground">
                128 active vehicles
              </p>
            </div>
          </header>
          <div className="grid flex-1 place-items-center text-center text-sm text-muted-foreground">
            Select a vehicle to inspect its history.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

const sidebar = {
  slug: "sidebar",
  title: "Sidebar",
  description:
    "A responsive application shell with desktop collapse, mobile sheets, keyboard controls, and left or right placement.",
  importName: "SidebarProvider, Sidebar, SidebarTrigger",
  importPath: "@carsxe/design-system/components/sidebar",
  usage: `import { Sidebar, SidebarProvider, SidebarTrigger } from "@carsxe/design-system/components/sidebar"

<SidebarProvider>
  <Sidebar collapsible="icon">...</Sidebar>
  <main><SidebarTrigger /></main>
</SidebarProvider>`,
  preview: <SidebarDemo />,
  previewCode: `<SidebarProvider><Sidebar collapsible="icon">...</Sidebar><SidebarTrigger /></SidebarProvider>`,
  examples: [
    {
      title: "Inset sidebar",
      preview: <SidebarDemo variant="inset" />,
      code: `<Sidebar variant="inset" collapsible="icon" />`,
    },
    {
      title: "Right-to-left sidebar",
      preview: <SidebarDemo side="right" dir="rtl" />,
      code: `<div dir="rtl"><Sidebar side="right" /></div>`,
    },
  ],
  props: [
    { name: "side", type: '"left" | "right"', defaultValue: '"left"' },
    {
      name: "variant",
      type: '"sidebar" | "floating" | "inset"',
      defaultValue: '"sidebar"',
    },
    {
      name: "collapsible",
      type: '"offcanvas" | "icon" | "none"',
      defaultValue: '"offcanvas"',
    },
    { name: "open / defaultOpen", type: "boolean" },
    { name: "onOpenChange", type: "(open: boolean) => void" },
  ],
} satisfies ComponentDoc

export { SidebarDemo, sidebar }
