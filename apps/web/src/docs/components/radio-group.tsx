import { Label } from "@carsxe/design-system/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@carsxe/design-system/components/radio-group"

import type { ComponentDoc } from "./types"

export const radioGroup: ComponentDoc = {
  slug: "radio-group",
  title: "Radio Group",
  description:
    "A set of checkable buttons — known as radio buttons — where no more than one of the buttons can be checked at a time.",
  importName: "RadioGroup, RadioGroupItem",
  importPath: "@carsxe/design-system/components/radio-group",
  usage: `import { RadioGroup, RadioGroupItem } from "@carsxe/design-system/components/radio-group"
import { Label } from "@carsxe/design-system/components/label"

<RadioGroup defaultValue="pro">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="pro" id="pro" />
    <Label htmlFor="pro">Pro</Label>
  </div>
</RadioGroup>`,
  preview: (
    <RadioGroup defaultValue="pro">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="free" id="docs-plan-free" />
        <Label htmlFor="docs-plan-free">Free</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="pro" id="docs-plan-pro" />
        <Label htmlFor="docs-plan-pro">Pro</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="enterprise" id="docs-plan-enterprise" />
        <Label htmlFor="docs-plan-enterprise">Enterprise</Label>
      </div>
    </RadioGroup>
  ),
  previewCode: `import { RadioGroup, RadioGroupItem } from "@carsxe/design-system/components/radio-group"
import { Label } from "@carsxe/design-system/components/label"

<RadioGroup defaultValue="pro">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="free" id="free" />
    <Label htmlFor="free">Free</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="pro" id="pro" />
    <Label htmlFor="pro">Pro</Label>
  </div>
</RadioGroup>`,
  examples: [
    {
      title: "Disabled",
      preview: (
        <RadioGroup defaultValue="pro" disabled>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="pro" id="docs-plan-disabled" />
            <Label htmlFor="docs-plan-disabled">Pro</Label>
          </div>
        </RadioGroup>
      ),
      code: `<RadioGroup defaultValue="pro" disabled>
  <RadioGroupItem value="pro" id="pro" />
  <Label htmlFor="pro">Pro</Label>
</RadioGroup>`,
    },
  ],
  props: [
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "disabled",
      type: "boolean",
    },
  ],
}
