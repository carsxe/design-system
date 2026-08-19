import { Label } from "@carsxe/design-system/components/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@carsxe/design-system/components/select"

import type { ComponentDoc } from "./types"

function PlanSelect({
  disabled,
  size = "default",
}: {
  disabled?: boolean
  size?: "sm" | "default"
}) {
  return (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label>Workspace plan</Label>
      <Select defaultValue="pro" disabled={disabled}>
        <SelectTrigger size={size} className="w-full">
          <SelectValue placeholder="Select a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Plans</SelectLabel>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export const select: ComponentDoc = {
  slug: "select",
  title: "Select",
  description:
    "Displays a list of options for the user to pick from — triggered by a button.",
  importName: "Select, SelectTrigger, SelectValue, SelectContent, SelectItem",
  importPath: "@carsxe/design-system/components/select",
  usage: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@carsxe/design-system/components/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pro">Pro</SelectItem>
  </SelectContent>
</Select>`,
  preview: <PlanSelect />,
  previewCode: `import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@carsxe/design-system/components/select"

<Select defaultValue="pro">
  <SelectTrigger className="w-[220px]">
    <SelectValue placeholder="Select a plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Plans</SelectLabel>
      <SelectItem value="free">Free</SelectItem>
      <SelectItem value="pro">Pro</SelectItem>
      <SelectItem value="enterprise">Enterprise</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
  examples: [
    {
      title: "Small",
      preview: <PlanSelect size="sm" />,
      code: `<SelectTrigger size="sm">
  <SelectValue placeholder="Select a plan" />
</SelectTrigger>`,
    },
    {
      title: "Disabled",
      preview: <PlanSelect disabled />,
      code: `<Select defaultValue="pro" disabled>
  <SelectTrigger>
    <SelectValue placeholder="Select a plan" />
  </SelectTrigger>
</Select>`,
    },
  ],
  props: [
    {
      name: "size",
      type: '"default" | "sm" (SelectTrigger)',
      defaultValue: '"default"',
    },
  ],
}
