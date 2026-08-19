import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@carsxe/design-system/components/progress"

const meta = {
  title: "Components/Progress",
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Progress value={45} className="max-w-md">
      <ProgressLabel>Syncing workspace</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}

export const Complete: Story = {
  render: () => (
    <Progress value={100} className="max-w-md">
      <ProgressLabel>Export complete</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}

export const Empty: Story = {
  render: () => (
    <Progress value={0} className="max-w-md">
      <ProgressLabel>Waiting</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}
