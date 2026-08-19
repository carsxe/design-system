import { Badge } from "@carsxe/design-system/components/badge"

import type { ComponentDoc } from "./types"

export const badge: ComponentDoc = {
  slug: "badge",
  title: "Badge",
  description: "Displays a badge or a component that looks like a badge.",
  importName: "Badge",
  importPath: "@carsxe/design-system/components/badge",
  usage: `import { Badge } from "@carsxe/design-system/components/badge"

<Badge>Badge</Badge>`,
  preview: (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Danger</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  previewCode: `import { Badge } from "@carsxe/design-system/components/badge"

<Badge>Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Danger</Badge>
<Badge variant="outline">Outline</Badge>`,
  examples: [
    {
      title: "Success",
      preview: <Badge variant="success">Success</Badge>,
      code: `<Badge variant="success">Success</Badge>`,
    },
    {
      title: "Warning",
      preview: <Badge variant="warning">Warning</Badge>,
      code: `<Badge variant="warning">Warning</Badge>`,
    },
    {
      title: "Outline",
      preview: <Badge variant="outline">Outline</Badge>,
      code: `<Badge variant="outline">Outline</Badge>`,
    },
  ],
  props: [
    {
      name: "variant",
      type: '"default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "ghost" | "link"',
      defaultValue: '"default"',
    },
  ],
}
