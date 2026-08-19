import { Checkbox } from "@carsxe/design-system/components/checkbox"
import { Label } from "@carsxe/design-system/components/label"

import type { ComponentDoc } from "./types"

export const checkbox: ComponentDoc = {
  slug: "checkbox",
  title: "Checkbox",
  description:
    "A control that allows the user to toggle between checked and not checked.",
  importName: "Checkbox",
  importPath: "@carsxe/design-system/components/checkbox",
  usage: `import { Checkbox } from "@carsxe/design-system/components/checkbox"
import { Label } from "@carsxe/design-system/components/label"

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>`,
  preview: (
    <div className="flex items-center gap-2">
      <Checkbox id="docs-checkbox" defaultChecked />
      <Label htmlFor="docs-checkbox">Accept terms</Label>
    </div>
  ),
  previewCode: `import { Checkbox } from "@carsxe/design-system/components/checkbox"
import { Label } from "@carsxe/design-system/components/label"

<div className="flex items-center gap-2">
  <Checkbox id="terms" defaultChecked />
  <Label htmlFor="terms">Accept terms</Label>
</div>`,
  examples: [
    {
      title: "Disabled",
      preview: (
        <div className="flex items-center gap-2">
          <Checkbox id="docs-checkbox-disabled" disabled />
          <Label htmlFor="docs-checkbox-disabled">Unavailable</Label>
        </div>
      ),
      code: `<div className="flex items-center gap-2">
  <Checkbox id="terms" disabled />
  <Label htmlFor="terms">Unavailable</Label>
</div>`,
    },
  ],
  props: [
    {
      name: "defaultChecked",
      type: "boolean",
    },
    {
      name: "disabled",
      type: "boolean",
    },
  ],
}
