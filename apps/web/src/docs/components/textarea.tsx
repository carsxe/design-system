import { Label } from "@carsxe/design-system/components/label"
import { Textarea } from "@carsxe/design-system/components/textarea"

import type { ComponentDoc } from "./types"

export const textarea: ComponentDoc = {
  slug: "textarea",
  title: "Textarea",
  description:
    "Displays a form textarea or a component that looks like a textarea.",
  importName: "Textarea",
  importPath: "@carsxe/design-system/components/textarea",
  usage: `import { Textarea } from "@carsxe/design-system/components/textarea"

<Textarea placeholder="Type your message here." />`,
  preview: (
    <div className="flex w-[280px] flex-col gap-1.5">
      <Label htmlFor="docs-textarea">Description</Label>
      <Textarea id="docs-textarea" placeholder="Write a short description..." />
    </div>
  ),
  previewCode: `import { Textarea } from "@carsxe/design-system/components/textarea"
import { Label } from "@carsxe/design-system/components/label"

<div className="flex flex-col gap-1.5">
  <Label htmlFor="bio">Description</Label>
  <Textarea id="bio" placeholder="Write a short description..." />
</div>`,
  examples: [
    {
      title: "Disabled",
      preview: (
        <div className="flex w-[280px] flex-col gap-1.5">
          <Label htmlFor="docs-textarea-disabled">Description</Label>
          <Textarea
            id="docs-textarea-disabled"
            defaultValue="Locked field"
            disabled
          />
        </div>
      ),
      code: `<Textarea defaultValue="Locked field" disabled />`,
    },
  ],
  props: [
    {
      name: "disabled",
      type: "boolean",
    },
  ],
}
