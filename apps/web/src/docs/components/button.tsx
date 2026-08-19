import { Button } from "@carsxe/design-system/components/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import type { ComponentDoc } from "./types"

export const button: ComponentDoc = {
  slug: "button",
  title: "Button",
  description: "Displays a button or a component that looks like a button.",
  importName: "Button",
  importPath: "@carsxe/design-system/components/button",
  usage: `import { Button } from "@carsxe/design-system/components/button"

<Button variant="outline">Button</Button>`,
  preview: <Button>Get started</Button>,
  previewCode: `import { Button } from "@carsxe/design-system/components/button"

export function Example() {
  return <Button>Get started</Button>
}`,
  examples: [
    {
      title: "Default",
      preview: <Button>Get started</Button>,
      code: `<Button>Get started</Button>`,
    },
    {
      title: "Outline",
      preview: <Button variant="outline">Get started</Button>,
      code: `<Button variant="outline">Get started</Button>`,
    },
    {
      title: "Secondary",
      preview: <Button variant="secondary">Get started</Button>,
      code: `<Button variant="secondary">Get started</Button>`,
    },
    {
      title: "Ghost",
      preview: <Button variant="ghost">Get started</Button>,
      code: `<Button variant="ghost">Get started</Button>`,
    },
    {
      title: "Destructive",
      preview: <Button variant="destructive">Delete</Button>,
      code: `<Button variant="destructive">Delete</Button>`,
    },
    {
      title: "Link",
      preview: <Button variant="link">Get started</Button>,
      code: `<Button variant="link">Get started</Button>`,
    },
    {
      title: "Disabled",
      preview: <Button disabled>Get started</Button>,
      code: `<Button disabled>Get started</Button>`,
    },
    {
      title: "Size",
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      ),
      code: `<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>`,
    },
    {
      title: "Icon",
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <ChevronLeftIcon data-icon="inline-start" />
            Get started
          </Button>
          <Button>
            Get started
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
          <Button size="icon" aria-label="Back">
            <ChevronLeftIcon />
          </Button>
        </div>
      ),
      code: `<Button>
  <ChevronLeftIcon data-icon="inline-start" />
  Get started
</Button>
<Button>
  Get started
  <ChevronRightIcon data-icon="inline-end" />
</Button>
<Button size="icon" aria-label="Back">
  <ChevronLeftIcon />
</Button>`,
    },
  ],
  props: [
    {
      name: "variant",
      type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
      defaultValue: '"default"',
    },
    {
      name: "size",
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
      defaultValue: '"default"',
    },
  ],
}
