import type { Meta, StoryObj } from "@storybook/react-vite"

import { Switch } from "@carsxe/design-system/components/switch"
import { Label } from "@carsxe/design-system/components/label"

const meta = {
  title: "Components/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Notifications</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications-on" defaultChecked />
      <Label htmlFor="notifications-on">Notifications</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications-off" disabled />
      <Label htmlFor="notifications-off">Unavailable</Label>
    </div>
  ),
}

export const Small: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications-sm" size="sm" defaultChecked />
      <Label htmlFor="notifications-sm">Compact</Label>
    </div>
  ),
}
