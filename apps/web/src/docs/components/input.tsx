import { Input } from "@carsxe/design-system/components/input"
import { Label } from "@carsxe/design-system/components/label"

import type { ComponentDoc } from "./types"

export const input: ComponentDoc = {
  slug: "input",
  title: "Input",
  description:
    "Displays a form input field or a component that looks like an input field.",
  importName: "Input",
  importPath: "@carsxe/design-system/components/input",
  usage: `import { Input } from "@carsxe/design-system/components/input"

<Input type="email" placeholder="Email" />`,
  preview: (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="docs-input">Email address</Label>
      <Input id="docs-input" placeholder="name@company.com" />
    </div>
  ),
  previewCode: `import { Input } from "@carsxe/design-system/components/input"
import { Label } from "@carsxe/design-system/components/label"

<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">Email address</Label>
  <Input id="email" placeholder="name@company.com" />
</div>`,
  examples: [
    {
      title: "Disabled",
      preview: (
        <div className="flex w-[220px] flex-col gap-1.5">
          <Label htmlFor="docs-input-disabled">Email address</Label>
          <Input
            id="docs-input-disabled"
            defaultValue="locked@disabled.com"
            disabled
          />
        </div>
      ),
      code: `<Input defaultValue="locked@disabled.com" disabled />`,
    },
    {
      title: "Invalid",
      preview: (
        <div className="flex w-[220px] flex-col gap-1.5">
          <Label htmlFor="docs-input-invalid" className="text-destructive">
            Email address
          </Label>
          <Input
            id="docs-input-invalid"
            defaultValue="invalid-email"
            aria-invalid
          />
          <p className="text-xs text-destructive">
            Please enter a valid email.
          </p>
        </div>
      ),
      code: `<Input defaultValue="invalid-email" aria-invalid />`,
    },
    {
      title: "Compact",
      preview: (
        <div className="flex w-[220px] flex-col gap-1">
          <Label htmlFor="docs-input-sm" className="text-xs">
            Search
          </Label>
          <Input
            id="docs-input-sm"
            placeholder="Search..."
            className="h-8 px-2.5 py-1.5 text-xs"
          />
        </div>
      ),
      code: `<Input placeholder="Search..." className="h-8 px-2.5 py-1.5 text-xs" />`,
    },
  ],
  props: [
    {
      name: "className",
      type: "string — use for compact heights (no size variant; native size is a number)",
    },
  ],
}
