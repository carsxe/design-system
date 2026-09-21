import {
  BubbleConversation,
  BubbleLegacy,
  BubbleWithoutAvatars,
} from "./bubble-examples"
import exampleSource from "./bubble-examples?raw"
import type { ComponentDoc } from "./types"

export const bubble: ComponentDoc = {
  slug: "bubble",
  title: "Bubble",
  description:
    "Conversational messages with optional avatars, copying, timestamps, and actions. Controls appear on hover or keyboard focus and stay visible on touch screens. Timestamps use English and the local timezone; pass a Date, ISO 8601 string, or epoch milliseconds. Invalid dates are omitted.",
  importName: "Bubble",
  importPath: "@carsxe/design-system/components/bubble",
  usage: exampleSource,
  preview: <BubbleConversation />,
  previewCode: exampleSource,
  examples: [
    {
      title: "Without avatars",
      preview: <BubbleWithoutAvatars />,
      code: exampleSource,
    },
    {
      title: "Custom actions with and without tooltips",
      preview: <BubbleConversation />,
      code: exampleSource,
    },
    {
      title: "Legacy composition and reactions",
      preview: <BubbleLegacy />,
      code: exampleSource,
    },
  ],
  props: [
    {
      name: "variant",
      type: '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"',
      defaultValue: '"default"',
    },
    { name: "align", type: '"start" | "end"', defaultValue: '"start"' },
    { name: "copyText", type: "string — exact text copied; omit to hide Copy" },
    {
      name: "timestamp",
      type: "Date | string | number — formatted as September 15, 3:14 AM",
    },
    { name: "actions", type: "BubbleAction[] — rendered in order after Copy" },
    { name: "actions[].icon", type: "React.ReactNode" },
    {
      name: "actions[].onPress",
      type: "React.MouseEventHandler<HTMLButtonElement>",
    },
    { name: "actions[].name", type: "string — accessible button label" },
    { name: "actions[].tooltipLabel", type: "string (optional)" },
    {
      name: "avatar",
      type: "{ src?: string; name: string; fallback?: React.ReactNode } — defaults to name initials",
    },
    { name: "onCopyError", type: "(error: unknown) => void" },
  ],
}
