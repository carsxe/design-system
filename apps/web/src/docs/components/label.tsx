import { Input } from "@carsxe/design-system/components/input"
import { Label } from "@carsxe/design-system/components/label"

import type { ComponentDoc } from "./types"

export const label: ComponentDoc = {
  slug: "label",
  title: "Label",
  description: "Renders an accessible label associated with controls.",
  importName: "Label",
  importPath: "@carsxe/design-system/components/label",
  usage: `import { Label } from "@carsxe/design-system/components/label"
import { Input } from "@carsxe/design-system/components/input"

<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input id="email" placeholder="name@company.com" />
</div>`,
  preview: (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="docs-label-email">Email address</Label>
      <Input id="docs-label-email" placeholder="name@company.com" />
    </div>
  ),
  previewCode: `import { Label } from "@carsxe/design-system/components/label"
import { Input } from "@carsxe/design-system/components/input"

<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">Email address</Label>
  <Input id="email" placeholder="name@company.com" />
</div>`,
  examples: [
    {
      title: "Error",
      preview: (
        <div className="flex w-[220px] flex-col gap-1.5">
          <Label htmlFor="docs-label-error" className="text-destructive">
            Email address
          </Label>
          <Input id="docs-label-error" defaultValue="invalid" aria-invalid />
        </div>
      ),
      code: `<Label htmlFor="email" className="text-destructive">
  Email address
</Label>
<Input id="email" defaultValue="invalid" aria-invalid />`,
    },
  ],
  props: [
    {
      name: "htmlFor",
      type: "string",
    },
  ],
}
