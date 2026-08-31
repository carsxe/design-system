import { DownloadIcon, FileTextIcon, MailIcon, Trash2Icon } from "lucide-react"
import {
  SplitButton,
  type SplitButtonItem,
} from "@carsxe/design-system/components/split-button"
import { toast } from "sonner"

import type { ComponentDoc } from "./types"

const reportActions: SplitButtonItem[] = [
  {
    id: "email",
    label: "Email report",
    icon: <MailIcon />,
    onSelect: () => toast.success("Report emailed"),
  },
  {
    id: "download",
    label: "Download PDF",
    icon: <DownloadIcon />,
    onSelect: () => toast.success("Download started"),
  },
  { separator: true },
  {
    id: "delete",
    label: "Delete report",
    icon: <Trash2Icon />,
    destructive: true,
    onSelect: () => toast.error("Report deleted"),
  },
]

function SplitButtonDefaultExample() {
  return (
    <SplitButton items={reportActions} onClick={() => toast("Report ordered")}>
      Order report
    </SplitButton>
  )
}

function SplitButtonVariantsExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton items={reportActions} variant="outline">
        Outline
      </SplitButton>
      <SplitButton items={reportActions} variant="secondary">
        Secondary
      </SplitButton>
      <SplitButton items={reportActions} variant="destructive">
        Destructive
      </SplitButton>
    </div>
  )
}

function SplitButtonSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton items={reportActions} size="xs">
        Extra small
      </SplitButton>
      <SplitButton items={reportActions} size="sm">
        Small
      </SplitButton>
      <SplitButton items={reportActions}>Default</SplitButton>
      <SplitButton items={reportActions} size="lg">
        Large
      </SplitButton>
    </div>
  )
}

function SplitButtonSubmenuExample() {
  return (
    <SplitButton
      items={[
        {
          id: "export",
          label: "Export as",
          icon: <FileTextIcon />,
          items: [
            { id: "pdf", label: "PDF", onSelect: () => toast("PDF queued") },
            { id: "csv", label: "CSV", onSelect: () => toast("CSV queued") },
            { id: "json", label: "JSON", onSelect: () => toast("JSON queued") },
          ],
        },
        {
          id: "docs",
          label: "API documentation",
          href: "https://api.carsxe.com",
        },
        { separator: true },
        { id: "archive", label: "Archive", disabled: true },
      ]}
      menuLabel="Export options"
      onClick={() => toast("Report ordered")}
    >
      Order report
    </SplitButton>
  )
}

function SplitButtonLoadingExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton items={reportActions} loading>
        Ordering
      </SplitButton>
      <SplitButton items={reportActions} disabled>
        Unavailable
      </SplitButton>
    </div>
  )
}

const splitButton = {
  slug: "split-button",
  title: "Split Button",
  description:
    "A primary action joined to a menu of related ones. The left button behaves like any Button and keeps its props; items describes the menu, including separators, links, destructive entries, and one level of submenu. loading shows a spinner and disables both halves at once.",
  importName: "SplitButton",
  importPath: "@carsxe/design-system/components/split-button",
  usage: `import { SplitButton } from "@carsxe/design-system/components/split-button"

<SplitButton
  items={[
    { id: "email", label: "Email report", onSelect: emailReport },
    { separator: true },
    { id: "delete", label: "Delete report", destructive: true, onSelect: remove },
  ]}
  onClick={orderReport}
>
  Order report
</SplitButton>`,
  preview: <SplitButtonDefaultExample />,
  previewCode: `<SplitButton items={reportActions} onClick={orderReport}>
  Order report
</SplitButton>`,
  examples: [
    {
      title: "Variants",
      preview: <SplitButtonVariantsExample />,
      code: `// The variant applies to both halves.
<SplitButton items={reportActions} variant="outline">Outline</SplitButton>`,
    },
    {
      title: "Sizes",
      preview: <SplitButtonSizesExample />,
      code: `// The menu trigger takes the icon size matching the action's height.
<SplitButton items={reportActions} size="sm">Small</SplitButton>`,
    },
    {
      title: "Submenus, links, and disabled items",
      preview: <SplitButtonSubmenuExample />,
      code: `<SplitButton
  items={[
    {
      id: "export",
      label: "Export as",
      items: [
        { id: "pdf", label: "PDF", onSelect: exportPdf },
        { id: "csv", label: "CSV", onSelect: exportCsv },
      ],
    },
    { id: "docs", label: "API documentation", href: "https://api.carsxe.com" },
    { separator: true },
    { id: "archive", label: "Archive", disabled: true },
  ]}
  menuLabel="Export options"
>
  Order report
</SplitButton>`,
    },
    {
      title: "Loading and disabled",
      preview: <SplitButtonLoadingExample />,
      code: `<SplitButton items={reportActions} loading>Ordering</SplitButton>
<SplitButton items={reportActions} disabled>Unavailable</SplitButton>`,
    },
  ],
  props: [
    { name: "items", type: "SplitButtonItem[]" },
    { name: "loading", type: "boolean", defaultValue: "false" },
    { name: "menuLabel", type: "string", defaultValue: '"More options"' },
    {
      name: "contentProps",
      type: "React.ComponentProps<typeof DropdownMenuContent>",
    },
    { name: "variant", type: "Button variant", defaultValue: '"default"' },
    { name: "size", type: "Button size", defaultValue: '"default"' },
    { name: "onClick", type: "(event) => void" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
  ],
} satisfies ComponentDoc

export {
  splitButton,
  SplitButtonDefaultExample,
  SplitButtonLoadingExample,
  SplitButtonSizesExample,
  SplitButtonSubmenuExample,
  SplitButtonVariantsExample,
}
