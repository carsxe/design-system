import {
  CheckIcon,
  FileTextIcon,
  SearchIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@carsxe/design-system/components/badge"
import { Card, CardContent } from "@carsxe/design-system/components/card"
import { Timeline } from "@carsxe/design-system/components/timeline"

import type { ComponentDoc } from "./types"

type ReportEvent = {
  id: string
  title: string
  detail: string
  time: string
  icon: LucideIcon
}

const reportEvents: ReportEvent[] = [
  {
    id: "ordered",
    title: "Report ordered",
    detail: "VIN 1HGCM82633A004352 submitted.",
    time: "09:14",
    icon: FileTextIcon,
  },
  {
    id: "decoded",
    title: "VIN decoded",
    detail: "2003 Honda Accord EX matched.",
    time: "09:15",
    icon: SearchIcon,
  },
  {
    id: "history",
    title: "History retrieved",
    detail: "Two previous owners, no accidents.",
    time: "09:16",
    icon: TruckIcon,
  },
  {
    id: "ready",
    title: "Report ready",
    detail: "Delivered to the requesting account.",
    time: "09:17",
    icon: CheckIcon,
  },
]

function TimelineDefaultExample() {
  return (
    <div className="w-full max-w-md">
      <Timeline
        items={reportEvents}
        content={(event) => (
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-muted-foreground">{event.detail}</p>
          </div>
        )}
      />
    </div>
  )
}

function TimelineOppositeExample() {
  return (
    <div className="w-full max-w-md">
      <Timeline
        items={reportEvents}
        opposite={(event) => <span className="font-mono">{event.time}</span>}
        content={(event) => <p className="font-medium">{event.title}</p>}
      />
    </div>
  )
}

function TimelineAlternateExample() {
  return (
    <div className="w-full max-w-lg">
      <Timeline
        items={reportEvents}
        align="alternate"
        opposite={(event) => <span className="font-mono">{event.time}</span>}
        content={(event) => (
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-muted-foreground">{event.detail}</p>
          </div>
        )}
      />
    </div>
  )
}

function TimelineEndExample() {
  return (
    <div className="w-full max-w-md">
      <Timeline
        items={reportEvents}
        align="end"
        content={(event) => <p className="font-medium">{event.title}</p>}
      />
    </div>
  )
}

function TimelineMarkersExample() {
  return (
    <div className="w-full max-w-md">
      <Timeline
        items={reportEvents}
        marker={(event) => {
          const Icon = event.icon
          return (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon className="size-4" />
            </span>
          )
        }}
        content={(event) => (
          <Card className="mb-1">
            <CardContent className="flex items-center justify-between gap-3 p-3">
              <span className="font-medium">{event.title}</span>
              <Badge variant="secondary" className="font-mono">
                {event.time}
              </Badge>
            </CardContent>
          </Card>
        )}
      />
    </div>
  )
}

function TimelineHorizontalExample() {
  return (
    <div className="w-full max-w-2xl">
      <Timeline
        items={reportEvents}
        orientation="horizontal"
        opposite={(event) => <span className="font-mono">{event.time}</span>}
        content={(event) => <p className="font-medium">{event.title}</p>}
      />
    </div>
  )
}

const timeline = {
  slug: "timeline",
  title: "Timeline",
  description:
    "An ordered list of events on a rail. Content, the opposite side, the marker, and the connector are all render props receiving the item and its index, so events can be as plain as a line of text or as rich as a card. The rail runs vertically or horizontally, and content can sit on either side or alternate so the rail centres itself.",
  importName: "Timeline",
  importPath: "@carsxe/design-system/components/timeline",
  usage: `import { Timeline } from "@carsxe/design-system/components/timeline"

<Timeline
  items={events}
  content={(event) => <p className="font-medium">{event.title}</p>}
/>`,
  preview: <TimelineDefaultExample />,
  previewCode: `<Timeline
  items={reportEvents}
  content={(event) => (
    <div>
      <p className="font-medium">{event.title}</p>
      <p className="text-muted-foreground">{event.detail}</p>
    </div>
  )}
/>`,
  examples: [
    {
      title: "Opposite content",
      preview: <TimelineOppositeExample />,
      code: `// The opposite template sits on the far side of the rail.
<Timeline
  items={reportEvents}
  opposite={(event) => <span className="font-mono">{event.time}</span>}
  content={(event) => <p className="font-medium">{event.title}</p>}
/>`,
    },
    {
      title: "Alternating",
      preview: <TimelineAlternateExample />,
      code: `// align="alternate" swaps sides per event, centring the rail.
<Timeline
  items={reportEvents}
  align="alternate"
  opposite={(event) => <span className="font-mono">{event.time}</span>}
  content={(event) => <p className="font-medium">{event.title}</p>}
/>`,
    },
    {
      title: "Content on the other side",
      preview: <TimelineEndExample />,
      code: `<Timeline items={reportEvents} align="end" content={(event) => event.title} />`,
    },
    {
      title: "Custom markers and cards",
      preview: <TimelineMarkersExample />,
      code: `<Timeline
  items={reportEvents}
  marker={(event) => (
    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <event.icon className="size-4" />
    </span>
  )}
  content={(event) => (
    <Card>
      <CardContent>{event.title}</CardContent>
    </Card>
  )}
/>`,
    },
    {
      title: "Horizontal",
      preview: <TimelineHorizontalExample />,
      code: `<Timeline
  items={reportEvents}
  orientation="horizontal"
  opposite={(event) => <span className="font-mono">{event.time}</span>}
  content={(event) => <p className="font-medium">{event.title}</p>}
/>`,
    },
  ],
  props: [
    { name: "items", type: "readonly T[]" },
    {
      name: "orientation",
      type: '"vertical" | "horizontal"',
      defaultValue: '"vertical"',
    },
    {
      name: "align",
      type: '"start" | "end" | "alternate"',
      defaultValue: '"start"',
    },
    { name: "content", type: "(item: T, index: number) => ReactNode" },
    { name: "opposite", type: "(item: T, index: number) => ReactNode" },
    { name: "marker", type: "(item: T, index: number) => ReactNode" },
    { name: "connector", type: "(item: T, index: number) => ReactNode" },
    {
      name: "getKey",
      type: "(item: T, index: number) => Key",
      defaultValue: "item.id ?? index",
    },
  ],
} satisfies ComponentDoc

export {
  timeline,
  TimelineAlternateExample,
  TimelineDefaultExample,
  TimelineEndExample,
  TimelineHorizontalExample,
  TimelineMarkersExample,
  TimelineOppositeExample,
}
