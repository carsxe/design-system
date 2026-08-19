import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "@carsxe/design-system/components/textarea"
import { Label } from "@carsxe/design-system/components/label"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-1.5">
      <Label htmlFor="bio-default">Description</Label>
      <Textarea id="bio-default" placeholder="Write a short description..." />
    </div>
  ),
}

export const Filled: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-1.5">
      <Label htmlFor="bio-filled">Description</Label>
      <Textarea
        id="bio-filled"
        defaultValue="Clarity ships a complete component library for product teams."
        className="bg-card"
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-1.5">
      <Label htmlFor="bio-disabled">Description</Label>
      <Textarea id="bio-disabled" defaultValue="Locked field" disabled />
    </div>
  ),
}
