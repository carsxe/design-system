import { Button } from "@carsxe/design-system/components/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@carsxe/design-system/components/alert-dialog"
import { AspectRatio } from "@carsxe/design-system/components/aspect-ratio"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentTitle,
} from "@carsxe/design-system/components/attachment"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@carsxe/design-system/components/bubble"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@carsxe/design-system/components/button-group"
import { Calendar } from "@carsxe/design-system/components/calendar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@carsxe/design-system/components/carousel"
import { ChartContainer } from "@carsxe/design-system/components/chart"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@carsxe/design-system/components/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@carsxe/design-system/components/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@carsxe/design-system/components/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@carsxe/design-system/components/context-menu"
import { DirectionProvider } from "@carsxe/design-system/components/direction"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@carsxe/design-system/components/drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@carsxe/design-system/components/empty"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@carsxe/design-system/components/field"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@carsxe/design-system/components/hover-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@carsxe/design-system/components/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@carsxe/design-system/components/input-otp"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@carsxe/design-system/components/item"
import { Kbd, KbdGroup } from "@carsxe/design-system/components/kbd"
import { Marker, MarkerContent } from "@carsxe/design-system/components/marker"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@carsxe/design-system/components/menubar"
import {
  Message,
  MessageContent,
  MessageGroup,
} from "@carsxe/design-system/components/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@carsxe/design-system/components/message-scroller"
import {
  NativeSelect,
  NativeSelectOption,
} from "@carsxe/design-system/components/native-select"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@carsxe/design-system/components/popover"
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@carsxe/design-system/components/questionnaire"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@carsxe/design-system/components/resizable"
import { ScrollArea } from "@carsxe/design-system/components/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@carsxe/design-system/components/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@carsxe/design-system/components/sidebar"
import { Spinner } from "@carsxe/design-system/components/spinner"
import {
  Toaster as ToastToaster,
  toast,
} from "@carsxe/design-system/components/toast"
import { Toggle } from "@carsxe/design-system/components/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@carsxe/design-system/components/toggle-group"
import { Bar, BarChart } from "recharts"

import type { ComponentDoc } from "./types"

export const extendedComponents = [
  ["alert-dialog", "Alert Dialog", "A modal dialog requiring a response."],
  ["aspect-ratio", "Aspect Ratio", "Displays content within a fixed ratio."],
  ["attachment", "Attachment", "Displays a file or linked attachment."],
  ["bubble", "Bubble", "Groups compact conversational content."],
  ["button-group", "Button Group", "Groups related buttons and controls."],
  ["calendar", "Calendar", "A date selection calendar."],
  ["carousel", "Carousel", "A keyboard-accessible content carousel."],
  ["chart", "Chart", "Token-aware wrappers for Recharts."],
  ["collapsible", "Collapsible", "An expandable content region."],
  ["combobox", "Combobox", "A searchable option picker."],
  ["command", "Command", "A fast command and search menu."],
  ["context-menu", "Context Menu", "A menu opened from a context action."],
  ["direction", "Direction", "Provides LTR or RTL reading direction."],
  ["drawer", "Drawer", "A swipeable dialog panel."],
  ["empty", "Empty", "An empty-state layout."],
  ["field", "Field", "Accessible form field composition."],
  ["hover-card", "Hover Card", "Preview content shown on hover or focus."],
  ["input-group", "Input Group", "Combines an input with inline addons."],
  ["input-otp", "Input OTP", "A segmented one-time-password input."],
  ["item", "Item", "A flexible list-item layout."],
  ["kbd", "Kbd", "Displays keyboard input hints."],
  ["marker", "Marker", "Marks status or annotated content."],
  ["menubar", "Menubar", "A desktop-style application menu."],
  ["message", "Message", "Structured conversational messages."],
  [
    "message-scroller",
    "Message Scroller",
    "Keeps streaming messages anchored.",
  ],
  ["native-select", "Native Select", "A styled native select control."],
  ["popover", "Popover", "Rich content displayed in a portal."],
  ["questionnaire", "Questionnaire", "A multi-step question flow."],
  ["resizable", "Resizable", "Keyboard-accessible resizable panels."],
  ["scroll-area", "Scroll Area", "A consistently styled scroll container."],
  ["sheet", "Sheet", "A dialog anchored to an edge."],
  ["sidebar", "Sidebar", "A responsive application sidebar."],
  ["spinner", "Spinner", "Indicates an in-progress operation."],
  ["toast", "Toast", "A transient Base UI notification."],
  ["toggle", "Toggle", "A two-state pressed control."],
  ["toggle-group", "Toggle Group", "A group of related toggle controls."],
] as const

const primaryImportNames: Partial<
  Record<(typeof extendedComponents)[number][0], string>
> = {
  chart: "ChartContainer",
  direction: "DirectionProvider",
  resizable: "ResizablePanelGroup",
  toast: "Toaster",
}

function ExtendedPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "alert-dialog":
      return (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete vehicle?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    case "aspect-ratio":
      return (
        <AspectRatio
          ratio={16 / 9}
          className="flex w-80 items-center justify-center bg-muted text-sm"
        >
          16:9
        </AspectRatio>
      )
    case "attachment":
      return (
        <Attachment>
          <AttachmentContent>
            <AttachmentTitle>inspection.pdf</AttachmentTitle>
            <AttachmentDescription>2.4 MB PDF</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      )
    case "bubble":
      return (
        <BubbleGroup>
          <Bubble>
            <BubbleContent>How can I help with this vehicle?</BubbleContent>
          </Bubble>
          <Bubble variant="secondary">
            <BubbleContent>Show its latest valuation.</BubbleContent>
          </Bubble>
        </BubbleGroup>
      )
    case "button-group":
      return (
        <ButtonGroup>
          <Button variant="outline">Back</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">Forward</Button>
        </ButtonGroup>
      )
    case "calendar":
      return <Calendar mode="single" className="border" />
    case "carousel":
      return (
        <Carousel className="w-64">
          <CarouselContent>
            {[1, 2, 3].map((item) => (
              <CarouselItem key={item}>
                <div className="flex h-28 items-center justify-center border bg-card text-2xl">
                  {item}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )
    case "chart":
      return (
        <ChartContainer
          config={{ value: { label: "Vehicles", color: "var(--chart-1)" } }}
          className="h-48 w-80"
        >
          <BarChart
            data={[
              { month: "Jan", value: 42 },
              { month: "Feb", value: 63 },
            ]}
          >
            <Bar dataKey="value" fill="var(--color-value)" />
          </BarChart>
        </ChartContainer>
      )
    case "collapsible":
      return (
        <Collapsible className="w-80">
          <CollapsibleTrigger render={<Button variant="outline" />}>
            Vehicle details
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 border p-3 text-sm">
            VIN and registration details.
          </CollapsibleContent>
        </Collapsible>
      )
    case "combobox":
      return (
        <Combobox items={["Sedan", "SUV", "Truck"]}>
          <ComboboxInput placeholder="Select body style" />
          <ComboboxContent>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )
    case "command":
      return (
        <Command className="w-80 border">
          <CommandInput placeholder="Search commands" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>Open dashboard</CommandItem>
              <CommandItem>Create report</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )
    case "context-menu":
      return (
        <ContextMenu>
          <ContextMenuTrigger className="flex h-28 w-80 items-center justify-center border border-dashed text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Open</ContextMenuItem>
            <ContextMenuItem>Duplicate</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
    case "direction":
      return (
        <DirectionProvider direction="rtl">
          <div className="w-80 border p-4 text-sm">
            واجهة من اليمين إلى اليسار
          </div>
        </DirectionProvider>
      )
    case "drawer":
      return (
        <Drawer>
          <DrawerTrigger render={<Button variant="outline" />}>
            Open drawer
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Vehicle filters</DrawerTitle>
              <DrawerDescription>
                Refine the inventory results.
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )
    case "empty":
      return (
        <Empty className="w-80 border">
          <EmptyHeader>
            <EmptyTitle>No vehicles found</EmptyTitle>
            <EmptyDescription>Try changing your filters.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )
    case "field":
      return (
        <Field className="w-80">
          <FieldLabel htmlFor="stock-number">Stock number</FieldLabel>
          <input id="stock-number" className="h-10 border bg-background px-3" />
          <FieldDescription>Shown on inventory listings.</FieldDescription>
        </Field>
      )
    case "hover-card":
      return (
        <HoverCard>
          <HoverCardTrigger render={<Button variant="link" />}>
            2024 Porsche 911
          </HoverCardTrigger>
          <HoverCardContent>
            Low mileage, one owner, full service history.
          </HoverCardContent>
        </HoverCard>
      )
    case "input-group":
      return (
        <InputGroup className="w-80">
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
        </InputGroup>
      )
    case "input-otp":
      return (
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )
    case "item":
      return (
        <Item className="w-80 border">
          <ItemContent>
            <ItemTitle>Vehicle report</ItemTitle>
            <ItemDescription>Updated five minutes ago</ItemDescription>
          </ItemContent>
        </Item>
      )
    case "kbd":
      return (
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      )
    case "marker":
      return (
        <Marker variant="border">
          <MarkerContent>Inspection complete</MarkerContent>
        </Marker>
      )
    case "menubar":
      return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New report</MenubarItem>
              <MenubarItem>Export</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
    case "message":
      return (
        <MessageGroup className="w-80">
          <Message>
            <MessageContent>Valuation completed successfully.</MessageContent>
          </Message>
        </MessageGroup>
      )
    case "message-scroller":
      return (
        <MessageScrollerProvider>
          <MessageScroller className="h-48 w-80 border">
            <MessageScrollerViewport>
              <MessageScrollerContent className="p-4">
                {[1, 2, 3, 4].map((item) => (
                  <MessageScrollerItem key={item}>
                    Message {item}
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      )
    case "native-select":
      return (
        <NativeSelect className="w-80">
          <NativeSelectOption value="">Select status</NativeSelectOption>
          <NativeSelectOption value="active">Active</NativeSelectOption>
        </NativeSelect>
      )
    case "popover":
      return (
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Open popover
          </PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Vehicle summary</PopoverTitle>
            <PopoverDescription>
              Key details without leaving the page.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      )
    case "questionnaire":
      return (
        <Questionnaire>
          <QuestionnaireItem name="usage">
            <QuestionnaireTitle>
              How will the vehicle be used?
            </QuestionnaireTitle>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="personal">
                Personal
              </QuestionnaireChoice>
              <QuestionnaireChoice value="business">
                Business
              </QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
        </Questionnaire>
      )
    case "resizable":
      return (
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-36 w-80 border"
        >
          <ResizablePanel defaultSize={50} className="grid place-items-center">
            One
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} className="grid place-items-center">
            Two
          </ResizablePanel>
        </ResizablePanelGroup>
      )
    case "scroll-area":
      return (
        <ScrollArea className="h-36 w-80 border p-4">
          <div className="space-y-3">
            {Array.from({ length: 10 }, (_, index) => (
              <p key={index}>Inventory row {index + 1}</p>
            ))}
          </div>
        </ScrollArea>
      )
    case "sheet":
      return (
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Open sheet
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Choose inventory filters.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )
    case "sidebar":
      return (
        <SidebarProvider
          defaultOpen
          className="min-h-64 w-full overflow-hidden border"
        >
          <Sidebar collapsible="none" className="absolute h-64">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive>Inventory</SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="min-h-64 p-4">
            <SidebarTrigger />
            Dashboard content
          </SidebarInset>
        </SidebarProvider>
      )
    case "spinner":
      return (
        <Button disabled>
          <Spinner /> Loading
        </Button>
      )
    case "toast":
      return (
        <>
          <ToastToaster />
          <Button
            onClick={() =>
              toast.add({
                title: "Vehicle saved",
                description: "Changes are live.",
              })
            }
          >
            Show toast
          </Button>
        </>
      )
    case "toggle":
      return <Toggle aria-label="Toggle bold">Bold</Toggle>
    case "toggle-group":
      return (
        <ToggleGroup defaultValue={["grid"]}>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      )
    default:
      return null
  }
}

export const extendedComponentDocs: ComponentDoc[] = extendedComponents.map(
  ([slug, title, description]) => {
    const importName = primaryImportNames[slug] ?? title.replaceAll(" ", "")

    return {
      slug,
      title,
      description,
      importName,
      importPath: `@carsxe/design-system/components/${slug}`,
      usage: `import { ${importName} } from "@carsxe/design-system/components/${slug}"

<${importName} />`,
      preview: <ExtendedPreview slug={slug} />,
      previewCode: `import { ${importName} } from "@carsxe/design-system/components/${slug}"`,
      examples: [],
      props: [],
    }
  }
)

export { ExtendedPreview }
