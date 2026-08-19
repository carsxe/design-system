import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@carsxe/design-system/components/input"
import { Label } from "@carsxe/design-system/components/label"

const meta = {
  title: "Components/Input",
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="email-default">Email Address</Label>
      <Input id="email-default" placeholder="name@company.com" />
    </div>
  ),
}

export const Filled: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="email-filled">Email Address</Label>
      <Input id="email-filled" defaultValue="developer@figma.com" className="bg-card" />
    </div>
  ),
}

export const Active: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="email-active">Email Address</Label>
      <Input id="email-active" defaultValue="typing_in_progress" autoFocus />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="email-disabled">Email Address</Label>
      <Input id="email-disabled" defaultValue="locked@disabled.com" disabled />
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1.5">
      <Label htmlFor="email-error" className="text-destructive">
        Email Address
      </Label>
      <Input
        id="email-error"
        defaultValue="invalid-email-format"
        aria-invalid
        className="bg-card"
      />
      <p className="text-xs text-destructive">Please enter a valid email.</p>
    </div>
  ),
}

export const Small: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-1">
      <Label htmlFor="search-sm" className="text-xs">
        Search Query
      </Label>
      <Input id="search-sm" placeholder="Search..." className="h-8 px-2.5 py-1.5 text-xs" />
    </div>
  ),
}
