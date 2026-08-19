import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@carsxe/design-system/components/select"
import { Label } from "@carsxe/design-system/components/label"

const meta = {
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

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

export const Default: Story = {
  render: () => <PlanSelect />,
}

export const Small: Story = {
  render: () => <PlanSelect size="sm" />,
}

export const Disabled: Story = {
  render: () => <PlanSelect disabled />,
}
