import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@carsxe/design-system/components/badge"

const meta = {
  title: "Components/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: "PRIMARY" },
}

export const Secondary: Story = {
  args: { variant: "secondary", children: "SECONDARY" },
}

export const Success: Story = {
  args: { variant: "success", children: "SUCCESS" },
}

export const Danger: Story = {
  args: { variant: "destructive", children: "DANGER" },
}

export const Warning: Story = {
  args: { variant: "warning", children: "WARNING" },
}

export const Outlined: Story = {
  args: { variant: "outline", children: "OUTLINED" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge>PRIMARY</Badge>
      <Badge variant="secondary">SECONDARY</Badge>
      <Badge variant="success">SUCCESS</Badge>
      <Badge variant="destructive">DANGER</Badge>
      <Badge variant="warning">WARNING</Badge>
      <Badge variant="outline">OUTLINED</Badge>
    </div>
  ),
}
