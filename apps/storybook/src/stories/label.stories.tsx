import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@carsxe/design-system/components/label"
import { Input } from "@carsxe/design-system/components/input"

const meta = {
  title: "Components/Label",
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="label-email">Email Address</Label>
      <Input id="label-email" placeholder="name@company.com" />
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="label-error" className="text-destructive">
        Email Address
      </Label>
      <Input id="label-error" defaultValue="invalid" aria-invalid />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="label-disabled" className="text-muted-foreground">
        Email Address
      </Label>
      <Input id="label-disabled" disabled defaultValue="locked@disabled.com" />
    </div>
  ),
}
